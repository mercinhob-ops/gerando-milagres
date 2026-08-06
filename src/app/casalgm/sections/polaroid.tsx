export function Polaroid({ className }: { className?: string }) {
  return (
    <div className={`bg-white p-2 pb-6 rounded-sm shadow-xl ${className ?? ""}`} aria-hidden="true">
      <div
        className="w-full aspect-square rounded-sm"
        style={{ background: "linear-gradient(135deg, #C4867A 0%, #E8D0C0 100%)" }}
      />
    </div>
  );
}
