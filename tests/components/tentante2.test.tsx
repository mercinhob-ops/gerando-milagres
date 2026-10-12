import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Tentante2Page from "@/app/tentante2/page";

const next = () => fireEvent.click(screen.getByRole("button", { name: /^próximo/i }));
const pick = (label: string | RegExp) => fireEvent.click(screen.getByRole("button", { name: label }));

function answerUntilExames({ tempo = "Mais de 2 anos", exames = "Sim, encontraram alguma coisa" } = {}) {
  fireEvent.click(screen.getByRole("button", { name: /começar/i }));
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Joana Maria Silva" } });
  next();
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "81 98888-7777" } });
  next();
  pick("36 a 39");
  next();
  pick(tempo);
  next();
  pick(exames);
  next();
}

function answerFromMarido({ inicio = "Daqui a alguns meses" } = {}) {
  pick("Sim, ele me apoia muito");
  next();
  fireEvent.click(screen.getByRole("button", { name: /^pular$/i }));
  pick("Minha cabeça e meu coração");
  next();
  pick(inicio);
  next();
  pick("Entre R$100 e R$300");
  next();
}

function acceptAndSubmit() {
  fireEvent.click(screen.getByLabelText(/concordo que a dra\. camilla pode me chamar no whatsapp/i));
  fireEvent.click(screen.getByRole("button", { name: /enviar e receber o material/i }));
}

describe("Tentante2Page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("usa a linguagem simples na tela inicial e nas perguntas", () => {
    render(<Tentante2Page />);
    expect(screen.getByRole("heading", { name: /me conta um pouco sobre você 🌸/i })).toBeInTheDocument();
    expect(screen.getByAltText(/dra\. camilla freitas/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /começar/i }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Joana" } });
    next();
    expect(screen.getByRole("heading", { name: "Qual é o seu WhatsApp? (ex: 81 99999-9999)" })).toBeInTheDocument();
  });

  it("mostra P6 com termos simples e 'Prefiro não falar' exclusivo", () => {
    render(<Tentante2Page />);
    answerUntilExames();
    expect(screen.getByText("6/11")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /o que o médico encontrou\?/i })).toBeInTheDocument();

    pick("Ovário policístico (SOP)");
    pick("Prefiro não falar");
    expect(screen.getByRole("button", { name: "Ovário policístico (SOP)" })).toHaveAttribute("aria-pressed", "false");
  });

  it("pula P6 quando o médico disse que está tudo bem", () => {
    render(<Tentante2Page />);
    answerUntilExames({ exames: "Sim, o médico disse que está tudo bem" });
    expect(screen.getByText("7/11")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /seu marido está junto nessa caminhada\?/i })).toBeInTheDocument();
  });

  it("fluxo completo com convite forte: Lead, envio ao Supabase e mensagem simples", () => {
    const fbq = vi.fn();
    window.fbq = fbq;
    const fetchMock = vi.fn(() => Promise.resolve(new Response("{}")));
    vi.stubGlobal("fetch", fetchMock);
    render(<Tentante2Page />);

    answerUntilExames();
    pick("Ovário policístico (SOP)");
    pick("Problema no esperma do marido");
    next();
    answerFromMarido();

    fireEvent.click(screen.getByRole("button", { name: /enviar e receber o material/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/marque o quadrinho/i);
    expect(fbq).not.toHaveBeenCalled();

    acceptAndSubmit();

    expect(fbq).toHaveBeenCalledWith("track", "Lead", expect.any(Object), expect.any(Object));
    const leadCall = fetchMock.mock.calls.find((call) => (call as unknown[])[0] === "/api/leads") as unknown as
      | [string, RequestInit]
      | undefined;
    expect(JSON.parse(leadCall![1].body as string)).toMatchObject({
      page: "tentante2",
      name: "Joana Maria Silva",
      whatsapp: "81988887777",
      data: expect.objectContaining({
        "O que foi identificado": ["Ovário policístico (SOP)", "Problema no esperma do marido"],
        "Perda gestacional": "Pulou",
      }),
    });

    expect(screen.getByRole("heading", { name: /pronto, joana! seu material está aqui 🌸/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /baixar o material/i })).toHaveAttribute("href", "#MATERIAL_TENTANTE2_URL");
    expect(
      screen.getByRole("heading", { name: /a dra\. camilla quer te ajudar! chama ela no whatsapp 💛/i })
    ).toBeInTheDocument();

    const href = screen.getByRole("link", { name: /chamar a dra\. camilla no whatsapp/i }).getAttribute("href")!;
    expect(href).toContain("https://wa.me/5581981396005?text=");
    const message = decodeURIComponent(href.split("text=")[1]);
    expect(message).toContain("Joana Maria Silva");
    expect(message).toContain("mais de 2 anos");
    expect(message).toContain("Ovário policístico (SOP), Problema no esperma do marido");
    expect(JSON.parse(window.localStorage.getItem("tentante2_lead")!).identificado).toEqual(["sop", "fator-masculino"]);
  });

  it("convite leve quando ainda está pensando e tenta há menos de 2 anos", () => {
    render(<Tentante2Page />);
    answerUntilExames({ tempo: "1 a 2 anos", exames: "Ainda não fomos ao médico" });
    answerFromMarido({ inicio: "Ainda estou pensando" });
    acceptAndSubmit();
    expect(screen.queryByText(/quer te ajudar/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^chamar no whatsapp$/i })).toBeInTheDocument();
  });

  it("convite forte quando quer começar logo", () => {
    render(<Tentante2Page />);
    answerUntilExames({ tempo: "Menos de 6 meses", exames: "Ainda não fomos ao médico" });
    answerFromMarido({ inicio: "Agora, quero começar logo" });
    acceptAndSubmit();
    expect(screen.getByText(/a dra\. camilla quer te ajudar!/i)).toBeInTheDocument();
  });
});
