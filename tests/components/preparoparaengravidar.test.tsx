import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PreparoParaEngravidarPage, { metadata } from "@/app/preparoparaengravidar/page";
import { preparoParaEngravidarContent } from "@/app/preparoparaengravidar/content";
import { cicloFemininoContent } from "@/app/ciclofeminino/content";
import {
  PRICE_IS_PROVISIONAL,
  preparoParaEngravidarFunnel,
  preparoParaEngravidarMaterials,
  preparoParaEngravidarProduct,
} from "@/config/funnels/preparo-para-engravidar";
import { cicloFemininoProducts, formatPrice } from "@/config/funnels/ciclo-feminino";
import { EntryCheckoutCta } from "@/components/funnel/entry-checkout-cta";
import { __resetFunnelTrackingForTests, trackFunnelCheckoutClick } from "@/lib/funnel-tracking";
import { validateCapiPayload } from "@/lib/meta-capi-validation";
import { buildPurchaseEvent, findFunnelProductByOfferCode } from "@/lib/kiwify-purchase";

const OTHER_CHECKOUTS = ["aktchfx", "AQyRq5m", "Ttiul2X", "uOSEIEm", "5IIyMsr", "OCUj5sd"];
let fbqMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  __resetFunnelTrackingForTests();
  vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(new Response("{}"))));
  fbqMock = vi.fn();
  window.fbq = fbqMock as unknown as Window["fbq"];
  window.history.replaceState({}, "", "/");
});

afterEach(() => {
  vi.doUnmock("@/config/funnels/preparo-para-engravidar");
  vi.doUnmock("next/navigation");
});

const checkoutClicks = () => fbqMock.mock.calls.filter((call) => call[1] === "CheckoutClick");
/** Corpos enviados à CAPI (/api/meta-conversions) pelo navegador. */
const capiBodies = () =>
  vi.mocked(fetch).mock.calls
    .filter(([url]) => url === "/api/meta-conversions")
    .map(([, init]) => JSON.parse(String((init as RequestInit).body)));

/** Todas as strings de um objeto de conteúdo (recursivo). */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

describe("Preparo para Engravidar — configuração central", () => {
  it("produto com preço provisório, checkout desativado e sem arte", () => {
    expect(preparoParaEngravidarProduct).toMatchObject({
      id: "preparo-para-engravidar",
      name: "Preparo para Engravidar",
      price: 77,
      checkoutUrl: null,
      checkoutReady: false,
      coverImage: null,
    });
    expect(PRICE_IS_PROVISIONAL).toBe(true);
    expect(preparoParaEngravidarFunnel.slug).toBe("preparo-para-engravidar");
    expect(preparoParaEngravidarFunnel.routes.entry).toBe("/preparoparaengravidar");
  });

  it("seis materiais planejados, nenhum marcado como pronto", () => {
    expect(preparoParaEngravidarMaterials.map((m) => m.name)).toEqual([
      "Guia Preparo para Engravidar",
      "Checklist Antes do Positivo",
      "Diário do Ciclo",
      "Mapa de Hábitos",
      "Roteiro para Consulta",
      "Plano Final de Preparação",
    ]);
    expect(preparoParaEngravidarMaterials.every((m) => !m.ready && m.preview === null)).toBe(true);
    for (const m of preparoParaEngravidarMaterials) {
      expect(preparoParaEngravidarContent.materials.descriptions[m.id]).toBeTruthy();
    }
  });
});

