import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MethodSection } from "@/components/sections/method-section";
import { methodPillars } from "@/data/method";

describe("MethodSection", () => {
  it("exibe o headline 'Os 5 pilares do método'", () => {
    render(<MethodSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: /os 5 pilares do método/i })
    ).toBeInTheDocument();
  });

  it("exibe eyebrow 'Como funciona'", () => {
    render(<MethodSection />);
    expect(screen.getByText(/como funciona/i)).toBeInTheDocument();
  });

  it(`renderiza todos os ${methodPillars.length} pilares`, () => {
    render(<MethodSection />);
    const list = screen.getByRole("list", { name: /pilares do método/i });
    expect(list.querySelectorAll("li")).toHaveLength(methodPillars.length);
  });

  it("exibe os títulos dos 5 pilares reais", () => {
    render(<MethodSection />);
    expect(screen.getByText("Alimentação")).toBeInTheDocument();
    expect(screen.getByText("Sono")).toBeInTheDocument();
    expect(screen.getByText("Suplementação")).toBeInTheDocument();
    expect(screen.getByText("Gerenciamento do Stress")).toBeInTheDocument();
    expect(screen.getByText("Atividade Física")).toBeInTheDocument();
  });

  it("exibe a chamada de rodapé do método", () => {
    render(<MethodSection />);
    expect(screen.getByText(/preparar seu corpo com intenção e ciência/i)).toBeInTheDocument();
  });

  it("section tem id='metodo'", () => {
    render(<MethodSection />);
    expect(document.getElementById("metodo")).toBeInTheDocument();
  });
});
