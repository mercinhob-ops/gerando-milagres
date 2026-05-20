import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, Section, Container, Heading, Subheading, BodyText } from "@/components/design-system";

describe("Button", () => {
  it("renderiza com texto correto", () => {
    render(<Button>Quero participar</Button>);
    expect(screen.getByRole("button", { name: "Quero participar" })).toBeInTheDocument();
  });

  it("aplica variante primary por padrão", () => {
    render(<Button>Entrar</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-lilac");
  });

  it("aplica variante secondary", () => {
    render(<Button variant="secondary">Saiba mais</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-lilac");
  });

  it("aplica variante ghost", () => {
    render(<Button variant="ghost">Ver detalhes</Button>);
    expect(screen.getByRole("button")).toHaveClass("underline");
  });

  it("aceita className adicional", () => {
    render(<Button className="mt-4">Clique</Button>);
    expect(screen.getByRole("button")).toHaveClass("mt-4");
  });

  it("chama onClick quando clicado", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Clique</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("respeita disabled", () => {
    render(<Button disabled>Indisponível</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("Section", () => {
  it("renderiza como section por padrão", () => {
    render(<Section>Conteúdo</Section>);
    expect(screen.getByText("Conteúdo").closest("section")).toBeInTheDocument();
  });

  it("aceita className adicional", () => {
    render(<Section className="bg-nude" data-testid="sec">Conteúdo</Section>);
    expect(screen.getByTestId("sec")).toHaveClass("bg-nude");
  });

  it("aceita id para âncoras", () => {
    render(<Section id="metodo">Conteúdo</Section>);
    expect(document.getElementById("metodo")).toBeInTheDocument();
  });
});

describe("Container", () => {
  it("renderiza children", () => {
    render(<Container>Texto interno</Container>);
    expect(screen.getByText("Texto interno")).toBeInTheDocument();
  });

  it("aplica max-width e centralização", () => {
    render(<Container data-testid="c">Conteúdo</Container>);
    expect(screen.getByTestId("c")).toHaveClass("max-w-6xl", "mx-auto");
  });

  it("aceita className adicional", () => {
    render(<Container className="text-center" data-testid="c">Conteúdo</Container>);
    expect(screen.getByTestId("c")).toHaveClass("text-center");
  });
});

describe("Heading", () => {
  it("renderiza como h2 por padrão", () => {
    render(<Heading>O Método</Heading>);
    expect(screen.getByRole("heading", { level: 2, name: "O Método" })).toBeInTheDocument();
  });

  it("renderiza como h1 quando size=h1", () => {
    render(<Heading size="h1" as="h1">Gerando Milagres</Heading>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renderiza como h3 quando size=h3", () => {
    render(<Heading size="h3" as="h3">Pilar 1</Heading>);
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });

  it("aceita className adicional", () => {
    render(<Heading className="text-lilac">Título</Heading>);
    expect(screen.getByRole("heading")).toHaveClass("text-lilac");
  });
});

describe("Subheading", () => {
  it("renderiza como parágrafo", () => {
    render(<Subheading>Uma jornada de transformação</Subheading>);
    expect(screen.getByText("Uma jornada de transformação")).toBeInTheDocument();
  });
});

describe("BodyText", () => {
  it("renderiza variante base por padrão", () => {
    render(<BodyText>Texto do corpo</BodyText>);
    expect(screen.getByText("Texto do corpo")).toHaveClass("text-base");
  });

  it("renderiza variante lg", () => {
    render(<BodyText variant="lg">Texto grande</BodyText>);
    expect(screen.getByText("Texto grande")).toHaveClass("text-lg");
  });

  it("renderiza variante caption", () => {
    render(<BodyText variant="caption">Nota de rodapé</BodyText>);
    expect(screen.getByText("Nota de rodapé")).toHaveClass("text-sm");
  });

  it("aceita className adicional", () => {
    render(<BodyText className="italic">Texto</BodyText>);
    expect(screen.getByText("Texto")).toHaveClass("italic");
  });
});
