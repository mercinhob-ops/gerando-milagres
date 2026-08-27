"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { ChevronDown, Stethoscope, Salad, Sparkles, CheckCircle2, Check } from "lucide-react";
import { trackConversionEvent } from "@/lib/meta-conversions";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";

const CHECKOUT_URL = "CHECKOUT_URL_EN";
const PRICE_VALUE = 27.0;
const PRODUCT_NAME = "Flourishing Together — A Practical Guide to Couple's Fertility";

const TICKER_TEXT =
  "FLOURISHING TOGETHER • COUPLE'S FERTILITY • DR. CAMILLA FREITAS • GERANDO MILAGRES • ".repeat(4);

// Real photos of couples cared for by Dr. Camilla.
const socialProofPhotos = [
  { src: "/images/casal-2.jpg", alt: "Couple cared for by Dr. Camilla" },
  { src: "/images/casal-3.jpg", alt: "Couple cared for by Dr. Camilla" },
  { src: "/images/casal-4.jpg", alt: "Couple cared for by Dr. Camilla" },
  { src: "/images/casal-5.jpg", alt: "Couple cared for by Dr. Camilla" },
  { src: "/images/casal-1.jpg", alt: "Couple cared for by Dr. Camilla" },
] as const;

const heroPolaroids = [
  { src: "/images/casal-2.jpg", alt: "Couple cared for by Dr. Camilla", rotate: -8 },
  { src: "/images/casal-3.jpg", alt: "Couple cared for by Dr. Camilla", rotate: 6 },
  { src: "/images/casal-5.jpg", alt: "Couple cared for by Dr. Camilla", rotate: 4 },
] as const;

const forWhoPoints = [
  "You've been trying to conceive for months with no results",
  "You've had tests done and were told everything is normal",
  "You're not sure which tests you both need to take",
  "Sex has started to feel like a chore",
  "You want to combine science and faith on this journey",
] as const;

const howItWorksSteps = [
  {
    number: "1",
    icon: Stethoscope,
    title: "Understand Your Body",
    desc: "Cycle, tests, and hormones explained simply, so you both understand what's happening.",
  },
  {
    number: "2",
    icon: Salad,
    title: "Prepare Together",
    desc: "Nutrition, supplementation, and mindset — habits you build side by side.",
  },
  {
    number: "3",
    icon: Sparkles,
    title: "Flourish Together",
    desc: "Connection, faith, and the next steps to walk united toward pregnancy.",
  },
] as const;

const timelineWeeks = [
  {
    week: "Week 1",
    icon: "🔎",
    title: "Understand and Diagnose",
    items: ["Getting to know your body", "Her and his tests", "Fertility guide"],
  },
  {
    week: "Week 2",
    icon: "🌱",
    title: "Prepare Body and Mind",
    items: ["Anti-inflammatory nutrition", "Supplementation", "Mind and anxiety"],
  },
  {
    week: "Week 3",
    icon: "🌸",
    title: "Flourish Together",
    items: ["Physical movement", "Couple's connection", "Faith and spirituality"],
  },
] as const;

const includedItems = [
  "9 complete chapters",
  "Her and his testing guide",
  "Anti-inflammatory protocol",
  "Educational supplementation guide",
  "Couple's connection plan",
  "Devotional with scripture verses",
  "Next-steps checklist",
  "Accessible, warm language",
] as const;

const trustBadges = [
  { label: "7-day guarantee", color: "bg-success/10 text-success border-success/30" },
  { label: "Instant access", color: "bg-info/10 text-info border-info/30" },
  { label: "Full PDF", color: "bg-salmon/10 text-salmon border-salmon/30" },
  { label: "Secure checkout", color: "bg-warning/10 text-warning border-warning/30" },
  { label: "+500 couples", color: "bg-brown/10 text-brown border-brown/30" },
] as const;