describe("Página /preparoparaengravidar", () => {
  it("estrutura semântica: um h1 e uma seção rotulada para cada bloco", () => {
    render(<PreparoParaEngravidarPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Você decidiu que quer engravidar. Mas por onde começar?"
    );
    for (const id of ["identification-title", "perspective-title", "guide-title", "materials-title", "audience-title", "specialist-title", "offer-title", "faq-title", "final-title"]) {
      expect(document.getElementById(id)!.tagName).toBe("H2");
      expect(document.querySelector(`section[aria-labelledby="${id}"]`)).not.toBeNull();
    }
    expect(screen.getByRole("list", { name: "Etapas do guia" }).querySelectorAll("li")).toHaveLength(6);
  });

  it("sem checkout real: nenhum link de compra; CTAs desativados em todas as posições", () => {
    render(<PreparoParaEngravidarPage />);
    expect(document.querySelectorAll("[data-funnel-checkout]")).toHaveLength(0);
    expect(document.querySelectorAll('a[href*="kiwify"], a[href*="pay."]')).toHaveLength(0);
    const pending = document.querySelectorAll<HTMLButtonElement>("button[data-checkout-pending]");
    expect(pending).toHaveLength(3);
    pending.forEach((button) => expect(button.disabled).toBe(true));
  });

  it("todo preço exibido vem da configuração e é identificado como provisório", () => {
    render(<PreparoParaEngravidarPage />);
    const prices = document.querySelectorAll("[data-price]");
    expect(prices).toHaveLength(3);
    prices.forEach((p) => expect(p.textContent).toBe(formatPrice(preparoParaEngravidarProduct.price)));
    expect(document.querySelectorAll("[data-price-provisional]")).toHaveLength(prices.length);
  });

  it("materiais aparecem como em produção, nunca como entregues", () => {
    render(<PreparoParaEngravidarPage />);
    const statuses = document.querySelectorAll("[data-material-status]");
    expect(statuses).toHaveLength(6);
    statuses.forEach((s) => expect(s.getAttribute("data-material-status")).toBe("pending"));
    expect(screen.queryByText(preparoParaEngravidarContent.materials.readyLabel)).toBeNull();
    expect(document.querySelector("[data-materials-pending]")).not.toBeNull();
  });

  it("sem mockup: só a foto da especialista e a capa tipográfica", () => {
    render(<PreparoParaEngravidarPage />);
    const srcs = Array.from(document.querySelectorAll("img")).map((img) => img.getAttribute("src") ?? "");
    expect(srcs.every((src) => src.includes("camilla-zap2.jpg"))).toBe(true);
    expect(document.querySelectorAll('[data-product-cover="typographic"]')).toHaveLength(1);
  });

  it("SEO: título e descrição próprios, Open Graph sem imagem e noindex", () => {
    expect(metadata.title).toBe(preparoParaEngravidarContent.meta.title);
    expect(String(metadata.description).length).toBeLessThanOrEqual(170);
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates?.canonical).toBe("https://gerandomilagres.com.br/preparoparaengravidar");
    expect(metadata.openGraph).toMatchObject({ url: "https://gerandomilagres.com.br/preparoparaengravidar", locale: "pt_BR" });
    expect(metadata.openGraph).not.toHaveProperty("images");
  });
});

describe("Copy", () => {
  const all = strings(preparoParaEngravidarContent).join("\n");

  it("sem promessas clínicas, urgência, depoimentos ou credenciais não verificadas", () => {
    expect(all).not.toMatch(/\bDra\.?\s/);
    expect(all).not.toMatch(/\d+\s?%|garantid|garantia de|últimas vagas|só hoje|por tempo limitado|pós-gradu|depoimento/i);
    expect(all).not.toMatch(/você vai engravidar|engravide em|aumente (suas|as) chances/i);
    expect(preparoParaEngravidarContent.specialist.credentials).toEqual(["Farmacêutica · CRF/PE 4563"]);
  });

  it("“por onde começar” só no título principal e no nome da etapa 1", () => {
    expect(all.match(/por onde começar/gi)).toHaveLength(2);
  });

  it("não reaproveita textos comerciais do Ciclo Feminino", () => {
    const own = new Set(strings(preparoParaEngravidarContent));
    // Exceção: o registro profissional é dado oficial e deve ser idêntico em todas as páginas.
    const credential = "Farmacêutica · CRF/PE 4563";
    const shared = strings(cicloFemininoContent).filter((text) => text.length > 20 && text !== credential && own.has(text));
    expect(shared).toEqual([]);
  });
});

