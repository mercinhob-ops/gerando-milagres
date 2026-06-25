import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Desbloqueando Ciclos — Dra. Camilla Freitas",
  description:
    "Programa para mulheres que querem regularizar o ciclo menstrual e preparar o corpo para a fertilidade com ciência e cuidado.",
  robots: { index: false, follow: false },
};

export default function DesbloqueandoCiclosPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #F0E6DC 0%, #E8D0C0 60%, #F0E6DC 100%)",
        fontFamily: "'Georgia', serif",
        color: "#4A2E26",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#C4867A",
          marginBottom: "0.5rem",
          fontFamily: "sans-serif",
        }}
      >
        Dra. Camilla Freitas · CRF/PE 4563
      </p>

      <h1
        style={{
          fontSize: "clamp(2rem, 6vw, 3.5rem)",
          fontWeight: 700,
          lineHeight: 1.15,
          maxWidth: 640,
          marginBottom: "1.25rem",
        }}
      >
        DESBLOQUEANDO{" "}
        <span style={{ color: "#C4867A" }}>CICLOS</span>
      </h1>

      <div
        style={{
          width: 48,
          height: 2,
          background: "#C4867A",
          margin: "0 auto 1.5rem",
          borderRadius: 2,
        }}
      />

      <p
        style={{
          fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
          lineHeight: 1.75,
          color: "#6B4239",
          maxWidth: 520,
          fontFamily: "sans-serif",
          marginBottom: "2.5rem",
        }}
      >
        Em breve. Um programa criado para mulheres que querem regularizar
        o ciclo menstrual e preparar o corpo para a fertilidade — com
        protocolos científicos e suporte humano.
      </p>

      <a
        href="/"
        style={{
          display: "inline-block",
          padding: "0.9rem 2rem",
          background: "#C4867A",
          color: "#fff",
          borderRadius: 12,
          fontFamily: "sans-serif",
          fontWeight: 700,
          fontSize: "0.95rem",
          textDecoration: "none",
          letterSpacing: "0.02em",
        }}
      >
        Conhecer o Gerando Milagres →
      </a>
    </main>
  );
}
