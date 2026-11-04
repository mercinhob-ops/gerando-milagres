/**
 * Conteúdo da página /preparoparaengravidar (redesign).
 *
 * Regras de copy (não remover):
 * - Não prometer gravidez, aumento de chances nem resultados clínicos.
 * - Sem urgência artificial, depoimentos inventados, números de vendas,
 *   porcentagens, descontos, parcelamento, prazo de garantia ou plataforma
 *   de entrega não confirmados.
 * - Respostas dos quizzes: acolhimento e organização, nunca diagnóstico ou
 *   recomendação clínica individual. As escolhas não são salvas nem enviadas.
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
    headline: "Você decidiu engravidar. Mas ninguém te explicou por onde começar.",
    subheadline:
      "Entre aplicativos, vitaminas, exames e conselhos da internet, é fácil se sentir perdida. O Preparo para Engravidar ajuda você a organizar os cuidados antes do positivo, com informação, clareza e participação do casal.",
    highlights: ["Seis etapas em ordem", "Materiais de aplicação", "Pensado para o casal"],
    format: "Guia digital e materiais de aplicação",
    access: "Material digital · forma de acesso a confirmar",
    accessConfirmed: "Material digital",
    ctaLabel: "Quero organizar minha preparação",
    unavailableLabel: "Compra disponível em breve",
    provisionalPrice: "preço provisório",
    authorName: "Camilla Freitas",
    authorRole: "Farmacêutica · CRF/PE 4563",
  },
  quizStart: {
    eyebrow: "Para começar",
    question: "O que mais te deixa insegura na preparação para engravidar?",
    hint: "Escolha uma opção. Sua resposta não é salva nem enviada.",
    continueLabel: "Continuar",
    options: [
      {
        id: "ciclo",
        label: "Não entendo bem meu ciclo.",
        response:
          "Você não está sozinha nessa dúvida. Entender o ciclo vai além da previsão do aplicativo — por isso o guia dedica uma etapa inteira às fases do ciclo e aos sinais do corpo, explicados de forma simples.",
      },
      {
        id: "suplementos",
        label: "Tenho dúvidas sobre suplementos.",
        response:
          "Faz sentido se sentir insegura com tantas indicações diferentes. A etapa “Suplementação sem achismo” ajuda você a pensar no assunto com critério e a levar as perguntas certas para o seu profissional de saúde.",
      },
      {
        id: "habitos",
        label: "Não sei quais hábitos observar.",
        response:
          "Você não precisa mudar a vida inteira. O guia ajuda a identificar quais hábitos observar e a planejar ajustes possíveis para a sua rotina, um passo de cada vez.",
      },
      {
        id: "comeco",
        label: "Não sei por onde começar.",
        response:
          "Você não precisa ter todas as respostas agora. O guia começa justamente aí: um ponto de partida claro para organizar prioridades sem se sobrecarregar.",
      },
    ],
  },
  identification: {
    eyebrow: "Talvez você já tenha pensado isso",
    heading: "Pensamentos de quem quer se preparar — e se sente perdida",
    thoughts: [
      "Meu aplicativo mostra a janela fértil, mas será que eu entendo meu ciclo?",
      "Vejo tantas pessoas falando sobre suplementos que fico sem saber o que realmente importa.",
      "Quero me preparar, mas parece que preciso mudar minha vida inteira.",
      "E meu parceiro? Será que essa preparação também envolve ele?",
    ],
    closing:
      "Se algum desses pensamentos parece seu, você não está fazendo nada de errado. O que costuma faltar é um caminho organizado.",
  },
  perspective: {
    eyebrow: "Uma nova forma de olhar",
    heading: "Você não precisa fazer tudo de uma vez. Precisa de um caminho.",
    text: "A preparação para engravidar envolve frentes que se conectam. Quando você enxerga cada uma delas, fica mais fácil decidir o próximo passo — sem pressa e sem culpa.",
    pillars: [
      { title: "Saúde pré-concepcional", text: "Os cuidados gerais que valem uma conversa com seus profissionais de saúde antes da gestação." },
      { title: "Conhecimento do ciclo", text: "Entender as fases e os sinais do seu corpo além do que o aplicativo mostra." },
      { title: "Hábitos", text: "Rotina, alimentação e sono: o que observar e ajustar no seu ritmo." },
      { title: "Suplementação responsável", text: "Critério e orientação profissional antes de qualquer compra." },
      { title: "Participação do casal", text: "A preparação é dos dois — e o parceiro também tem o seu papel." },
    ],
  },
  steps: {
    eyebrow: "Por dentro do guia",
    heading: "Seis etapas, uma de cada vez",
    text: "Toque em cada etapa para ver o que ela organiza. O conteúdo final está em produção.",
    panelLabel: "Nesta etapa você vai",
    materialLabel: "Material de apoio",
    items: [
      {
        title: "Por onde começar",
        text: "Um retrato do seu momento: o que você já sabe, o que ainda gera dúvida e o que merece prioridade.",
        points: [
          "Mapear o que você já faz e o que ainda é dúvida",
          "Definir prioridades sem tentar mudar tudo de uma vez",
          "Separar informação confiável de ruído",
        ],
        material: "checklist",
      },
      {
        title: "Entenda seu ciclo",
        text: "As fases do ciclo e os sinais do corpo explicados de forma simples, para ir além da previsão do aplicativo.",
        points: [
          "Conhecer as fases do ciclo menstrual",
          "Observar e registrar os sinais do seu corpo",
          "Levar suas anotações para a conversa com seu profissional de saúde",
        ],
        material: "diario-ciclo",
      },
      {
        title: "Alimentação e hábitos",
        text: "Rotina, alimentação, sono e outros hábitos do dia a dia que merecem atenção na fase de preparação.",
        points: [
          "Identificar os hábitos que você quer observar",
          "Planejar ajustes possíveis para a sua rotina",
          "Acompanhar sua evolução sem culpa nem radicalismo",
        ],
        material: "mapa-habitos",
      },
      {
        title: "Suplementação sem achismo",
        text: "Como pensar sobre suplementos com critério — e por que a orientação profissional vem antes de qualquer compra.",
        points: [
          "Entender por que não existe receita única para todas",
          "Reconhecer promessas exageradas",
          "Preparar perguntas sobre suplementação para a sua consulta",
        ],
        material: "roteiro-consulta",
      },
      {
        title: "E ele?",
        text: "A preparação é do casal: como incluir o parceiro nas conversas, nos cuidados e nas decisões.",
        points: [
          "Conversar sobre a preparação como um projeto a dois",
          "Entender quais cuidados também cabem a ele",
          "Dividir responsabilidades de forma prática",
        ],
        material: "guia",
      },
      {
        title: "Seu plano antes do positivo",
        text: "Tudo o que você organizou nas etapas anteriores reunido em um plano claro de próximos passos.",
        points: [
          "Reunir suas prioridades em um só lugar",
          "Definir próximos passos com seu parceiro",
          "Levar um plano organizado para seus profissionais de saúde",
        ],
        material: "plano-final",
      },
    ],
  },
  howItWorks: {
    eyebrow: "Como funciona",
    heading: "Três movimentos simples",
    items: [
      { title: "Conheça os cuidados gerais", text: "Leia cada etapa no seu ritmo e entenda o que merece atenção antes da gestação." },
      { title: "Registre suas observações e dúvidas", text: "Use o diário, o checklist e o mapa de hábitos para anotar o que você percebe e o que quer perguntar." },
      {
        title: "Organize seus próximos passos",
        text: "Monte seu plano com seu parceiro e leve suas perguntas para os seus profissionais de saúde.",
      },
    ],
  },
  materials: {
    eyebrow: "O que está incluído",
    heading: "Um guia e materiais para colocar em prática",
    text: "Os materiais foram planejados para acompanhar cada etapa do guia.",
    pendingLabel: "Em produção",
    readyLabel: "Incluído",
    coverPending: "Capa em produção",
    pendingNotice: "Os materiais estão em produção. As capas e páginas reais serão exibidas aqui quando estiverem prontas.",
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
  quizMoment: {
    eyebrow: "Para você",
    question: "Em qual momento você está?",
    hint: "Escolha uma opção. Sua resposta não é salva nem enviada.",
    continueLabel: "Ver quem criou o guia",
    options: [
      {
        id: "planejando",
        label: "Ainda estou planejando começar.",
        response:
          "Começar antes das tentativas é um bom momento para se organizar. O guia ajuda você a conhecer os cuidados gerais e a montar seu plano com calma.",
      },
      {
        id: "tentando",
        label: "Já comecei a tentar.",
        response:
          "O guia ajuda você a organizar informações, registrar observações e preparar perguntas para o seu profissional de saúde — que é quem pode avaliar o seu caso.",
      },
      {
        id: "parceiro",
        label: "Quero envolver mais meu parceiro.",
        response:
          "A etapa “E ele?” foi pensada para isso: trazer o parceiro para as conversas e os cuidados, transformando a preparação em um projeto a dois.",
      },
      {
        id: "duvidas",
        label: "Preciso organizar minhas dúvidas.",
        response:
          "Organizar as dúvidas já é um passo importante. O Roteiro para Consulta e o Plano Final de Preparação ajudam você a reunir perguntas e próximos passos em um só lugar.",
      },
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
  trust: {
    eyebrow: "Credibilidade",
    heading: "Transparência antes de qualquer promessa",
    text: "Este guia não usa promessas de resultado nem depoimentos inventados. A confiança vem de informação responsável e de quem está por trás do conteúdo.",
    items: [
      { title: "Responsável identificada", text: "Camilla Freitas, farmacêutica com registro profissional CRF/PE 4563." },
      { title: "Conteúdo educativo", text: "Informação organizada para apoiar suas decisões — sem diagnóstico, prescrição ou tratamento individual." },
      { title: "Profissional de saúde no centro", text: "O guia prepara você para conversar melhor com seus profissionais de saúde, nunca para substituí-los." },
      { title: "Amostras reais", text: "As páginas reais dos materiais serão exibidas nesta página assim que estiverem prontas." },
    ],
    testimonialsHeading: "Quem já usou",
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
        question: "Para quem é o guia?",
        answer:
          "Para mulheres que estão planejando engravidar ou já começaram a tentar e querem organizar a preparação com mais clareza — e para casais que desejam participar juntos.",
      },
      {
        question: "Serve para quem já tenta há meses?",
        answer:
          "Sim. O guia ajuda a organizar informações e cuidados. Ele não substitui uma avaliação: se as tentativas já duram um tempo, converse com seu médico sobre a investigação adequada.",
      },
      {
        question: "Meu parceiro também pode participar?",
        answer:
          "Sim. Há uma etapa dedicada ao papel dele na preparação, e o conteúdo pode ser lido e aplicado pelo casal.",
      },
      {
        question: "Preciso comprar suplementos?",
        answer:
          "Não. O guia não exige a compra de nenhum produto. Ele explica como pensar sobre suplementação com critério, e qualquer suplemento deve ser avaliado com um profissional de saúde.",
      },
      {
        question: "Qual a diferença entre o guia e uma consulta?",
        answer:
          "A consulta avalia o seu caso individualmente. O guia é educativo: não oferece diagnóstico nem tratamento, mas ajuda você a chegar à consulta mais organizada, com suas observações e perguntas em mãos.",
      },
      {
        id: "delivery",
        question: "Como o material será entregue?",
        answer: "O material é digital. A forma de acesso será informada nesta página antes da abertura das vendas.",
      },
      {
        id: "guarantee",
        question: "Tem garantia?",
        answer: "As condições de garantia serão informadas nesta página antes da abertura das vendas.",
      },
    ],
  },
  finalCta: {
    heading: "Seu próximo passo não precisa ser mais uma pesquisa sem direção.",
    text: "Comece organizando sua preparação com mais clareza, informação e participação do casal.",
  },
  buyBar: {
    unavailableLabel: "Em breve",
  },
} as const;
