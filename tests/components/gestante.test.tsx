import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GestantePage from "@/app/gestante/page";

function fillForm({ avaliacao = "Sim, quero avaliação", lgpd = true } = {}) {
  fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: "Ana Paula Souza" } });
  fireEvent.change(screen.getByLabelText(/whatsapp/i), { target: { value: "(81) 99999-1234" } });
  fireEvent.click(screen.getByLabelText("2º"));
  for (const legend of [/restrição alimentar/i, /diabetes gestacional/i, /cirurgia bariátrica/i]) {
    const group = screen.getByRole("group", { name: legend });
    fireEvent.click(group.querySelector('input[value="nao"]')!);
  }
  fireEvent.click(screen.getByLabelText(avaliacao));
  if (lgpd) fireEvent.click(screen.getByLabelText(/autorizo o uso dos meus dados conforme a lgpd/i));
}

function submit() {
  fireEvent.click(screen.getByRole("button", { name: /quero receber o material/i }));
}

describe("GestantePage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, "", "/gestante");
  });

  it("mostra chamada, Dra. Camilla e questionário", () => {
    render(<GestantePage />);
    expect(
      screen.getByRole("heading", {
        name: /o seu bebê muda a cada trimestre\. a sua alimentação também deveria\./i,
      })
    ).toBeInTheDocument();
    expect(screen.queryByText(/o que você vai receber/i)).not.toBeInTheDocument();
    expect(screen.getByAltText(/dra\. camilla freitas/i)).toHaveAttribute(
      "src",
      expect.stringContaining("camilla-zap.jpg")
    );
    expect(screen.getByText(/farmacêutica · crf\/pe 4563/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/whatsapp/i)).toBeInTheDocument();
  });

  it("exige o consentimento LGPD antes de enviar", () => {
    const fbq = vi.fn();
    window.fbq = fbq;
    render(<GestantePage />);
    fillForm({ lgpd: false });
    submit();
    expect(screen.getByRole("alert")).toHaveTextContent(/lgpd/i);
    expect(fbq).not.toHaveBeenCalled();
    expect(window.localStorage.getItem("gestante_lead")).toBeNull();
  });

  it("valida o WhatsApp com DDD", () => {
    render(<GestantePage />);
    fillForm();
    fireEvent.change(screen.getByLabelText(/whatsapp/i), { target: { value: "9999-1234" } });
    submit();
    expect(screen.getByRole("alert")).toHaveTextContent(/whatsapp válido/i);
  });

  it("ao enviar com avaliação: dispara Lead, salva origem e mostra convite forte", () => {
    const fbq = vi.fn();
    window.fbq = fbq;
    window.history.replaceState({}, "", "/gestante?origem=instagram");

    render(<GestantePage />);
    fillForm();
    submit();

    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Lead",
      expect.objectContaining({ trimestre: "2º", origem: "instagram" }),
      expect.any(Object)
    );

    const saved = JSON.parse(window.localStorage.getItem("gestante_lead")!);
    expect(saved).toMatchObject({
      nome: "Ana Paula Souza",
      whatsapp: "81999991234",
      trimestre: "2º",
      querAvaliacao: "sim",
      lgpd: true,
      origem: "instagram",
    });

    expect(screen.queryByLabelText(/nome completo/i)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /pronto, ana!/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /baixar o material/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /vamos olhar o seu caso juntas\?/i })).toBeInTheDocument();

    const whatsLink = screen.getByRole("link", { name: /quero minha avaliação no whatsapp/i });
    const href = whatsLink.getAttribute("href")!;
    expect(href).toContain("https://wa.me/5581981396005?text=");
    const message = decodeURIComponent(href.split("text=")[1]);
    expect(message).toContain("Ana Paula Souza");
    expect(message).toContain("2º trimestre");
  });

  it("sem avaliação: mostra convite leve e origem nula sem UTM", () => {
    render(<GestantePage />);
    fillForm({ avaliacao: "Não por enquanto" });
    submit();

    expect(screen.queryByText(/vamos olhar o seu caso juntas/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /falar no whatsapp/i })).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/5581981396005")
    );
    expect(JSON.parse(window.localStorage.getItem("gestante_lead")!).origem).toBeNull();
  });
});
