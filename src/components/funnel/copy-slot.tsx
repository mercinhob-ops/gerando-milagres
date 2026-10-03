import { cn } from "@/lib/utils";

/**
 * Marca visualmente conteúdo provisório.
 * Qualquer texto que comece com "[COPY" é exibido com contorno tracejado
 * para ficar óbvio na revisão que ainda falta a copy definitiva.
 */
export function isPlaceholder(text: string) {
  return text.trimStart().startsWith("[COPY");
}

export function CopySlot({
  text,
  className,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "p" | "div";
}) {
  if (!isPlaceholder(text)) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag
      data-placeholder="copy"
      className={cn(
        className,
        "outline-2 outline-dashed outline-offset-4 outline-amber-500/70 rounded-sm"
      )}
    >
      {text}
    </Tag>
  );
}

/** Espaço reservado para imagem/mockup ainda não produzido. */
export function MediaPlaceholder({
  label,
  className,
  tone = "light",
}: {
  label: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      data-placeholder="media"
      role="img"
      aria-label={label}
      className={cn(
        "flex items-center justify-center text-center rounded-3xl border-2 border-dashed p-6",
        tone === "dark"
          ? "border-amber-400/60 bg-white/5 text-nude/80"
          : "border-amber-500/60 bg-cream text-brown/70",
        className
      )}
    >
      <span className="font-sans text-xs font-semibold uppercase tracking-widest">{label}</span>
    </div>
  );
}
