import React, { StrictMode } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import PrivacidadePage from "@/app/privacidade/page";
import { PremiumFooter } from "@/components/marketing/premium-footer";
import CicloFemininoPage from "@/app/ciclofeminino/page";
import OfertaEspecialPage from "@/app/ciclofeminino/oferta-especial/page";
import SuplementacaoPage from "@/app/ciclofeminino/suplementacao/page";
import ObrigadaPage from "@/app/ciclofeminino/obrigada/page";
import {
  cicloFemininoProducts,
  formatPrice,
  getOneClickConfig,
  KIWIFY_UPSELL_SCRIPT_SRC,
  type FunnelProduct,
} from "@/config/funnels/ciclo-feminino";
import { __resetFunnelTrackingForTests } from "@/lib/funnel-tracking";
import { appendParams, pickParams, ATTRIBUTION_PARAMS } from "@/lib/funnel-params";

const GLOBAL_CHECKOUT = "https://pay.kiwify.com.br/uOSEIEm"; // NEXT_PUBLIC_CHECKOUT_URL (vitest.config)
const ENTRY_CHECKOUT = "https://pay.kiwify.com.br/aktchfx";
const UPSELL1_CHECKOUT = "https://pay.kiwify.com.br/AQyRq5m";
const UPSELL2_CHECKOUT = "https://pay.kiwify.com.br/Ttiul2X";
const ALL_PARAMS =
  "token=TK1&utm_source=meta&utm_medium=cpc&utm_campaign=camp&utm_content=ad1&utm_term=termo&src=SRC&sck=SCK&fbclid=FB1&foo=bar";

let fetchMock: ReturnType<typeof vi.fn>;
let fbqMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  __resetFunnelTrackingForTests();
  fetchMock = vi.fn(() => Promise.resolve(new Response("{}")));
  vi.stubGlobal("fetch", fetchMock);
  fbqMock = vi.fn();
  window.fbq = fbqMock as unknown as Window["fbq"];
  window.history.replaceState({}, "", "/");
  // Scripts NÃO são removidos entre testes: next/script mantém cache por src,
  // e o teste L verifica que o script oficial nunca aparece mais de uma vez.
});

function go(path: string) {
  window.history.replaceState({}, "", path);
}

