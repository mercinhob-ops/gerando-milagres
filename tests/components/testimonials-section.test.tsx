import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestimonialsSection } from "@/components/sections/testimonials-section";

describe("TestimonialsSection", () => {
  it("exibe o headline principal", () => {
    render(<TestimonialsSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: /resultados reais de mulheres reais/i })
    ).toBeInTheDocument();
  });

  it("exibe o subheadline", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText(/veja o que elas têm a dizer/i)).toBeInTheDocument();
  });

  it("renderiza 2 iframes de vídeo", () => {
    render(<TestimonialsSection />);
    const iframes = document.querySelectorAll("iframe");
    expect(iframes).toHaveLength(2);
  });

  it("iframes apontam para youtube-nocookie (LGPD)", () => {
    render(<TestimonialsSection />);
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      expect(iframe.src).toContain("youtube-nocookie.com");
    });
  });

  it("iframes têm o ID correto dos vídeos", () => {
    render(<TestimonialsSection />);
    const iframes = document.querySelectorAll("iframe");
    const srcs = Array.from(iframes).map((el) => el.src);
    expect(srcs.some((s) => s.includes("YtnEK5VDuC0"))).toBe(true);
    expect(srcs.some((s) => s.includes("r3nvI7zs3Pc"))).toBe(true);
  });

  it("section tem id='depoimentos'", () => {
    render(<TestimonialsSection />);
    expect(document.getElementById("depoimentos")).toBeInTheDocument();
  });
});
