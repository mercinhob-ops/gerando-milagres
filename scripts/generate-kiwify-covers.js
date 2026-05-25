// @ts-check
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ROOT = path.join(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "public/kiwify");

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const W = 1200;
const H = 628;

// Brand palette
const CREAM       = "#F0E6DC";
const SALMON      = "#C4867A";
const BROWN       = "#6B4239";
const NUDE_DARK   = "#D4B5A0";
const BROWN_MUTED = "#8B6355";

const products = [
  {
    filename:  "consulta-individual.jpg",
    label:     "CONSULTA INDIVIDUAL",
    title1:    "Protocolo exclusivo",
    title2:    "para o seu corpo",
    sub:       "Suplementação · Exames · Suporte WhatsApp",
    price:     "R$ 550",
    priceNote: "Consulta online · 1h a 1h30",
  },
  {
    filename:  "guia-5-pilares.jpg",
    label:     "GUIA RÁPIDO",
    title1:    "5 Pilares da",
    title2:    "Fertilidade",
    sub:       "PDF prático · Plano de 30 dias · Download imediato",
    price:     "R$ 47",
    priceNote: "Acesso vitalício ao PDF",
  },
  {
    filename:  "plano-coracao.jpg",
    label:     "PLANO CORAÇÃO",
    title1:    "Para o casal",
    title2:    "que sonha junto",
    sub:       "2 consultas · Protocolo masculino · 90 dias de suporte",
    price:     "R$ 1.650",
    priceNote: "Para dois · Economia de R$ 450",
  },
  {
    filename:  "acesso-30-dias.jpg",
    label:     "ACESSO LIMITADO",
    title1:    "Experimente",
    title2:    "por 30 dias",
    sub:       "2 módulos completos · Suporte incluso",
    price:     "R$ 97",
    priceNote: "Acesso por 30 dias",
  },
];

/**
 * Heart SVG path centered at (0,0), ~44×28 units.
 * At scale(s) the heart is 44s × 28s px.
 */
const HEART_PATH =
  "M 0 7 Q -4 0 -13 0 Q -22 0 -22 9 Q -22 18 0 28 Q 22 18 22 9 Q 22 0 13 0 Q 4 0 0 7 Z";

/**
 * @param {object} p
 * @param {string} p.label
 * @param {string} p.title1
 * @param {string} p.title2
 * @param {string} p.sub
 * @param {string} p.price
 * @param {string} p.priceNote
 */
