import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, waitFor, act, screen } from "@testing-library/react";
import {
  KiwifyUpsell,
  buildOfficialUpsellHtml,
  CLICK_LOCK_MS,
} from "@/components/funnel/kiwify-upsell";
import { KIWIFY_UPSELL_SCRIPT_SRC, cicloFemininoProducts } from "@/config/funnels/ciclo-feminino";
import { forwardParams, searchParamsToQuery } from "@/lib/funnel-params";

/**
 * next/script é substituído por um dublê que expõe os callbacks, para testar
 * a lógica do componente (bloqueio, prontidão, fallback) de forma
 * determinística. A deduplicação real do next/script é coberta em
 * ciclofeminino.test.tsx (teste L).
 */
const scriptMock = vi.hoisted(() => ({
  mounts: 0,
  last: null as null | { onLoad?: () => void; onReady?: () => void; onError?: () => void; src?: string; id?: string },
}));
vi.mock("next/script", () => ({
  default: (props: { onLoad?: () => void; onReady?: () => void; onError?: () => void; src?: string; id?: string }) => {
    scriptMock.last = props;
    return null;
  },
}));

const IDS = {
  containerId: "kiwify-upsell-TEST1",
  triggerId: "kiwify-upsell-trigger-TEST1",
  cancelTriggerId: "kiwify-upsell-cancel-trigger-TEST1",
};

function renderUpsell(extra: Partial<Parameters<typeof KiwifyUpsell>[0]> = {}) {
  const onAccept = vi.fn();
  const onDecline = vi.fn();
  const onUnavailable = vi.fn();
  const utils = render(
    <KiwifyUpsell
      {...IDS}
      acceptUrl="https://gerandomilagres.com.br/proxima?utm_source=meta"
      declineUrl="https://gerandomilagres.com.br/recusa"
      acceptLabel="Quero"
      declineLabel="Não quero"
      tracking={{ onAccept, onDecline }}
      onUnavailable={onUnavailable}
      {...extra}
    />
  );
  const host = () => document.querySelector(".kiwify-upsell-host")!;
  const trigger = () => document.getElementById(IDS.triggerId)!;
  const cancel = () => document.getElementById(IDS.cancelTriggerId)!;
  return { ...utils, onAccept, onDecline, onUnavailable, host, trigger, cancel };
}

function loadScript() {
  act(() => scriptMock.last?.onLoad?.());
}

afterEach(() => {
  vi.useRealTimers();
});

describe("KiwifyUpsell — antes do script ficar pronto", () => {
  it("botões bloqueados: clique/teclado não chegam ao script nem geram tracking", () => {
    const { host, trigger, cancel, onAccept, onDecline, unmount } = renderUpsell();
    expect(host()).toHaveAttribute("data-kiwify-ready", "false");
    expect(host()).toHaveAttribute("aria-busy", "true");

    const scriptHandler = vi.fn();
    trigger().addEventListener("click", scriptHandler);
    cancel().addEventListener("click", scriptHandler);
    fireEvent.click(trigger());
    fireEvent.click(cancel());
    fireEvent.keyDown(cancel(), { key: "Enter" });
    expect(scriptHandler).not.toHaveBeenCalled();
    expect(onAccept).not.toHaveBeenCalled();
    expect(onDecline).not.toHaveBeenCalled();
    unmount();
  });

  it("timeout sem script pronto → onUnavailable (fallback para checkout)", () => {
    vi.useFakeTimers();
    const { onUnavailable, unmount } = renderUpsell({ readyTimeoutMs: 5000 });
    act(() => vi.advanceTimersByTime(4999));
    expect(onUnavailable).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onUnavailable).toHaveBeenCalledTimes(1);
    unmount();
  });

  it("timeout do script troca o 1 clique pelo checkout oficial", async () => {
    vi.useFakeTimers();
    const { UpsellActions } = await import("@/components/funnel/upsell-actions");
    window.history.replaceState({}, "", "/ciclofeminino/suplementacao?token=T");
    const { container } = render(
      <UpsellActions
        product={{ ...cicloFemininoProducts.suplementacao, kiwifyOfferCode: "NOVO1", oneClickTriggerId: "kiwify-upsell-trigger-NOVO1", oneClickCancelTriggerId: "kiwify-upsell-cancel-trigger-NOVO1" }}
        funnelId="f"
        step="upsell-2"
        acceptLabel="Aceitar"
        declineLabel="Recusar"
        initialSearch="?token=T"
      />
    );
    expect(container.firstElementChild).toHaveAttribute("data-upsell-mode", "one-click");
    act(() => vi.advanceTimersByTime(12_000));
    expect(container.firstElementChild).toHaveAttribute("data-upsell-mode", "checkout");
    expect(screen.getByRole("link", { name: "Aceitar" }).getAttribute("href")).toBe("https://pay.kiwify.com.br/Ttiul2X");
  });

  it("erro ao carregar o script → onUnavailable", () => {
    const { onUnavailable, unmount } = renderUpsell();
    expect(scriptMock.last).toMatchObject({ id: "kiwify-upsell-v2", src: KIWIFY_UPSELL_SCRIPT_SRC });
    act(() => scriptMock.last?.onError?.());
    expect(onUnavailable).toHaveBeenCalledTimes(1);
    unmount();
  });
});

