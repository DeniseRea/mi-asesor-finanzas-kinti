"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  Bot,
  Check,
  ChevronRight,
  Eye,
  FileUp,
  LockKeyhole,
  MessageCircle,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import type { HomeDictionary } from "@/shared/i18n/dictionaries/home";
import { useAuth } from "@/shared/lib/auth-context";
import { Hero } from "./components/Hero";
import { LandingNav } from "./components/LandingNav";
import { Reveal } from "./components/Reveal";

interface HomeProps {
  dict: HomeDictionary;
  locale: "es" | "en";
}

export function Home({ dict, locale }: HomeProps) {
  const router = useRouter();
  const { enterDemo } = useAuth();
  const [progress, setProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const openDemo = () => {
    enterDemo();
    router.push(`/${locale}/dashboard`);
  };
  useEffect(() => {
    const storedTheme = localStorage.getItem("kinti_landing_theme");
    const enabled = storedTheme
      ? storedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    queueMicrotask(() => setDarkMode(enabled));
  }, []);
  const toggleTheme = () => {
    setDarkMode((current) => {
      const next = !current;
      localStorage.setItem("kinti_landing_theme", next ? "dark" : "light");
      return next;
    });
  };
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  const featurePresentation = [
    {
      icon: MessageCircle,
      tone: "from-emerald-50 to-lime-50 text-emerald-800",
    },
    { icon: PiggyBank, tone: "from-orange-50 to-amber-50 text-orange-800" },
    { icon: BarChart3, tone: "from-violet-50 to-blue-50 text-violet-800" },
  ];
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="landing-page min-h-screen overflow-x-clip bg-[#f7faf5] text-slate-950 [--font-display:'Iowan_Old_Style','Palatino_Linotype',Georgia,serif] dark:bg-[#06150f] dark:text-slate-100">
        <div
          aria-hidden="true"
          className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-emerald-700 via-lime-500 to-amber-400"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
        <LandingNav
          dict={dict}
          locale={locale}
          darkMode={darkMode}
          onThemeAction={toggleTheme}
          onDemoAction={openDemo}
        />
        <Hero dict={dict} locale={locale} onDemoAction={openDemo} />

        <section
          aria-label="Beneficios"
          className="border-y border-emerald-900/8 bg-white/65 py-6 backdrop-blur"
        >
          <div className="mx-auto grid w-[min(92%,76rem)] grid-cols-2 gap-5 text-center md:grid-cols-4">
            {dict.stats.map(({ value, label }) => (
              <div key={label}>
                <strong className="font-[family-name:var(--font-display)] text-2xl font-medium text-emerald-900 sm:text-3xl">
                  {value}
                </strong>
                <span className="mt-1 block text-xs text-slate-500 sm:text-sm">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section
          id="producto"
          className="relative isolate overflow-hidden py-24 sm:py-32"
        >
          <Image
            src="/assets/landing/product-features.webp"
            alt=""
            fill
            sizes="100vw"
            className="-z-20 object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-transparent dark:bg-[linear-gradient(to_bottom,rgba(8,38,27,.14),rgba(8,38,27,.17))]"
          />
          <div className="relative mx-auto w-[min(92%,80rem)]">
            <Reveal className="landing-section-heading mx-auto max-w-3xl text-center">
              <span className="text-xs font-black uppercase tracking-[.18em] text-emerald-700">
                {dict.productEyebrow}
              </span>
              <h2 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.7rem,5vw,5rem)] font-medium leading-[.95] tracking-[-.05em] text-emerald-950">
                {dict.featureTitle}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                {dict.featureSubtitle}
              </p>
            </Reveal>
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {dict.features.map(({ title, description }, index) => {
                const { icon: Icon, tone } = featurePresentation[index];
                return (
                  <Reveal key={title} delay={index * 120} direction="scale">
                    <article
                      className={`group relative min-h-80 overflow-hidden rounded-[2rem] border border-white bg-gradient-to-br ${tone} p-7 shadow-[0_24px_70px_rgba(8,59,44,.07)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(8,59,44,.12)]`}
                    >
                      <span className="grid size-14 place-items-center rounded-2xl bg-white/80 shadow-sm">
                        <Icon size={25} />
                      </span>
                      <h3 className="mt-12 text-2xl font-black tracking-[-.03em]">
                        {title}
                      </h3>
                      <p className="mt-4 max-w-sm leading-7 text-slate-600">
                        {description}
                      </p>
                      <span className="absolute bottom-6 right-6 grid size-11 place-items-center rounded-full border border-current/15 bg-white/50 transition-transform group-hover:rotate-[-25deg]">
                        <ArrowRight size={18} />
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute -right-14 -top-14 size-40 rounded-full border border-current/10"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute -right-6 -top-6 size-24 rounded-full border border-current/10"
                      />
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="como-funciona"
          className="relative isolate overflow-hidden bg-[#09513c] py-24 text-white sm:py-32"
        >
          <Image
            src="/assets/landing/conversation-night.webp"
            alt=""
            fill
            sizes="100vw"
            className="-z-20 object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,37,27,.18),rgba(5,61,43,.12))]"
          />
          <div className="relative mx-auto grid w-[min(92%,80rem)] items-center gap-14 lg:grid-cols-[.82fr_1.18fr]">
            <Reveal direction="left">
              <span className="text-xs font-black uppercase tracking-[.18em] text-emerald-300">
                {dict.conversationEyebrow}
              </span>
              <h2 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.8rem,5vw,5.5rem)] font-medium leading-[.93] tracking-[-.055em]">
                {dict.conversationTitle}
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-emerald-50/70">
                {dict.conversationSubtitle}
              </p>
              <div className="mt-9 space-y-4">
                {dict.conversationSteps.map((text, index) => (
                  <div key={text} className="flex items-center gap-4">
                    <span className="grid size-9 place-items-center rounded-full border border-emerald-300/30 bg-emerald-300/10 text-sm font-black text-emerald-200">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-emerald-50/85">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal direction="right">
              <div className="relative rounded-[2.25rem] border border-white/70 bg-white p-4 text-slate-900 shadow-[0_40px_100px_rgba(0,0,0,.28)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/98 dark:text-slate-100 sm:p-7">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-5 dark:border-slate-700">
                  <span className="grid size-11 place-items-center rounded-full bg-emerald-300 text-emerald-950">
                    <Bot size={22} />
                  </span>
                  <div>
                    <strong className="block">{dict.assistant.name}</strong>
                    <small className="text-emerald-700/75 dark:text-emerald-300/80">
                      {dict.assistant.status}
                    </small>
                  </div>
                  <span className="ml-auto size-2.5 rounded-full bg-lime-300 shadow-[0_0_18px_#bef264]" />
                </div>
                <div className="space-y-5 py-7">
                  <div className="max-w-[80%] rounded-2xl rounded-tl-md border border-slate-200 bg-slate-100 p-4 text-sm leading-6 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {dict.assistant.greeting}
                  </div>
                  <div className="ml-auto max-w-[76%] rounded-2xl rounded-tr-md bg-emerald-300 p-4 text-sm font-semibold text-emerald-950">
                    {dict.assistant.example}
                  </div>
                  <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-slate-200 bg-white p-5 text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                    <div className="flex items-center gap-2 text-sm font-black text-emerald-800">
                      <Sparkles size={17} />
                      {dict.assistant.understood}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      {[
                        [dict.assistant.amount, "$25.00"],
                        [dict.assistant.category, "Comida"],
                        [dict.assistant.merchant, "McDonald's"],
                        [dict.assistant.date, dict.assistant.today],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                          <small className="block text-slate-400">
                            {label}
                          </small>
                          <strong>{value}</strong>
                        </div>
                      ))}
                    </div>
                    <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 py-3 text-sm font-bold text-white">
                      <Check size={16} />
                      {dict.assistant.confirm}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500 shadow-inner dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                  <MessageCircle size={18} />
                  {dict.assistant.placeholder}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="analitica"
          className="relative isolate overflow-hidden py-24 sm:py-32"
        >
          <Image
            src="/assets/landing/analytics-story.webp"
            alt=""
            fill
            sizes="100vw"
            className="-z-20 object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-transparent dark:bg-[linear-gradient(90deg,rgba(8,38,27,.14),rgba(8,38,27,.17))]"
          />
          <div className="relative mx-auto grid w-[min(92%,80rem)] items-center gap-16 lg:grid-cols-2">
            <Reveal direction="left">
              <div className="relative min-h-[34rem] rounded-[2.25rem] border border-emerald-900/8 bg-white/90 p-6 shadow-[0_35px_90px_rgba(8,59,44,.09)] backdrop-blur-sm sm:p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400">
                      {dict.analytics.summary}
                    </span>
                    <strong className="mt-2 block text-3xl tracking-tight">
                      $2,533.61
                    </strong>
                  </div>
                  <span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <WalletCards />
                  </span>
                </div>
                <div className="mt-8 flex h-44 items-end gap-2">
                  {[28, 42, 35, 58, 49, 72, 64, 86, 76, 96, 88, 110].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="group flex-1 rounded-t-xl bg-gradient-to-t from-emerald-700 to-emerald-300 transition hover:brightness-110"
                        style={{ height }}
                      />
                    ),
                  )}
                </div>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-orange-50 p-4">
                    <span className="flex items-center gap-2 text-xs font-bold text-orange-700">
                      <BellRing size={15} />
                      {dict.analytics.budget}
                    </span>
                    <strong className="mt-2 block text-xl">82%</strong>
                    <div className="mt-3 h-2 rounded-full bg-orange-100">
                      <div className="h-2 w-[82%] rounded-full bg-orange-500" />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-violet-50 p-4">
                    <span className="flex items-center gap-2 text-xs font-bold text-violet-700">
                      <BarChart3 size={15} />
                      {dict.analytics.savings}
                    </span>
                    <strong className="mt-2 block text-xl">38%</strong>
                    <p className="mt-2 text-xs text-slate-500">
                      {dict.analytics.change}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal direction="right" className="landing-section-heading">
              <span className="text-xs font-black uppercase tracking-[.18em] text-emerald-700">
                {dict.analytics.eyebrow}
              </span>
              <h2 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.8rem,5vw,5rem)] font-medium leading-[.94] tracking-[-.05em] text-emerald-950">
                {dict.analytics.title}
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                {dict.analytics.description}
              </p>
              <div className="mt-8 space-y-3">
                {dict.analytics.checks.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-emerald-900/8 bg-white px-4 py-3.5"
                  >
                    <span className="grid size-8 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check size={16} />
                    </span>
                    <span className="font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="seguridad"
          className="relative isolate overflow-hidden bg-[#edf6ee] py-24 sm:py-32"
        >
          <Image
            src="/assets/landing/security-growth.webp"
            alt=""
            fill
            sizes="100vw"
            className="-z-20 object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-transparent dark:bg-[#0a2f23]/10"
          />
          <div className="relative mx-auto w-[min(92%,74rem)]">
            <Reveal className="landing-section-heading text-center">
              <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-emerald-900 text-emerald-200 shadow-xl">
                <LockKeyhole size={28} />
              </span>
              <h2 className="mx-auto mt-7 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(2.8rem,5vw,5rem)] font-medium leading-[.95] tracking-[-.05em] text-emerald-950">
                {dict.securityTitle}
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                {dict.securitySubtitle}
              </p>
            </Reveal>
            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {dict.securityItems.map(({ title, description }, index) => {
                const Icon = [Eye, ShieldCheck, FileUp][index];
                return (
                  <Reveal key={title} delay={index * 110}>
                    <div className="h-full rounded-3xl border border-emerald-900/8 bg-white/75 p-6 text-center backdrop-blur">
                      <Icon className="mx-auto text-emerald-700" />
                      <h3 className="mt-4 font-black">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {description}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-3 py-16 sm:px-6 sm:py-24">
          <Reveal className="mx-auto max-w-[82rem]">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#07543d] px-6 py-16 text-center text-white shadow-[0_40px_100px_rgba(6,61,46,.22)] sm:px-12 sm:py-24">
              <Image
                src="/assets/landing/final-journey.webp"
                alt=""
                fill
                sizes="(max-width: 1360px) 96vw, 1312px"
                className="object-cover object-center"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-emerald-950/10"
              />
              <div className="relative z-10">
                <h2 className="mx-auto max-w-3xl font-[family-name:var(--font-display)] text-[clamp(2.7rem,5vw,5rem)] font-medium leading-[.95] tracking-[-.05em]">
                  {dict.finalTitle}
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-emerald-50/80">
                  {dict.finalSubtitle}
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    onClick={openDemo}
                    className="group flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-300 px-6 font-black text-emerald-950 hover:-translate-y-1 hover:bg-lime-300"
                  >
                    {dict.viewDemo}
                    <ArrowRight
                      className="transition group-hover:translate-x-1"
                      size={18}
                    />
                  </button>
                  <Link
                    href={`/${locale}/login`}
                    className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 font-bold text-white hover:bg-white/15"
                  >
                    {dict.login}
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <footer className="border-t border-emerald-900/8 px-5 py-10">
          <div className="mx-auto flex w-full max-w-[80rem] flex-col items-center justify-between gap-5 sm:flex-row">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <Image
                src="/assets/brand/kinti-bird.png"
                alt=""
                width={38}
                height={32}
              />
              <span className="text-xl font-black text-emerald-950">kinti</span>
            </Link>
            <p className="text-center text-sm text-slate-500">
              {dict.footerCopyright}
            </p>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-semibold text-slate-500">
              <Link
                href={locale === "es" ? "/es/terminos" : "/en/terms"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-800 hover:underline"
              >
                {dict.footerTerms}
              </Link>
              <Link
                href={locale === "es" ? "/es/privacidad" : "/en/privacy"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-800 hover:underline"
              >
                {dict.footerPrivacy}
              </Link>
              <Link href={`/${locale}/login`}>{dict.login}</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
