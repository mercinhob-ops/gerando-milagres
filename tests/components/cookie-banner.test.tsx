import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CookieBanner } from "@/components/compliance/cookie-banner";

describe("CookieBanner", () => {
  it("renderiza o banner com role dialog", () => {
    render(<CookieBanner onAccept={() => {}} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("exibe texto sobre política de privacidade", () => {
    render(<CookieBanner onAccept={() => {}} />);
    expect(screen.getByText(/política de privacidade/i)).toBeInTheDocument();
  });

  it("exibe botão Aceitar", () => {
    render(<CookieBanner onAccept={() => {}} />);
    expect(screen.getByRole("button", { name: /aceitar/i })).toBeInTheDocument();
  });

  it("chama onAccept ao clicar em Aceitar", async () => {
    const user = userEvent.setup();
    let called = false;
    render(<CookieBanner onAccept={() => { called = true; }} />);
    await user.click(screen.getByRole("button", { name: /aceitar/i }));
    expect(called).toBe(true);
  });
});
