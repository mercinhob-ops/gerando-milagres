export const methodPillars = [
  {
    slug: "alimentacao",
    title: "Alimentação",
    description:
      "Protocolos anti-inflamatórios personalizados que criam o ambiente interno ideal para a fertilidade, reduzindo os gatilhos que bloqueiam a ovulação.",
  },
  {
    slug: "sono",
    title: "Sono",
    description:
      "O sono regula os hormônios reprodutivos diretamente. Estratégias práticas para restaurar ciclos de descanso que o corpo fértil precisa.",
  },
  {
    slug: "suplementacao",
    title: "Suplementação",
    description:
      "Protocolo científico com os micronutrientes certos, nas doses certas — sem desperdício de dinheiro em suplementos que não fazem diferença.",
  },
  {
    slug: "stress",
    title: "Gerenciamento do Stress",
    description:
      "Stress crônico eleva o cortisol e suprime a progesterona. Técnicas validadas para quebrar esse ciclo e restaurar o equilíbrio hormonal.",
  },
  {
    slug: "atividade",
    title: "Atividade Física",
    description:
      "O movimento certo — nem de menos, nem de mais. Exercícios que apoiam a fertilidade sem sobrecarregar o sistema endócrino.",
  },
] as const;

export type MethodPillar = (typeof methodPillars)[number];