function buildSvg({ label, title1, title2, sub, price, priceNote }) {
  // Badge pill sizing  (label is short uppercase string)
  const pillW = Math.max(label.length * 9 + 52, 170);
  const pillX = 600 - pillW / 2;

  // Layout Y positions (all text-anchor="middle" at x=600)
  const yHeart      = 50;   // heart transform origin (top of heart bumps)
  const yBrand      = 148;  // "GERANDO MILAGRES"
  const yAccentLine = 162;  // decorative accent lines
  const yBadgeTop   = 182;  // badge pill top
  const yBadgeH     = 34;   // badge pill height
  const yBadgeText  = yBadgeTop + yBadgeH / 2 + 5; // vertically centred text
  const yTitle1     = 274;  // title line 1 baseline
  const yTitle2     = 332;  // title line 2 baseline
  const ySub        = 366;  // subtitle baseline
  const yDivider    = 392;  // thin centre divider
  const yPrice      = 455;  // price baseline
  const yPriceNote  = 479;  // price note baseline
  const ySepLine    = 534;  // separator above footer
  const yFooter     = 564;  // credential footer

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="${CREAM}"/>

  <!-- Inner border (premium framing) -->
  <rect x="22" y="22" width="1156" height="584"
        rx="14" fill="none" stroke="${NUDE_DARK}" stroke-width="1"/>

  <!-- Heart icon — outline with light fill -->
  <g transform="translate(600, ${yHeart}) scale(2.6)">
    <path d="${HEART_PATH}"
          fill="${SALMON}" fill-opacity="0.13"
          stroke="${SALMON}" stroke-width="1"
          stroke-linejoin="round"/>
  </g>

  <!-- Brand name -->
  <text x="600" y="${yBrand}"
        font-family="Georgia, serif"
        font-size="11"
        fill="${SALMON}"
        text-anchor="middle"
        letter-spacing="6"
  >GERANDO MILAGRES</text>

  <!-- Accent lines flanking brand name -->
  <line x1="365" y1="${yAccentLine}" x2="495" y2="${yAccentLine}"
        stroke="${SALMON}" stroke-width="0.7" opacity="0.45"/>
  <line x1="705" y1="${yAccentLine}" x2="835" y2="${yAccentLine}"
        stroke="${SALMON}" stroke-width="0.7" opacity="0.45"/>

  <!-- Product label badge -->
  <rect x="${pillX}" y="${yBadgeTop}" width="${pillW}" height="${yBadgeH}"
        rx="${yBadgeH / 2}" fill="none"
        stroke="${SALMON}" stroke-width="1.2"/>
  <text x="600" y="${yBadgeText}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="11"
        fill="${SALMON}"
        text-anchor="middle"
        letter-spacing="3"
        font-weight="bold"
  >${label}</text>

  <!-- Title line 1 -->
  <text x="600" y="${yTitle1}"
        font-family="Georgia, serif"
        font-style="italic"
        font-size="56"
        fill="${BROWN}"
        text-anchor="middle"
  >${title1}</text>

  <!-- Title line 2 -->
  <text x="600" y="${yTitle2}"
        font-family="Georgia, serif"
        font-style="italic"
        font-size="56"
        fill="${BROWN}"
        text-anchor="middle"
  >${title2}</text>

  <!-- Subtitle -->
  <text x="600" y="${ySub}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="14.5"
        fill="${BROWN_MUTED}"
        text-anchor="middle"
        opacity="0.85"
  >${sub}</text>

  <!-- Centre divider -->
  <line x1="450" y1="${yDivider}" x2="750" y2="${yDivider}"
        stroke="${NUDE_DARK}" stroke-width="1"/>

  <!-- Price -->
  <text x="600" y="${yPrice}"
        font-family="Georgia, serif"
        font-size="52"
        fill="${BROWN}"
        font-weight="bold"
        text-anchor="middle"
  >${price}</text>

  <!-- Price note -->
  <text x="600" y="${yPriceNote}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="13"
        fill="${BROWN_MUTED}"
        text-anchor="middle"
        opacity="0.72"
  >${priceNote}</text>

  <!-- Footer separator -->
  <line x1="490" y1="${ySepLine}" x2="710" y2="${ySepLine}"
        stroke="${NUDE_DARK}" stroke-width="0.8" opacity="0.6"/>

  <!-- Credential footer -->
  <text x="600" y="${yFooter}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="11"
        fill="${BROWN}"
        text-anchor="middle"
        opacity="0.42"
        letter-spacing="1"
  >Camilla Freitas \xB7 Farmac\xEAutica CRF/PE 4563</text>

</svg>`;
}

async function main() {
  console.log("Gerando capas Kiwify — estilo minimalista premium (1200\xD7628) ...\n");

  for (const product of products) {
    const outputPath = path.join(OUTPUT_DIR, product.filename);
    const svgBuf = Buffer.from(buildSvg(product), "utf8");

    await sharp(svgBuf)
      .jpeg({ quality: 94 })
      .toFile(outputPath);

    const { size } = fs.statSync(outputPath);
    console.log(`✓ ${product.filename.padEnd(32)} ${(size / 1024).toFixed(0)} KB`);
  }

  console.log("\nPronto! Arquivos salvos em public/kiwify/");
}

main().catch((err) => {
  console.error("Erro:", err.message);
  process.exit(1);
});