const testimonials = [
  {
    names: "Sarah & Michael",
    city: "Austin, TX",
    photo: "/images/casal-1.jpg",
    message:
      "After 8 months of trying, Dr. Camilla's guide helped us understand that fertility really is a couple's journey. We got tested together and now we're expecting!",
  },
  {
    names: "Emily & David",
    city: "San Diego, CA",
    photo: "/images/casal-2.jpg",
    message:
      "The connection chapter changed everything for us. With Dr. Camilla's guidance, intimacy stopped feeling like a task and became something we looked forward to again.",
  },
  {
    names: "Jessica & Ryan",
    city: "Chicago, IL",
    photo: "/images/casal-3.jpg",
    message:
      "I didn't even know where to start with testing. Dr. Camilla explained everything so simply and warmly in the guide. Now we know exactly what to do.",
  },
  {
    names: "Ashley & Brian",
    city: "Nashville, TN",
    photo: "/images/casal-4.jpg",
    message:
      "The faith alongside the science part is what touched us most. With Dr. Camilla's guidance, we felt supported every step of this journey.",
  },
] as const;

const journeyStages = [
  "Lost and Alone",
  "Seeking Answers",
  "Preparing the Body",
  "Flourishing Together",
  "Positive! 🎉",
] as const;
const CURRENT_STAGE_INDEX = 2;

const faqs = [
  {
    question: "Who is Flourishing Together for?",
    answer:
      "For couples who are trying to conceive and want to walk this journey together — understanding each other's bodies, the tests you need, and how to prepare, with both science and faith.",
  },
  {
    question: "Is this a course or an ebook?",
    answer:
      "It's a digital PDF guide with 9 chapters organized across 3 weeks of content. You read it at your own pace, on your phone or computer.",
  },
  {
    question: "How will I receive it?",
    answer:
      "As soon as your purchase is confirmed, you'll get instant access to the material by email, with a link to download the complete PDF.",
  },
  {
    question: "Does it work for women with PCOS or endometriosis?",
    answer:
      "Yes. The guide was designed for couples in different fertility situations. It doesn't replace medical care, but it helps you arrive at your appointments more prepared and informed.",
  },
  {
    question: "Does my husband need to read it too?",
    answer:
      "Yes — that's the whole idea! Flourishing Together was created for both of you to take part, understand each other's role in this journey, and walk it together, not just her.",
  },
] as const;

export function CasalGm2Content() {
  return (
    <div className="overflow-x-hidden">
      <style>{`
        @keyframes casalgm-ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes casalgm-float {
          0%, 100% { transform: translateY(0) rotate(var(--float-rotate, 0deg)); }
          50% { transform: translateY(-10px) rotate(var(--float-rotate, 0deg)); }
        }
      `}</style>

      <HeroSection />
      <TickerBar />
      <FadeInSection>
        <SocialProofSection />
      </FadeInSection>
      <FadeInSection>
        <ForWhoSection />
      </FadeInSection>
      <FadeInSection>
        <HowItWorksSection />
      </FadeInSection>
      <FadeInSection>
        <TimelineSection />
      </FadeInSection>
      <FadeInSection>
        <WhatsIncludedSection />
      </FadeInSection>
      <FadeInSection>
        <TestimonialsSection />
      </FadeInSection>
      <FadeInSection>
        <JourneyRulerSection />
      </FadeInSection>
      <FadeInSection>
        <PricingSection />
      </FadeInSection>
      <FadeInSection>
        <GuaranteeSection />
      </FadeInSection>
      <FadeInSection>
        <FaqSection />
      </FadeInSection>
      <FadeInSection>
        <FinalCtaSection />
      </FadeInSection>
      <FooterSection />
    </div>
  );
}

/* ─────────────────────────── Reusable pieces ─────────────────────────── */

function FadeInSection({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
      }}
    >
      {children}
    </div>
  );
}

function AnimatedCounter({ target, duration = 1600 }: { target: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    let frameId: number;

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [started, target, duration]);

  return (
    <span ref={ref} data-testid="animated-counter">
      {count}
    </span>
  );
}