type AsyncPage = (props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => Promise<React.ReactElement>;

/** Renderiza uma página assíncrona (searchParams) com a query atual da URL. */
async function pageEl(Page: AsyncPage) {
  const params = Object.fromEntries(new URLSearchParams(window.location.search));
  return await Page({ searchParams: Promise.resolve(params) });
}

function allHrefs() {
  return Array.from(document.querySelectorAll("a")).map((a) => a.getAttribute("href") ?? "");
}

function capiEvents() {
  return fetchMock.mock.calls
    .filter(([url]) => String(url).includes("/api/meta-conversions"))
    .map(([, init]) => JSON.parse(String((init as RequestInit).body)));
}

function pixelCalls(eventName: string) {
  return fbqMock.mock.calls.filter((c) => c[1] === eventName);
}

function forbiddenPlaceholders() {
  const html = document.body.innerHTML;
  return [/CHECKOUT PENDENTE/i, /example\.com/i, /data-placeholder/i, /\[COPY/, /pendente/i].filter((re) =>
    re.test(html)
  );
}

// ─── Configuração ──────────────────────────────────────────────────────────

describe("Config Funil 01 — Ciclo Feminino", () => {
  it("produtos, preços e checkouts oficiais", () => {
    const { cicloFeminino, ciclosDesbloqueados, suplementacao } = cicloFemininoProducts;
    expect([cicloFeminino.name, cicloFeminino.price, cicloFeminino.checkoutUrl, cicloFeminino.checkoutReady]).toEqual([
      "Ciclo Feminino Descomplicado",
      39.9,
      ENTRY_CHECKOUT,
      true,
    ]);
    expect([ciclosDesbloqueados.name, ciclosDesbloqueados.price, ciclosDesbloqueados.checkoutUrl]).toEqual([
      "Ciclos Desbloqueados",
      67,
      UPSELL1_CHECKOUT,
    ]);
    expect([suplementacao.name, suplementacao.price, suplementacao.checkoutUrl]).toEqual([
      "Suplementação para a Fertilidade da Mulher",
      47.9,
      UPSELL2_CHECKOUT,
    ]);
  });

  it("IDs oficiais do 1 clique e próxima etapa", () => {
    expect(getOneClickConfig(cicloFemininoProducts.ciclosDesbloqueados)).toEqual({
      containerId: "kiwify-upsell-AQyRq5m",
      triggerId: "kiwify-upsell-trigger-AQyRq5m",
      cancelTriggerId: "kiwify-upsell-cancel-trigger-AQyRq5m",
    });
    expect(getOneClickConfig(cicloFemininoProducts.suplementacao)).toEqual({
      containerId: "kiwify-upsell-Ttiul2X",
      triggerId: "kiwify-upsell-trigger-Ttiul2X",
      cancelTriggerId: "kiwify-upsell-cancel-trigger-Ttiul2X",
    });
    expect(cicloFemininoProducts.ciclosDesbloqueados.nextPath).toBe("/ciclofeminino/suplementacao");
    expect(cicloFemininoProducts.suplementacao.nextPath).toBe("/ciclofeminino/obrigada");
    expect(KIWIFY_UPSELL_SCRIPT_SRC).toBe("https://snippets.kiwify.com/upsell-v2/upsell.min.js");
  });

  it("nenhum produto do funil usa checkout de outro produto, checkout global ou placeholder", () => {
    const urls = (Object.values(cicloFemininoProducts) as FunnelProduct[]).map((p) => p.checkoutUrl);
    expect(new Set(urls).size).toBe(3);
    for (const url of urls) {
      expect(url).not.toBe(GLOBAL_CHECKOUT);
      expect(url).not.toMatch(/example\.com|placeholder|SEU_PRODUTO/i);
      expect(url).toMatch(/^https:\/\/pay\.kiwify\.com\.br\/[A-Za-z0-9]+$/);
    }
  });

  it("formata preço em BRL", () => {
    expect(formatPrice(39.9)).toBe("R$ 39,90");
    expect(formatPrice(47.9)).toBe("R$ 47,90");
  });
});

describe("Parâmetros (funnel-params)", () => {
  it("preserva atribuição sem duplicar chaves já existentes no destino", () => {
    const params = pickParams("?utm_source=meta&utm_campaign=x&foo=bar&token=T", ATTRIBUTION_PARAMS);
    expect(params.has("token")).toBe(false);
    expect(params.has("foo")).toBe(false);
    const url = appendParams("https://pay.kiwify.com.br/aktchfx?utm_source=kiwify", params);
    const parsed = new URL(url);
    expect(parsed.searchParams.getAll("utm_source")).toEqual(["kiwify"]);
    expect(parsed.searchParams.get("utm_campaign")).toBe("x");
    expect(appendParams("/ciclofeminino/obrigada", new URLSearchParams())).toBe("/ciclofeminino/obrigada");
  });
});

// ─── /ciclofeminino ────────────────────────────────────────────────────────

describe("/ciclofeminino", () => {
  it("A/B) todos os CTAs de compra levam SOMENTE ao checkout aktchfx", async () => {
    render(<CicloFemininoPage />);
    const ctas = Array.from(document.querySelectorAll("[data-funnel-checkout]"));
    expect(ctas.length).toBe(3);
    ctas.forEach((a) => expect(a.getAttribute("href")!.startsWith(ENTRY_CHECKOUT)).toBe(true));
    const kiwifyLinks = allHrefs().filter((h) => h.includes("pay.kiwify.com.br") || h.includes("hotmart"));
    kiwifyLinks.forEach((h) => expect(h.startsWith(ENTRY_CHECKOUT)).toBe(true));
    expect(allHrefs()).not.toContain(GLOBAL_CHECKOUT);
  });

  it("I) leva UTMs/src/sck/fbclid ao checkout, sem token e sem duplicar", async () => {
    go(`/ciclofeminino?${ALL_PARAMS}`);
    render(<CicloFemininoPage />);
    await waitFor(() => {
      const href = document.querySelector("[data-funnel-checkout]")!.getAttribute("href")!;
      expect(href).toContain("utm_source=meta");
    });
    const url = new URL(document.querySelector("[data-funnel-checkout]")!.getAttribute("href")!);
    expect(`${url.origin}${url.pathname}`).toBe(ENTRY_CHECKOUT);
    for (const [k, v] of Object.entries({
      utm_source: "meta",
      utm_medium: "cpc",
      utm_campaign: "camp",
      utm_content: "ad1",
      utm_term: "termo",
      src: "SRC",
      sck: "SCK",
      fbclid: "FB1",
    })) {
      expect(url.searchParams.getAll(k)).toEqual([v]);
    }
    expect(url.searchParams.has("token")).toBe(false);
    expect(url.searchParams.has("foo")).toBe(false);
  });

  it("M) ViewContent uma única vez (Strict Mode), Pixel e CAPI com o mesmo eventID", async () => {
    const { rerender } = render(
      <StrictMode>
        <CicloFemininoPage />
      </StrictMode>
    );
    rerender(
      <StrictMode>
        <CicloFemininoPage />
      </StrictMode>
    );
    await waitFor(() => expect(capiEvents().filter((e) => e.eventName === "ViewContent").length).toBe(1));
    const capi = capiEvents().find((e) => e.eventName === "ViewContent");
    const pixel = pixelCalls("ViewContent");
    expect(pixel.length).toBe(1);
    expect(pixel[0][2]).toMatchObject({
      value: 39.9,
      currency: "BRL",
      content_name: "Ciclo Feminino Descomplicado",
      content_ids: ["ciclo-feminino-descomplicado"],
      step: "entry",
    });
    expect(pixel[0][3].eventID).toBe(capi.eventId);
  });

  it("InitiateCheckout 39,90 BRL no clique; clique duplo conta uma vez", () => {
    render(<CicloFemininoPage />);
    const cta = document.querySelector("[data-funnel-checkout]")!;
    cta.addEventListener("click", (e) => e.preventDefault());
    fireEvent.click(cta);
    fireEvent.click(cta);
    const calls = pixelCalls("InitiateCheckout");
    expect(calls.length).toBe(1);
    expect(calls[0][2]).toMatchObject({ value: 39.9, currency: "BRL" });
    expect(capiEvents().filter((e) => e.eventName === "InitiateCheckout")[0].eventId).toBe(calls[0][3].eventID);
  });

  it("copy: hero, sem promessa e sem citar as ofertas seguintes", () => {
    render(<CicloFemininoPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /tentando engravidar, conhecer seus dias férteis/i })
    ).toBeInTheDocument();
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/garant\w* (a |sua )?gravidez|engravide em|cura/i);
    expect(text).not.toMatch(/ciclos desbloqueados|suplementação para|R\$\s*67|R\$\s*47,90/i);
  });

  it("O) sem placeholders e com metadata pública", async () => {
    render(<CicloFemininoPage />);
    expect(forbiddenPlaceholders()).toEqual([]);
    const { metadata } = await import("@/app/ciclofeminino/page");
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
  });
});

