import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { IdentifySection } from "@/components/sections/identify-section";
import { pains, bridge } from "@/data/identify";

describe("IdentifySection", () => {
  it("exibe headline 'Você se identifica?'", () => {
    render(<IdentifySection />);
    expect(
      screen.getByRole("heading", { level: 2, name: /você se identifica/i })
    ).toBeInTheDocument();
  });

  it("exibe eyebrow 'Isso é para você'", () => {
    render(<IdentifySection />);
    expect(screen.getByText(/isso é para você/i)).toBeInTheDocument();
  });

  it(`exibe todas as ${pains.length} dores da persona`, () => {
    render(<IdentifySection />);
    const list = screen.getByRole("list", { name: /situações da persona/i });
    expect(list.querySelectorAll("li")).toHaveLength(pains.length);
  });

  it("cada dor é exibida como texto", () => {
    render(<IdentifySection />);
    expect(screen.getByText(/já tentou de tudo/i)).toBeInTheDocument();
    expect(screen.getByText(/três da manhã/i)).toBeInTheDocument();
  });

  it("exibe a frase de transição (ponte emocional)", () => {
    render(<IdentifySection />);
    expect(screen.getByText(new RegExp(bridge.slice(0, 40), "i"))).toBeInTheDocument();
  });

  it("section tem id='voce-se-identifica'", () => {
    render(<IdentifySection />);
    expect(document.getElementById("voce-se-identifica")).toBeInTheDocument();
  });
});