describe("Ativação pelo link oficial (simulada)", () => {
  it("com checkout configurado, os 3 CTAs levam só a esse link e registram o funil correto", async () => {
    vi.resetModules();
    vi.doMock("@/config/funnels/preparo-para-engravidar", async (importOriginal) => {
      const original = await importOriginal<typeof import("@/config/funnels/preparo-para-engravidar")>();
      const product = { ...original.preparoParaEngravidarProduct, checkoutUrl: "https://pay.kiwify.com.br/TESTE", checkoutReady: true };
      return { ...original, preparoParaEngravidarProduct: product, preparoParaEngravidarFunnel: { ...original.preparoParaEngravidarFunnel, product } };
    });
    const { default: Page } = await import("@/app/preparoparaengravidar/page");
    window.history.replaceState({}, "", "/preparoparaengravidar?utm_source=meta&fbclid=FB1");
    render(<Page />);

    const ctas = document.querySelectorAll<HTMLAnchorElement>("[data-funnel-checkout]");
    expect(ctas).toHaveLength(3);
    expect(document.querySelectorAll("[data-checkout-pending]")).toHaveLength(0);
    ctas.forEach((a) => {
      const href = a.getAttribute("href")!;
      expect(href).toMatch(/^https:\/\/pay\.kiwify\.com\.br\/TESTE/);
      expect(href).toContain("utm_source=meta");
      for (const other of OTHER_CHECKOUTS) expect(href).not.toContain(other);
    });
    ctas.forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));
    fireEvent.click(ctas[0]);
    fireEvent.click(ctas[0]); // clique duplo
    fireEvent.click(ctas[2]); // outro CTA no mesmo instante
    expect(checkoutClicks()).toHaveLength(1);
    expect(checkoutClicks()[0][0]).toBe("trackCustom");
    expect(checkoutClicks()[0][2]).toEqual({
      content_name: "Preparo para Engravidar",
      content_type: "product",
      value: 77,
      currency: "BRL",
      funnel: "preparo-para-engravidar",
      step: "entry",
    });
    // CAPI: um único CheckoutClick, mesmo eventID do Pixel (deduplicação) e aceito pela validação do servidor.
    const capi = capiBodies().filter((b) => b.eventName === "CheckoutClick");
    expect(capi).toHaveLength(1);
    expect(capi[0].eventId).toBe(checkoutClicks()[0][3].eventID);
    // jsdom roda em localhost; a validação de produção só aceita o domínio oficial.
    const official = { ...capi[0], eventSourceUrl: "https://gerandomilagres.com.br/preparoparaengravidar?utm_source=meta" };
    expect(validateCapiPayload(official, "gerandomilagres.com.br", true).ok).toBe(true);
    // Nunca dispara InitiateCheckout (fica com o Pixel da Kiwify) nem Purchase no navegador.
    const names = [...fbqMock.mock.calls.map((c) => c[1]), ...capiBodies().map((b) => b.eventName)];
    expect(names).not.toContain("InitiateCheckout");
    expect(names).not.toContain("Purchase");
  });
});

describe("Materiais e capa oficiais (simulados)", () => {
  it("capa, imagens dos e-books e preço definitivo entram só pela configuração", async () => {
    vi.resetModules();
    vi.doMock("@/config/funnels/preparo-para-engravidar", async (importOriginal) => {
      const original = await importOriginal<typeof import("@/config/funnels/preparo-para-engravidar")>();
      const coverImage = { src: "/images/teste-capa.webp", width: 1200, height: 1500, alt: "Capa oficial" };
      const product = { ...original.preparoParaEngravidarProduct, coverImage };
      const materials = original.preparoParaEngravidarMaterials.map((m, i) =>
        i === 0 ? { ...m, ready: true, preview: { src: "/images/teste-guia.webp", width: 1200, height: 900, alt: "Página do guia" } } : m
      );
      return {
        ...original,
        PRICE_IS_PROVISIONAL: false,
        preparoParaEngravidarProduct: product,
        preparoParaEngravidarMaterials: materials,
        preparoParaEngravidarFunnel: { ...original.preparoParaEngravidarFunnel, product, materials },
      };
    });
    const { default: Page, metadata: readyMetadata } = await import("@/app/preparoparaengravidar/page");
    render(<Page />);

    const srcs = Array.from(document.querySelectorAll("img")).map((img) => decodeURIComponent(img.getAttribute("src") ?? ""));
    expect(srcs.some((src) => src.includes("/images/teste-capa.webp"))).toBe(true);
    expect(srcs.some((src) => src.includes("/images/teste-guia.webp"))).toBe(true);
    expect(document.querySelector('[data-product-cover="typographic"]')).toBeNull();
    expect(document.querySelector('[data-material-status="ready"]')?.textContent).toBe(preparoParaEngravidarContent.materials.readyLabel);
    expect(document.querySelectorAll('[data-material-status="pending"]')).toHaveLength(5);
    expect(document.querySelectorAll("[data-price-provisional]")).toHaveLength(0);
    expect(readyMetadata.openGraph).toMatchObject({
      images: [{ url: "https://gerandomilagres.com.br/images/teste-capa.webp", width: 1200, height: 1500 }],
    });
    // Disponibilidade continua dependendo só do checkout: sem link, botões seguem desativados.
    expect(document.querySelectorAll("button[data-checkout-pending]")).toHaveLength(3);
  });
});

