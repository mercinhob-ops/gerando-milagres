/**
 * Conteúdo da página /ciclofeminino.
 *
 * Narrativa: "quero engravidar" → "preciso compreender minha fertilidade" →
 * "meu ciclo e os sinais do meu corpo são o primeiro lugar a observar" →
 * "este material me ajuda a começar" → compra.
 *
 * Regras: sem promessa de gravidez, cura ou resultado biológico; sinais
 * corporais nunca apresentados como diagnóstico ou confirmação de ovulação;
 * sem mencionar próximos produtos, preços ou upsell.
 *
 * Itens que começam com "[CONFIRMAR" ou "[COPY" são pendências e aparecem
 * com contorno tracejado na página.
 */
export const cicloFemininoContent = {
  meta: {
    title: "Ciclo Feminino Descomplicado — Dra. Camilla Freitas",
    description:
      "Para mulheres que desejam engravidar: aprenda a reconhecer os sinais do seu ciclo e compreender melhor sua janela fértil.",
  },

  hero: {
    eyebrow: "Para mulheres que desejam engravidar",
    headline:
      "Se você está tentando engravidar, conhecer seus dias férteis não deveria depender apenas da previsão de um aplicativo.",
    subheadline:
      "Aprenda a reconhecer os sinais do seu ciclo, compreender melhor sua janela fértil e dê o primeiro passo para uma preparação mais consciente na sua jornada em busca do positivo.",
    ctaLabel: "QUERO COMEÇAR MINHA PREPARAÇÃO",
    author: "Dra. Camilla Freitas · CRF/PE 4563",
  },

  identification: {
    heading:
      "Talvez você esteja tentando acertar o dia. Mas ainda não aprendeu a interpretar o seu próprio corpo.",
    intro: "Se a sua rotina de tentante se parece com isso:",
    items: [
      "Abrir o aplicativo para descobrir quando “deveria” estar ovulando",
      "Contar os dias do ciclo no calendário",
      "Esperar a próxima menstruação com o coração apertado",
      "Tentar adivinhar qual é o seu período fértil",
      "Ficar em dúvida se realmente ovulou neste mês",
      "Perceber mudanças no corpo e não saber o que elas significam",
    ],
    conclusionLead: "Seu corpo pode apresentar sinais ao longo do ciclo.",
    conclusion: "O problema é que muitas mulheres nunca aprenderam quais sinais observar.",
  },

  belief: {
    eyebrow: "Uma crença que precisa cair",
    heading: "Fertilidade é muito mais do que contar 14 dias.",
    text:
      "Nem todo ciclo segue a conta de calendário. Compreender o seu ciclo envolve conhecer as fases pelas quais ele passa e aprender a observar sinais que o seu corpo pode dar ao longo do mês.",
    signals: [
      { title: "Fases do ciclo", desc: "O que muda em cada etapa do mês." },
      { title: "Muco cervical", desc: "Como observar as mudanças ao longo do ciclo." },
      { title: "Temperatura basal", desc: "Como funciona a observação e o registro." },
    ],
    signalsNote: "E outras alterações explicadas no material.",
    quote: [
      "O aplicativo calcula.",
      "Seu corpo sinaliza.",
      "E aprender a observar esses sinais muda a forma como você entende o seu ciclo.",
    ],
  },

  transformation: {
    eyebrow: "A virada",
    heading: "O primeiro passo não é tentar adivinhar mais. É começar a entender.",
    pairs: [
      {
        before: "O aplicativo disse que hoje é meu período fértil.",
        after: "Agora eu sei quais sinais observar no meu corpo.",
      },
      {
        before: "Será que estou ovulando?",
        after: "Entendo melhor as mudanças que podem acontecer próximo à ovulação.",
      },
      {
        before: "Todo mês parece uma nova tentativa no escuro.",
        after: "Comecei a registrar meu ciclo e observar padrões do meu próprio corpo.",
      },
    ],
  },

  learn: {
    eyebrow: "O que você vai aprender",
    heading: "Comece conhecendo aquilo que acontece dentro de você todos os meses.",
    items: [
      "Como funciona o ciclo menstrual",
      "Quais são as suas principais fases",
      "Sinais que podem aparecer próximos à ovulação",
      "Como observar o muco cervical",
      "Como funciona a observação da temperatura basal",
      "Ferramentas que podem ajudar no acompanhamento",
      "Como começar a mapear o seu próprio ciclo",
      "Uma proposta de acompanhamento por três meses",
      "Checklist de autoconhecimento do ciclo",
    ],
  },

  desire: {
    heading: "Porque o seu objetivo não é apenas entender o ciclo.",
    highlight: "O seu desejo é ver o positivo.",
    text:
      "E justamente por isso, aprender a compreender seu ciclo pode ser uma das primeiras etapas de uma jornada mais consciente de preparação.",
    turnLead: "Mas existe algo que você precisa saber desde agora:",
    turn: "fertilidade não depende apenas do dia da ovulação.",
    piece: "Seu ciclo é uma peça dessa história.",
    closing:
      "Por isso, o Ciclo Feminino Descomplicado não pretende entregar uma promessa milagrosa. Ele foi criado para ajudar você a dominar uma das primeiras informações que precisa compreender: o funcionamento do seu próprio ciclo.",
  },

  product: {
    eyebrow: "O seu primeiro passo",
    subtitle:
      "O primeiro passo para sair da tentativa no escuro e começar a compreender melhor os sinais do seu ciclo.",
    mediaLabel: "[Imagem: mockup Ciclo Feminino Descomplicado]",
    note: "Pagamento único",
    ctaLabel: "QUERO ENTENDER MELHOR MEU CORPO",
  },

  // Somente informações já existentes no projeto (src/data/camilla.ts e páginas publicadas).
  specialist: {
    eyebrow: "Quem está por trás deste caminho",
    name: "Dra. Camilla Freitas",
    role: "Farmacêutica · CRF/PE 4563",
    quote: "Eu sei o que é olhar para um resultado negativo e sentir o chão sumir.",
    text:
      "Camilla viveu a jornada da tentante por dentro, incluindo a perda de gestações. Como farmacêutica, passou a estudar a fertilidade com os olhos de quem conhece essa dor e criou o método Gerando Milagres a partir dessa vivência.",
  },

  journey: {
    heading: "Esse é o começo. Não o fim da sua preparação.",
    text:
      "Compreender o seu ciclo é uma etapa importante. Ao longo da jornada, outros fatores ligados à sua saúde e à preparação para a fertilidade podem precisar ser compreendidos de forma individual, porque cada corpo e cada história são únicos.",
  },

  finalOffer: {
    heading: "Antes de tentar interpretar mais um ciclo no escuro, aprenda o que observar.",
    ctaLabel: "QUERO DAR O PRIMEIRO PASSO",
  },

  faq: {
    eyebrow: "Dúvidas frequentes",
    heading: "Perguntas que talvez você tenha",
    items: [
      {
        question: "É somente para quem está tentando engravidar?",
        answer:
          "Não. O material foi pensado principalmente para quem deseja engravidar e quer começar entendendo o próprio ciclo, mas qualquer mulher que queira conhecer melhor as fases e os sinais do seu corpo pode aproveitar o conteúdo.",
      },
      {
        question: "Preciso entender de ciclo menstrual para acompanhar?",
        answer:
          "Não. O conteúdo começa pelo básico, explicando como o ciclo funciona e quais são as suas fases, antes de chegar à observação dos sinais e ao registro do seu próprio ciclo.",
      },
      {
        question: "Vou aprender a reconhecer sinais relacionados ao período fértil?",
        answer:
          "Sim. Você vai conhecer sinais que podem aparecer próximos à ovulação, como as mudanças no muco cervical e na temperatura basal, e como começar a observá-los e registrá-los. Esses sinais ajudam você a entender melhor o seu ciclo, mas não substituem exames nem confirmam a ovulação com certeza.",
      },
      {
        question: "Isso substitui uma avaliação profissional?",
        answer:
          "Não. O material ajuda você a compreender o seu ciclo, mas não faz diagnóstico nem substitui a avaliação individual com um profissional de saúde, que continua essencial para investigar a sua fertilidade.",
      },
      {
        question: "Como vou receber o material?",
        answer:
          "[CONFIRMAR: formato do material (PDF, área de membros Kiwify etc.) e como o acesso é enviado após a compra]",
      },
    ],
  },

  footerWhatsappMessage:
    "Olá! Tenho interesse no Ciclo Feminino Descomplicado da Dra. Camilla Freitas 🌸",
} as const;
