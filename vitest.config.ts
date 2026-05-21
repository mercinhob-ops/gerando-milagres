import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    env: {
      NEXT_PUBLIC_CHECKOUT_URL: "https://pay.kiwify.com.br/uOSEIEm",
      NEXT_PUBLIC_WHATSAPP_NUMBER: "5581981396005",
      NEXT_PUBLIC_WHATSAPP_MESSAGE: "Olá! Tenho interesse no programa Gerando Milagres da Dra. Camilla Freitas 🌸",
      NEXT_PUBLIC_META_PIXEL_ID: "123456789012345",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
