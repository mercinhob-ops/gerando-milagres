import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CtaFinalSection } from "@/components/sections/cta-final-section";

describe("CtaFinalSection", () => {
  it("exibe headline emocional", () => {
    render(<CtaFinalSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: /seu corpo está esperando/i })
    ).toBeInTheDocument();
  });

  it("exibe badge de urgência com vagas abertas", () => {
    render(<CtaFinalSection />);
    expect(screen.getByText(/vagas abertas/i)).toBeInTheDocument();
  });

  it("exibe texto de escassez sobre vagas limitadas", () => {
    render(<CtaFinalSection />);
    expect(screen.getByText(/vagas limitadas/i)).toBeInTheDocument();
  });

  it("CTA principal aponta para checkout externo", () => {
    render(<CtaFinalSection />);
    const cta = screen.getByRole("link", { name: /quero preparar meu corpo/i });
    expect(cta).toHaveAttribute("href", "https://pay.kiwify.com.br/uOSEIEm");
    expect(cta).toHaveAttribute("target", "_blank");
  });

  it("CTA secundário aponta para WhatsApp", () => {
    render(<CtaFinalSection />);
    const wa = screen.getByRole("link", { name: /tire suas dúvidas pelo whatsapp/i });
    expect(wa).toHaveAttribute("href", expect.stringContaining("wa.me"));
    expect(wa).toHaveAttribute("target", "_blank");
  });

  it("section tem id='inscricao'", () => {
    render(<CtaFinalSection />);
    expect(document.getElementById("inscricao")).toBeInTheDocument();
  });
});
