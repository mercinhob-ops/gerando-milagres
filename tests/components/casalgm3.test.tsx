import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import CasalGm3Page from "@/app/casalgm3/page";

describe("CasalGm3Page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renderiza a headline principal e as credenciais da Dra. Camilla", () => {
    render(<CasalGm3Page />);
    expect(
      screen.getByRole("heading", { name: /checklist da fertilidade masculina/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/dra\. camilla freitas · crf\/pe 4563/i).length).toBeGreaterThan(0);
  });

  it("mostra a frase destaque sobre os 90 dias de formação dos espermatozoides", () => {
    render(<CasalGm3Page />);
    expect(screen.getByText(/espermatozoides levam cerca de 90 dias/i)).toBeInTheDocument();
  });

  it("renderiza as 7 seções do checklist com seus ícones", () => {
    render(<CasalGm3Page />);
    expect(screen.getByText(/calor e exposição/i)).toBeInTheDocument();
    expect(screen.getByText(/estilo de vida/i)).toBeInTheDocument();
    expect(screen.getByText(/sono e estresse/i)).toBeInTheDocument();
    expect(screen.getByText(/alimentação/i)).toBeInTheDocument();
    expect(screen.getByText(/saúde geral/i)).toBeInTheDocument();
    expect(screen.getByText(/desreguladores endócrinos/i)).toBeInTheDocument();
    expect(screen.getByText(/medicamentos e substâncias/i)).toBeInTheDocument();
  });

  it("conta 29 itens de checklist no total e começa zerado", () => {
    render(<CasalGm3Page />);
    expect(screen.getAllByRole("checkbox")).toHaveLength(29);
    expect(screen.getByText(/você marcou/i).parentElement).toHaveTextContent("Você marcou 0 de 29 itens");
  });

  it("atualiza o contador em tempo real ao marcar itens", () => {
    render(<CasalGm3Page />);
    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);
    expect(screen.getByText(/você marcou/i).parentElement).toHaveTextContent("Você marcou 1 de 29 itens");

    fireEvent.click(checkboxes[1]);
    expect(screen.getByText(/você marcou/i).parentElement).toHaveTextContent("Você marcou 2 de 29 itens");
  });

  it("desmarca um item ao clicar novamente", () => {
    render(<CasalGm3Page />);
    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
  });

  it("não mostra o banner de alerta com menos de 3 itens marcados, e mostra a partir de 3", () => {
    render(<CasalGm3Page />);
    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);
    expect(screen.queryByText(/não é motivo pra pânico/i)).not.toBeInTheDocument();

    fireEvent.click(checkboxes[2]);
    expect(screen.getByText(/você marcou 3 itens — não é motivo pra pânico/i)).toBeInTheDocument();
  });

  it("não mostra a seção de resultado/CTA antes da captura de lead", () => {
    render(<CasalGm3Page />);
    expect(screen.queryByText(/quero o florescer a dois →/i)).not.toBeInTheDocument();
    expect(screen.getByText(/quer entender por onde começar\?/i)).toBeInTheDocument();
  });

  it("valida nome e e-mail antes de enviar o formulário de captura", () => {
    render(<CasalGm3Page />);
    const submitButton = screen.getByRole("button", { name: /quero saber por onde começar/i });

    fireEvent.click(submitButton);
    expect(screen.getByRole("alert")).toHaveTextContent(/digite seu nome/i);

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: "Marcos Silva" } });
    fireEvent.click(submitButton);
    expect(screen.getByRole("alert")).toHaveTextContent(/e-mail válido/i);
  });

  it("ao enviar nome e e-mail válidos: dispara Lead, salva no localStorage e revela o CTA com o nome", () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    render(<CasalGm3Page />);
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: "Marcos Silva" } });
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: "marcos@exemplo.com" } });
    fireEvent.click(screen.getByRole("button", { name: /quero saber por onde começar/i }));

    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Lead",
      expect.objectContaining({ content_name: "Checklist Fertilidade Masculina" }),
      expect.any(Object)
    );

    const stored = JSON.parse(window.localStorage.getItem("casalgm3_lead") ?? "{}");
    expect(stored).toMatchObject({ name: "Marcos Silva", email: "marcos@exemplo.com" });

    expect(
      screen.getByText(/marcos, o corpo do seu parceiro pode se preparar muito melhor/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/quero o florescer a dois →/i)).toBeInTheDocument();
  });

  it("mostra o produto, o preço e a foto da Dra. Camilla no resultado", () => {
    render(<CasalGm3Page />);
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: "Ana Souza" } });
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: "ana@exemplo.com" } });
    fireEvent.click(screen.getByRole("button", { name: /quero saber por onde começar/i }));

    expect(screen.getByText("Florescer a Dois")).toBeInTheDocument();
    expect(screen.getByText(/2x de r\$28,95 ou r\$57,90 à vista/i)).toBeInTheDocument();
    expect(screen.getByAltText(/florescer a dois — dra\. camilla freitas/i)).toBeInTheDocument();
    expect(screen.getByAltText(/^dra\. camilla freitas$/i)).toBeInTheDocument();
  });

  it("o CTA final dispara InitiateCheckout e aponta para /casalgm1", () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    render(<CasalGm3Page />);
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: "Ana Souza" } });
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: "ana@exemplo.com" } });
    fireEvent.click(screen.getByRole("button", { name: /quero saber por onde começar/i }));

    fbq.mockClear();
    const cta = screen.getByText(/quero o florescer a dois →/i).closest("a");
    expect(cta).toHaveAttribute("href", "/casalgm1");

    fireEvent.click(cta!);
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "InitiateCheckout",
      expect.objectContaining({ value: 57.9, currency: "BRL", content_name: "Florescer a Dois" }),
      expect.any(Object)
    );
  });

  it("mostra o aviso de LGPD junto ao formulário de captura", () => {
    render(<CasalGm3Page />);
    expect(screen.getByText(/seus dados estão protegidos pela lgpd/i)).toBeInTheDocument();
  });

  it("mostra o footer com direitos reservados e aviso de material educativo", () => {
    render(<CasalGm3Page />);
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText(/© 2026 gerando milagres · dra\. camilla freitas · crf\/pe 4563/i)).toBeInTheDocument();
    expect(within(footer).getByText(/não substitui acompanhamento profissional/i)).toBeInTheDocument();
  });
});
