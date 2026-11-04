/**
 * Conteúdo da página /preparoparaengravidar.
 *
 * Regras de copy (não remover):
 * - Não prometer gravidez, aumento de chances nem resultados clínicos.
 * - Sem urgência artificial, depoimentos, prazo de garantia, plataforma de
 *   entrega ou condições comerciais não confirmadas.
 * - Materiais ainda em produção nunca aparecem como prontos (o estado vem de
 *   src/config/funnels/preparo-para-engravidar.ts).
 * - Credenciais: somente "Farmacêutica · CRF/PE 4563" (sem "Dra." — decisão
 *   documentada em docs/funil-ciclo-feminino.md).
 */

export const PREVIEW_NOTICE = "Pré-lançamento — preço, materiais e condições de compra ainda em definição.";

export const preparoParaEngravidarContent = {
  meta: {
    title: "Preparo para Engravidar | Guia prático — Gerando Milagres",
    description:
      "Organize sua preparação para a gravidez com clareza: entenda seu ciclo, observe os hábitos que importam e inclua seu parceiro. Guia prático de Camilla Freitas.",
  },
  hero: {
    eyebrow: "Guia prático de preparação para a gravidez",
    headline: "Você decidiu que quer engravidar. Mas por onde começar?",
    subheadline:
      "Ovulação, alimentação, vitaminas, exames… Em vez de juntar informações soltas, siga um caminho prático para organizar sua preparação, entender seu ciclo, observar os hábitos que importam e incluir seu parceiro.",
    highlights: [
      "Seu ciclo explicado de forma simples",
      "Hábitos e suplementação com critério",
      "Um plano a dois, antes do positivo",
    ],
    format: "Guia digital e materiais de aplicação",
    access: "Material digital · forma de acesso a confirmar",
    ctaLabel: "Quero organizar minha preparação",
    unavailableLabel: "Compra disponível em breve",
    provisionalPrice: "preço provisório",
    authorName: "Camilla Freitas",
    authorRole: "Farmacêutica · CRF/PE 4563",
  },
  identification: {
    eyebrow: "Talvez você se reconheça",
    heading: "A vontade é clara. O caminho, nem sempre.",
    items: [
      "Você acompanha o ciclo por aplicativo, mas não entende de verdade o que cada fase significa.",
      "Pesquisa sobre suplementos e encontra recomendações que se contradizem.",
      "Não sabe quais hábitos merecem atenção antes da gestação.",
      "Sente que toda a preparação está nas suas costas, enquanto o parceiro fica de fora.",
    ],
    closing:
      "Se alguma dessas situações parece familiar, você não está sozinha — e não está fazendo nada de errado. O que costuma faltar é um caminho organizado.",
  },
  perspective: {
    eyebrow: "Uma nova forma de olhar",
    heading: "Você não precisa fazer tudo de uma vez. Precisa de um caminho em ordem.",
    text: "A preparação para engravidar envolve quatro frentes que se conectam. Quando você enxerga cada uma delas, fica mais fácil decidir o próximo passo — sem pressa e sem culpa.",
    pillars: [
      { title: "Saúde", text: "Saber quais pontos levar para a conversa com seus profissionais de saúde." },
      { title: "Hábitos", text: "Rotina, alimentação e sono: o que vale observar antes da gestação." },
      { title: "Conhecimento do ciclo", text: "Entender os sinais do seu corpo além do que o aplicativo mostra." },
      { title: "Participação do casal", text: "A preparação é dos dois — e o parceiro também tem o seu papel." },
    ],
  },
  guide: {
    eyebrow: "Conheça o guia",
    heading: "Seis etapas para organizar sua preparação",
    text: "Cada etapa prepara a seguinte. Assim, cada informação encontra o seu lugar e faz sentido na sua rotina.",
    steps: [
      { title: "Por onde começar", text: "Um ponto de partida claro para definir prioridades sem se sobrecarregar." },
      { title: "Entenda seu ciclo", text: "As fases do ciclo e os sinais do seu corpo explicados de forma simples." },
      { title: "Alimentação e hábitos", text: "Os hábitos do dia a dia que merecem atenção na fase de preparação." },
      {
        title: "Suplementação sem achismo",
        text: "Como pensar sobre suplementos com critério — e por que conversar com um profissional antes de começar.",
      },
      { title: "E ele?", text: "Como incluir o parceiro e quais cuidados também cabem a ele." },
      { title: "Seu plano antes do positivo", text: "Tudo reunido em um plano organizado para os seus próximos passos." },
    ],
  },
  materials: {
    eyebrow: "Materiais de aplicação",
    heading: "Para sair da leitura e colocar em prática",
    text: "Além do guia, o produto foi planejado com materiais de apoio para aplicar cada etapa no seu dia a dia.",
    pendingLabel: "Em produção",
    readyLabel: "Incluído",
    pendingNotice: "Os materiais estão em produção. As páginas reais serão exibidas aqui quando estiverem prontas.",
    /** Descrição de cada material, pela `id` da configuração central. */
    descriptions: {
      guia: "As seis etapas da preparação, em linguagem simples e em ordem.",
      checklist: "Os primeiros pontos para organizar sua preparação sem se sobrecarregar.",
      "diario-ciclo": "Um espaço para registrar os sinais do seu corpo ao longo do ciclo.",
      "mapa-habitos": "Uma visão dos hábitos que você quer observar e ajustar no dia a dia.",
      "roteiro-consulta": "Perguntas e informações para levar à sua consulta.",
      "plano-final": "Seus próximos passos reunidos em um só lugar.",
    } as Record<string, string>,
  },
  audience: {
    eyebrow: "Para quem é",
    heading: "Feito para quem quer se preparar com mais clareza",
    forItems: [
      "Mulheres que estão planejando engravidar e querem começar com organização.",
      "Tentantes que precisam colocar em ordem tudo o que já leram e ouviram.",
      "Casais que desejam participar juntos da preparação.",
    ],
    notTitle: "O que este guia não faz",
    notItems: [
      "Não substitui consulta nem acompanhamento profissional.",
      "Não oferece diagnóstico nem tratamento individualizado.",
      "Não promete gravidez nem resultados clínicos.",
    ],
  },
  specialist: {
    eyebrow: "Quem criou o guia",
    name: "Camilla Freitas",
    credentials: ["Farmacêutica · CRF/PE 4563"],
    paragraphs: [
      "Camilla Freitas é farmacêutica e atua com suplementação e saúde pré-concepcional.",
      "No Preparo para Engravidar, ela organiza esse conhecimento em um caminho prático, com linguagem simples e respeito ao momento de cada mulher.",
    ],
  },
  offer: {
    eyebrow: "Sua preparação, organizada",
    summary: "Um guia em seis etapas e materiais de aplicação para você organizar sua preparação com mais clareza.",
    includesTitle: "O que está planejado",
    note: "Conteúdo final, forma de entrega e condições de pagamento serão confirmados antes da abertura das vendas.",
  },
  faq: {
    heading: "Perguntas frequentes",
    items: [
      {
        question: "Serve para quem ainda não começou a tentar?",
        answer:
          "Sim. O guia foi pensado justamente para quem está planejando e quer começar a preparação com organização, antes das tentativas.",
      },
      {
        question: "Serve para quem já tenta há meses?",
        answer:
          "Sim. Se você já está tentando, o guia ajuda a organizar informações e cuidados. Ele não substitui uma avaliação: se as tentativas já duram um tempo, converse com seu médico sobre a investigação adequada.",
      },
      {
        question: "Preciso comprar suplementos?",
        answer:
          "Não. O guia não exige a compra de nenhum produto. Ele explica como pensar sobre suplementação com critério, e qualquer suplemento deve ser avaliado com um profissional de saúde.",
      },
      {
        question: "Meu parceiro também pode utilizar?",
        answer:
          "Sim. Há uma etapa dedicada ao papel dele na preparação, e o conteúdo pode ser lido e aplicado pelo casal.",
      },
      {
        question: "Substitui uma consulta?",
        answer:
          "Não. O conteúdo é educativo e não oferece diagnóstico nem tratamento. O roteiro para consulta existe justamente para ajudar você a aproveitar melhor o encontro com seu profissional de saúde.",
      },
      {
        question: "Como receberei o material?",
        answer: "O material é digital. A forma de acesso será informada nesta página antes da abertura das vendas.",
      },
    ],
  },
  finalCta: {
    heading: "Sua preparação pode começar com mais clareza.",
    text: "Organize suas dúvidas, compreenda os cuidados importantes e dê os próximos passos com mais informação e tranquilidade.",
  },
} as const;
