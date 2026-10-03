import Image from "next/image";
import { cn } from "@/lib/utils";
import type { FunnelCoverImage } from "@/config/funnels/ciclo-feminino";

const TONES = {
  dark: "from-[#6B4239] to-[#4A2E26] text-white",
  salmon: "from-[#C4867A] to-[#6B4239] text-white",
  light: "from-[#E8D0C0] to-[#D4B5A0] text-dark-brown",
} as const;

/**
 * Capa de produto do funil.
 * - Com `image` (arte oficial em /public): mostra a arte inteira, sem
 *   cortar nem distorcer, com width/height reais (sem CLS).
 * - Sem `image`: capa tipográfica na identidade do funil (não é placeholder
 *   técnico; é a apresentação definitiva até a arte existir).
 */
export function ProductCover({
  title,
  image,
  eyebrow,
  tone = "dark",
  className,
  sizes = "(max-width: 768px) 50vw, 320px",
  titleClassName,
}: {
  title: string;
  image?: FunnelCoverImage | null;
  eyebrow?: string;
  tone?: keyof typeof TONES;
  className?: string;
  sizes?: string;
  titleClassName?: string;
}) {
  if (image) {
    return (
      <div className={cn("overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5", className)}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          className="block h-auto w-full"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={title}
      data-product-cover="typographic"
      className={cn(
        "relative aspect-[3/4] rounded-xl bg-gradient-to-br shadow-lg ring-1 ring-black/5 p-3 md:p-4 flex flex-col justify-between overflow-hidden",
        TONES[tone],
        className
      )}
    >
      <span className="font-sans text-[8px] md:text-[10px] font-bold uppercase tracking-widest opacity-70">
        {eyebrow ?? "Gerando Milagres"}
      </span>
      <span className={cn("font-['Georgia',serif] font-bold leading-tight", titleClassName ?? "text-sm md:text-lg")}>
        {title}
      </span>
      <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-widest opacity-70">Camilla Freitas</span>
    </div>
  );
}
