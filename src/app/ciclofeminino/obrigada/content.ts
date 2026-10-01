/**
 * Copy da página final /ciclofeminino/obrigada.
 *
 * A cliente pode ter comprado só o produto inicial ou também uma/ambas as
 * ofertas: nada aqui afirma quais produtos ela tem.
 * Sem preços, sem nova oferta, sem consulta/agendamento, sem WhatsApp ou
 * outros canais. Próximo passo: acessar o conteúdo pelo e-mail da Kiwify.
 *
 * As etapas são listas de dados para que novas etapas do funil possam ser
 * adicionadas depois sem reconstruir a página.
 */
export const obrigadaContent = {
  meta: { title: "Pronto! Próximos passos — Ciclo Feminino" },

  hero: {
    eyebrow: "Pronto 💛",
    headline: "Seu próximo passo agora é acessar o seu conteúdo.",
    text: "Seu material será disponibilizado pela Kiwify na área de membros vinculada ao e-mail utilizado na compra.",
  },

  /** Usado somente se membersAreaUrl for configurada em ./config.ts. */
  membersCtaLabel: "ACESSAR MINHA ÁREA DE MEMBROS",

  nextSteps: {
    heading: "O que fazer agora",
    steps: [
      { title: "Verifique o e-mail usado na compra." },
      { title: "Procure a mensagem de acesso enviada pela Kiwify." },
      { title: "Entre na área de membros e comece pelo conteúdo que você adquiriu." },
    ],
    note: "Se não encontrar o e-mail imediatamente, confira também as abas Promoções, Atualizações e Spam.",
  },

  message: {
    heading: "Uma mensagem da Camilla para você",
    paragraphs: [
      "Eu sei que, quando existe o desejo de engravidar, cada ciclo pode carregar expectativa, dúvidas e até frustração. Por isso, quero que você use esses conteúdos não para cobrar ainda mais do seu corpo, mas para começar a compreendê-lo melhor.",
      "Conhecimento é uma parte da preparação. E quando chegar o momento de olhar para aquilo que é específico da sua história, uma avaliação individualizada faz toda a diferença.",
    ],
    signature: {
      name: "Camilla Freitas",
      lines: [
        "Farmacêutica · CRF/PE 4563",
        "Pós-graduada em Fertilidade · atuação especializada em fertilidade do casal",
      ],
    },
  },

  closing: {
    heading: "Esse não precisa ser mais um ciclo vivido no automático.",
    text: "Observe. Aprenda. Registre. E, principalmente, comece a compreender sua jornada com mais consciência.",
  },

} as const;
