type EnvironmentKey =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "NEXT_PUBLIC_SITE_URL"
  | "NEXT_PUBLIC_CHECKOUT_URL"
  | "NEXT_PUBLIC_WHATSAPP_NUMBER"
  | "NEXT_PUBLIC_META_PIXEL_ID"
  | "NEXT_PUBLIC_GA4_MEASUREMENT_ID";

type EnvironmentConfig = Partial<Record<EnvironmentKey, string>>;

const requiredPublicKeys: EnvironmentKey[] = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

function readEnvValue(key: EnvironmentKey) {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value : undefined;
}

export function getEnvironment(): EnvironmentConfig {
  return {
    NEXT_PUBLIC_SUPABASE_URL: readEnvValue("NEXT_PUBLIC_SUPABASE_URL"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: readEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    NEXT_PUBLIC_SITE_URL: readEnvValue("NEXT_PUBLIC_SITE_URL"),
    NEXT_PUBLIC_CHECKOUT_URL: readEnvValue("NEXT_PUBLIC_CHECKOUT_URL"),
    NEXT_PUBLIC_WHATSAPP_NUMBER: readEnvValue("NEXT_PUBLIC_WHATSAPP_NUMBER"),
    NEXT_PUBLIC_META_PIXEL_ID: readEnvValue("NEXT_PUBLIC_META_PIXEL_ID"),
    NEXT_PUBLIC_GA4_MEASUREMENT_ID: readEnvValue("NEXT_PUBLIC_GA4_MEASUREMENT_ID"),
  };
}

export function validateEnvironment(requiredKeys = requiredPublicKeys) {
  const env = getEnvironment();
  const missing = requiredKeys.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente obrigatórias ausentes: ${missing.join(", ")}.`);
  }

  return env;
}
