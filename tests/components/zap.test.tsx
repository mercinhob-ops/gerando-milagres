import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ZapPage from "@/app/zap/page";

describe("ZapPage", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renderiza a headline e os 4 bullets de benefício", () => {
    render(<ZapPage />);
    expect(screen.getByRole("heading", { name: /gerando milagres/i })).toBeInTheDocument();
    expect(screen.getAllByText(/mais de 500 mulheres/i).length).toBeGreaterThan(0);
  });

  it("mantém o botão desabilitado até nome e whatsapp válidos serem preenchidos", () => {
    render(<ZapPage />);
    const button = screen.getByRole("button", { name: /quero falar com a dra\. camilla/i });
    expect(button).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText(/como posso te chamar/i), {
      target: { value: "Ana" },
    });
    expect(button).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText(/99999-9999/i), {
      target: { value: "81999998888" },
    });
    expect(button).toBeEnabled();
  });

  it("mostra a tela de confirmação e abre o WhatsApp após enviar", () => {
    vi.useFakeTimers();
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    render(<ZapPage />);
    fireEvent.change(screen.getByPlaceholderText(/como posso te chamar/i), {
      target: { value: "Ana Souza" },
    });
    fireEvent.change(screen.getByPlaceholderText(/99999-9999/i), {
      target: { value: "81999998888" },
    });
    fireEvent.click(screen.getByRole("button", { name: /quero falar com a dra\. camilla/i }));

    expect(screen.getByText(/tudo certo, ana!/i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1300);
    });

    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining("wa.me/5581981396005"), "_blank");
    openSpy.mockRestore();
  });

  it("mostra o footer simples com CRF/PE 4563", () => {
    const { container } = render(<ZapPage />);
    const footer = container.querySelector("footer");
    expect(footer?.textContent).toMatch(/dra\. camilla freitas · crf\/pe 4563/i);
  });
});
