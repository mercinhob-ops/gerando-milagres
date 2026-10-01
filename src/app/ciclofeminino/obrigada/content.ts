/**
 * Copy da página final /ciclofeminino/obrigada.
 *
 * A cliente pode ter comprado só o produto inicial ou também uma/ambas as
 * ofertas: nada aqui afirma quais produtos ela tem.
 * Sem preços, sem nova oferta, sem consulta/agendamento, sem WhatsApp ou
 * outros canais. Único próximo passo: acessar a área de membros.
 *
 * As etapas são listas de dados para que novas etapas do funil possam ser
 * adicionadas depois sem reconstruir a página.
 */
export const obrigadaContent = {
  meta: { title: "Agora começa a sua preparação — Ciclo Feminino" },

  hero: {
    eyebrow: "Agora começa a sua preparação 💛",
    headline: "Você deu um passo importante: decidiu compreender melhor a sua própria jornada.",
    text:
      "O desejo pelo positivo pode trazer muitas perguntas. A partir de agora, a ideia é trocar parte da ansiedade por conhecimento, observação e uma preparação cada vez mais consciente.",
  },

  membersCtaLabel: "ACESSAR MINHA ÁREA DE MEMBROS",

  nextSteps: {
    heading: "O que fazer agora",
    steps: [
      {
        title: "Acesse sua área de membros",
        text: "Após a confirmação da compra, os conteúdos adquiridos ficam disponíveis conforme a liberação configurada na plataforma.",
      },
      {
        title: "Comece pelo seu primeiro material",
        text: "Não tente consumir tudo de uma vez. Comece entendendo o seu ciclo e observando aquilo que acontece no seu próprio corpo.",
      },
      {
        title: "Transforme informação em observação",
        text: "Faça anotações, registre seus ciclos e leve suas dúvidas para uma avaliação profissional quando precisar compreender aquilo que é específico do seu caso.",
      },
    ],
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

  footer: "Camilla Freitas · CRF/PE 4563 · Todos os direitos reservados",
} as const;
