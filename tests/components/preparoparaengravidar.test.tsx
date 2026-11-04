import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import PreparoParaEngravidarPage, { metadata } from "@/app/preparoparaengravidar/page";
import { preparoParaEngravidarContent } from "@/app/preparoparaengravidar/content";
import { cicloFemininoContent } from "@/app/ciclofeminino/content";
import {
  PRICE_IS_PROVISIONAL,
  PURCHASE_TERMS,
  preparoParaEngravidarFunnel,
  preparoParaEngravidarMaterials,
  preparoParaEngravidarProduct,
  preparoParaEngravidarTestimonials,
} from "@/config/funnels/preparo-para-engravidar";
import { cicloFemininoProducts, formatPrice } from "@/config/funnels/ciclo-feminino";
import { EntryCheckoutCta } from "@/components/funnel/entry-checkout-cta";
import { __resetFunnelTrackingForTests, trackFunnelCheckoutClick } from "@/lib/funnel-tracking";
import { validateCapiPayload } from "@/lib/meta-capi-validation";
import { buildPurchaseEvent, findFunnelProductByOfferCode } from "@/lib/kiwify-purchase";

const c = preparoParaEngravidarContent;
const OTHER_CHECKOUTS = ["aktchfx", "AQyRq5m", "Ttiul2X", "uOSEIEm", "5IIyMsr", "OCUj5sd"];
/** Hero, oferta, CTA final e barra fixa do celular. */
const CTA_POSITIONS = 4;
let fbqMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  __resetFunnelTrackingForTests();
  vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(new Response("{}"))));
  fbqMock = vi.fn();
  window.fbq = fbqMock as unknown as Window["fbq"];
  window.history.replaceState({}, "", "/");
  window.localStorage.clear();
  window.sessionStorage.clear();
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

  it("seis materiais planejados, nenhum pronto; garantia, entrega e depoimentos ainda não confirmados", () => {
    expect(preparoParaEngravidarMaterials.map((m) => m.name)).toEqual([
      "Guia Preparo para Engravidar",
      "Checklist Antes do Positivo",
      "Diário do Ciclo",
      "Mapa de Hábitos",
      "Roteiro para Consulta",
      "Plano Final de Preparação",
    ]);
    expect(preparoParaEngravidarMaterials.every((m) => !m.ready && m.preview === null)).toBe(true);
    for (const m of preparoParaEngravidarMaterials) expect(c.materials.descriptions[m.id]).toBeTruthy();
    expect(PURCHASE_TERMS).toEqual({ guarantee: null, delivery: null });
    expect(preparoParaEngravidarTestimonials).toEqual([]);
  });
});

