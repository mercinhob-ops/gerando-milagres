const TICKER_KEYFRAMES = `
  @keyframes marketing-ticker-scroll {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
`;

export function Ticker({ text }: { text: string }) {
  const repeated = `${text} `.repeat(4);

  return (
    <div
      className="relative border-y border-white/10 py-3 overflow-hidden"
      style={{ background: "linear-gradient(90deg, #4A2E26 0%, #6B4239 100%)" }}
    >
      <style>{TICKER_KEYFRAMES}</style>
      <div
        className="flex w-max whitespace-nowrap"
        style={{ animation: "marketing-ticker-scroll 24s linear infinite" }}
      >
        <span className="font-sans text-xs font-semibold tracking-widest text-nude/80 uppercase px-4">
          {repeated}
        </span>
        <span
          className="font-sans text-xs font-semibold tracking-widest text-nude/80 uppercase px-4"
          aria-hidden="true"
        >
          {repeated}
        </span>
      </div>
    </div>
  );
}
