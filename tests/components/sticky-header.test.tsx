import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StickyHeader } from "@/components/ui/sticky-header";

describe("StickyHeader", () => {
  it("não renderiza em /casalgm1", async () => {
    vi.resetModules();
    vi.doMock("next/navigation", () => ({ usePathname: () => "/casalgm1" }));
    const { StickyHeader: StickyHeaderWithMockedPath } = await import("@/components/ui/sticky-header");

    const { container } = render(<StickyHeaderWithMockedPath />);
    expect(container).toBeEmptyDOMElement();

    vi.doUnmock("next/navigation");
  });

  it("está oculto no scroll inicial (translate-y-full)", () => {
    render(<StickyHeader />);
    const header = screen.getByRole("banner");
    expect(header.className).toContain("-translate-y-full");
  });

  it("exibe logo 'Gerando Milagres'", () => {
    render(<StickyHeader />);
    expect(screen.getByText(/gerando milagres/i)).toBeInTheDocument();
  });

  it("CTA aponta para checkout externo", () => {
    render(<StickyHeader />);
    const cta = screen.getAllByRole("link")[0];
    expect(cta).toHaveAttribute("href", "https://pay.kiwify.com.br/uOSEIEm");
    expect(cta).toHaveAttribute("target", "_blank");
  });

  it("aparece após 300px de scroll", () => {
    render(<StickyHeader />);
    Object.defineProperty(window, "scrollY", { value: 350, writable: true });
    fireEvent.scroll(window);
    const header = screen.getByRole("banner");
    expect(header.className).toContain("translate-y-0");
  });
});
