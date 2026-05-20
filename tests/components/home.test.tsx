import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home (canary)", () => {
  it("exibe o nome do produto", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1, name: /Gerando Milagres/i })).toBeInTheDocument();
  });

  it("exibe a promessa central", () => {
    render(<Home />);
    expect(screen.getByText(/preparar seu corpo/i)).toBeInTheDocument();
  });

  it("exibe o CTA principal", () => {
    render(<Home />);
    expect(screen.getByRole("button", { name: /Quero preparar meu corpo/i })).toBeInTheDocument();
  });

  it("exibe swatches de cor da marca", () => {
    render(<Home />);
    expect(screen.getByText("Lilás")).toBeInTheDocument();
    expect(screen.getByText("Roxo Suave")).toBeInTheDocument();
    expect(screen.getByText("Nude")).toBeInTheDocument();
  });

  it("exibe seção de tipografia com Playfair Display", () => {
    render(<Home />);
    expect(screen.getByText(/Identidade Visual/i)).toBeInTheDocument();
    expect(screen.getByText(/Tipografia/i)).toBeInTheDocument();
  });
});