// ─── Upsells ───────────────────────────────────────────────────────────────

const UPSELLS = [
  {
    label: "Upsell 1 (Ciclos Desbloqueados)",
    Page: OfertaEspecialPage,
    path: "/ciclofeminino/oferta-especial",
    code: "AQyRq5m",
    checkout: UPSELL1_CHECKOUT,
    next: "/ciclofeminino/suplementacao",
    step: "upsell-1",
    value: 67,
    product: "Ciclos Desbloqueados",
    accept: /SIM, QUERO AMPLIAR MINHA PREPARAÇÃO/,
    decline: /Não, obrigada\. Quero continuar sem adicionar o Ciclos Desbloqueados\./,
  },
  {
    label: "Upsell 2 (Suplementação)",
    Page: SuplementacaoPage,
    path: "/ciclofeminino/suplementacao",
    code: "Ttiul2X",
    checkout: UPSELL2_CHECKOUT,
    next: "/ciclofeminino/obrigada",
    step: "upsell-2",
    value: 47.9,
    product: "Suplementação para a Fertilidade da Mulher",
    accept: /SIM, QUERO ENTENDER MELHOR A SUPLEMENTAÇÃO/,
    decline: /Não, obrigada\. Quero continuar sem adicionar este material\./,
  },
] as const;

