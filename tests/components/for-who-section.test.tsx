import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ForWhoSection } from "@/components/sections/for-who-section";

describe("ForWhoSection", () => {
  it("exibe headline principal", () => {
    render(<ForWhoSection />);
    expect(
      screen.getByRole("heading", { name: /este programa é para você/i })
    ).toBeInTheDocument();
  });

  it("lista os itens 'para quem é'", () => {
    render(<ForWhoSection />);
    expect(
      screen.getByRole("list", { name: /para quem é o programa/i })
    ).toBeInTheDocument();
  });

  it("exibe itens 'não é para quem'", () => {
    render(<ForWhoSection />);
    expect(
      screen.getByRole("list", { name: /para quem não é o programa/i })
    ).toBeInTheDocument();
  });

  it("section tem id='para-quem-e'", () => {
    render(<ForWhoSection />);
    expect(document.getElementById("para-quem-e")).toBeInTheDocument();
  });
});
