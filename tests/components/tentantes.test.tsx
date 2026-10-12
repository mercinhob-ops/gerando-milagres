import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TentantesPage from "@/app/tentantes/page";

const next = () => fireEvent.click(screen.getByRole("button", { name: /^próximo/i }));
const pick = (label: string | RegExp) => fireEvent.click(screen.getByRole("button", { name: label }));

function answerUntilExames({ tempo = "Mais de 2 anos", exames = "Sim, e encontraram algo" } = {}) {
  fireEvent.click(screen.getByRole("button", { name: /começar/i }));
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Maria Clara Lima" } });
  next();
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "(81) 98888-7777" } });
  next();
  pick("36 a 39 anos");
  next();
  pick(tempo);
  next();
  pick(exames);
  next();
}

function answerFromMarido({ inicio = "Nos próximos meses" } = {}) {
  pick("Sim, muito presente");
  next();
  fireEvent.click(screen.getByRole("button", { name: /^pular$/i }));
  pick("O lado emocional");
  next();
  pick(inicio);
  next();
  pick("Entre R$100 e R$300");
  next();
}

describe("TentantesPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("mostra a tela inicial com a foto da Dra. Camilla", () => {
    render(<TentantesPage />);
    expect(screen.getByAltText(/dra\. camilla freitas/i)).toHaveAttribute(
      "src",
      expect.stringContaining("camilla-zap2.jpg")
    );
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("mostra progresso X/11, valida e permite voltar", () => {
    render(<TentantesPage />);
    fireEvent.click(screen.getByRole("button", { name: /começar/i }));
    expect(screen.getByText("1/11")).toBeInTheDocument();

    next();
    expect(screen.getByRole("alert")).toHaveTextContent(/nome completo/i);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Maria" } });
    next();
    expect(screen.getByText("2/11")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "8888" } });
    next();
    expect(screen.getByRole("alert")).toHaveTextContent(/whatsapp válido/i);

    fireEvent.click(screen.getByRole("button", { name: /voltar/i }));
    expect(screen.getByText("1/11")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("Maria");
  });

  it("pula P6 quando os exames estão normais", () => {
    render(<TentantesPage />);
    answerUntilExames({ exames: "Sim, e está tudo normal" });
    expect(screen.getByText("7/11")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /marido está envolvido/i })).toBeInTheDocument();
  });

  it("P6 aceita seleção múltipla e 'Prefiro não dizer' é exclusivo", () => {
    render(<TentantesPage />);
    answerUntilExames();
    expect(screen.getByText("6/11")).toBeInTheDocument();

    pick(/^SOP/);
    pick("Endometriose");
    expect(screen.getByRole("button", { name: /^SOP/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Endometriose" })).toHaveAttribute("aria-pressed", "true");

    pick("Prefiro não dizer");
    expect(screen.getByRole("button", { name: /^SOP/ })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Prefiro não dizer" })).toHaveAttribute("aria-pressed", "true");
  });

  it("fluxo completo com convite forte: exige LGPD, dispara Lead e monta mensagem do WhatsApp", () => {
    const fbq = vi.fn();
    window.fbq = fbq;
    render(<TentantesPage />);

    answerUntilExames();
    pick(/^SOP/);
    pick("Endometriose");
    next();
    answerFromMarido();

    expect(screen.getByText("11/11")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /enviar e receber o material/i }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(fbq).not.toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText(/autorizo a dra\. camilla freitas a entrar em contato/i));
    fireEvent.click(screen.getByRole("button", { name: /enviar e receber o material/i }));

    expect(fbq).toHaveBeenCalledWith("track", "Lead", expect.any(Object), expect.any(Object));
    expect(screen.getByRole("heading", { name: /pronto, maria! 🌸/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /baixar o material/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /vamos olhar o seu caso juntas\?/i })).toBeInTheDocument();

    const href = screen.getByRole("link", { name: /falar com a dra\. camilla no whatsapp/i }).getAttribute("href")!;
    expect(href).toContain("https://wa.me/5581981396005?text=");
    const message = decodeURIComponent(href.split("text=")[1]);
    expect(message).toContain("Maria Clara Lima");
    expect(message).toContain("mais de 2 anos");
    expect(message).toContain("SOP (Síndrome dos Ovários Policísticos), Endometriose");

    const saved = JSON.parse(window.localStorage.getItem("tentantes_lead")!);
    expect(saved).toMatchObject({
      nome: "Maria Clara Lima",
      whatsapp: "81988887777",
      identificado: ["sop", "endometriose"],
      perda: null,
      preocupacao: "emocional",
      lgpd: true,
    });
  });

  it("convite leve quando não está pronta e tenta há menos de 2 anos", () => {
    render(<TentantesPage />);
    answerUntilExames({ tempo: "1 a 2 anos", exames: "Ainda não fizemos" });
    answerFromMarido({ inicio: "Ainda estou pesquisando" });
    fireEvent.click(screen.getByLabelText(/autorizo/i));
    fireEvent.click(screen.getByRole("button", { name: /enviar e receber o material/i }));

    expect(screen.queryByText(/vamos olhar o seu caso juntas/i)).not.toBeInTheDocument();
    const href = screen.getByRole("link", { name: /falar no whatsapp/i }).getAttribute("href")!;
    const message = decodeURIComponent(href.split("text=")[1]);
    expect(message).toContain("1 a 2 anos");
    expect(message).not.toContain("identificado");
  });

  it("convite forte quando responde 'Agora, estou pronta'", () => {
    render(<TentantesPage />);
    answerUntilExames({ tempo: "Menos de 6 meses", exames: "Ainda não fizemos" });
    answerFromMarido({ inicio: "Agora, estou pronta" });
    fireEvent.click(screen.getByLabelText(/autorizo/i));
    fireEvent.click(screen.getByRole("button", { name: /enviar e receber o material/i }));
    expect(screen.getByRole("heading", { name: /vamos olhar o seu caso juntas\?/i })).toBeInTheDocument();
  });
});
