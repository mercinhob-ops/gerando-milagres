"use client";

export function CookieBanner({ onAccept }: { onAccept: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Aviso de cookies e privacidade"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#D4B5A0] shadow-lg"
    >
      <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-sans text-sm text-gray-600 text-center sm:text-left">
          Usamos cookies para melhorar sua experiência e exibir conteúdo
          relevante. Ao continuar, você concorda com nossa{" "}
          <a
            href="#"
            className="text-[#6B4239] underline underline-offset-2 hover:text-[#4A2E26] transition-colors"
          >
            Política de Privacidade
          </a>
          .
        </p>
        <button
          onClick={onAccept}
          className="shrink-0 bg-[#C4867A] text-white font-sans font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-[#6B4239] active:bg-[#4A2E26] transition-colors"
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}
