import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import CasalGm2Page from "@/app/casalgm2/page";

describe("CasalGm2Page", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renderiza a headline principal do hero em inglês", () => {
    render(<CasalGm2Page />);
    expect(
      screen.getByRole("heading", { name: /the first step to getting pregnant together/i })
    ).toBeInTheDocument();
  });

  it("renderiza todas as seções pedidas em inglês", () => {
    render(<CasalGm2Page />);

    expect(screen.getByText(/couples have already transformed their journey/i)).toBeInTheDocument();
    expect(screen.getAllByText(/500/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/this guide is for you if/i)).toBeInTheDocument();
    expect(screen.getByText(/a clear path, in 3 steps/i)).toBeInTheDocument();
    expect(screen.getByText(/what you.ll experience with the guide/i)).toBeInTheDocument();
    expect(screen.getByText(/what.s included/i)).toBeInTheDocument();
    expect(screen.getByText(/what couples are saying/i)).toBeInTheDocument();
    expect(screen.getByText(/where are you in this journey/i)).toBeInTheDocument();
    expect(screen.getByText(/spots for this guide are closing soon/i)).toBeInTheDocument();
    expect(screen.getByText(/7-day money back guarantee/i)).toBeInTheDocument();
    expect(screen.getByText(/frequently asked questions/i)).toBeInTheDocument();
    expect(screen.getByText(/don.t lose another cycle/i)).toBeInTheDocument();
  });

  it("todos os CTAs apontam para o placeholder de checkout em inglês", () => {
    render(<CasalGm2Page />);
    const links = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href") === "CHECKOUT_URL_EN");
    expect(links.length).toBeGreaterThanOrEqual(3);
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("dispara InitiateCheckout em dólar ao clicar em um CTA", () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    render(<CasalGm2Page />);
    const links = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href") === "CHECKOUT_URL_EN");
    fireEvent.click(links[0]);

    expect(fbq).toHaveBeenCalledWith(
      "track",
      "InitiateCheckout",
      expect.objectContaining({ value: 27.0, currency: "USD" }),
      expect.any(Object)
    );
  });

  it("mostra o preço único de $27.00 sem parcelamento", () => {
    render(<CasalGm2Page />);
    expect(screen.getByText(/\$27\.00/i)).toBeInTheDocument();
    expect(screen.getByText(/instant access · no installments/i)).toBeInTheDocument();
    expect(screen.queryByText(/2x/i)).not.toBeInTheDocument();
  });

  it("abre e fecha uma pergunta do FAQ ao clicar", () => {
    render(<CasalGm2Page />);
    const question = screen.getByText(/who is blooming together for\?/i);
    const button = question.closest("button");
    expect(button).not.toBeNull();

    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button!);
    expect(button).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(button!);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it('o botão "Back to top" rola a página para o início', () => {
    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;

    render(<CasalGm2Page />);
    fireEvent.click(screen.getByText(/back to top/i));

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("footer não contém link de WhatsApp", () => {
    render(<CasalGm2Page />);
    const footer = screen.getByRole("contentinfo");
    const waLinks = within(footer)
      .queryAllByRole("link")
      .filter((link) => link.getAttribute("href")?.includes("wa.me"));
    expect(waLinks).toHaveLength(0);
  });

  it("footer mostra as credenciais em inglês e link de privacidade", () => {
    render(<CasalGm2Page />);
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText(/dr\. camilla freitas · crf\/pe 4563 · fertility specialist/i)).toBeInTheDocument();
    const link = within(footer).getByText(/privacy policy/i);
    expect(link).toHaveAttribute("href", "/privacidade");
  });

  it("o contador de casais anima até 500 quando entra na tela", () => {
    vi.useFakeTimers();
    render(<CasalGm2Page />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByTestId("animated-counter")).toHaveTextContent("500");
  });

  it("mostra depoimentos com nomes americanos", () => {
    render(<CasalGm2Page />);
    expect(screen.getByText("Sarah & Michael")).toBeInTheDocument();
    expect(screen.getByText("Austin, TX")).toBeInTheDocument();
  });

  it("cada depoimento usa uma foto de casal diferente, sem repetição", () => {
    render(<CasalGm2Page />);

    const expectedPhotos = [
      { name: "Sarah & Michael", photo: "casal-1.jpg" },
      { name: "Emily & David", photo: "casal-2.jpg" },
      { name: "Jessica & Ryan", photo: "casal-3.jpg" },
      { name: "Ashley & Brian", photo: "casal-4.jpg" },
    ];

    const usedPhotos = new Set<string>();

    expectedPhotos.forEach(({ name, photo }) => {
      const card = screen.getByText(name).closest("div.border-l-4");
      expect(card).not.toBeNull();
      const img = card!.querySelector("img");
      expect(img?.getAttribute("src")).toContain(`%2Fimages%2F${photo}`);
      usedPhotos.add(photo);
    });

    expect(usedPhotos.size).toBe(4);
  });

  it("os 3 polaroids do hero usam fotos diferentes, sem repetição", () => {
    const { container } = render(<CasalGm2Page />);

    const polaroidImgs = container.querySelectorAll(".aspect-square.rounded-sm.overflow-hidden img");
    expect(polaroidImgs.length).toBe(3);

    const srcs = Array.from(polaroidImgs).map((img) => img.getAttribute("src"));
    expect(srcs[0]).toContain("%2Fimages%2Fcasal-2.jpg");
    expect(srcs[1]).toContain("%2Fimages%2Fcasal-3.jpg");
    expect(srcs[2]).toContain("%2Fimages%2Fcasal-5.jpg");

    expect(new Set(srcs).size).toBe(3);
  });

  it("usa fotos reais de casais (não placeholders do Unsplash)", () => {
    const { container } = render(<CasalGm2Page />);

    const casalPhotos = screen.getAllByAltText(/couple cared for by dr\. camilla/i);
    expect(casalPhotos.length).toBeGreaterThanOrEqual(8); // 3 polaroids + 5 grid + 4 testimonials
    casalPhotos.forEach((img) => {
      expect(img.getAttribute("src")).toContain("%2Fimages%2Fcasal-");
    });

    expect(container.innerHTML).not.toContain("unsplash.com");
  });
});