describe("KiwifyUpsell — script pronto", () => {
  it("libera os botões após o load; clique chega ao handler do script uma vez; clique duplo travado", async () => {
    const { host, trigger, cancel, onAccept, onDecline, onUnavailable } = renderUpsell();
    loadScript();
    await waitFor(() => expect(host()).toHaveAttribute("data-kiwify-ready", "true"));
    expect(host()).toHaveAttribute("aria-busy", "false");

    const scriptHandler = vi.fn();
    trigger().addEventListener("click", scriptHandler);
    fireEvent.click(trigger());
    fireEvent.click(trigger());
    fireEvent.click(cancel());
    expect(scriptHandler).toHaveBeenCalledTimes(1);
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onDecline).not.toHaveBeenCalled();
    expect(onUnavailable).not.toHaveBeenCalled();
  });

  it("trava expira após CLICK_LOCK_MS (permite nova tentativa se a Kiwify recusar o pagamento)", async () => {
    const { trigger, onAccept } = renderUpsell();
    loadScript();
    await waitFor(() => expect(document.querySelector(".kiwify-upsell-host")).toHaveAttribute("data-kiwify-ready", "true"));
    const now = Date.now();
    const spy = vi.spyOn(Date, "now").mockReturnValue(now);
    fireEvent.click(trigger());
    spy.mockReturnValue(now + CLICK_LOCK_MS + 1);
    fireEvent.click(trigger());
    expect(onAccept).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });

  it("script já carregado antes da montagem: onReady libera os botões", async () => {
    const { host } = renderUpsell();
    act(() => scriptMock.last?.onReady?.());
    await waitFor(() => expect(host()).toHaveAttribute("data-kiwify-ready", "true"));
  });

  it("re-render não reescreve a marcação oficial (o script pode ter alterado o DOM)", async () => {
    const { rerender, trigger } = renderUpsell();
    trigger().setAttribute("data-kiwify-bound", "1");
    rerender(
      <KiwifyUpsell
        {...IDS}
        acceptUrl="https://gerandomilagres.com.br/proxima?utm_source=meta"
        declineUrl="https://gerandomilagres.com.br/recusa"
        acceptLabel="Quero"
        declineLabel="Não quero"
      />
    );
    expect(document.getElementById(IDS.triggerId)).toHaveAttribute("data-kiwify-bound", "1");
    // A troca para "pronto" (re-render) também preserva o DOM do script.
    loadScript();
    await waitFor(() => expect(document.querySelector(".kiwify-upsell-host")).toHaveAttribute("data-kiwify-ready", "true"));
    expect(document.getElementById(IDS.triggerId)).toHaveAttribute("data-kiwify-bound", "1");
  });
});

describe("buildOfficialUpsellHtml", () => {
  it("marcação oficial com URLs de aceite/recusa separadas e conteúdo escapado", () => {
    const html = buildOfficialUpsellHtml({
      ...IDS,
      acceptUrl: 'https://x.com/a?u=1&v="2"',
      declineUrl: "https://x.com/b",
      acceptLabel: "<b>Quero</b>",
      declineLabel: "Não",
    });
    const div = document.createElement("div");
    div.innerHTML = html;
    const container = div.querySelector(`#${IDS.containerId}`)!;
    expect(container.getAttribute("data-upsell-url")).toBe('https://x.com/a?u=1&v="2"');
    expect(container.getAttribute("data-downsell-url")).toBe("https://x.com/b");
    expect(div.querySelector(`#${IDS.triggerId}`)!.textContent).toBe("<b>Quero</b>");
    expect(div.querySelector("b")).toBeNull();
    expect(div.querySelector(`#${IDS.cancelTriggerId}`)).toHaveAttribute("role", "button");
  });
});

describe("Parâmetros Kiwify desconhecidos", () => {
  it("forwardParams e searchParamsToQuery preservam todas as chaves", () => {
    const q = "token=T&payment_type=pix&utm_source=meta&kw_x=1&vazio=";
    expect([...forwardParams(q).keys()]).toEqual(["token", "payment_type", "utm_source", "kw_x"]);
    const ssr = searchParamsToQuery({ token: "T", payment_type: ["pix", "card"], kw_x: "1", vazio: "" });
    expect(new URLSearchParams(ssr).get("payment_type")).toBe("pix");
    expect(new URLSearchParams(ssr).get("kw_x")).toBe("1");
    expect(new URLSearchParams(ssr).has("vazio")).toBe(false);
  });

  it("modo fallback: recusa repassa token + payment_type + UTMs; checkout recebe só atribuição", async () => {
    window.history.replaceState({}, "", "/ciclofeminino/oferta-especial?token=T&payment_type=pix&utm_source=meta&sck=S");
    const { UpsellActions } = await import("@/components/funnel/upsell-actions");
    render(
      <UpsellActions
        product={{ ...cicloFemininoProducts.ciclosDesbloqueados, oneClickTriggerId: null }}
        funnelId="f"
        step="upsell-1"
        acceptLabel="Aceitar"
        declineLabel="Recusar"
        initialSearch="?token=T&payment_type=pix&utm_source=meta&sck=S"
      />
    );
    const decline = new URL(screen.getByRole("link", { name: "Recusar" }).getAttribute("href")!, "http://x");
    expect(decline.pathname).toBe("/ciclofeminino/suplementacao");
    expect(Object.fromEntries(decline.searchParams)).toEqual({
      token: "T",
      payment_type: "pix",
      utm_source: "meta",
      sck: "S",
    });
    const accept = new URL(screen.getByRole("link", { name: "Aceitar" }).getAttribute("href")!);
    expect(accept.searchParams.has("token")).toBe(false);
    expect(accept.searchParams.has("payment_type")).toBe(false);
    expect(accept.searchParams.get("sck")).toBe("S");
  });

});
