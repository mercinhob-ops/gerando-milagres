import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home (landing page)", () => {
  it("exibe headline principal com h1", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("exibe a promessa central de preparar o corpo para gerar vida", () => {
    render(<Home />);
    expect(screen.getByText(/preparar seu corpo para gerar vida/i)).toBeInTheDocument();
  });

  it("exibe o CTA principal com copy emocional", () => {
    render(<Home />);
    expect(
      screen.getByRole("link", { name: /Quero preparar meu corpo/i })
    ).toBeInTheDocument();
  });

  it("CTA principal aponta para âncora #inscricao", () => {
    render(<Home />);
    const cta = screen.getByRole("link", { name: /Quero preparar meu corpo/i });
    expect(cta).toHaveAttribute("href", "#inscricao");
  });

  it("placeholder de inscrição existe na página", () => {
    render(<Home />);
    expect(document.getElementById("inscricao")).toBeInTheDocument();
  });
});
