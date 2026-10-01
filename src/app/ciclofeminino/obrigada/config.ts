/**
 * Configuração da página final /ciclofeminino/obrigada.
 *
 * TODO(kiwify): URL real da área de membros — será fornecida na etapa final
 * de integração do funil. Enquanto for `null`, os botões de acesso aparecem
 * inativos com a marcação "Link da área de membros pendente" e NÃO apontam
 * para nenhum destino.
 */
export const obrigadaConfig = {
  membersAreaUrl: null as string | null,
} as const;

export function getMembersAreaUrl(): string | null {
  const url = obrigadaConfig.membersAreaUrl;
  return typeof url === "string" && url.startsWith("https://") ? url : null;
}
