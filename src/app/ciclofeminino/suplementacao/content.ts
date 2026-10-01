/**
 * Copy da oferta /ciclofeminino/suplementacao (Suplementação para a Fertilidade da Mulher, R$ 47,90).
 *
 * A cliente chega aqui tendo ACEITADO ou RECUSADO o Ciclos Desbloqueados:
 * nada nesta página pressupõe a decisão anterior.
 * Função: aprofundar especificamente nutrientes e suplementação (não repetir
 * a visão ampla do Ciclos Desbloqueados).
 *
 * Regras: sem promessa de gravidez, positivo, cura, tratamento ou aumento
 * garantido de fertilidade; sem doses; somente os nutrientes do material;
 * sem vender consulta (apenas plantar a diferença entre informação geral e
 * avaliação individual); sem mencionar R$ 147.
 */
export const suplementacaoContent = {
  meta: { title: "Um último passo — Suplementação para a Fertilidade da Mulher" },

  hero: {
    eyebrow: "Um último passo antes de continuar",
    headline:
      "Quando o assunto é fertilidade, não basta saber que um nutriente é “bom”. É preciso entender o papel dele.",
    subheadline:
      "Conheça nutrientes frequentemente discutidos na preparação para a fertilidade feminina e entenda melhor por que suplementação não deveria começar apenas por indicação de internet.",
  },

  offer: {
    subtitle:
      "Um guia educacional específico sobre nutrientes e suplementação na preparação para a fertilidade feminina.",
    nutrientsLabel: "Nutrientes abordados no guia",
    nutrients: ["Metilfolato", "Vitamina B12", "Vitamina D3", "Mio-inositol", "CoQ10", "Vitamina E"],
    care:
      "O conteúdo também aborda cuidados, acompanhamento e a importância da avaliação profissional antes de iniciar qualquer suplemento.",
    priceNote: "Pagamento único",
    acceptLabel: "SIM, QUERO ENTENDER MELHOR A SUPLEMENTAÇÃO",
    declineLabel: "Não, obrigada. Quero continuar sem adicionar este material.",
  },

  belief: {
    heading: "“Toma isso porque ajuda a engravidar” não deveria ser toda a orientação que você recebe.",
    text:
      "Quando você começa a pesquisar sobre fertilidade, encontra listas de vitaminas, suplementos, fórmulas e recomendações que nem sempre combinam entre si.",
    intent:
      "Se você está se preparando para engravidar, faz sentido entender melhor aquilo que coloca no seu corpo. Este material ajuda você a compreender o assunto antes de simplesmente acumular suplementos.",
  },

  transformation: {
    pairs: [
      {
        before: "Vi alguém dizendo que isso é bom para fertilidade, então vou tomar.",
        after:
          "Quero primeiro compreender qual é o papel desse nutriente e por que meu caso precisa ser avaliado individualmente.",
      },
      {
        before: "Quanto mais suplementos, melhor.",
        after: "Suplementação precisa fazer sentido dentro da minha preparação.",
      },
    ],
  },

  bridge: {
    general: "Informação geral ensina o que existe.",
    individual: "Avaliação individual ajuda a entender o que faz sentido para você.",
    authorityName: "Camilla Freitas",
    authorityText:
      "Farmacêutica, CRF/PE 4563, pós-graduada em Fertilidade e com atuação especializada em fertilidade do casal.",
  },

  backToOffer: "Voltar para a oferta ↑",
} as const;