describe.each(UPSELLS)("$label", (u) => {
  it("C/D/F/G) com token: marcação oficial da Kiwify com os IDs exatos", async () => {
    go(`${u.path}?${ALL_PARAMS}`);
    render(await pageEl(u.Page));
    const trigger = await waitFor(() => {
      const el = document.getElementById(`kiwify-upsell-trigger-${u.code}`);
      expect(el).not.toBeNull();
      return el!;
    });
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger.textContent).toMatch(u.accept);
    const cancel = document.getElementById(`kiwify-upsell-cancel-trigger-${u.code}`)!;
    expect(cancel.textContent).toMatch(u.decline);
    const container = document.getElementById(`kiwify-upsell-${u.code}`)!;
    expect(container.contains(trigger) && container.contains(cancel)).toBe(true);
    // Nenhum link de checkout comum quando há contexto de 1 clique.
    expect(allHrefs().some((h) => h.includes("pay.kiwify.com.br"))).toBe(false);
  });

  it("E/H/I) data-upsell-url e data-downsell-url → próxima etapa + atribuição, sem token", async () => {
    go(`${u.path}?${ALL_PARAMS}`);
    render(await pageEl(u.Page));
    const container = await waitFor(() => {
      const el = document.getElementById(`kiwify-upsell-${u.code}`);
      expect(el).not.toBeNull();
      return el!;
    });
    for (const attr of ["data-upsell-url", "data-downsell-url"]) {
      const url = new URL(container.getAttribute(attr)!);
      expect(url.pathname).toBe(u.next);
      expect(url.searchParams.get("utm_source")).toBe("meta");
      expect(url.searchParams.get("utm_campaign")).toBe("camp");
      expect(url.searchParams.get("sck")).toBe("SCK");
      expect(url.searchParams.has("token")).toBe(false);
      expect(url.searchParams.has("foo")).toBe(false);
    }
  });

  it("L) script oficial carregado no máximo uma vez, mesmo com re-render", async () => {
    go(`${u.path}?token=TK1`);
    const { rerender } = render(await pageEl(u.Page));
    await waitFor(() => expect(document.getElementById(`kiwify-upsell-${u.code}`)).not.toBeNull());
    rerender(await pageEl(u.Page));
    rerender(await pageEl(u.Page));
    await new Promise((r) => setTimeout(r, 50));
    // Carregado pela primeira página com token e nunca reinserido (re-render,
    // remount e as duas upsells compartilham o mesmo script).
    const scripts = document.querySelectorAll(`script[src="${KIWIFY_UPSELL_SCRIPT_SRC}"]`);
    expect(scripts.length).toBe(1);
  });

  it("aceite/recusa no 1 clique disparam UpsellAccept/UpsellDecline uma vez (clique duplo)", async () => {
    go(`${u.path}?token=TK1`);
    render(await pageEl(u.Page));
    const trigger = await waitFor(() => {
      const el = document.getElementById(`kiwify-upsell-trigger-${u.code}`);
      expect(el).not.toBeNull();
      return el!;
    });
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    const accept = pixelCalls("UpsellAccept");
    expect(accept.length).toBe(1);
    expect(accept[0][0]).toBe("trackCustom");
    expect(accept[0][2]).toMatchObject({ step: u.step, product: u.product, value: u.value, currency: "BRL" });
    expect(pixelCalls("InitiateCheckout").length).toBe(0); // 1 clique não é checkout novo
    fireEvent.click(document.getElementById(`kiwify-upsell-cancel-trigger-${u.code}`)!);
    expect(pixelCalls("UpsellDecline")[0][2]).toMatchObject({ step: u.step, value: u.value });
  });

  it("5/6) sem token: página não quebra; aceitar → checkout oficial, recusar → próxima etapa", async () => {
    go(`${u.path}?utm_source=meta&sck=SCK`);
    render(await pageEl(u.Page));
    const accept = await waitFor(() => {
      const el = screen.getByRole("link", { name: u.accept });
      expect(el.getAttribute("href")).toContain("utm_source=meta");
      return el;
    });
    const acceptUrl = new URL(accept.getAttribute("href")!);
    expect(`${acceptUrl.origin}${acceptUrl.pathname}`).toBe(u.checkout);
    expect(acceptUrl.searchParams.get("sck")).toBe("SCK");
    const decline = screen.getByRole("link", { name: u.decline });
    expect(decline.getAttribute("href")).toBe(`${u.next}?utm_source=meta&sck=SCK`);
    expect(document.getElementById(`kiwify-upsell-trigger-${u.code}`)).toBeNull();
    expect(allHrefs()).not.toContain(GLOBAL_CHECKOUT);
  });

  it("I) recusa sem 1 clique preserva token e atribuição", async () => {
    const withoutOneClick = { ...cicloFemininoProducts[u.code === "AQyRq5m" ? "ciclosDesbloqueados" : "suplementacao"] };
    go(`${u.path}?${ALL_PARAMS}`);
    // Mesmo com token, sem IDs de 1 clique cai no modo checkout (mesmo caminho do fallback por falha do script).
    const { UpsellActions } = await import("@/components/funnel/upsell-actions");
    render(
      <UpsellActions
        product={{ ...withoutOneClick, oneClickTriggerId: null }}
        funnelId="f"
        step={u.step}
        acceptLabel="Aceitar"
        declineLabel="Recusar"
      />
    );
    await waitFor(() =>
      expect(screen.getByRole("link", { name: "Recusar" }).getAttribute("href")).toContain("token=TK1")
    );
    const decline = new URL(screen.getByRole("link", { name: "Recusar" }).getAttribute("href")!, "http://x");
    expect(decline.pathname).toBe(u.next);
    for (const k of ["token", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "src", "sck", "fbclid"]) {
      expect(decline.searchParams.getAll(k).length).toBe(1);
    }
    expect(decline.searchParams.has("foo")).toBe(false);
  });

  it("M) UpsellView uma única vez (Strict Mode) com step/produto/valor corretos", async () => {
    go(u.path);
    render(
      <StrictMode>{await pageEl(u.Page)}</StrictMode>
    );
    await waitFor(() => expect(capiEvents().filter((e) => e.eventName === "UpsellView").length).toBe(1));
    const view = pixelCalls("UpsellView");
    expect(view.length).toBe(1);
    expect(view[0][0]).toBe("trackCustom");
    expect(view[0][2]).toMatchObject({ step: u.step, product: u.product, value: u.value, currency: "BRL" });
  });

  it("N/O) CTAs acessíveis e nenhum placeholder, nos dois modos", async () => {
    for (const q of ["", "?token=TK1"]) {
      go(`${u.path}${q}`);
      const { unmount } = render(await pageEl(u.Page));
      await waitFor(() => expect(screen.getAllByText(u.accept).length).toBeGreaterThan(0));
      const accept = screen.getAllByText(u.accept)[0].closest("a,button")!;
      expect(accept).not.toHaveAttribute("aria-disabled");
      expect(forbiddenPlaceholders()).toEqual([]);
      unmount();
    }
  });
});

