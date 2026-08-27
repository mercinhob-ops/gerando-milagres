import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import CasalGmPage from "@/app/casalgm/page";

describe("CasalGmPage", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renderiza a headline principal do hero", () => {
    render(<CasalGmPage />);
    expect(
      screen.getByRole("heading", { name: /o primeiro passo para vocês engravidarem juntos/i })
    ).toBeInTheDocument();
  });

  it("renderiza todas as 15 seções pedidas", () => {
    render(<CasalGmPage />);

    expect(screen.getByText(/casais já transformaram sua jornada/i)).toBeInTheDocument();
    expect(screen.getAllByText(/500 casais/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/esse guia é para vocês se/i)).toBeInTheDocument();
    expect(screen.getByText(/um caminho claro, em 3 etapas/i)).toBeInTheDocument();
    expect(screen.getByText(/o que vocês vão viver com o guia/i)).toBeInTheDocument();
    expect(screen.getByText(/o que está incluso/i)).toBeInTheDocument();
    expect(screen.getByText(/o que casais estão dizendo/i)).toBeInTheDocument();
    expect(screen.getByText(/onde vocês estão nessa jornada/i)).toBeInTheDocument();
    expect(screen.getByText(/quanto vale o sonho de vocês terem um bebê\?/i)).toBeInTheDocument();
    expect(screen.getByText(/as vagas para esse guia encerram em breve/i)).toBeInTheDocument();
    expect(screen.getByText(/garantia de 7 dias — sem riscos/i)).toBeInTheDocument();
    expect(screen.getByText(/perguntas frequentes/i)).toBeInTheDocument();
    expect(screen.getByText(/não percam mais um ciclo/i)).toBeInTheDocument();
  });

  it("todos os CTAs apontam para o checkout Hotmart do Florescer a Dois", () => {
    render(<CasalGmPage />);
    const links = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.includes("pay.hotmart.com"));
    expect(links.length).toBeGreaterThanOrEqual(3);
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "https://pay.hotmart.com/D106943069P");
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("dispara InitiateCheckout ao clicar em um CTA", () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    render(<CasalGmPage />);
    const links = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.includes("pay.hotmart.com"));
    fireEvent.click(links[0]);

    expect(fbq).toHaveBeenCalledWith(
      "track",
      "InitiateCheckout",
      expect.objectContaining({ value: 57.9, currency: "BRL" }),
      expect.any(Object)
    );
  });

  it("mostra a hierarquia de preço com valor riscado e parcelamento", () => {
    render(<CasalGmPage />);
    expect(screen.getByText(/de r\$ 97,00/i)).toBeInTheDocument();
    expect(screen.getAllByText(/r\$ 28,95/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/ou r\$ 57,90 à vista/i)).toBeInTheDocument();
  });

  it("mostra a seção de empilhamento de valor antes do preço", () => {
    render(<CasalGmPage />);
    expect(screen.getByText(/quanto vale o sonho de vocês terem um bebê\?/i)).toBeInTheDocument();
    expect(screen.getByText(/guia florescer a dois — 9 capítulos completos/i)).toBeInTheDocument();
    expect(screen.getByText(/valor total/i)).toBeInTheDocument();
    expect(screen.getByText(/r\$242,00/i)).toBeInTheDocument();
    expect(screen.getByText(/mas hoje vocês levam tudo isso por apenas/i)).toBeInTheDocument();
  });

  it("abre e fecha uma pergunta do FAQ ao clicar", () => {
    render(<CasalGmPage />);
    const question = screen.getByText(/para quem é o florescer a dois\?/i);
    const button = question.closest("button");
    expect(button).not.toBeNull();

    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button!);
    expect(button).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(button!);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it('o botão "Voltar ao topo" rola a página para o início', () => {
    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;

    render(<CasalGmPage />);
    fireEvent.click(screen.getByText(/voltar ao topo/i));

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("link da política de privacidade aponta para /privacidade", () => {
    render(<CasalGmPage />);
    const link = within(screen.getByRole("contentinfo")).getByText(/política de privacidade/i);
    expect(link).toHaveAttribute("href", "/privacidade");
  });

  it("o contador de casais anima até 500 quando entra na tela", () => {
    vi.useFakeTimers();
    render(<CasalGmPage />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByTestId("animated-counter")).toHaveTextContent("500");
  });

  it("mostra depoimentos", () => {
    render(<CasalGmPage />);
    expect(screen.getByText("Maria e João")).toBeInTheDocument();
    expect(screen.getByText("Recife, PE")).toBeInTheDocument();
  });

  it("cada depoimento usa uma foto de casal diferente, sem repetição", () => {
    render(<CasalGmPage />);

    const expectedPhotos = [
      { name: "Maria e João", photo: "casal-1.jpg" },
      { name: "Ana e Pedro", photo: "casal-2.jpg" },
      { name: "Camila e Rafael", photo: "casal-3.jpg" },
      { name: "Juliana e Marcos", photo: "casal-4.jpg" },
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
    const { container } = render(<CasalGmPage />);

    const polaroidImgs = container.querySelectorAll(".aspect-square.rounded-sm.overflow-hidden img");
    expect(polaroidImgs.length).toBe(3);

    const srcs = Array.from(polaroidImgs).map((img) => img.getAttribute("src"));
    expect(srcs[0]).toContain("%2Fimages%2Fcasal-2.jpg");
    expect(srcs[1]).toContain("%2Fimages%2Fcasal-3.jpg");
    expect(srcs[2]).toContain("%2Fimages%2Fcasal-5.jpg");

    expect(new Set(srcs).size).toBe(3);
  });

  it("usa fotos reais de casais (não placeholders do Unsplash)", () => {
    const { container } = render(<CasalGmPage />);

    const casalPhotos = screen.getAllByAltText(/casal atendido pela dra\. camilla/i);
    expect(casalPhotos.length).toBeGreaterThanOrEqual(8); // 3 polaroids + 5 grid + 4 depoimentos
    casalPhotos.forEach((img) => {
      expect(img.getAttribute("src")).toContain("%2Fimages%2Fcasal-");
    });

    expect(container.innerHTML).not.toContain("unsplash.com");
  });
});
