export function StreakIndicator({ streak }: { streak: number }) {
  if (streak === 0) {
    return (
      <p className="font-sans text-sm text-brown/60 text-center">
        Registre hoje para começar sua sequência de cuidado. 🌱
      </p>
    );
  }

  const colorClass = streak >= 7 ? "text-[#B8860B]" : streak >= 3 ? "text-salmon" : "text-brown";

  return (
    <p className={`font-sans text-sm font-semibold text-center ${colorClass}`}>
      🔥 {streak} {streak === 1 ? "dia seguido" : "dias seguidos"} de registro! Continue assim!
    </p>
  );
}
