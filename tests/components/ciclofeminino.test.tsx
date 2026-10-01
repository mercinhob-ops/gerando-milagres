import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CicloFemininoPage from "@/app/ciclofeminino/page";
import OfertaEspecialPage from "@/app/ciclofeminino/oferta-especial/page";
import SuplementacaoPage from "@/app/ciclofeminino/suplementacao/page";
import ObrigadaPage from "@/app/ciclofeminino/obrigada/page";
import { UpsellActions } from "@/components/funnel/upsell-actions";
import {
  cicloFemininoFunnel,
  cicloFemininoProducts,
  formatPrice,
  type FunnelProduct,
} from "@/config/funnels/ciclo-feminino";

const GLOBAL_CHECKOUT = "https://pay.kiwify.com.br/uOSEIEm"; // vitest.config env

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(new Response("{}"))));
  window.fbq = vi.fn();
  window.history.replaceState({}, "", "/");
});

function allHrefs() {
  return Array.from(document.querySelectorAll("a")).map((a) => a.getAttribute("href") ?? "");
}

describe("Config Funil 01 — Ciclo Feminino", () => {
  it("tem os 3 produtos com os preços definidos", () => {
    expect(cicloFemininoProducts.cicloFeminino.price).toBe(39.9);
    expect(cicloFemininoProducts.ciclosDesbloqueados.price).toBe(67);
    expect(cicloFemininoProducts.suplementacao.price).toBe(47.9);
  });

  it("formata preço em BRL", () => {
    expect(formatPrice(39.9)).toBe("R$ 39,90");
    expect(formatPrice(67)).toBe("R$ 67,00");
  });

  it("nenhum checkout não confirmado tem URL preenchida", () => {
    for (const p of Object.values(cicloFemininoProducts) as FunnelProduct[]) {
      if (p.checkoutStatus === "pending") expect(p.checkoutUrl).toBeNull();
    }
  });
});

describe("/ciclofeminino", () => {
  it("renderiza o hero com o nome do produto e o preço", () => {
    render(<CicloFemininoPage />);
    expect(screen.getByRole("heading", { level: 1, name: /ciclo feminino\s*descomplicado/i })).toBeInTheDocument();
    expect(screen.getAllByText(/R\$\s*39,90/).length).toBeGreaterThan(0);
  });

  it("dispara ViewContent ao montar", () => {
    render(<CicloFemininoPage />);
    expect(window.fbq).toHaveBeenCalledWith(
      "track",
      "ViewContent",
      expect.objectContaining({ value: 39.9, currency: "BRL", funnel_step: "entry" }),
      expect.objectContaining({ eventID: expect.any(String) })
    );
  });

  it("nunca usa o checkout global e marca checkout pendente", () => {
    render(<CicloFemininoPage />);
    expect(allHrefs()).not.toContain(GLOBAL_CHECKOUT);
    expect(document.querySelectorAll("[data-checkout-pending]").length).toBeGreaterThanOrEqual(3);
  });

  it("marca a copy provisória de forma identificável", () => {
    render(<CicloFemininoPage />);
    expect(document.querySelectorAll('[data-placeholder="copy"]').length).toBeGreaterThan(5);
  });
});

describe("Ofertas pós-compra", () => {
  it("oferta-especial: recusa leva para /ciclofeminino/suplementacao preservando token", () => {
    window.history.replaceState({}, "", "/ciclofeminino/oferta-especial?token=abc&utm_source=meta&x=1");
    render(<OfertaEspecialPage />);
    const decline = screen.getByRole("link", { name: /não, obrigada/i });
    expect(decline).toHaveAttribute("href", "/ciclofeminino/suplementacao?token=abc&utm_source=meta");
    expect(allHrefs()).not.toContain(GLOBAL_CHECKOUT);
  });

  it("oferta-especial: dispara UpsellView (custom) e UpsellDecline ao recusar", () => {
    render(<OfertaEspecialPage />);
    expect(window.fbq).toHaveBeenCalledWith(
      "trackCustom",
      "UpsellView",
      expect.objectContaining({ value: 67, funnel_step: "upsell-1" }),
      expect.any(Object)
    );
    fireEvent.click(screen.getByRole("link", { name: /não, obrigada/i }));
    expect(window.fbq).toHaveBeenCalledWith(
      "trackCustom",
      "UpsellDecline",
      expect.objectContaining({ value: 67 }),
      expect.any(Object)
    );
  });

  it("suplementacao: recusa leva para /ciclofeminino/obrigada e exibe aviso educacional", () => {
    render(<SuplementacaoPage />);
    expect(screen.getByRole("link", { name: /não, obrigada/i })).toHaveAttribute(
      "href",
      cicloFemininoFunnel.routes.thankYou
    );
    expect(screen.getByText(/não substitui consulta/i)).toBeInTheDocument();
    expect(screen.getAllByText(/R\$\s*47,90/).length).toBeGreaterThan(0);
  });

  const readyProduct: FunnelProduct = {
    id: "teste",
    name: "Produto Teste",
    price: 67,
    checkoutUrl: "https://pay.kiwify.com.br/TESTE",
    checkoutStatus: "confirmed",
    oneClickTriggerId: null,
  };

  it("sem token: aceitar abre o checkout próprio do produto e dispara UpsellAccept + InitiateCheckout", () => {
    window.history.replaceState({}, "", "/x?utm_source=meta");
    render(
      <UpsellActions
        product={readyProduct}
        funnelId="f"
        step="upsell-1"
        acceptLabel="Aceitar"
        declineLabel="Recusar"
        declineHref="/proxima"
      />
    );
    const accept = screen.getByRole("link", { name: "Aceitar" });
    expect(accept).toHaveAttribute("href", "https://pay.kiwify.com.br/TESTE?utm_source=meta");
    fireEvent.click(accept);
    expect(window.fbq).toHaveBeenCalledWith("trackCustom", "UpsellAccept", expect.any(Object), expect.any(Object));
    expect(window.fbq).toHaveBeenCalledWith("track", "InitiateCheckout", expect.any(Object), expect.any(Object));
  });

  it("com token e trigger configurado: usa os ids do upsell de 1 clique da Kiwify", () => {
    window.history.replaceState({}, "", "/x?token=tok");
    render(
      <UpsellActions
        product={{ ...readyProduct, oneClickTriggerId: "kiwify-upsell-trigger-ABC123" }}
        funnelId="f"
        step="upsell-1"
        acceptLabel="Aceitar"
        declineLabel="Recusar"
        declineHref="/proxima"
      />
    );
    expect(screen.getByRole("link", { name: "Aceitar" })).toHaveAttribute("id", "kiwify-upsell-trigger-ABC123");
    expect(screen.getByRole("link", { name: "Recusar" })).toHaveAttribute("id", "kiwify-upsell-cancel-trigger");
  });
});

describe("/ciclofeminino/obrigada", () => {
  it("não dispara Purchase nem tem link de checkout", () => {
    render(<ObrigadaPage />);
    const calls = (window.fbq as ReturnType<typeof vi.fn>).mock.calls;
    expect(calls.some((c) => c[1] === "Purchase")).toBe(false);
    expect(allHrefs().some((h) => h.includes("pay.kiwify") || h.includes("hotmart"))).toBe(false);
    expect(screen.getByRole("heading", { level: 1, name: /obrigada/i })).toBeInTheDocument();
  });
});