describe("Upsell 1 — copy", () => {
  it("selo correto e sem afirmar pagamento confirmado", async () => {
    render(await pageEl(OfertaEspecialPage));
    expect(screen.getByText(/seu primeiro passo está dado/i)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/compra confirmada|pagamento confirmado/i);
  });
});

describe("Upsell 2 — copy", () => {
  it("não pressupõe a decisão anterior nem cita outros preços/consulta", async () => {
    render(await pageEl(SuplementacaoPage));
    expect(screen.getAllByText("Suplementação para a Fertilidade da Mulher").length).toBeGreaterThan(0);
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/ciclos desbloqueados|R\$\s*67|R\$\s*147|consulta|Dra\./i);
    expect(text).not.toMatch(/garant\w* (a |sua )?gravidez|cura|aumenta(rá)? (a |sua )?fertilidade/i);
  });
});

// ─── /obrigada ─────────────────────────────────────────────────────────────

describe("/ciclofeminino/obrigada", () => {
  it("J/K/7) sem checkout e sem Purchase (nem outro evento de conversão) pela visita", async () => {
    go(`/ciclofeminino/obrigada?${ALL_PARAMS}`);
    render(
      <StrictMode>
        <ObrigadaPage />
      </StrictMode>
    );
    await new Promise((r) => setTimeout(r, 50));
    expect(fbqMock).not.toHaveBeenCalled();
    expect(capiEvents()).toEqual([]);
    expect(allHrefs().some((h) => /pay\.kiwify|hotmart/.test(h))).toBe(false);
  });

  it("copy final, sem afirmar produtos comprados, sem WhatsApp e sem link falso", () => {
    render(<ObrigadaPage />);
    expect(screen.getByText(/pronto 💛/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: /seu próximo passo agora é acessar o seu conteúdo/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/verifique o e-mail usado na compra/i)).toBeInTheDocument();
    expect(screen.getByText(/promoções, atualizações e spam/i)).toBeInTheDocument();
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/ciclos desbloqueados|suplementação para|R\$|desafio|consulta|Dra\./i);
    // sem URL da área de membros: nenhum botão; único link é a Política de Privacidade
    expect(allHrefs()).toEqual(["/privacidade"]);
    expect(forbiddenPlaceholders()).toEqual([]);
  });
});

