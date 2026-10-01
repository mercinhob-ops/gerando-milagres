# Funil 01 — Ciclo Feminino

Configuração central: `src/config/funnels/ciclo-feminino.ts` (produtos, preços, checkouts, rotas).
Copy provisória: `src/app/ciclofeminino/content.ts` e o objeto `content` de cada oferta.
Todo texto `[COPY: …]` aparece com contorno tracejado até ser substituído.

## Rotas

| Etapa | Rota | Produto | Preço |
|---|---|---|---|
| Entrada | `/ciclofeminino` | Ciclo Feminino Descomplicado | R$ 39,90 |
| Upsell 01 | `/ciclofeminino/oferta-especial` | Ciclos Desbloqueados | R$ 67,00 |
| Oferta 02 | `/ciclofeminino/suplementacao` | Suplementação Inteligente para Fertilidade Feminina | R$ 47,90 |
| Final | `/ciclofeminino/obrigada` | — | — |

## Pendências de checkout (Kiwify)

| Produto | Campo | Status |
|---|---|---|
| Ciclo Feminino Descomplicado | `checkoutUrl` | **falta o link** |
| Ciclos Desbloqueados | `checkoutUrl` | **confirmar** `pay.kiwify.com.br/AQyRq5m` (nome confere; preço e descrição não) |
| Ciclos Desbloqueados | `oneClickTriggerId` | **falta** id do gerador de upsell |
| Suplementação Inteligente | `checkoutUrl` | **falta o link** |
| Suplementação Inteligente | `oneClickTriggerId` | **falta** id do gerador de upsell |

Ao preencher `checkoutUrl`, mude `checkoutStatus` para `"confirmed"`.
Enquanto estiver `"pending"`, o botão aparece inativo com "CHECKOUT PENDENTE" e o header fixo fica oculto.
Nenhuma etapa usa `NEXT_PUBLIC_CHECKOUT_URL` (checkout global).

## Redirecionamentos — configurar na Kiwify (não no frontend)

Kiwify → Produtos → [produto] → Configurações → "Página de obrigado e upsell"
→ ativar "Esse produto tem uma página de obrigado personalizada ou upsell".

| Produto (Kiwify) | URL a cadastrar |
|---|---|
| Ciclo Feminino Descomplicado (R$ 39,90) | `https://gerandomilagres.com.br/ciclofeminino/oferta-especial` |
| Ciclos Desbloqueados (R$ 67) — oferta do funil | `https://gerandomilagres.com.br/ciclofeminino/suplementacao` |
| Suplementação Inteligente (R$ 47,90) | `https://gerandomilagres.com.br/ciclofeminino/obrigada` |

Botões de 1 clique: no mesmo painel, "gerador de upsell".
- Na página `/oferta-especial`: gerar o botão para a oferta Ciclos Desbloqueados → copiar o id do botão de aceitar (`kiwify-upsell-trigger-XXXX`) para `ciclosDesbloqueados.oneClickTriggerId`.
- Na página `/suplementacao`: idem para Suplementação → `suplementacao.oneClickTriggerId`.
- Se o código gerado tiver campos de URL de recusa/próxima etapa, usar `/ciclofeminino/suplementacao` (recusa do upsell 01) e `/ciclofeminino/obrigada` (recusa da oferta 02).

O site carrega `https://kiwify-snippets.netlify.app/upsell/upsell.min.js` só quando há `?token=` na URL e o id está configurado.
Sem token (acesso direto, ou caminho sem 1 clique), "aceitar" abre o checkout normal do produto.
"Recusar" sempre vai para a próxima etapa e repassa `token` e UTMs.

Limitações da Kiwify:
- O upsell de 1 clique e a página de obrigado personalizada só valem para **cartão e Pix aprovado**. Boleto e Pix gerado (não pago) ficam na página padrão da Kiwify — esse comprador não entra no funil de ofertas.
- A página de obrigado é por **produto**. Se o Ciclos Desbloqueados do funil for o mesmo produto vendido em `/desbloqueandociclos`, quem comprar lá também será mandado para `/ciclofeminino/suplementacao`. Usar um produto/oferta separado para o funil.
- Teste: abrir a página de upsell com `?token=123`.

## Tracking (Pixel + CAPI, mesmo `eventID`)

| Evento | Tipo | Onde |
|---|---|---|
| `ViewContent` | padrão | carregar `/ciclofeminino` |
| `InitiateCheckout` | padrão | clique no CTA da entrada / aceitar sem 1 clique |
| `UpsellView` | custom | carregar oferta 01 e 02 |
| `UpsellAccept` | custom | clique em aceitar |
| `UpsellDecline` | custom | clique em recusar |

Todos levam `value`, `currency`, `content_name`, `content_ids`, `funnel_id`, `funnel_step`.
**Purchase não é disparado pelo site.** Fonte confiável: integração de Pixel/CAPI nativa da Kiwify em cada produto (ou webhook server-side, ainda não existe no repositório).
