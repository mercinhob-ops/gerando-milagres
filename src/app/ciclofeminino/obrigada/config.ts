/**
 * Configuração da página final /ciclofeminino/obrigada.
 *
 * `membersAreaUrl`: URL pública da área de membros da Kiwify (opcional).
 * Enquanto for `null`, a página orienta o acesso pelo e-mail enviado pela
 * Kiwify e NÃO exibe botão — nenhum link falso é criado.
 */
export const obrigadaConfig = {
  membersAreaUrl: null as string | null,
} as const;

export function getMembersAreaUrl(): string | null {
  const url = obrigadaConfig.membersAreaUrl;
  return typeof url === "string" && url.startsWith("https://") ? url : null;
}