describe("Rastreamento da visualização (Pixel + CAPI)", () => {
  it("um único ViewContent do funil 02, com o mesmo eventID no Pixel e na CAPI e aceito pelo servidor", async () => {
    window.history.replaceState({}, "", "/preparoparaengravidar");
    render(<PreparoParaEngravidarPage />);
    await waitFor(() => expect(capiBodies().filter((b) => b.eventName === "ViewContent")).toHaveLength(1));
    const pixel = fbqMock.mock.calls.filter((c) => c[1] === "ViewContent");
    expect(pixel).toHaveLength(1);
    expect(pixel[0][2]).toMatchObject({
      content_ids: ["preparo-para-engravidar"],
      funnel_id: "funil-02-preparo-para-engravidar",
      value: 77,
      step: "entry",
    });
    const capi = capiBodies().find((b) => b.eventName === "ViewContent")!;
    expect(capi.eventId).toBe(pixel[0][3].eventID);
    expect(validateCapiPayload({ ...capi, eventSourceUrl: "https://gerandomilagres.com.br/preparoparaengravidar" }, "gerandomilagres.com.br", true).ok).toBe(true);
    // Sem checkout: nenhum clique, início de checkout ou compra.
    const names = [...fbqMock.mock.calls.map((c) => c[1]), ...capiBodies().map((b) => b.eventName)];
    expect(names.filter((n) => ["CheckoutClick", "InitiateCheckout", "Purchase"].includes(n))).toEqual([]);
  });

  it("o site nunca gera Purchase para este produto (compra fica só com a Kiwify)", () => {
    expect(findFunnelProductByOfferCode("preparo-para-engravidar")).toBeNull();
    expect(findFunnelProductByOfferCode("TESTE")).toBeNull();
    expect(buildPurchaseEvent({ offerCode: "TESTE", orderId: "pedido-1", amount: 77 } as Parameters<typeof buildPurchaseEvent>[0])).toBeNull();
  });
});

describe("Rastreamento por funil", () => {
  it("CheckoutClick identifica o funil preparo-para-engravidar quando informado", () => {
    const ready = { ...preparoParaEngravidarProduct, checkoutUrl: "https://pay.kiwify.com.br/teste", checkoutReady: true };
    render(<EntryCheckoutCta product={ready} funnelSlug={preparoParaEngravidarFunnel.slug} label="Comprar" />);
    const cta = document.querySelector("[data-funnel-checkout]")!;
    cta.addEventListener("click", (e) => e.preventDefault());
    fireEvent.click(cta);
    expect(checkoutClicks()).toHaveLength(1);
    expect(checkoutClicks()[0][2]).toMatchObject({ funnel: "preparo-para-engravidar", value: 77 });
  });

  it("sem funnelSlug o comportamento do Funil 01 é preservado", () => {
    trackFunnelCheckoutClick(cicloFemininoProducts.cicloFeminino, "entry");
    expect(checkoutClicks()[0][2]).toMatchObject({ funnel: "ciclo-feminino" });
  });
});

describe("Header fixo em /preparoparaengravidar", () => {
  it("não exibe o checkout global enquanto a página não registrar o próprio", async () => {
    vi.resetModules();
    vi.doMock("next/navigation", () => ({ usePathname: () => "/preparoparaengravidar" }));
    const { StickyHeader } = await import("@/components/ui/sticky-header");
    const { container } = render(<StickyHeader />);
    expect(container).toBeEmptyDOMElement();
  });
});
