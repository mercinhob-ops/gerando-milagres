import { getEnvironment } from "@/config/environment";

const env = getEnvironment();

export const siteConfig = {
  checkoutUrl: env.NEXT_PUBLIC_CHECKOUT_URL ?? "",
  whatsappNumber: env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
} as const;

export function createWhatsappUrl(message: string) {
  const sanitizedNumber = siteConfig.whatsappNumber.replace(/\D/g, "");
  const target = sanitizedNumber || "5500000000000";

  return `https://wa.me/${target}?text=${encodeURIComponent(message)}`;
}
