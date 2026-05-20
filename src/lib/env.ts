export const siteConfig = {
  checkoutUrl: process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "#",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  whatsappMessage:
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    "Olá! Tenho interesse no programa Gerando Milagres da Dra. Camilla Freitas 🌸",
} as const;

export function whatsappUrl(): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;
}
