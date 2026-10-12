import type { TentantesConfig } from "@/components/tentantes/TentantesBase";

/** Versão com linguagem simples e acessível (palavras curtas, sem termos médicos). */
export const tentante2Config: TentantesConfig = {
  page: "tentante2",
  storageKey: "tentante2_lead",
  contentName: "Material Tentante 2",
  materialUrl: "https://drive.google.com/file/d/1GaIyWbWukU_ISG3Sw-14J3nxq1k8fFUF/view?usp=sharing",
  texts: {
    intro: {
      title: "Me conta um pouco sobre você 🌸",
      subtitle: "São {total} perguntas rápidas. No final, você ganha um material da Dra. Camilla.",
      start: "Começar →",
    },
    nav: {
      back: "← Voltar",
      next: "Próximo →",
      skip: "Pular",
      questionLabel: "Pergunta {numero}",
      multiHint: "Pode marcar mais de uma.",
    },
    questions: {
      nome: { title: "Qual é o seu nome completo?", placeholder: "Seu nome completo" },
      whatsapp: { title: "Qual é o seu WhatsApp? (ex: 81 99999-9999)", placeholder: "81 99999-9999" },
      idade: {
        title: "Qual é a sua idade?",
        options: { "ate-30": "Até 30", "31-35": "31 a 35", "36-39": "36 a 39", "40-mais": "40 ou mais" },
      },
      tempoTentando: {
        title: "Faz quanto tempo que vocês tentam ter um bebê?",
        options: {
          "menos-6-meses": "Menos de 6 meses",
          "6-meses-1-ano": "6 meses a 1 ano",
          "1-2-anos": "1 a 2 anos",
          "mais-2-anos": "Mais de 2 anos",
        },
      },
      exames: {
        title: "Vocês já foram ao médico para ver se tem algum problema?",
        options: {
          normal: "Sim, o médico disse que está tudo bem",
          "encontraram-algo": "Sim, encontraram alguma coisa",
          "nao-fizemos": "Ainda não fomos ao médico",
          tratamento: "Já estou em tratamento médico",
        },
      },
      identificado: {
        title: "O que o médico encontrou?",
        options: {
          sop: "Ovário policístico (SOP)",
          endometriose: "Endometriose",
          "baixa-reserva": "Poucos óvulos (reserva baixa)",
          "fator-masculino": "Problema no esperma do marido",
          tireoide: "Problema na tireoide",
          outro: "Outra coisa",
          "prefiro-nao-dizer": "Prefiro não falar",
        },
      },
      marido: {
        title: "Seu marido está junto nessa caminhada?",
        options: {
          "muito-presente": "Sim, ele me apoia muito",
          "mais-ou-menos": "Às vezes sim, às vezes não",
          "nao-conversamos": "A gente ainda não falou muito sobre isso",
        },
      },
      perda: {
        title: "Você já perdeu alguma gravidez?",
        options: {
          nao: "Não",
          "1-vez": "Sim, 1 vez",
          "2-ou-mais": "Sim, 2 ou mais vezes",
          "prefiro-nao-responder": "Prefiro não responder",
        },
      },
      preocupacao: {
        title: "O que mais te deixa preocupada?",
        options: {
          idade: "Minha idade",
          "nao-sei-investigar": "Não saber o que fazer",
          "tentei-de-tudo": "Já fiz muita coisa e nada funcionou",
          emocional: "Minha cabeça e meu coração",
          marido: "O meu marido não está muito envolvido",
        },
      },
      inicio: {
        title: "Quando você quer dar o próximo passo?",
        options: {
          agora: "Agora, quero começar logo",
          "proximos-meses": "Daqui a alguns meses",
          pesquisando: "Ainda estou pensando",
        },
      },
      investimento: {
        title: "Quanto você consegue gastar por mês com sua saúde?",
        options: {
          "ate-100": "Até R$100",
          "100-300": "Entre R$100 e R$300",
          "300-600": "Entre R$300 e R$600",
          "acima-600": "Acima de R$600",
        },
      },
    },
    errors: {
      nome: "Escreva o seu nome completo.",
      whatsapp: "Confira o número. Coloque o DDD, como 81 99999-9999.",
      single: "Toque em uma resposta para seguir.",
      multi: "Toque em pelo menos uma resposta.",
      lgpd: "Para ver o material, marque o quadrinho acima.",
    },
    lgpd: {
      title: "Falta só uma coisa",
      consent: "Concordo que a Dra. Camilla pode me chamar no WhatsApp para me ajudar. Meus dados ficam só com ela.",
      submit: "Enviar e receber o material →",
    },
    final: {
      title: "Pronto, {nome}! Seu material está aqui 🌸",
      subtitle: "É só tocar no botão abaixo.",
      download: "Baixar o material",
      strongTitle: "A Dra. Camilla quer te ajudar! Chama ela no WhatsApp 💛",
      strongText: "Toque no botão e mande a sua mensagem. Ela já está escrita.",
      strongButton: "Chamar a Dra. Camilla no WhatsApp →",
      lightText: "Ficou com alguma dúvida? A Dra. Camilla pode te ajudar pelo WhatsApp.",
      lightLink: "Chamar no WhatsApp",
    },
    whatsapp: {
      greeting: "Oi, Dra. Camilla! Sou {nome}.",
      tempo: "A gente tenta ter um bebê faz: {tempo}.",
      identificado: "O médico encontrou: {itens}.",
      strongClosing: "Quero a sua ajuda.",
      lightClosing: "Peguei o material e quero conversar.",
    },
  },
};
