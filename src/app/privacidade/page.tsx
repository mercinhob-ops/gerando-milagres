import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade — Gerando Milagres",
  description:
    "Como o site Gerando Milagres trata dados de navegação, de campanhas e de compras realizadas pela Kiwify.",
  robots: { index: true, follow: true },
};

const UPDATED_AT = "1º de outubro de 2026";

const sections = [
  {
    title: "1. Quem somos",
    body: [
      "Este site apresenta os conteúdos educativos da marca Gerando Milagres, criados por Camilla Freitas, farmacêutica (CRF/PE 4563). Esta política explica quais dados são tratados quando você navega pelo site e como você pode exercer seus direitos previstos na Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).",
    ],
  },
  {
    title: "2. Dados que podem ser tratados",
    body: [
      "Dados de navegação: páginas visitadas, botões clicados, tipo de dispositivo e navegador, endereço IP e identificadores de cookies, coletados por ferramentas de medição como o Pixel da Meta e a API de Conversões da Meta.",
      "Parâmetros de campanha presentes no endereço da página (por exemplo, utm_source, utm_campaign, src, sck e fbclid), usados para entender de qual anúncio ou canal você veio.",
      "Dados que você informar voluntariamente, como nome e número de WhatsApp em formulários de contato do site.",
    ],
  },
  {
    title: "3. Compras e pagamentos",
    body: [
      "As compras são processadas pela plataforma Kiwify. Os dados de pagamento (como cartão de crédito) são informados diretamente no ambiente da Kiwify e não são recebidos nem armazenados por este site. O tratamento desses dados segue também a política de privacidade da Kiwify.",
      "O acesso aos conteúdos adquiridos é liberado pela Kiwify, na área de membros vinculada ao e-mail utilizado na compra.",
    ],
  },
  {
    title: "4. Para que usamos os dados",
    body: [
      "Medir o desempenho das páginas e dos anúncios, entender quais conteúdos são mais úteis, melhorar a experiência de navegação e responder contatos que você iniciar.",
    ],
  },
  {
    title: "5. Compartilhamento",
    body: [
      "Os dados podem ser compartilhados apenas com os fornecedores necessários para o funcionamento do site e das vendas: Meta (medição de anúncios), Kiwify (pagamentos e entrega dos conteúdos) e o provedor de hospedagem do site. Não vendemos dados pessoais.",
    ],
  },
  {
    title: "6. Cookies",
    body: [
      "Você pode bloquear ou apagar cookies nas configurações do seu navegador. Isso pode limitar a medição de campanhas, mas não impede a navegação pelo site.",
    ],
  },
  {
    title: "7. Seus direitos",
    body: [
      "Nos termos do art. 18 da LGPD, você pode solicitar confirmação do tratamento, acesso, correção, anonimização, portabilidade ou eliminação dos seus dados, além de informações sobre compartilhamento e revogação de consentimento.",
      "Para exercer seus direitos, entre em contato pelo WhatsApp +55 (81) 98139-6005.",
    ],
  },
  {
    title: "8. Atualizações",
    body: [
      "Esta política pode ser atualizada para refletir mudanças no site ou na legislação. A data da última atualização aparece no topo desta página.",
    ],
  },
] as const;

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-cream px-5 py-14 md:py-20">
      <article className="max-w-2xl mx-auto bg-white rounded-3xl border border-nude-dark/40 shadow-sm px-6 py-10 md:px-12 md:py-14">
        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-salmon">Gerando Milagres</p>
        <h1 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown mt-2">
          Política de Privacidade
        </h1>
        <p className="font-sans text-sm text-gray-500 mt-2">Última atualização: {UPDATED_AT}</p>

        <div className="mt-8 space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-sans text-base md:text-lg font-bold text-dark-brown">{s.title}</h2>
              <div className="mt-2 space-y-3">
                {s.body.map((p) => (
                  <p key={p} className="font-sans text-[15px] text-gray-700 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-nude-dark/30">
          <Link href="/" className="font-sans text-sm text-brown underline underline-offset-4 hover:text-dark-brown">
            Voltar ao site
          </Link>
        </div>
      </article>
    </main>
  );
}