function CheckoutCta({ label, className }: { label: string; className?: string }) {
  function handleClick() {
    trackConversionEvent({
      eventName: "InitiateCheckout",
      customData: { value: PRICE_VALUE, currency: "USD", content_name: PRODUCT_NAME },
    });
  }

  return (
    <a
      href={CHECKOUT_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        buttonVariants({ variant: "primary", size: "lg" }),
        "bg-salmon hover:bg-salmon/90 shadow-[0_10px_30px_rgba(196,134,122,0.45)] hover:shadow-[0_14px_36px_rgba(196,134,122,0.55)] transition-all duration-200 hover:-translate-y-0.5 inline-flex",
        className
      )}
    >
      {label}
    </a>
  );
}

function Polaroid({
  className,
  rotate,
  src,
  alt,
}: {
  className?: string;
  rotate: number;
  src: string;
  alt: string;
}) {
  return (
    <div
      className={cn("bg-white p-2 pb-6 rounded-sm shadow-2xl", className)}
      style={{ "--float-rotate": `${rotate}deg`, animation: "casalgm-float 5s ease-in-out infinite" } as React.CSSProperties}
    >
      <div className="relative w-full aspect-square rounded-sm overflow-hidden">
        <Image src={src} alt={alt} fill className="object-cover" sizes="120px" />
      </div>
    </div>
  );
}

/* ─────────────────────────────── 1. Hero ─────────────────────────────── */

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #F0E6DC 0%, #E8D0C0 55%, #F0E6DC 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-8%] w-[40vw] h-[40vw] rounded-full bg-salmon/10 blur-3xl" />
        <div className="absolute bottom-[-8%] left-[-6%] w-[32vw] h-[32vw] rounded-full bg-brown/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-14 md:pt-20 pb-14 flex flex-col md:flex-row items-center gap-14">
        {/* Left: copy */}
        <div className="flex-1 text-center md:text-left space-y-6 order-2 md:order-1">
          <p className="font-['Georgia',serif] italic text-lg font-bold text-dark-brown">Gerando Milagres</p>

          <h1 className="font-['Georgia',serif] text-4xl md:text-5xl lg:text-6xl font-bold text-dark-brown leading-[1.1]">
            THE FIRST STEP TO GETTING PREGNANT TOGETHER <span aria-hidden="true">🌸</span>
          </h1>

          <p className="font-sans text-lg md:text-xl text-brown/80 leading-relaxed md:max-w-xl">
            What you do before trying can completely change your chances.
          </p>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <AvatarStack />
            <p className="font-sans text-sm text-brown/60">+500 couples have already started this journey</p>
          </div>

          <div className="pt-2">
            <CheckoutCta label="Start Our Journey →" className="text-base md:text-lg px-8 py-4" />
          </div>
        </div>

        {/* Right: photo + floating polaroids */}
        <div className="order-1 md:order-2 shrink-0 relative w-full max-w-[300px] md:max-w-[360px]">
          <div className="relative w-full aspect-[4/5]">
            <div
              className="absolute inset-[6%] rounded-full blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(196,134,122,0.35) 0%, rgba(196,134,122,0) 70%)" }}
              aria-hidden="true"
            />
            <Image
              src="/images/camilla-zap2.jpg"
              alt="Dr. Camilla Freitas"
              fill
              className="object-cover object-top rounded-[2.5rem] shadow-2xl relative"
              sizes="(max-width: 768px) 300px, 360px"
              priority
            />
          </div>

          <Polaroid
            rotate={heroPolaroids[0].rotate}
            src={heroPolaroids[0].src}
            alt={heroPolaroids[0].alt}
            className="absolute -top-6 -left-10 w-24 hidden sm:block"
          />
          <Polaroid
            rotate={heroPolaroids[1].rotate}
            src={heroPolaroids[1].src}
            alt={heroPolaroids[1].alt}
            className="absolute top-1/3 -right-8 w-24 hidden sm:block"
          />
          <Polaroid
            rotate={heroPolaroids[2].rotate}
            src={heroPolaroids[2].src}
            alt={heroPolaroids[2].alt}
            className="absolute -bottom-6 left-6 w-24 hidden sm:block"
          />
        </div>
      </div>
    </section>
  );
}

