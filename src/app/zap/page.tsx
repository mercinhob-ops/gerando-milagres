"use client";

import { useState } from "react";
import Image from "next/image";

export default function ZapPage() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [enviado, setEnviado] = useState(false);

  function formatarTelefone(valor: string) {
    const nums = valor.replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 2) return `(${nums}`;
    if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
  }

  function handleEnviar() {
    if (!nome.trim() || telefone.replace(/\D/g, "").length < 10) return;
    setEnviado(true);
    const msg = encodeURIComponent(
      `Olá, Dra. Camilla! Me chamo ${nome} e quero saber mais sobre o Gerando Milagres. 🌸`
    );
    setTimeout(() => {
      window.open(`https://wa.me/5581981396005?text=${msg}`, "_blank");
    }, 1200);
  }

  const waLink = `https://wa.me/5581981396005?text=${encodeURIComponent(
    `Olá, Dra. Camilla! Me chamo ${nome} e quero saber mais sobre o Gerando Milagres. 🌸`
  )}`;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #F0E6DC 0%, #E8D0C0 60%, #F0E6DC 100%)",
        fontFamily: "'Georgia', serif",
        color: "#4A2E26",
      }}
    >
      <header style={{ textAlign: "center", padding: "2.5rem 1rem 0" }}>
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#C4867A",
            marginBottom: "0.4rem",
            fontFamily: "sans-serif",
          }}
        >
          Dra. Camilla Freitas · CRF/PE 4563
        </p>
        <h1
          style={{
            fontSize: "clamp(1.6rem, 5vw, 2.6rem)",
            fontWeight: 700,
            color: "#4A2E26",
            lineHeight: 1.2,
            margin: "0 auto",
            maxWidth: 560,
          }}
        >
          GERANDO<span style={{ color: "#C4867A" }}> MILAGRES</span>
        </h1>
        <div
          style={{
            width: 48,
            height: 2,
            background: "#C4867A",
            margin: "1rem auto",
            borderRadius: 2,
          }}
        />
      </header>

      <section
        style={{ textAlign: "center", padding: "1.75rem 1rem 0" }}
      >
        <Image
          src="/images/camilla-zap.jpg"
          alt="Dra. Camilla Freitas"
          width={320}
          height={420}
          style={{
            objectFit: "cover",
            borderRadius: 16,
            display: "block",
            margin: "0 auto",
          }}
          priority
        />
        <p
          style={{
            marginTop: "0.85rem",
            fontSize: "0.78rem",
            letterSpacing: "0.06em",
            color: "#8B5E52",
            fontFamily: "sans-serif",
            fontStyle: "italic",
          }}
        >
          Dra. Camilla Freitas — Farmacêutica · CRF/PE 4563
        </p>
      </section>

      <section
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "2rem 1.5rem 0",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.5rem, 4.5vw, 2.2rem)",
            fontWeight: 700,
            lineHeight: 1.3,
            color: "#4A2E26",
            marginBottom: "1.2rem",
          }}
        >
          Seu corpo pode ser o lar do{" "}
          <em style={{ color: "#C4867A", fontStyle: "italic" }}>milagre</em>{" "}
          que você espera.
        </h2>
        <p
          style={{
            fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
            lineHeight: 1.75,
            color: "#6B4239",
            maxWidth: 520,
            margin: "0 auto 2rem",
          }}
        >
          Descubra como preparar seu corpo para gerar vida — com protocolos
          científicos, suplementação estratégica e o cuidado humano que você
          merece.
        </p>

        <div
          style={{
            background: "rgba(255,255,255,0.55)",
            borderRadius: 16,
            padding: "1.5rem 2rem",
            maxWidth: 480,
            margin: "0 auto 2.5rem",
            textAlign: "left",
            border: "1px solid rgba(196,134,122,0.18)",
          }}
        >
          {[
            "Entenda por que seu corpo ainda não engravidou",
            "Conheça o protocolo científico da Dra. Camilla",
            "Saiba como a suplementação certa faz diferença real",
            "Dê o primeiro passo com quem já ajudou mais de 500 mulheres",
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                marginBottom: i < 3 ? "0.85rem" : 0,
              }}
            >
              <span style={{ color: "#C4867A", flexShrink: 0 }}>✦</span>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  color: "#4A2E26",
                  fontFamily: "sans-serif",
                }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{ maxWidth: 480, margin: "0 auto", padding: "0 1.5rem 4rem" }}
      >
        {!enviado ? (
          <div
            style={{
              background: "rgba(255,255,255,0.7)",
              borderRadius: 20,
              padding: "2rem 1.75rem",
              boxShadow: "0 8px 40px rgba(74,46,38,0.10)",
              border: "1px solid rgba(196,134,122,0.2)",
            }}
          >
            <p
              style={{
                textAlign: "center",
                fontSize: "1rem",
                fontWeight: 600,
                color: "#4A2E26",
                marginBottom: "1.5rem",
                fontFamily: "sans-serif",
              }}
            >
              Deixe seu contato e a Dra. Camilla fala com você em breve 💬
            </p>

            <label
              style={{
                display: "block",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#6B4239",
                marginBottom: "0.4rem",
                textTransform: "uppercase",
                fontFamily: "sans-serif",
              }}
            >
              Seu nome
            </label>
            <input
              type="text"
              placeholder="Como posso te chamar?"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                border: "1.5px solid rgba(196,134,122,0.4)",
                borderRadius: 10,
                fontSize: "0.95rem",
                background: "rgba(255,255,255,0.8)",
                color: "#4A2E26",
                marginBottom: "1.1rem",
                outline: "none",
                fontFamily: "sans-serif",
                boxSizing: "border-box",
              }}
            />

            <label
              style={{
                display: "block",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#6B4239",
                marginBottom: "0.4rem",
                textTransform: "uppercase",
                fontFamily: "sans-serif",
              }}
            >
              WhatsApp
            </label>
            <input
              type="tel"
              placeholder="(81) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                border: "1.5px solid rgba(196,134,122,0.4)",
                borderRadius: 10,
                fontSize: "0.95rem",
                background: "rgba(255,255,255,0.8)",
                color: "#4A2E26",
                marginBottom: "1.1rem",
                outline: "none",
                fontFamily: "sans-serif",
                boxSizing: "border-box",
              }}
            />

            <button
              onClick={handleEnviar}
              disabled={
                !nome.trim() || telefone.replace(/\D/g, "").length < 10
              }
              style={{
                width: "100%",
                padding: "1rem",
                background:
                  nome.trim() && telefone.replace(/\D/g, "").length >= 10
                    ? "#C4867A"
                    : "#d4a89a",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontSize: "1rem",
                fontWeight: 700,
                cursor:
                  nome.trim() && telefone.replace(/\D/g, "").length >= 10
                    ? "pointer"
                    : "not-allowed",
                fontFamily: "sans-serif",
                marginTop: "0.5rem",
              }}
            >
              Quero falar com a Dra. Camilla →
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: "0.72rem",
                color: "#6B4239",
                marginTop: "0.75rem",
                fontFamily: "sans-serif",
                opacity: 0.75,
              }}
            >
              Resposta em até 5 min · Dados protegidos pela LGPD
            </p>
          </div>
        ) : (
          <div
            style={{
              background: "rgba(255,255,255,0.7)",
              borderRadius: 20,
              padding: "2.5rem 1.75rem",
              textAlign: "center",
              boxShadow: "0 8px 40px rgba(74,46,38,0.10)",
              border: "1px solid rgba(196,134,122,0.2)",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
              🌸
            </div>
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "#4A2E26",
                marginBottom: "0.5rem",
                fontFamily: "sans-serif",
              }}
            >
              Tudo certo, {nome.split(" ")[0]}!
            </h3>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#6B4239",
                fontFamily: "sans-serif",
                lineHeight: 1.6,
              }}
            >
              Estamos te levando ao WhatsApp da Dra. Camilla. Se não abrir
              automaticamente,{" "}
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#C4867A" }}
              >
                toque aqui
              </a>
              .
            </p>
          </div>
        )}

        <p
          style={{
            textAlign: "center",
            fontSize: "0.78rem",
            color: "#6B4239",
            marginTop: "1.5rem",
            fontFamily: "sans-serif",
            opacity: 0.8,
          }}
        >
          ✦ Mais de 500 mulheres já prepararam o corpo com o método ✦
        </p>
      </section>
    </main>
  );
}
