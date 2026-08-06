export const ENCOURAGEMENT_MESSAGES = [
  "🌸 Mais um dia de cuidado com você. Continue firme!",
  "✨ Cada registro é um passo mais perto do seu milagre.",
  "💛 Você está no caminho certo. Confie no processo.",
  "🌿 Seu corpo é sábio. Você está aprendendo a ouvi-lo.",
  "🙏 Fé e ciência juntas — você está no lugar certo.",
];

export function randomEncouragement() {
  return ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)];
}

export function EncouragementToast({
  message,
  visible,
}: {
  message: string | null;
  visible: boolean;
}) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="pointer-events-auto bg-white border border-salmon/30 shadow-[0_8px_24px_rgba(107,66,57,0.18)] rounded-2xl px-5 py-3 max-w-sm text-center">
        <p className="font-sans text-sm font-semibold text-brown">{message}</p>
      </div>
    </div>
  );
}
