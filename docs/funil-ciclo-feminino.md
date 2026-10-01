# Funil 01 — Ciclo Feminino

Fonte de verdade: `src/config/funnels/ciclo-feminino.ts` (produtos, preços, checkouts, IDs Kiwify, próxima etapa, capas).
Copy: `src/app/ciclofeminino/**/content.ts`. URL divulgada em anúncios/bio: **somente** `https://gerandomilagres.com.br/ciclofeminino`.

## Mapa técnico

```
TRÁFEGO
↓
/ciclofeminino                       (pública, index/follow, canonical)
Ciclo Feminino Descomplicado · R$ 39,90 · checkout aktchfx
↓ Kiwify — página de obrigado do produto (configurada na Kiwify)
/ciclofeminino/oferta-especial       (noindex)
Ciclos Desbloqueados · R$ 67 · 1-click AQyRq5m
↓ aceite ou recusa → data-upsell-url / data-downsell-url (script oficial)
/ciclofeminino/suplementacao         (noindex)
Suplementação para a Fertilidade da Mulher · R$ 47,90 · 1-click Ttiul2X
↓ aceite ou recusa → data-upsell-url / data-downsell-url (script oficial)
/ciclofeminino/obrigada              (noindex)
```

| Etapa | Produto | Preço | Checkout | 1 clique (aceite / recusa) | Próxima etapa |
|---|---|---|---|---|---|
| Entrada | Ciclo Feminino Descomplicado | 39,90 | `pay.kiwify.com.br/aktchfx` | — | Kiwify → `/ciclofeminino/oferta-especial` |
| Upsell 1 | Ciclos Desbloqueados | 67,00 | `pay.kiwify.com.br/AQyRq5m` (fallback) | `kiwify-upsell-trigger-AQyRq5m` / `kiwify-upsell-cancel-trigger-AQyRq5m` | `/ciclofeminino/suplementacao` |
| Upsell 2 | Suplementação para a Fertilidade da Mulher | 47,90 | `pay.kiwify.com.br/Ttiul2X` (fallback) | `kiwify-upsell-trigger-Ttiul2X` / `kiwify-upsell-cancel-trigger-Ttiul2X` | `/ciclofeminino/obrigada` |

## Integração Kiwify (1 clique)

Componente: `src/components/funnel/upsell-actions.tsx`.

- **Com contexto** (`?token=` na URL — o sinal que a Kiwify envia ao redirecionar após a compra e que a própria documentação usa para teste, `?token=123`) **e** IDs configurados: a página renderiza a **marcação oficial do gerador** (container `kiwify-upsell-<código>` com `data-upsell-url`/`data-downsell-url`, `<button id="kiwify-upsell-trigger-…">`, `<div id="kiwify-upsell-cancel-trigger-…">`) via `innerHTML` — React não controla esses nós — e carrega **uma vez** `https://snippets.kiwify.com/upsell-v2/upsell.min.js` (`next/script`, `id="kiwify-upsell-v2"`). Cobrança e redirecionamento (aceite e recusa) são da Kiwify.
- `data-upsell-url` = `data-downsell-url` = origem atual + próxima etapa + parâmetros de atribuição, **sem** `token` (o script anexa o próprio contexto ao redirecionar — evitar token duplicado).
- Cores do botão: variáveis CSS do script (`--kiwify-upsell-accept-bg:#C4867A` etc.) + estilo base da marca sem `!important` (o CSS do script prevalece quando carrega).
- **Sem contexto** (acesso direto) ou **se o script falhar ao carregar** (`onError`): aceitar abre o checkout oficial do produto com UTMs; recusar segue para a próxima etapa com token/UTMs. A página nunca quebra.
- A detecção usa apenas a presença de `token`; não bloqueia o script quando o contexto existe.

## Parâmetros preservados (`src/lib/funnel-params.ts`)

| Transição | Preservados | Observação |
|---|---|---|
| LP → checkout aktchfx (3 CTAs + header fixo) | utm_source, utm_medium, utm_campaign, utm_content, utm_term, src, sck, fbclid | Sem `token`; chaves já existentes no destino não são sobrescritas nem duplicadas |
| Kiwify → upsell 1 | o que a Kiwify enviar (`token` documentado) | UTMs após o checkout dependem da Kiwify — verificar na compra teste |
| Upsell (1 clique) → próxima | URLs data-* levam os de atribuição; o script anexa o contexto | |
| Upsell (fallback) → checkout | atribuição | sem `token` |
| Upsell (fallback) recusa → próxima | `token` + atribuição | |
| Qualquer outro parâmetro | descartado | ex.: `foo` |

## Eventos Meta por etapa

Pixel (browser) + CAPI (`/api/meta-conversions`) com o **mesmo eventID** (`trackConversionEvent`). `custom_data`: `value`, `currency: BRL`, `content_name`, `content_ids`, `content_type`, `product`, `step`, `funnel_id`.

