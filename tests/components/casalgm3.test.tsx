import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import CasalGm3Page from "@/app/casalgm3/page";

describe("CasalGm3Page", () => {
  it("mostra o logo, as credenciais e a foto da Dra. Camilla no topo, sem formulário de captura", () => {
    render(<CasalGm3Page />);

    expect(screen.getByText("Gerando Milagres")).toBeInTheDocument();
    expect(screen.getAllByText(/dra\. camilla freitas · crf\/pe 4563/i).length).toBeGreaterThan(0);
    expect(screen.getAllByAltText(/^dra\. camilla freitas$/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: /checklist da fertilidade masculina/i })).toBeInTheDocument();

    expect(screen.queryByLabelText(/nome completo/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/e-mail/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/quero acessar o checklist/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/seus dados estão protegidos pela lgpd/i)).not.toBeInTheDocument();
  });

  it("abre direto mostrando o checklist completo, sem precisar de cadastro", () => {
    render(<CasalGm3Page />);

    expect(screen.getByText(/espermatozoides levam cerca de 90 dias/i)).toBeInTheDocument();
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

  it("mostra a seção de benefícios/CTA já no carregamento inicial, sem mencionar preço ou curso", () => {
    render(<CasalGm3Page />);

    expect(
      screen.getByText(/você acabou de ver o mapa completo\. mas o caminho é diferente pra cada casal\./i)
    ).toBeInTheDocument();
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

  it("não dispara Lead — não há mais captura nesta página", () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    render(<CasalGm3Page />);
    expect(fbq).not.toHaveBeenCalledWith("track", "Lead", expect.anything(), expect.anything());
  });

  it("mostra o footer com direitos reservados e aviso de material educativo", () => {
    render(<CasalGm3Page />);
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText(/© 2026 gerando milagres · dra\. camilla freitas · crf\/pe 4563/i)).toBeInTheDocument();
    expect(within(footer).getByText(/não substitui acompanhamento profissional/i)).toBeInTheDocument();
  });
});
