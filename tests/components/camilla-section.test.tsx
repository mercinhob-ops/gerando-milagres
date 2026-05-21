import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CamillaSection } from "@/components/sections/camilla-section";
import { camillaStory } from "@/data/camilla";

describe("CamillaSection", () => {
  it("exibe o headline da seção", () => {
    render(<CamillaSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: /de dentro da dor nasceu o método/i })
    ).toBeInTheDocument();
  });

  it("exibe o eyebrow 'A história por trás do método'", () => {
    render(<CamillaSection />);
    expect(screen.getByText(/a história por trás do método/i)).toBeInTheDocument();
  });

  it("exibe trecho da narrativa pessoal", () => {
    render(<CamillaSection />);
    expect(screen.getByText(/resultado negativo e sentir o chão sumir/i)).toBeInTheDocument();
  });

  it("exibe o nome da especialista no bloco de credencial", () => {
    render(<CamillaSection />);
    const names = screen.getAllByText(camillaStory.credential.name);
    expect(names.length).toBeGreaterThanOrEqual(1);
  });

  it("exibe o CRF da especialista", () => {
    render(<CamillaSection />);
    expect(screen.getAllByText(/CRF\/PE 4563/i).length).toBeGreaterThanOrEqual(1);
  });

  it("exibe a descrição profissional", () => {
    render(<CamillaSection />);
    expect(screen.getByText(/suplementação estratégica/i)).toBeInTheDocument();
  });

  it("exibe imagem editorial da Camilla com alt text", () => {
    render(<CamillaSection />);
    expect(screen.getByRole("img", { name: /camilla freitas/i })).toBeInTheDocument();
  });

  it("section tem id='historia'", () => {
    render(<CamillaSection />);
    expect(document.getElementById("historia")).toBeInTheDocument();
  });
});