| Página | Evento | Tipo | Quando |
|---|---|---|---|
| todas | PageView | padrão | script do Pixel (layout global), 1x por carregamento |
| /ciclofeminino | ViewContent (39,90, step `entry`) | padrão | ao carregar, após o Pixel existir (espera até 4 s) |
| /ciclofeminino | InitiateCheckout (39,90) | padrão | clique em CTA (header fixo: evento do componente global, só `value`) |
| oferta-especial | UpsellView / UpsellAccept / UpsellDecline (67, `upsell-1`) | custom (`trackCustom`) | carregar / aceitar / recusar |
| suplementacao | UpsellView / UpsellAccept / UpsellDecline (47,90, `upsell-2`) | custom | carregar / aceitar / recusar |
| upsell (fallback) | + InitiateCheckout | padrão | só quando aceitar abre checkout comum |
| /obrigada | — | — | **nenhum** evento de conversão |

Proteções: ref por montagem + janela de deduplicação de 1,5 s (Strict Mode, remount, clique duplo) em `src/lib/funnel-tracking.ts`. Nenhum `preventDefault` — o script da Kiwify não é afetado.

## Política de Purchase

- **Nunca** no frontend; **nunca** pela visita a `/obrigada` (URL pública, não prova pagamento, valor varia).
- Fonte confiável, escolher **uma**:
  1. **Pixel/CAPI nativo da Kiwify** em cada produto (recomendado agora: não exige código).
  2. **Webhook Kiwify → `/api/webhooks/kiwify`** — infraestrutura criada e **desligada** (503 sem `KIWIFY_WEBHOOK_ENABLED=true`; 501 enquanto a verificação não existir). A documentação pública da Kiwify lista os gatilhos (`compra_aprovada`…) mas não publica payload nem verificação de autenticidade. Falta implementar `verifyKiwifyDelivery` e o mapeamento payload → `ConfirmedKiwifySale` com o contrato oficial.
- `src/lib/kiwify-purchase.ts`: `buildPurchaseEvent` gera **um Purchase por transação confirmada**, com o valor real (39,90 / 67 / 47,90 — nada é somado), `event_id = kiwify-purchase-<orderId>` (retentativas não duplicam), e-mail/telefone com SHA-256 (via `meta-conversions-server.ts`), `action_source: system_generated` (sem user agent do comprador o Meta não aceita `website`).
- **Não usar 1 e 2 ao mesmo tempo no mesmo Pixel** (IDs diferentes → Purchase em dobro).

## Variáveis de ambiente (Netlify)

| Variável | Onde | Uso |
|---|---|---|
| `NEXT_PUBLIC_META_PIXEL_ID` | público | Pixel |
| `META_CONVERSIONS_TOKEN` | **servidor** | CAPI (sem ele `/api/meta-conversions` responde 503) |
| `KIWIFY_WEBHOOK_ENABLED`, `KIWIFY_WEBHOOK_TOKEN` | servidor | só ao ativar o webhook |

## Imagens

| Produto | Caminho esperado | Uso | Recomendado |
|---|---|---|---|
| Ciclo Feminino Descomplicado | `public/images/ciclofeminino/ciclo-feminino-descomplicado.png` → `coverImage: "/images/ciclofeminino/ciclo-feminino-descomplicado.png"` | card do produto na LP | PNG transparente, 1200×1600 (3:4) |
| Suplementação para a Fertilidade da Mulher | `public/images/ciclofeminino/suplementacao-fertilidade-feminina.png` | card da oferta 2 | idem |

Sem arte, as páginas usam capa tipográfica (`ProductCover`). Ciclos Desbloqueados: capas tipográficas dos 3 materiais.

## Configuração externa ainda necessária

- Kiwify: página de obrigado do produto **aktchfx** → `https://gerandomilagres.com.br/ciclofeminino/oferta-especial`.
- Kiwify: confirmar que as ofertas 1 clique AQyRq5m e Ttiul2X estão ativas para cartão e Pix.
- Kiwify: checkout comum de AQyRq5m é o mesmo de `/desbloqueandociclos` — a página de obrigado desse produto afeta quem compra por lá.
- Meta: escolher a fonte de Purchase (nativo Kiwify **ou** webhook).
- Netlify: `NEXT_PUBLIC_META_PIXEL_ID` e `META_CONVERSIONS_TOKEN`.
- Área de membros: `src/app/ciclofeminino/obrigada/config.ts` → `membersAreaUrl` (opcional; sem ela a página orienta pelo e-mail da Kiwify).

## Checklist de QA (compra real, cartão e Pix)

| # | Cenário | Esperado |
|---|---|---|
| 1 | Compra 39,90 → aceita 67 → aceita 47,90 | 3 cobranças; chega em /obrigada; 3 Purchases (fonte escolhida) |
| 2 | Compra → aceita 67 → recusa 47,90 | 2 cobranças; /obrigada |
| 3 | Compra → recusa 67 → aceita 47,90 | 2 cobranças; /obrigada (validar se o token segue válido na 2ª oferta) |
| 4 | Compra → recusa 67 → recusa 47,90 | 1 cobrança; /obrigada |
| 5 | Abrir oferta-especial direto | modo checkout, CTA para AQyRq5m, recusa → suplementacao |
| 6 | Abrir suplementacao direto | modo checkout, CTA para Ttiul2X, recusa → obrigada |
| 7 | Abrir /obrigada direto | só PageView; nenhum Purchase |

Verificar também: botões no estilo da marca com o CSS oficial carregado; UTMs no relatório de vendas da Kiwify; eventos deduplicados no Gerenciador de Eventos; reembolso das compras de teste.