// ─── SSR do modo das upsells ───────────────────────────────────────────────

describe.each(UPSELLS)("$label — HTML do servidor", (u) => {
  it("com ?token= o HTML já sai com a marcação oficial (sem troca pós-hidratação)", async () => {
    const html = renderToString(await u.Page({ searchParams: Promise.resolve({ token: "T", utm_source: "meta" }) }));
    expect(html).toContain(`id="kiwify-upsell-trigger-${u.code}"`);
    expect(html).toContain(`id="kiwify-upsell-cancel-trigger-${u.code}"`);
    expect(html).toContain(`data-upsell-url="https://gerandomilagres.com.br${u.next}?utm_source=meta"`);
    expect(html).not.toContain('data-funnel-action="accept"');
  });

  it("sem token o HTML já sai com o checkout oficial (+UTMs)", async () => {
    const html = renderToString(await u.Page({ searchParams: Promise.resolve({ utm_source: "meta" }) }));
    expect(html).toContain(`href="${u.checkout}?utm_source=meta"`);
    expect(html).not.toContain(`kiwify-upsell-trigger-${u.code}`);
  });
});

// ─── Rodapé, autoridade e links ────────────────────────────────────────────

describe("Rodapé e links do Funil 01", () => {
  const pages = [
    ["LP", async () => render(<CicloFemininoPage />)],
    ["Upsell 1", async () => render(await pageEl(OfertaEspecialPage))],
    ["Upsell 2", async () => render(await pageEl(SuplementacaoPage))],
    ["Obrigada", async () => render(<ObrigadaPage />)],
  ] as const;

  it.each(pages)("%s: sem 'Dra.', sem WhatsApp e com link válido de privacidade", async (_, mount) => {
    await mount();
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/Dra\./);
    expect(text).toMatch(/Camilla Freitas • Farmacêutica • CRF\/PE 4563/);
    expect(allHrefs().some((h) => /wa\.me|whatsapp/i.test(h))).toBe(false);
    expect(allHrefs()).toContain("/privacidade");
    // Todos os links internos apontam para rotas existentes do funil ou institucionais.
    const internal = allHrefs().filter((h) => h.startsWith("/"));
    for (const h of internal) {
      expect(h.split("?")[0]).toMatch(/^\/(privacidade|ciclofeminino(\/(oferta-especial|suplementacao|obrigada))?)$/);
    }
  });

  it("PremiumFooter padrão continua igual nas outras páginas (regressão)", () => {
    render(<PremiumFooter whatsappMessage="Oi" />);
    expect(screen.getByText(/Dra\. Camilla Freitas • CRF\/PE 4563/)).toBeInTheDocument();
    expect(allHrefs().some((h) => h.startsWith("https://wa.me/"))).toBe(true);
    expect(screen.getByRole("button", { name: /voltar ao topo/i })).toBeInTheDocument();
  });

  it("/privacidade existe e não inventa dados empresariais", () => {
    render(<PrivacidadePage />);
    expect(screen.getByRole("heading", { level: 1, name: /política de privacidade/i })).toBeInTheDocument();
    const text = document.body.textContent ?? "";
    expect(text).toMatch(/Kiwify/);
    expect(text).toMatch(/LGPD|13\.709/);
    expect(text).not.toMatch(/CNPJ|Ltda|razão social|endereço:/i);
  });
});
