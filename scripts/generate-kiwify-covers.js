// @ts-check
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ROOT = path.join(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public/images");
const OUTPUT_DIR = path.join(ROOT, "public/kiwify");

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const W = 1200;
const H = 628;

const products = [
  {
    filename: "consulta-individual.jpg",
    source: "camilla-hero.jpg",
    label: "CONSULTA INDIVIDUAL",
    title1: "Protocolo exclusivo",
    title2: "para o seu corpo",
    sub: "Suplementação · Exames · Suporte WhatsApp",
    price: "R$ 550",
  },
  {
    filename: "guia-5-pilares.jpg",
    source: "camilla-profile.jpg",
    label: "GUIA RÁPIDO",
    title1: "5 Pilares da",
    title2: "Fertilidade",
    sub: "PDF prático · Plano de 30 dias · Download imediato",
    price: "R$ 47",
  },
  {
    filename: "plano-coracao.jpg",
    source: "camilla-family.jpg",
    label: "PLANO CORAÇÃO",
    title1: "Para o casal",
    title2: "que sonha junto",
    sub: "2 consultas · Protocolo masculino · 90 dias de suporte",
    price: "R$ 1.650",
  },
  {
    filename: "acesso-30-dias.jpg",
    source: "camilla-story.jpg",
    label: "ACESSO LIMITADO",
    title1: "Experimente",
    title2: "por 30 dias",
    sub: "2 módulos completos · Suporte incluso",
    price: "R$ 97",
  },
];

/**
 * Builds the SVG overlay with brand colors and text layout.
 * @param {object} p
 * @param {string} p.label
 * @param {string} p.title1
 * @param {string} p.title2
 * @param {string} p.sub
 * @param {string} p.price
 */
function buildSvg({ label, title1, title2, sub, price }) {
  // Estimate pill width from price string length
  const pillW = price.length * 15 + 52;
  const pillCx = 60 + pillW / 2;

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Left-to-right dark overlay -->
    <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#4A2E26" stop-opacity="0.92"/>
      <stop offset="52%"  stop-color="#4A2E26" stop-opacity="0.55"/>
      <stop offset="78%"  stop-color="#4A2E26" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#4A2E26" stop-opacity="0"/>
    </linearGradient>
    <!-- Bottom vignette for credential readability -->
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.28"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#lg)"/>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Brand eyebrow -->
  <text
    x="60" y="62"
    font-family="Georgia, serif"
    font-size="11"
    fill="#F0E6DC"
    opacity="0.7"
    letter-spacing="5"
  >GERANDO MILAGRES</text>

  <!-- Salmon accent line -->
  <line x1="60" y1="74" x2="228" y2="74" stroke="#C4867A" stroke-width="1.5" opacity="0.7"/>

  <!-- Product label badge -->
  <text
    x="60" y="122"
    font-family="Arial, Helvetica, sans-serif"
    font-size="11"
    fill="#C4867A"
    font-weight="bold"
    letter-spacing="3"
  >${label}</text>

  <!-- Title line 1 -->
  <text
    x="60" y="240"
    font-family="Georgia, serif"
    font-style="italic"
    font-size="68"
    fill="#FFFFFF"
    font-weight="bold"
  >${title1}</text>

  <!-- Title line 2 -->
  <text
    x="60" y="318"
    font-family="Georgia, serif"
    font-style="italic"
    font-size="68"
    fill="#F0E6DC"
    font-weight="bold"
  >${title2}</text>

  <!-- Subtitle -->
  <text
    x="60" y="360"
    font-family="Arial, Helvetica, sans-serif"
    font-size="16"
    fill="#E8D0C0"
    opacity="0.88"
  >${sub}</text>

  <!-- Price pill -->
  <rect x="60" y="390" width="${pillW}" height="46" rx="23" fill="#C4867A"/>
  <text
    x="${pillCx}" y="420"
    font-family="Arial, Helvetica, sans-serif"
    font-size="21"
    fill="#FFFFFF"
    font-weight="bold"
    text-anchor="middle"
    dominant-baseline="middle"
  >${price}</text>

  <!-- Credential footer -->
  <text
    x="60" y="604"
    font-family="Arial, Helvetica, sans-serif"
    font-size="12"
    fill="#F0E6DC"
    opacity="0.6"
  >Camilla Freitas · Farmacêutica CRF/PE 4563</text>
</svg>`;
}

async function main() {
  console.log("Gerando capas Kiwify (1200×628) ...\n");

  for (const product of products) {
    const sourcePath = path.join(IMAGES_DIR, product.source);
    const outputPath = path.join(OUTPUT_DIR, product.filename);

    const svgBuf = Buffer.from(buildSvg(product), "utf8");

    await sharp(sourcePath)
      .resize(W, H, { fit: "cover", position: "top" })
      .composite([{ input: svgBuf, top: 0, left: 0 }])
      .jpeg({ quality: 92 })
      .toFile(outputPath);

    const { size } = fs.statSync(outputPath);
    console.log(`✓ ${product.filename.padEnd(30)} ${(size / 1024).toFixed(0)} KB`);
  }

  console.log("\nPronto! Arquivos salvos em public/kiwify/");
}

main().catch((err) => {
  console.error("Erro:", err.message);
  process.exit(1);
});
