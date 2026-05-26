import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BonusSection } from "@/components/sections/bonus-section";

describe("BonusSection", () => {
  it("exibe headline principal", () => {
    render(<BonusSection />);
    expect(
      screen.getByRole("heading", { name: /tudo isso ainda vem com você/i })
    ).toBeInTheDocument();
  });

  it("exibe os 3 bônus", () => {
    render(<BonusSection />);
    expect(screen.getByText(/checklist dos 10 pilares/i)).toBeInTheDocument();
    expect(screen.getByText(/linha do tempo inteligente/i)).toBeInTheDocument();
    expect(screen.getByText(/guia de valores ideais/i)).toBeInTheDocument();
  });

  it("exibe valor total dos bônus", () => {
    render(<BonusSection />);
    expect(screen.getByText(/valor total dos bônus/i)).toBeInTheDocument();
  });

  it("section tem id='bonus'", () => {
    render(<BonusSection />);
    expect(document.getElementById("bonus")).toBeInTheDocument();
  });
});