function AvatarStack() {
  const colors = ["bg-salmon", "bg-brown", "bg-dark-brown", "bg-nude-dark"];
  return (
    <div className="flex -space-x-3" aria-hidden="true">
      {colors.map((color) => (
        <div
          key={color}
          className={cn(
            "w-9 h-9 rounded-full border-2 border-white/80 flex items-center justify-center backdrop-blur-sm",
            color
          )}
        >
          <span className="text-white/90 text-xs" aria-hidden="true">
            💛
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────── 2. Ticker ─────────────────────────────── */

function TickerBar() {
  return (
    <div
      className="relative border-y border-white/10 py-3 overflow-hidden"
      style={{ background: "linear-gradient(90deg, #4A2E26 0%, #6B4239 100%)" }}
    >
      <div
        className="flex w-max whitespace-nowrap"
        style={{ animation: "casalgm-ticker-scroll 24s linear infinite" }}
      >
        <span className="font-sans text-xs font-semibold tracking-widest text-nude/80 uppercase px-4">
          {TICKER_TEXT}
        </span>
        <span
          className="font-sans text-xs font-semibold tracking-widest text-nude/80 uppercase px-4"
          aria-hidden="true"
        >
          {TICKER_TEXT}
        </span>
      </div>
    </div>
  );
}

/* ────────────────────────── 3. Social proof ────────────────────────── */

function SocialProofSection() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-['Georgia',serif] text-2xl md:text-3xl font-bold text-dark-brown mb-8 leading-snug">
          <span className="text-salmon">
            <AnimatedCounter target={500} />+
          </span>{" "}
          couples have already transformed their journey with Dr. Camilla Freitas
        </p>

        <div className="grid grid-cols-5 gap-3 md:gap-4 mb-6">
          {socialProofPhotos.map((photo) => (
            <div
              key={photo.src}
              className="relative aspect-square rounded-2xl shadow-sm overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 18vw, 140px"
              />
            </div>
          ))}
        </div>

        <p className="font-sans text-brown/70 text-base md:text-lg italic">Now it&rsquo;s your turn.</p>
      </div>
    </section>
  );
}

/* ────────────────────────── 4. Who it's for ────────────────────────── */

function ForWhoSection() {
  return (
    <section className="py-20 px-6" style={{ background: "#4A2E26" }}>
      <div className="max-w-2xl mx-auto">
        <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-white text-center mb-10 leading-snug">
          This guide is for you if…
        </h2>
        <ul className="space-y-4">
          {forWhoPoints.map((point) => (
            <li
              key={point}
              className="flex items-start gap-4 rounded-2xl px-5 py-4 border border-white/15 backdrop-blur-sm bg-white/5 transition-colors hover:bg-white/10"
            >
              <span className="shrink-0 w-6 h-6 rounded-full bg-white/15 flex items-center justify-center mt-0.5">
                <Check className="w-4 h-4 text-white" aria-hidden="true" />
              </span>
              <p className="font-sans text-white/90 text-base leading-snug">{point}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ────────────────────────── 5. How it works ────────────────────────── */

function HowItWorksSection() {
  return (
    <section className="py-20 px-6 bg-cream">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
            How it works
          </p>
          <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
            A clear path, in 3 steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howItWorksSteps.map(({ number, icon: Icon, title, desc }) => (
            <div
              key={number}
              className="bg-white rounded-2xl p-7 text-center shadow-sm border border-nude-dark/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <p className="font-['Georgia',serif] text-6xl font-bold text-salmon/25 leading-none mb-2">
                {number}
              </p>
              <div className="w-14 h-14 rounded-full bg-salmon/15 flex items-center justify-center mx-auto -mt-10 mb-4 border-4 border-white shadow-sm">
                <Icon className="w-7 h-7 text-salmon" aria-hidden="true" />
              </div>
              <h3 className="font-['Georgia',serif] text-xl font-bold text-dark-brown mb-3">{title}</h3>
              <p className="font-sans text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 6. Timeline ────────────────────────── */

function TimelineSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
            What you&rsquo;ll experience with the guide
          </h2>
          <p className="font-sans text-sm text-gray-500 mt-3">3 weeks of content, at your own pace</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {timelineWeeks.map(({ week, icon, title, items }) => (
            <div
              key={week}
              className="rounded-2xl p-7 shadow-sm border border-nude-dark/30 bg-cream transition-all duration-300 hover:shadow-lg"
            >
              <span className="text-5xl" aria-hidden="true">
                {icon}
              </span>
              <p className="font-sans text-[11px] font-bold text-salmon uppercase tracking-widest mt-4">{week}</p>
              <h3 className="font-['Georgia',serif] text-lg font-bold text-dark-brown mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item} className="font-sans text-sm text-gray-600 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-salmon shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 7. What's included ────────────────────────── */

function WhatsIncludedSection() {
  return (
    <section className="py-20 px-6 bg-cream">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
            What&rsquo;s included
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {includedItems.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 shadow-sm transition-transform duration-200 hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-5 h-5 text-success shrink-0" aria-hidden="true" />
              <p className="font-sans text-sm text-brown/90">{item}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {trustBadges.map(({ label, color }) => (
            <span
              key={label}
              className={cn("font-sans text-xs font-semibold border rounded-full px-4 py-1.5", color)}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 8. Testimonials ────────────────────────── */

function TestimonialsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
            Testimonials
          </p>
          <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
            What couples are saying
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {testimonials.map(({ names, city, photo, message }) => (
            <div
              key={names}
              className="bg-white border-l-4 border-salmon rounded-2xl p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg"
              style={{ boxShadow: "0 4px 20px rgba(107,66,57,0.06)" }}
            >
              <p className="font-['Georgia',serif] italic text-gray-700 leading-relaxed mb-4">
                &ldquo;{message}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={photo}
                    alt="Couple cared for by Dr. Camilla"
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <p className="font-sans text-sm font-bold text-dark-brown">{names}</p>
                  <p className="font-sans text-xs text-gray-400">{city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 9. Journey ruler ────────────────────────── */

function JourneyRulerSection() {
  const columnWidthPct = 100 / journeyStages.length;
  const insetPct = columnWidthPct / 2;

  return (
    <section className="py-20 px-6 bg-nude">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
            Where are you in this journey?
          </h2>
        </div>

        <div className="relative h-9">
          <div
            className="absolute top-1/2 h-2 rounded-full -translate-y-1/2"
            style={{
              left: `${insetPct}%`,
              right: `${insetPct}%`,
              background: "linear-gradient(90deg, #DC2626 0%, #F59E0B 50%, #16A34A 100%)",
            }}
            aria-hidden="true"
          />
          <div
            className="relative grid h-9"
            style={{ gridTemplateColumns: `repeat(${journeyStages.length}, 1fr)` }}
          >
            {journeyStages.map((stage, i) => (
              <div key={stage} className="flex justify-center">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow-md",
                    i === CURRENT_STAGE_INDEX ? "bg-dark-brown scale-110" : "bg-white"
                  )}
                >
                  {i === CURRENT_STAGE_INDEX && (
                    <span className="w-2.5 h-2.5 rounded-full bg-white" aria-hidden="true" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid mt-3" style={{ gridTemplateColumns: `repeat(${journeyStages.length}, 1fr)` }}>
          {journeyStages.map((stage, i) => (
            <p
              key={stage}
              className={cn(
                "text-center font-sans text-[11px] md:text-xs leading-tight px-1",
                i === CURRENT_STAGE_INDEX ? "text-dark-brown font-bold" : "text-brown/60"
              )}
            >
              {stage}
            </p>
          ))}
        </div>

        <p className="text-center font-sans text-sm text-brown/70 mt-10 max-w-xl mx-auto">
          You&rsquo;re ready to take the next step. Flourishing Together is the push you&rsquo;ve been waiting for.
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────── 10. Pricing ────────────────────────── */

function PricingSection() {
  return (
    <section className="py-20 px-6" style={{ background: "#EEE4F7" }}>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 lg:gap-14">
        <div className="shrink-0 w-full max-w-[220px] md:max-w-[240px]">
          <div className="relative w-full aspect-[3/4] drop-shadow-2xl rounded-2xl overflow-hidden rotate-[-3deg]">
            <Image
              src="/images/florescer-a-dois.png"
              alt="Flourishing Together — Dr. Camilla Freitas"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 220px, 240px"
            />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left w-full max-w-lg">
          <div className="inline-flex items-center gap-2 bg-white/60 border border-salmon/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-salmon animate-pulse shrink-0" aria-hidden="true" />
            <p className="font-sans text-xs font-bold text-salmon uppercase tracking-widest">
              Spots for this guide are closing soon!
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-xl border border-white/60">
            <p className="font-sans text-sm text-brown/60 font-medium mb-1">One-time payment</p>
            <p className="font-['Georgia',serif] text-6xl font-bold text-salmon leading-none">$27.00</p>
            <p className="font-sans text-brown/50 text-xs mt-2">USD</p>

            <p className="font-sans text-base font-bold text-brown mt-6 uppercase tracking-wide">
              instant access · no installments
            </p>
            <p className="font-sans text-brown/50 text-xs mt-2 mb-8">secure checkout · no monthly fees</p>

            <CheckoutCta label="Get My Guide Now →" className="w-full justify-center text-base" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 11. Guarantee ────────────────────────── */

function GuaranteeSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          style={{ background: "linear-gradient(145deg, #F0E6DC, #E8D0C0)" }}
          aria-hidden="true"
        >
          <span className="text-5xl">🏅</span>
        </div>

        <h2 className="font-['Georgia',serif] text-2xl md:text-3xl font-bold text-dark-brown mb-4 leading-snug">
          7-Day Money Back Guarantee
        </h2>

        <p className="font-sans text-gray-600 leading-relaxed max-w-lg mx-auto">
          If within the first <strong className="text-brown">7 days</strong> you feel this guide isn&rsquo;t right
          for you, we&rsquo;ll refund 100% of your investment. No questions asked, no red tape — the risk is ours,
          the flourishing is yours.
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────── 12. FAQ ────────────────────────── */

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-6 bg-cream">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-nude-dark/30 shadow-sm px-6 divide-y divide-nude-dark/30">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between py-5 text-left gap-4 group cursor-pointer"
                >
                  <span className="font-sans font-semibold text-base text-dark-brown group-hover:text-salmon transition-colors">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "shrink-0 w-5 h-5 text-salmon transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="font-sans text-gray-600 leading-relaxed pb-5 pr-8">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 13. Final CTA ────────────────────────── */

function FinalCtaSection() {
  return (
    <section
      className="py-24 px-6 text-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #4A2E26 0%, #6B4239 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-5%] w-[30vw] h-[30vw] rounded-full bg-salmon/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[28vw] h-[28vw] rounded-full bg-nude/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-7">
        <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase">The time has come</p>
        <h2 className="font-['Georgia',serif] text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Don&rsquo;t lose another cycle — this one could be yours.
        </h2>
        <p className="font-sans text-nude/80 text-lg leading-relaxed max-w-xl mx-auto">
          Body, mind, supplementation, and faith — everything you need to walk together, hand in hand, toward
          pregnancy.
        </p>

        <div className="pt-2">
          <CheckoutCta label="I Want to Flourish Together →" className="text-lg px-10 py-5" />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 14. Footer ────────────────────────── */

function FooterSection() {
  function handleBackToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="py-12 px-6 text-center" style={{ background: "#4A2E26" }}>
      <div className="max-w-2xl mx-auto space-y-5">
        <p className="font-sans text-xs text-nude/50">
          Dr. Camilla Freitas · CRF/PE 4563 · Fertility Specialist · All rights reserved
        </p>

        <a
          href="/privacidade"
          className="inline-block font-sans text-xs text-nude/60 hover:text-white underline underline-offset-4 transition-colors"
        >
          Privacy Policy
        </a>

        <div>
          <button
            type="button"
            onClick={handleBackToTop}
            className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-white/80 border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 transition-colors"
          >
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
