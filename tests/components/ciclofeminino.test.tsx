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
  it("renderiza o hero voltado a quem deseja engravidar, com nome do produto e preço", () => {
    render(<CicloFemininoPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /tentando engravidar, conhecer seus dias férteis/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/para mulheres que desejam engravidar/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Ciclo Feminino Descomplicado • R\$\s*39,90/).length).toBeGreaterThan(0);
  });

  it("não promete gravidez nem menciona as ofertas seguintes", () => {
    render(<CicloFemininoPage />);
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/garant\w* (a |sua )?gravidez|engravide em|cura/i);
    expect(text).not.toMatch(/ciclos desbloqueados|suplementação|R\$\s*67|R\$\s*47,90/i);
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

  it("mantém o mockup como pendência e mostra a entrega pela área de membros", () => {
    render(<CicloFemininoPage />);
    expect(document.querySelectorAll('[data-placeholder="media"]').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByText(/como vou receber o material/i).closest("button")!);
    expect(screen.getByText(/acesso ao conteúdo pela área de membros/i)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/\[CONFIRMAR|\[COPY/);
  });

  it("autoridade usa as credenciais confirmadas e não usa 'Dra.' no conteúdo da página", () => {
    render(<CicloFemininoPage />);
    expect(screen.getAllByText(/pós-graduada em Fertilidade/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/fertilidade do casal\.$/i)).toBeInTheDocument();
    const main = document.body.cloneNode(true) as HTMLElement;
    main.querySelector("footer")?.remove(); // rodapé é componente compartilhado
    expect(main.textContent).not.toMatch(/Dra\./);
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

  it("oferta-especial: copy pós-compra, 3 materiais, R$ 67 e sem mencionar a próxima oferta ou consulta", () => {
    render(<OfertaEspecialPage />);
    expect(screen.getByText(/seu primeiro passo está dado/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: /não começa e termina na ovulação/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/conexão íntima/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/fertilidade de dentro para fora/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/R\$\s*67,00/).length).toBeGreaterThan(0);
    expect(screen.getByText(/SIM, QUERO AMPLIAR MINHA PREPARAÇÃO/)).toBeInTheDocument();
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/suplementação|R\$\s*47,90|R\$\s*147|consulta/i);
    expect(text).not.toMatch(/Dra\./);
    expect(document.querySelectorAll('[data-placeholder="media"]').length).toBe(3);
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

  it("suplementacao: recusa leva para /ciclofeminino/obrigada preservando token/UTMs", () => {
    window.history.replaceState({}, "", "/ciclofeminino/suplementacao?token=abc&utm_campaign=x");
    render(<SuplementacaoPage />);
    expect(screen.getByRole("link", { name: /não, obrigada/i })).toHaveAttribute(
      "href",
      `${cicloFemininoFunnel.routes.thankYou}?token=abc&utm_campaign=x`
    );
    expect(screen.getAllByText(/R\$\s*47,90/).length).toBeGreaterThan(0);
    expect(screen.getByText(/SIM, QUERO ENTENDER MELHOR A SUPLEMENTAÇÃO/)).toBeInTheDocument();
  });

  it("suplementacao: copy neutra à decisão anterior, só os nutrientes do material, sem promessas nem consulta", () => {
    render(<SuplementacaoPage />);
    expect(screen.getByText(/um último passo antes de continuar/i)).toBeInTheDocument();
    for (const n of ["Metilfolato", "Vitamina B12", "Vitamina D3", "Mio-inositol", "CoQ10", "Vitamina E"]) {
      expect(screen.getByText(n)).toBeInTheDocument();
    }
    expect(screen.getByText(/avaliação individual ajuda a entender/i)).toBeInTheDocument();
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/ciclos desbloqueados|R\$\s*67|R\$\s*147|consulta|Dra\./i);
    expect(text).not.toMatch(/garant\w* (a |sua )?gravidez|cura|aumenta(rá)? (a |sua )?fertilidade/i);
    expect(document.querySelectorAll('[data-placeholder="media"]').length).toBe(1);
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
