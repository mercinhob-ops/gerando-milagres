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
  meta: { title: "Pronto. Agora é hora de começar — Ciclo Feminino" },

  hero: {
    eyebrow: "Pronto. Agora é hora de começar. 💛",
    headline: "Seu próximo passo é transformar informação em uma preparação mais consciente.",
    text: "Você acaba de dar um passo importante para compreender melhor o seu corpo e a sua fertilidade. Agora, em vez de tentar absorver tudo de uma vez, comece pelo material que escolheu e avance no seu ritmo.",
  },

  /** Usado somente se membersAreaUrl for configurada em ./config.ts. */
  membersCtaLabel: "ACESSAR MINHA ÁREA DE MEMBROS",

  nextSteps: {
    heading: "Seus próximos passos",
    steps: [
      { title: "Acesse sua área de membros da Kiwify." },
      { title: "Comece pelo material adquirido e percorra o conteúdo com calma." },
      { title: "Anote dúvidas, sinais do seu ciclo e pontos que gostaria de compreender melhor." },
      { title: "Lembre-se de que conteúdos educativos não substituem avaliação individual de saúde." },
    ],
    note: "O acesso é enviado pela Kiwify para o e-mail utilizado na compra. Se não encontrar a mensagem, confira também as abas Promoções, Atualizações e Spam.",
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
