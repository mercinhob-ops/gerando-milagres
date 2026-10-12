import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GestantePage from "@/app/gestante/page";

const next = () => fireEvent.click(screen.getByRole("button", { name: /^próximo/i }));
const pick = (label: string | RegExp) => fireEvent.click(screen.getByRole("button", { name: label }));

interface Flow {
  semanas?: string;
  condicoes?: string[];
  alimentacao?: string;
  acompanhamento?: string;
  preocupacao?: string | null;
}

function answerAll({
  semanas = "13 a 27 semanas (2º trimestre)",
  condicoes = ["Anemia"],
  alimentacao = "Razoável, sigo algumas orientações",
  acompanhamento = "Sim, tenho acompanhamento",
  preocupacao = "Ganho de peso excessivo",
}: Flow = {}) {
  fireEvent.click(screen.getByRole("button", { name: /começar/i }));
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Ana Paula Souza" } });
  next();
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "(81) 99999-1234" } });
  next();
  pick(semanas);
  next();
  pick("Sim, primeira vez");
  next();
  condicoes.forEach((c) => pick(c));
  next();
  pick(alimentacao);
  next();
  pick(acompanhamento);
  next();
  if (preocupacao) {
    pick(preocupacao);
    next();
  } else {
    fireEvent.click(screen.getByRole("button", { name: /^pular$/i }));
  }
}

function acceptAndSubmit() {
  fireEvent.click(screen.getByLabelText(/autorizo a dra\. camilla freitas a entrar em contato/i));
  fireEvent.click(screen.getByRole("button", { name: /enviar e receber o material/i }));
}

const strongHeading = () => screen.queryByRole("heading", { name: /vamos olhar o seu caso juntas\?/i });

