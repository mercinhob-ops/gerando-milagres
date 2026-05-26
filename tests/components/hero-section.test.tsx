import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/components/sections/hero-section";

describe("HeroSection", () => {
  it("exibe headline emocional com h1", () => {
    render(<HeroSection />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("headline contém o termo-chave destacado 'milagre'", () => {
    render(<HeroSection />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toMatch(/milagre/i);
    const em = h1.querySelector("em");
    expect(em).toBeInTheDocument();
    expect(em?.textContent).toMatch(/milagre/i);
  });

  it("exibe subheadline com promessa de preparar o corpo para gerar vida", () => {
    render(<HeroSection />);
    expect(screen.getByText(/preparar seu corpo para gerar vida/i)).toBeInTheDocument();
  });

  it("exibe CTA principal com copy emocional", () => {
    render(<HeroSection />);
    expect(
      screen.getByRole("link", { name: /Quero preparar meu corpo/i })
    ).toBeInTheDocument();
  });

  it("CTA principal aponta para URL de checkout externo", () => {
    render(<HeroSection />);
    const cta = screen.getByRole("link", { name: /Quero preparar meu corpo/i });
    expect(cta).toHaveAttribute("href", "https://pay.kiwify.com.br/uOSEIEm");
    expect(cta).toHaveAttribute("target", "_blank");
    expect(cta).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("exibe apenas o CTA principal (sem link secundário)", () => {
    render(<HeroSection />);
    expect(screen.getAllByRole("link").length).toBe(1);
  });

  it("exibe eyebrow de fertilidade natural e suplementação", () => {
    render(<HeroSection />);
    expect(screen.getByText(/fertilidade natural/i)).toBeInTheDocument();
  });

  it("exibe credencial da especialista Camilla Freitas", () => {
    render(<HeroSection />);
    expect(screen.getByText(/Camilla Freitas — Farmacêutica CRF\/PE 4563/i)).toBeInTheDocument();
  });

  it("section tem id='hero'", () => {
    render(<HeroSection />);
    expect(document.getElementById("hero")).toBeInTheDocument();
  });
});
