import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DesignTokensPage from "@/app/dev/design-tokens/page";

describe("DesignTokensPage", () => {
  it("renderiza sem erros", () => {
    render(<DesignTokensPage />);
    expect(screen.getByText("Design Tokens — Gerando Milagres")).toBeInTheDocument();
  });

  it("exibe todas as seções principais", () => {
    render(<DesignTokensPage />);
    expect(screen.getByText("Paleta de Cores")).toBeInTheDocument();
    expect(screen.getByText("Escala Tipográfica")).toBeInTheDocument();
    expect(screen.getByText("Botões")).toBeInTheDocument();
  });

  it("exibe todas as cores da marca", () => {
    render(<DesignTokensPage />);
    expect(screen.getByText("Salmão")).toBeInTheDocument();
    expect(screen.getByText("Marrom")).toBeInTheDocument();
    expect(screen.getByText("Nude")).toBeInTheDocument();
  });

  it("exibe a escala tipográfica", () => {
    render(<DesignTokensPage />);
    expect(screen.getByText(/Heading 1/)).toBeInTheDocument();
    expect(screen.getByText(/Prepare seu corpo para gerar vida/)).toBeInTheDocument();
    expect(screen.getByText(/Resultados individuais podem variar/)).toBeInTheDocument();
  });
});