describe("Página /preparoparaengravidar", () => {
  it("estrutura semântica: um h1 e uma seção rotulada para cada bloco", () => {
    render(<PreparoParaEngravidarPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(c.hero.headline);
    for (const id of ["quiz-start-title", "identification-title", "perspective-title", "steps-title", "how-title", "materials-title", "quiz-moment-title", "specialist-title", "trust-title", "offer-title", "faq-title", "final-title"]) {
      expect(document.getElementById(id)!.tagName).toBe("H2");
      expect(document.querySelector(`section[aria-labelledby="${id}"]`)).not.toBeNull();
    }
  });

  it("sem checkout real: nenhum link de compra; CTAs desativados em todas as posições, inclusive na barra do celular", () => {
    render(<PreparoParaEngravidarPage />);
    expect(document.querySelectorAll("[data-funnel-checkout]")).toHaveLength(0);
    expect(document.querySelectorAll('a[href*="kiwify"], a[href*="pay."]')).toHaveLength(0);
    const pending = document.querySelectorAll<HTMLButtonElement>("button[data-checkout-pending]");
    expect(pending).toHaveLength(CTA_POSITIONS);
    pending.forEach((button) => expect(button.disabled).toBe(true));
    expect(document.querySelector("[data-mobile-buy-bar] button[data-checkout-pending]")).not.toBeNull();
  });

  it("todo preço exibido vem da configuração e é identificado como provisório", () => {
    render(<PreparoParaEngravidarPage />);
    const prices = document.querySelectorAll("[data-price]");
    expect(prices).toHaveLength(CTA_POSITIONS);
    prices.forEach((p) => expect(p.textContent).toBe(formatPrice(preparoParaEngravidarProduct.price)));
    expect(document.querySelectorAll("[data-price-provisional]")).toHaveLength(prices.length);
  });

  it("materiais aparecem como em produção, com espaço de capa e nunca como entregues", () => {
    render(<PreparoParaEngravidarPage />);
    const statuses = document.querySelectorAll("[data-material-status]");
    expect(statuses).toHaveLength(6);
    statuses.forEach((s) => expect(s.getAttribute("data-material-status")).toBe("pending"));
    expect(screen.getAllByText(c.materials.coverPending)).toHaveLength(6);
    expect(screen.queryByText(c.materials.readyLabel)).toBeNull();
    expect(document.querySelector("[data-materials-pending]")).not.toBeNull();
  });

  it("sem mockup nem depoimento: só a foto da especialista e a capa tipográfica", () => {
    render(<PreparoParaEngravidarPage />);
    const srcs = Array.from(document.querySelectorAll("img")).map((img) => img.getAttribute("src") ?? "");
    expect(srcs.every((src) => src.includes("camilla-zap2.jpg"))).toBe(true);
    expect(document.querySelectorAll('[data-product-cover="typographic"]')).toHaveLength(1);
    expect(document.querySelector("[data-testimonials]")).toBeNull();
  });

  it("FAQ completo; entrega e garantia informadas como ainda não confirmadas", () => {
    render(<PreparoParaEngravidarPage />);
    expect(c.faq.items).toHaveLength(7);
    const garantia = c.faq.items.find((i) => "id" in i && i.id === "guarantee")!;
    fireEvent.click(screen.getByText(garantia.question));
    expect(screen.getByText(garantia.answer)).toBeTruthy();
    expect(garantia.answer).toMatch(/serão informadas .* antes da abertura das vendas/);
  });

  it("SEO: título e descrição próprios, Open Graph sem imagem e noindex", () => {
    expect(metadata.title).toBe(c.meta.title);
    expect(String(metadata.description).length).toBeLessThanOrEqual(170);
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates?.canonical).toBe("https://gerandomilagres.com.br/preparoparaengravidar");
    expect(metadata.openGraph).toMatchObject({ url: "https://gerandomilagres.com.br/preparoparaengravidar", locale: "pt_BR" });
    expect(metadata.openGraph).not.toHaveProperty("images");
  });
});

describe("Quizzes interativos", () => {
  it("cada pergunta mostra a resposta acolhedora da opção escolhida e o link para continuar", () => {
    render(<PreparoParaEngravidarPage />);
    const [first, second] = screen.getAllByRole("group");
    expect(within(first).getAllByRole("radio")).toHaveLength(4);
    expect(within(second).getAllByRole("radio")).toHaveLength(4);

    fireEvent.click(within(first).getByLabelText(c.quizStart.options[1].label));
    expect(screen.getByText(c.quizStart.options[1].response)).toBeTruthy();
    expect(screen.getByRole("link", { name: c.quizStart.continueLabel }).getAttribute("href")).toBe("#identificacao");
    expect(document.getElementById("identificacao")).not.toBeNull();

    fireEvent.click(within(second).getByLabelText(c.quizMoment.options[2].label));
    expect(screen.getByText(c.quizMoment.options[2].response)).toBeTruthy();
    expect(screen.getByRole("link", { name: c.quizMoment.continueLabel }).getAttribute("href")).toBe("#especialista");
  });

  it("respostas não são salvas nem enviadas a Pixel, CAPI ou serviços externos", async () => {
    render(<PreparoParaEngravidarPage />);
    await waitFor(() => expect(capiBodies().filter((b) => b.eventName === "ViewContent")).toHaveLength(1));
    const fetchCalls = vi.mocked(fetch).mock.calls.length;
    const pixelCalls = fbqMock.mock.calls.length;
    const urlBefore = window.location.href;
    for (const option of [...c.quizStart.options, ...c.quizMoment.options]) {
      fireEvent.click(screen.getByLabelText(option.label));
    }
    expect(vi.mocked(fetch).mock.calls.length).toBe(fetchCalls);
    expect(fbqMock.mock.calls.length).toBe(pixelCalls);
    expect(window.localStorage.length).toBe(0);
    expect(window.sessionStorage.length).toBe(0);
    expect(window.location.href).toBe(urlBefore);
  });

  it("respostas sem porcentagens, diagnóstico ou recomendação clínica", () => {
    const responses = [...c.quizStart.options, ...c.quizMoment.options].map((o) => o.response).join("\n");
    expect(responses).not.toMatch(/\d+\s?%|diagnóstic|você tem |tome |use [a-z]+ mg|dose/i);
  });
});

