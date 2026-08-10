"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const benefits = [
  "Entenda por que seu corpo ainda não engravidou",
  "Conheça o protocolo científico da Dra. Camilla",
  "Saiba como a suplementação certa faz diferença real",
  "Dê o primeiro passo com quem já ajudou mais de 500 mulheres",
] as const;

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

  const message = `Olá, Dra. Camilla! Me chamo ${nome} e quero saber mais sobre o Gerando Milagres. 🌸`;
  const waLink = `https://wa.me/5581981396005?text=${encodeURIComponent(message)}`;
  const isValid = nome.trim() !== "" && telefone.replace(/\D/g, "").length >= 10;

  function handleEnviar() {
    if (!isValid) return;
    setEnviado(true);
    setTimeout(() => {
      window.open(waLink, "_blank");
    }, 1200);
  }

  return (
    <main
      className="min-h-screen pb-16"
      style={{ background: "linear-gradient(160deg, #F0E6DC 0%, #E8D0C0 55%, #F0E6DC 100%)" }}
    >
      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section className="text-center pt-12 px-6">
        <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-3">
          Dra. Camilla Freitas · CRF/PE 4563
        </p>
        <h1 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-tight max-w-xl mx-auto">
          GERANDO <span className="text-salmon">MILAGRES</span>
        </h1>
        <div className="w-12 h-0.5 bg-salmon mx-auto my-4 rounded-full" />

        <div className="relative w-40 h-52 md:w-48 md:h-64 mx-auto rounded-2xl overflow-hidden shadow-2xl mt-4">
          <Image
            src="/images/camilla-zap.jpg"
            alt="Dra. Camilla Freitas"
            fill
            className="object-cover object-top"
            sizes="192px"
            priority
          />
        </div>
        <p className="font-sans italic text-xs text-brown/70 mt-3 tracking-wide">
          Dra. Camilla Freitas — Farmacêutica · CRF/PE 4563
        </p>
      </section>

      {/* ─── HEADLINE + BENEFÍCIOS ──────────────────────────────────── */}
      <section className="max-w-xl mx-auto px-6 pt-10 text-center">
        <h2 className="font-['Georgia',serif] text-2xl md:text-3xl font-bold text-dark-brown leading-snug mb-5">
          Seu corpo pode ser o lar do{" "}
          <em className="not-italic text-salmon">milagre</em> que você espera.
        </h2>
        <p className="font-sans text-base md:text-lg text-brown leading-relaxed max-w-lg mx-auto mb-8">
          Descubra como preparar seu corpo para gerar vida — com protocolos
          científicos, suplementação estratégica e o cuidado humano que você
          merece.
        </p>

        <div className="bg-white/50 backdrop-blur-md border border-salmon/20 rounded-2xl p-6 text-left shadow-sm max-w-md mx-auto">
          <ul className="space-y-3">
            {benefits.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-salmon shrink-0 mt-1" aria-hidden="true" />
                <p className="font-sans text-sm text-dark-brown leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── FORMULÁRIO ─────────────────────────────────────────────── */}
      <section className="max-w-md mx-auto px-6 pt-10">
        {!enviado ? (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-7 shadow-[0_8px_40px_rgba(74,46,38,0.1)] border border-salmon/20">
            <p className="text-center font-sans font-semibold text-dark-brown mb-6">
              Deixe seu contato e a Dra. Camilla fala com você em breve 💬
            </p>

            <label className="block font-sans text-xs font-semibold text-brown uppercase mb-1.5">
              Seu nome
            </label>
            <input
              type="text"
              placeholder="Como posso te chamar?"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              className="w-full font-sans text-sm text-dark-brown border border-salmon/40 rounded-lg px-4 py-3 bg-white/80 mb-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-salmon/40 focus:border-salmon/60"
            />

            <label className="block font-sans text-xs font-semibold text-brown uppercase mb-1.5">
              WhatsApp
            </label>
            <input
              type="tel"
              placeholder="(81) 99999-9999"
              value={telefone}
              onChange={(event) => setTelefone(formatarTelefone(event.target.value))}
              className="w-full font-sans text-sm text-dark-brown border border-salmon/40 rounded-lg px-4 py-3 bg-white/80 mb-5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-salmon/40 focus:border-salmon/60"
            />

            <button
              type="button"
              onClick={handleEnviar}
              disabled={!isValid}
              className={cn(
                "w-full font-sans font-bold text-base text-white rounded-xl py-3.5 transition-all duration-200",
                isValid
                  ? "bg-salmon shadow-[0_10px_30px_rgba(196,134,122,0.45)] hover:bg-salmon/90 hover:shadow-[0_14px_36px_rgba(196,134,122,0.55)] hover:-translate-y-0.5 cursor-pointer"
                  : "bg-salmon/40 cursor-not-allowed"
              )}
            >
              Quero falar com a Dra. Camilla →
            </button>

            <p className="text-center font-sans text-xs text-brown/70 mt-3">
              Resposta em até 5 min · Dados protegidos pela LGPD
            </p>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-10 text-center shadow-[0_8px_40px_rgba(74,46,38,0.1)] border border-salmon/20">
            <p className="text-4xl mb-3" aria-hidden="true">
              🌸
            </p>
            <h3 className="font-['Georgia',serif] text-xl font-bold text-dark-brown mb-2">
              Tudo certo, {nome.split(" ")[0]}!
            </h3>
            <p className="font-sans text-sm text-brown leading-relaxed">
              Estamos te levando ao WhatsApp da Dra. Camilla. Se não abrir
              automaticamente,{" "}
              <a href={waLink} target="_blank" rel="noreferrer" className="text-salmon font-semibold underline">
                toque aqui
              </a>
              .
            </p>
          </div>
        )}

        <p className="text-center font-sans text-xs text-brown/80 mt-6">
          ✦ Mais de 500 mulheres já prepararam o corpo com o método ✦
        </p>
      </section>

      {/* ─── FOOTER SIMPLES ─────────────────────────────────────────── */}
      <footer className="text-center mt-14 px-6">
        <p className="font-sans text-xs text-brown/50">Dra. Camilla Freitas · CRF/PE 4563</p>
      </footer>
    </main>
  );
}
