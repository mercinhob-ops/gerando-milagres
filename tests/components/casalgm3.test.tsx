import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import CasalGm3Page from "@/app/casalgm3/page";

function submitLeadForm(name = "Marcos Silva", email = "marcos@exemplo.com") {
  fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: name } });
  fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: email } });
  fireEvent.click(screen.getByRole("button", { name: /quero acessar o checklist/i }));
}

describe("CasalGm3Page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("mostra apenas o passo de captura no carregamento inicial, com o restante oculto", () => {
    render(<CasalGm3Page />);

    expect(
      screen.getByRole("heading", { name: /descubra se o corpo do seu parceiro está pronto para gerar vida/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/dra\. camilla freitas · crf\/pe 4563/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/preencha seus dados para acessar o checklist exclusivo da fertilidade masculina/i)
    ).toBeInTheDocument();

    expect(screen.queryByText(/calor e exposição/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/espermatozoides levam cerca de 90 dias/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/você acabou de ver o mapa completo\. mas o caminho é diferente pra cada casal\./i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/quero conhecer o caminho →/i)).not.toBeInTheDocument();
  });

  it("mostra a foto da Dra. Camilla e o aviso de LGPD no passo de captura", () => {
    render(<CasalGm3Page />);
    expect(screen.getByAltText(/^dra\. camilla freitas$/i)).toBeInTheDocument();
    expect(screen.getByText(/seus dados estão protegidos pela lgpd/i)).toBeInTheDocument();
  });

  it("valida nome e e-mail antes de liberar o checklist", () => {
    render(<CasalGm3Page />);
    const submitButton = screen.getByRole("button", { name: /quero acessar o checklist/i });

    fireEvent.click(submitButton);
    expect(screen.getByRole("alert")).toHaveTextContent(/digite seu nome/i);

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: "Marcos Silva" } });
    fireEvent.click(submitButton);
    expect(screen.getByRole("alert")).toHaveTextContent(/e-mail válido/i);

    expect(screen.queryByText(/calor e exposição/i)).not.toBeInTheDocument();
  });

  it("ao enviar nome e e-mail válidos: dispara Lead, salva no localStorage e revela checklist + CTA", () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    render(<CasalGm3Page />);
    submitLeadForm();

    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Lead",
      expect.objectContaining({ content_name: "Checklist Fertilidade Masculina" }),
      expect.any(Object)
    );

    const stored = JSON.parse(window.localStorage.getItem("casalgm3_lead") ?? "{}");
    expect(stored).toMatchObject({ name: "Marcos Silva", email: "marcos@exemplo.com" });

    expect(screen.getByText(/calor e exposição/i)).toBeInTheDocument();
    expect(
      screen.getByText(/você acabou de ver o mapa completo\. mas o caminho é diferente pra cada casal\./i)
    ).toBeInTheDocument();
  });

  it("mostra a frase destaque dos 90 dias junto com o checklist, só após a captura", () => {
    render(<CasalGm3Page />);
    submitLeadForm();
    expect(screen.getByText(/espermatozoides levam cerca de 90 dias/i)).toBeInTheDocument();
  });

  it("renderiza as 7 seções do checklist com seus ícones após a captura", () => {
    render(<CasalGm3Page />);
    submitLeadForm();
    expect(screen.getByText(/calor e exposição/i)).toBeInTheDocument();
    expect(screen.getByText(/estilo de vida/i)).toBeInTheDocument();
    expect(screen.getByText(/sono e estresse/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /alimentação/i })).toBeInTheDocument();
    expect(screen.getByText(/saúde geral/i)).toBeInTheDocument();
    expect(screen.getByText(/desreguladores endócrinos/i)).toBeInTheDocument();
    expect(screen.getByText(/medicamentos e substâncias/i)).toBeInTheDocument();
  });

  it("conta 29 itens de checklist no total e começa zerado", () => {
    render(<CasalGm3Page />);
    submitLeadForm();
    expect(screen.getAllByRole("checkbox")).toHaveLength(29);
    expect(screen.getByText(/você marcou/i).parentElement).toHaveTextContent("Você marcou 0 de 29 itens");
  });

  it("atualiza o contador em tempo real ao marcar itens", () => {
    render(<CasalGm3Page />);
    submitLeadForm();
    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);
    expect(screen.getByText(/você marcou/i).parentElement).toHaveTextContent("Você marcou 1 de 29 itens");

    fireEvent.click(checkboxes[1]);
    expect(screen.getByText(/você marcou/i).parentElement).toHaveTextContent("Você marcou 2 de 29 itens");
  });

  it("desmarca um item ao clicar novamente", () => {
    render(<CasalGm3Page />);
    submitLeadForm();
    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
  });

  it("não mostra o banner de alerta com menos de 3 itens marcados, e mostra a partir de 3", () => {
    render(<CasalGm3Page />);
    submitLeadForm();
    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);
    expect(screen.queryByText(/não é motivo pra pânico/i)).not.toBeInTheDocument();

    fireEvent.click(checkboxes[2]);
    expect(screen.getByText(/você marcou 3 itens — não é motivo pra pânico/i)).toBeInTheDocument();
  });

  it("mostra os 6 benefícios, a frase de impacto e a autoridade da Dra. Camilla, sem mencionar preço ou curso", () => {
    render(<CasalGm3Page />);
    submitLeadForm("Ana Souza", "ana@exemplo.com");

    expect(
      screen.getByText(/entender como o corpo dele e o dela funcionam juntos para gerar vida/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/unir ciência e fé — preparar o corpo e fortalecer a esperança juntos/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/existe um caminho mais seguro/i)).toBeInTheDocument();
    expect(
      screen.getByText(/dra\. camilla freitas — farmacêutica especialista em fertilidade natural · crf\/pe 4563/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/já ajudou mais de 500 casais a prepararem o corpo e conquistarem a gravidez/i)
    ).toBeInTheDocument();

    expect(screen.queryByText(/r\$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/curso/i)).not.toBeInTheDocument();
  });

  it("o CTA final dispara InitiateCheckout e aponta para /casalgm1", () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    render(<CasalGm3Page />);
    submitLeadForm("Ana Souza", "ana@exemplo.com");

    fbq.mockClear();
    const cta = screen.getByText(/quero conhecer o caminho →/i).closest("a");
    expect(cta).toHaveAttribute("href", "/casalgm1");

    fireEvent.click(cta!);
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "InitiateCheckout",
      expect.objectContaining({ value: 57.9, currency: "BRL", content_name: "Florescer a Dois" }),
      expect.any(Object)
    );
  });

  it("mostra o footer com direitos reservados e aviso de material educativo, mesmo antes da captura", () => {
    render(<CasalGm3Page />);
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText(/© 2026 gerando milagres · dra\. camilla freitas · crf\/pe 4563/i)).toBeInTheDocument();
    expect(within(footer).getByText(/não substitui acompanhamento profissional/i)).toBeInTheDocument();
  });
});