describe("GestantePage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, "", "/gestante");
  });

  it("começa pela tela inicial com a chamada e a foto da Dra. Camilla", () => {
    render(<GestantePage />);
    expect(
      screen.getByRole("heading", {
        name: /o seu bebê muda a cada trimestre\. a sua alimentação também deveria\./i,
      })
    ).toBeInTheDocument();
    expect(screen.getByAltText(/dra\. camilla freitas/i)).toHaveAttribute(
      "src",
      expect.stringContaining("camilla-zap.jpg")
    );
    expect(screen.getAllByText(/crf\/pe 4563/i).length).toBeGreaterThan(0);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("mostra uma pergunta por tela com progresso X/8, valida e volta", () => {
    render(<GestantePage />);
    fireEvent.click(screen.getByRole("button", { name: /começar/i }));
    expect(screen.getByText("1/8")).toBeInTheDocument();
    next();
    expect(screen.getByRole("alert")).toHaveTextContent(/nome completo/i);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Ana" } });
    next();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "9999" } });
    next();
    expect(screen.getByRole("alert")).toHaveTextContent(/whatsapp válido/i);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "81999991234" } });
    next();
    expect(screen.getByText("3/8")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /quantas semanas de gestação/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /voltar/i }));
    expect(screen.getByText("2/8")).toBeInTheDocument();
  });

  it("P5 aceita várias condições e 'Nenhuma dessas' / 'Prefiro não dizer' são exclusivas", () => {
    render(<GestantePage />);
    fireEvent.click(screen.getByRole("button", { name: /começar/i }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Ana" } });
    next();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "81999991234" } });
    next();
    pick("Ainda não sei exatamente");
    next();
    pick("Sim, primeira vez");
    next();
    expect(screen.getByText("5/8")).toBeInTheDocument();
    next();
    expect(screen.getByRole("alert")).toHaveTextContent(/pelo menos uma opção/i);

    const btn = (name: string) => screen.getByRole("button", { name });
    pick("Anemia");
    pick("Tireoide alterada");
    expect(btn("Anemia")).toHaveAttribute("aria-pressed", "true");
    expect(btn("Tireoide alterada")).toHaveAttribute("aria-pressed", "true");
    pick("Nenhuma dessas");
    expect(btn("Anemia")).toHaveAttribute("aria-pressed", "false");
    expect(btn("Nenhuma dessas")).toHaveAttribute("aria-pressed", "true");
    pick("Prefiro não dizer");
    expect(btn("Nenhuma dessas")).toHaveAttribute("aria-pressed", "false");
    pick("Diabetes gestacional");
    expect(btn("Prefiro não dizer")).toHaveAttribute("aria-pressed", "false");
  });

  it("exige a autorização LGPD antes de enviar", () => {
    const fbq = vi.fn();
    window.fbq = fbq;
    render(<GestantePage />);
    answerAll();
    expect(screen.getByText("8/8")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /enviar e receber o material/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/autorização/i);
    expect(fbq).not.toHaveBeenCalled();
    expect(window.localStorage.getItem("gestante_lead")).toBeNull();
  });

  it("envio: dispara Lead, salva no Supabase com page gestante e origem, e mostra convite leve", () => {
    const fbq = vi.fn();
    window.fbq = fbq;
    const fetchMock = vi.fn(() => Promise.resolve(new Response("{}")));
    vi.stubGlobal("fetch", fetchMock);
    window.history.replaceState({}, "", "/gestante?origem=instagram");

    render(<GestantePage />);
    answerAll({ preocupacao: null });
    acceptAndSubmit();

    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Lead",
      expect.objectContaining({ trimestre: "2º trimestre", origem: "instagram" }),
      expect.any(Object)
    );

    const leadCall = fetchMock.mock.calls.find((call) => (call as unknown[])[0] === "/api/leads") as unknown as
      | [string, RequestInit]
      | undefined;
    expect(JSON.parse(leadCall![1].body as string)).toMatchObject({
      page: "gestante",
      name: "Ana Paula Souza",
      whatsapp: "81999991234",
      data: {
        "Semanas de gestação": "13 a 27 semanas (2º trimestre)",
        "Primeira gravidez": "Sim, primeira vez",
        Condições: ["Anemia"],
        "Alimentação hoje": "Razoável, sigo algumas orientações",
        "Acompanhamento nutricional": "Sim, tenho acompanhamento",
        "Maior preocupação": "Pulou",
        Origem: "instagram",
        "Autorização LGPD": "Sim",
      },
    });
    expect(JSON.parse(window.localStorage.getItem("gestante_lead")!)).toMatchObject({
      nome: "Ana Paula Souza",
      semanas: "2-trimestre",
      origem: "instagram",
    });

    expect(screen.getByRole("heading", { name: /pronto, ana! 🌸/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /baixar o material/i })).toHaveAttribute("href", "#MATERIAL_GESTANTE_URL");
    expect(strongHeading()).not.toBeInTheDocument();

    const href = screen.getByRole("link", { name: /^falar no whatsapp$/i }).getAttribute("href")!;
    const message = decodeURIComponent(href.split("text=")[1]);
    expect(href).toContain("https://wa.me/5581981396005?text=");
    expect(message).toContain("Ana Paula Souza");
    expect(message).toContain("2º trimestre");
  });

  it.each<[string, Flow]>([
    ["alimentação muito irregular", { alimentacao: "Muito irregular, como mal" }],
    ["nunca teve acompanhamento", { acompanhamento: "Não, nunca tive" }],
    ["diabetes gestacional", { condicoes: ["Diabetes gestacional"] }],
    ["pressão alta", { condicoes: ["Anemia", "Pressão alta na gravidez"] }],
  ])("convite forte quando: %s", (_, flow) => {
    render(<GestantePage />);
    answerAll(flow);
    acceptAndSubmit();
    expect(strongHeading()).toBeInTheDocument();
    const href = screen.getByRole("link", { name: /falar com a dra\. camilla no whatsapp/i }).getAttribute("href")!;
    expect(decodeURIComponent(href.split("text=")[1])).toContain("2º trimestre");
  });

  it("mensagem do WhatsApp quando ainda não sabe o trimestre", () => {
    render(<GestantePage />);
    answerAll({ semanas: "Ainda não sei exatamente" });
    acceptAndSubmit();
    const href = screen.getByRole("link", { name: /^falar no whatsapp$/i }).getAttribute("href")!;
    expect(decodeURIComponent(href.split("text=")[1])).toContain("ainda não sei exatamente o trimestre");
  });
});
