const brandColors = [
  { name: "salmon", hex: "#C4867A", label: "Salmão", textDark: false },
  { name: "cream", hex: "#F0E6DC", label: "Cream", textDark: true },
  { name: "nude", hex: "#E8D0C0", label: "Nude", textDark: true },
  { name: "brown", hex: "#6B4239", label: "Marrom", textDark: false },
  { name: "dark-brown", hex: "#4A2E26", label: "Marrom Escuro", textDark: false },
  { name: "white", hex: "#FFFFFF", label: "Branco", textDark: true },
];

const typographyScale = [
  { tag: "h1", label: "Heading 1", className: "font-display text-5xl font-bold", sample: "Prepare seu corpo para gerar vida" },
  { tag: "h2", label: "Heading 2", className: "font-display text-4xl font-bold", sample: "O Método Gerando Milagres" },
  { tag: "h3", label: "Heading 3", className: "font-display text-3xl font-semibold", sample: "Por que funciona?" },
  { tag: "h4", label: "Heading 4", className: "font-sans text-xl font-semibold", sample: "Anti-inflamação & Microbiota" },
  { tag: "body-lg", label: "Body Large", className: "font-sans text-lg leading-relaxed", sample: "Um programa criado por quem viveu na pele a dor de tentar e não conseguir." },
  { tag: "body", label: "Body", className: "font-sans text-base leading-relaxed", sample: "Camilla é farmacêutica e viveu perdas gestacionais. Essa experiência transformou sua visão sobre fertilidade." },
  { tag: "caption", label: "Caption", className: "font-sans text-sm text-gray-500", sample: "* Resultados individuais podem variar. Este programa não garante gestação." },
];

const buttonVariantsList = [
  { label: "Primary", className: "bg-salmon text-white px-6 py-3 rounded-full font-semibold hover:bg-brown transition-colors" },
  { label: "Secondary", className: "border-2 border-salmon text-salmon px-6 py-3 rounded-full font-semibold hover:bg-salmon hover:text-white transition-colors" },
  { label: "Ghost", className: "text-brown underline underline-offset-4 px-6 py-3 font-semibold hover:text-dark-brown transition-colors" },
];

export default function DesignTokensPage() {
  return (
    <main className="min-h-screen bg-white p-8 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold font-display text-gray-900 mb-2">Design Tokens — Gerando Milagres</h1>
        <p className="text-gray-500 text-sm">Preview interno · não indexado em produção</p>
      </div>

      {/* Color Palette */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold font-sans text-gray-700 mb-6 pb-2 border-b border-gray-200">
          Paleta de Cores
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {brandColors.map((color) => (
            <div key={color.name} className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div
                className="h-24 w-full"
                style={{ backgroundColor: color.hex }}
              />
              <div className="p-3 bg-white">
                <p className="font-semibold text-sm text-gray-800">{color.label}</p>
                <p className="text-xs text-gray-500 font-mono">{color.hex}</p>
                <p className="text-xs text-gray-400 mt-1">{color.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Scale */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold font-sans text-gray-700 mb-6 pb-2 border-b border-gray-200">
          Escala Tipográfica
        </h2>
        <div className="space-y-8">
          {typographyScale.map((item) => (
            <div key={item.tag} className="border-l-2 border-salmon pl-4">
              <p className="text-xs text-gray-400 mb-1 font-mono">
                {item.label} — <span className="text-gray-500">{item.className}</span>
              </p>
              <p className={item.className}>{item.sample}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Button Variants */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold font-sans text-gray-700 mb-6 pb-2 border-b border-gray-200">
          Botões
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          {buttonVariantsList.map((btn) => (
            <div key={btn.label} className="text-center">
              <button className={btn.className}>
                Quero preparar meu corpo
              </button>
              <p className="text-xs text-gray-400 mt-2">{btn.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gradients */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold font-sans text-gray-700 mb-6 pb-2 border-b border-gray-200">
          Gradientes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-24 rounded-2xl" style={{ background: "linear-gradient(135deg, #F0E6DC, #E8D0C0)" }}>
            <div className="p-4 h-full flex items-end">
              <p className="text-xs font-mono text-brown drop-shadow-sm">cream → nude</p>
            </div>
          </div>
          <div className="h-24 rounded-2xl" style={{ background: "linear-gradient(135deg, #6B4239, #C4867A)" }}>
            <div className="p-4 h-full flex items-end">
              <p className="text-xs font-mono text-white drop-shadow-sm">brown → salmon</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
