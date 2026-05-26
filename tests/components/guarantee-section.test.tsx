import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GuaranteeSection } from "@/components/sections/guarantee-section";

describe("GuaranteeSection", () => {
  it("exibe headline principal", () => {
    render(<GuaranteeSection />);
    expect(
      screen.getByRole("heading", { name: /experimente sem medo/i })
    ).toBeInTheDocument();
  });

  it("exibe badge de garantia de 30 dias", () => {
    render(<GuaranteeSection />);
    expect(screen.getByRole("img", { name: /garantia de 30 dias/i })).toBeInTheDocument();
  });

  it("exibe texto da garantia incondicional", () => {
    render(<GuaranteeSection />);
    expect(screen.getByText(/100% do seu investimento/i)).toBeInTheDocument();
  });

  it("exibe citação emocional", () => {
    render(<GuaranteeSection />);
    expect(screen.getByText(/o risco é meu/i)).toBeInTheDocument();
  });

  it("section tem id='garantia'", () => {
    render(<GuaranteeSection />);
    expect(document.getElementById("garantia")).toBeInTheDocument();
  });
});