describe("Demonstração das seis etapas", () => {
  it("abas acessíveis por teclado (setas, Home e End)", () => {
    render(<PreparoParaEngravidarPage />);
    const tablist = screen.getByRole("tablist", { name: "Etapas do guia" });
    const tabs = within(tablist).getAllByRole("tab");
    expect(tabs.map((t) => t.textContent?.replace(/^\d+/, ""))).toEqual(c.steps.items.map((s) => s.title));
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    const panel = screen.getByRole("tabpanel");
    expect(within(panel).getByRole("heading", { level: 3 }).textContent).toBe(c.steps.items[0].title);

    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(tabs[1]);
    expect(within(screen.getByRole("tabpanel")).getByRole("heading", { level: 3 }).textContent).toBe(c.steps.items[1].title);

    fireEvent.keyDown(tabs[1], { key: "End" });
    expect(tabs[5].getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(tabs[5], { key: "ArrowRight" });
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(tabs[0], { key: "ArrowLeft" });
    expect(tabs[5].getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(tabs[5], { key: "Home" });
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    tabs.forEach((t, i) => expect(t.tabIndex).toBe(i === 0 ? 0 : -1));
  });

  it("cada etapa mostra seu material de apoio, sempre identificado como em produção", () => {
    render(<PreparoParaEngravidarPage />);
    const tabs = screen.getAllByRole("tab");
    tabs.forEach((tab, i) => {
      fireEvent.click(tab);
      const panel = screen.getByRole("tabpanel");
      const material = preparoParaEngravidarMaterials.find((m) => m.id === c.steps.items[i].material)!;
      expect(within(panel).getByText(material.name)).toBeTruthy();
      expect(within(panel).getByText(c.materials.pendingLabel)).toBeTruthy();
    });
  });
});

describe("Barra fixa do celular", () => {
  it("começa oculta e fora do foco/leitura; só celular; respeita a área segura", () => {
    render(<PreparoParaEngravidarPage />);
    const bar = document.querySelector<HTMLElement>("[data-mobile-buy-bar]")!;
    expect(bar.getAttribute("data-visible")).toBe("false");
    expect(bar.hasAttribute("inert")).toBe(true);
    expect(bar.getAttribute("aria-hidden")).toBe("true");
    expect(bar.className).toContain("md:hidden");
    expect(bar.className).toContain("safe-area-inset-bottom");
  });
});

describe("Copy", () => {
  const all = strings(c).join("\n");

  it("sem promessas clínicas, urgência, depoimentos, descontos ou credenciais não verificadas", () => {
    expect(all).not.toMatch(/\bDra\.?\s/);
    expect(all).not.toMatch(/\d+\s?%|garantid|garantia de|últimas vagas|só hoje|por tempo limitado|pós-gradu|desconto|parcel|\d+x de|de R\$/i);
    expect(all).not.toMatch(/você vai engravidar|engravide em|aumente (suas|as) chances|milhares de|mulheres já/i);
    expect(c.specialist.credentials).toEqual(["Farmacêutica · CRF/PE 4563"]);
  });

  it("textos definidos pelo proprietário aplicados exatamente", () => {
    expect(c.hero.headline).toBe("Você decidiu engravidar. Mas ninguém te explicou por onde começar.");
    expect(c.perspective.heading).toBe("Você não precisa fazer tudo de uma vez. Precisa de um caminho.");
    expect(c.finalCta.heading).toBe("Seu próximo passo não precisa ser mais uma pesquisa sem direção.");
    expect(c.quizStart.question).toBe("O que mais te deixa insegura na preparação para engravidar?");
    expect(c.quizMoment.question).toBe("Em qual momento você está?");
    expect(c.steps.items.map((s) => s.title)).toEqual([
      "Por onde começar",
      "Entenda seu ciclo",
      "Alimentação e hábitos",
      "Suplementação sem achismo",
      "E ele?",
      "Seu plano antes do positivo",
    ]);
  });

  it("não reaproveita textos comerciais do Ciclo Feminino", () => {
    const own = new Set(strings(c));
    // Exceção: o registro profissional é dado oficial e deve ser idêntico em todas as páginas.
    const credential = "Farmacêutica · CRF/PE 4563";
    const shared = strings(cicloFemininoContent).filter((text) => text.length > 20 && text !== credential && own.has(text));
    expect(shared).toEqual([]);
  });
});

describe("Ativação pelo link oficial (simulada)", () => {
  it("com checkout configurado, todos os CTAs levam só a esse link e registram o funil correto", async () => {
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
    expect(ctas).toHaveLength(CTA_POSITIONS);
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
    fireEvent.click(ctas[ctas.length - 1]); // barra do celular no mesmo instante
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
    const names = [...fbqMock.mock.calls.map((call) => call[1]), ...capiBodies().map((b) => b.eventName)];
    expect(names).not.toContain("InitiateCheckout");
    expect(names).not.toContain("Purchase");
  });
});

describe("Materiais, capa, condições e depoimentos oficiais (simulados)", () => {
  it("tudo entra só pela configuração, sem mexer nos componentes", async () => {
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
        PURCHASE_TERMS: { guarantee: "Garantia confirmada pelo proprietário (teste).", delivery: "Entrega confirmada (teste)." },
        preparoParaEngravidarTestimonials: [{ name: "Cliente Teste", text: "Depoimento autorizado (teste).", authorizedOn: "2026-11-04" }],
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
    expect(document.querySelector('[data-material-status="ready"]')?.textContent).toBe(c.materials.readyLabel);
    expect(document.querySelectorAll('[data-material-status="pending"]')).toHaveLength(5);
    expect(document.querySelectorAll("[data-price-provisional]")).toHaveLength(0);
    expect(document.querySelector("[data-testimonials]")?.textContent).toContain("Cliente Teste");
    fireEvent.click(screen.getByText("Tem garantia?"));
    expect(screen.getByText("Garantia confirmada pelo proprietário (teste).")).toBeTruthy();
    expect(screen.getByText(c.hero.accessConfirmed)).toBeTruthy();
    expect(readyMetadata.openGraph).toMatchObject({
      images: [{ url: "https://gerandomilagres.com.br/images/teste-capa.webp", width: 1200, height: 1500 }],
    });
    // Disponibilidade continua dependendo só do checkout: sem link, botões seguem desativados.
    expect(document.querySelectorAll("button[data-checkout-pending]")).toHaveLength(CTA_POSITIONS);
  });
});

describe("Rastreamento da visualização (Pixel + CAPI)", () => {
  it("um único ViewContent do funil 02, com o mesmo eventID no Pixel e na CAPI e aceito pelo servidor", async () => {
    window.history.replaceState({}, "", "/preparoparaengravidar");
    render(<PreparoParaEngravidarPage />);
    await waitFor(() => expect(capiBodies().filter((b) => b.eventName === "ViewContent")).toHaveLength(1));
    const pixel = fbqMock.mock.calls.filter((call) => call[1] === "ViewContent");
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
    const names = [...fbqMock.mock.calls.map((call) => call[1]), ...capiBodies().map((b) => b.eventName)];
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
  it("não exibe o checkout global (a página usa a própria barra inferior)", async () => {
    vi.resetModules();
    vi.doMock("next/navigation", () => ({ usePathname: () => "/preparoparaengravidar" }));
    const { StickyHeader } = await import("@/components/ui/sticky-header");
    const { container } = render(<StickyHeader />);
    expect(container).toBeEmptyDOMElement();
  });
});
