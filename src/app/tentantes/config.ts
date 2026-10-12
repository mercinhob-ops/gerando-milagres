import type { TentantesConfig } from "@/components/tentantes/TentantesBase";

export const tentantesConfig: TentantesConfig = {
  page: "tentantes",
  storageKey: "tentantes_lead",
  contentName: "Material Tentantes",
  materialUrl: "https://drive.google.com/file/d/1-hYOOYsaGRkt3jfs8KmiJ1eXA3f0WYpE/view?usp=sharing",
  texts: {
    intro: {
      title: "Vamos entender a sua jornada para engravidar?",
      subtitle: "Responda {total} perguntas rápidas e receba o material da Dra. Camilla para tentantes.",
      start: "Começar →",
    },
    nav: {
      back: "← Voltar",
      next: "Próximo →",
      skip: "Pular",
      questionLabel: "Pergunta {numero}",
      multiHint: "Você pode marcar mais de uma opção.",
    },
    questions: {
      nome: { title: "Qual é o seu nome completo?", placeholder: "Seu nome completo" },
      whatsapp: { title: "Qual é o seu WhatsApp com DDD?", placeholder: "(81) 99999-9999" },
      idade: {
        title: "Qual é a sua idade?",
        options: { "ate-30": "Até 30 anos", "31-35": "31 a 35 anos", "36-39": "36 a 39 anos", "40-mais": "40 anos ou mais" },
      },
      tempoTentando: {
        title: "Há quanto tempo vocês tentam engravidar?",
        options: {
          "menos-6-meses": "Menos de 6 meses",
          "6-meses-1-ano": "6 meses a 1 ano",
          "1-2-anos": "1 a 2 anos",
          "mais-2-anos": "Mais de 2 anos",
        },
      },
      exames: {
        title: "Vocês já fizeram exames de fertilidade?",
        options: {
          normal: "Sim, e está tudo normal",
          "encontraram-algo": "Sim, e encontraram algo",
          "nao-fizemos": "Ainda não fizemos",
          tratamento: "Já faço tratamento (indutor, IIU ou FIV)",
        },
      },
      identificado: {
        title: "O que foi identificado?",
        options: {
          sop: "SOP (Síndrome dos Ovários Policísticos)",
          endometriose: "Endometriose",
          "baixa-reserva": "Baixa reserva ovariana",
          "fator-masculino": "Fator masculino",
          tireoide: "Tireoide",
          outro: "Outro",
          "prefiro-nao-dizer": "Prefiro não dizer",
        },
      },
      marido: {
        title: "O seu marido está envolvido nessa jornada?",
        options: {
          "muito-presente": "Sim, muito presente",
          "mais-ou-menos": "Mais ou menos",
          "nao-conversamos": "Ainda não conversamos sobre isso",
        },
      },
      perda: {
        title: "Vocês já tiveram alguma perda gestacional?",
        options: {
          nao: "Não",
          "1-vez": "Sim, 1 vez",
          "2-ou-mais": "Sim, 2 ou mais vezes",
          "prefiro-nao-responder": "Prefiro não responder",
        },
      },
      preocupacao: {
        title: "O que mais te preocupa hoje?",
        options: {
          idade: "A idade",
          "nao-sei-investigar": "Não saber o que investigar",
          "tentei-de-tudo": "Já tentei de tudo",
          emocional: "O lado emocional",
          marido: "O envolvimento do meu marido",
        },
      },
      inicio: {
        title: "Quando você quer começar?",
        options: {
          agora: "Agora, estou pronta",
          "proximos-meses": "Nos próximos meses",
          pesquisando: "Ainda estou pesquisando",
        },
      },
      investimento: {
        title: "Quanto você pode investir por mês no cuidado com a sua fertilidade?",
        options: {
          "ate-100": "Até R$100",
          "100-300": "Entre R$100 e R$300",
          "300-600": "Entre R$300 e R$600",
          "acima-600": "Acima de R$600",
        },
      },
    },
    errors: {
      nome: "Digite o seu nome completo, por favor.",
      whatsapp: "Digite um WhatsApp válido, com DDD.",
      single: "Selecione uma opção para continuar.",
      multi: "Selecione pelo menos uma opção.",
      lgpd: "Para receber o material, marque a autorização acima.",
    },
    lgpd: {
      title: "Falta só a sua autorização",
      consent:
        "Autorizo a Dra. Camilla Freitas a entrar em contato comigo pelo WhatsApp informado. Meus dados serão usados apenas para esse fim, conforme a LGPD.",
      submit: "Enviar e receber o material →",
    },
    final: {
      title: "Pronto, {nome}! 🌸",
      subtitle: "O seu material já está liberado.",
      download: "Baixar o material",
      strongTitle: "Vamos olhar o seu caso juntas?",
      strongText: "Me chama no WhatsApp e me conta um pouco mais da sua história.",
      strongButton: "Falar com a Dra. Camilla no WhatsApp →",
      lightText: "Se quiser tirar alguma dúvida sobre a sua jornada, a Dra. Camilla está no WhatsApp.",
      lightLink: "Falar no WhatsApp",
    },
    whatsapp: {
      greeting: "Olá, Dra. Camilla! Sou {nome}.",
      tempo: "Estamos tentando engravidar há: {tempo}.",
      identificado: "Nos exames foi identificado: {itens}.",
      strongClosing: "Quero que você olhe o meu caso.",
      lightClosing: "Baixei o material para tentantes e gostaria de conversar.",
    },
  },
};
