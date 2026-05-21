import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AnalyticsProvider } from "@/components/compliance/analytics-provider";

const CONSENT_KEY = "gm_cookie_consent";

beforeEach(() => {
  localStorage.clear();
});

describe("AnalyticsProvider", () => {
  it("renderiza children", () => {
    render(<AnalyticsProvider><p>conteúdo</p></AnalyticsProvider>);
    expect(screen.getByText("conteúdo")).toBeInTheDocument();
  });

  it("exibe CookieBanner quando não há consentimento", () => {
    render(<AnalyticsProvider><p>x</p></AnalyticsProvider>);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("oculta CookieBanner quando já há consentimento no localStorage", () => {
    localStorage.setItem(CONSENT_KEY, "true");
    render(<AnalyticsProvider><p>x</p></AnalyticsProvider>);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("oculta CookieBanner após clicar em Aceitar", async () => {
    const user = userEvent.setup();
    render(<AnalyticsProvider><p>x</p></AnalyticsProvider>);
    await user.click(screen.getByRole("button", { name: /aceitar/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("salva consentimento no localStorage após aceitar", async () => {
    const user = userEvent.setup();
    render(<AnalyticsProvider><p>x</p></AnalyticsProvider>);
    await user.click(screen.getByRole("button", { name: /aceitar/i }));
    expect(localStorage.getItem(CONSENT_KEY)).toBe("true");
  });

  it("expõe window.trackEvent globalmente", () => {
    render(<AnalyticsProvider><p>x</p></AnalyticsProvider>);
    expect(typeof window.trackEvent).toBe("function");
  });
});
