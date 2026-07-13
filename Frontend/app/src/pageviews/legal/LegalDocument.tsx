import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Globe2,
  Headphones,
  ShieldCheck,
} from 'lucide-react';
import type { Locale } from '@/shared/i18n/config';
import {
  getLegalDocumentCopy,
  type LegalDocumentKind,
} from '@/shared/i18n/dictionaries/legal';

function legalPath(locale: Locale, kind: LegalDocumentKind) {
  if (locale === 'en') return kind === 'terms' ? '/en/terms' : '/en/privacy';
  return kind === 'terms' ? '/es/terminos' : '/es/privacidad';
}

export function LegalDocument({
  locale,
  kind,
}: {
  locale: Locale;
  kind: LegalDocumentKind;
}) {
  const copy = getLegalDocumentCopy(locale, kind);
  const nextLocale: Locale = locale === 'es' ? 'en' : 'es';
  const otherKind: LegalDocumentKind = kind === 'terms' ? 'privacy' : 'terms';
  const DocumentIcon = kind === 'privacy' ? ShieldCheck : FileText;

  return (
    <div className="min-h-dvh bg-[#f5f8f6] text-slate-800">
      <header className="border-b border-emerald-950/8 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-[min(92%,78rem)] items-center justify-between gap-4">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-emerald-950"
            aria-label="Kinti"
          >
            <Image
              src="/assets/brand/kinti-bird.png"
              alt=""
              width={48}
              height={40}
              className="object-contain"
            />
            <span className="text-2xl font-black tracking-tight">kinti</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={legalPath(nextLocale, kind)}
              hrefLang={nextLocale}
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <Globe2 size={17} />
              <span className="hidden sm:inline">{copy.switchLanguage}</span>
              <span className="sm:hidden">{nextLocale.toUpperCase()}</span>
            </Link>
            <Link
              href={`/${locale}`}
              className="flex h-10 items-center gap-2 rounded-xl px-2 text-sm font-bold text-emerald-800 hover:bg-emerald-50 sm:px-3"
            >
              <ArrowLeft size={17} />
              <span className="hidden sm:inline">{copy.backHome}</span>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-emerald-950/8 bg-[linear-gradient(135deg,#062f24_0%,#075b40_58%,#0f766e_100%)] px-5 py-16 text-white sm:py-20">
          <div className="absolute -right-24 -top-24 size-80 rounded-full bg-emerald-300/12 blur-3xl" />
          <div className="absolute -bottom-36 left-1/4 size-96 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="relative mx-auto w-full max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-emerald-100">
              <DocumentIcon size={15} />
              {copy.eyebrow}
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-emerald-50/80 sm:text-lg">
              {copy.summary}
            </p>
            <p className="mt-7 text-sm font-semibold text-emerald-100">
              {copy.effectiveLabel}: {copy.effectiveDate}
            </p>
          </div>
        </section>

        <div className="mx-auto grid w-[min(92%,78rem)] gap-8 py-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:py-14">
          <aside className="self-start lg:sticky lg:top-6">
            <nav
              aria-label={copy.contents}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="mb-3 text-xs font-black uppercase tracking-[.14em] text-emerald-700">
                {copy.contents}
              </p>
              <ol className="space-y-1.5">
                {copy.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block rounded-lg px-2 py-1.5 text-sm leading-5 text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,.06)]">
            <div className="divide-y divide-slate-100 px-5 sm:px-9 lg:px-12">
              {copy.sections.map((section) => (
                <section
                  id={section.id}
                  key={section.id}
                  className="scroll-mt-8 py-8 sm:py-10"
                >
                  <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.bullets ? (
                      <ul className="space-y-3 pt-1">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-3">
                            <CheckCircle2
                              size={18}
                              className="mt-1 shrink-0 text-emerald-600"
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {section.note ? (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium leading-6 text-amber-950">
                        {section.note}
                      </div>
                    ) : null}
                  </div>
                </section>
              ))}
            </div>

            <section className="bg-emerald-950 p-6 text-white sm:p-9 lg:p-12">
              <Headphones className="text-emerald-300" size={30} />
              <h2 className="mt-5 text-2xl font-black">{copy.contactTitle}</h2>
              <p className="mt-3 max-w-2xl leading-7 text-emerald-50/75">
                {copy.contactText}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/${locale}/dashboard/soporte`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 text-sm font-black text-emerald-950 hover:bg-lime-300"
                >
                  {copy.supportLabel}
                  <ArrowUpRight size={17} />
                </Link>
                <a
                  href="https://t.me/kintiAsesor_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-bold text-white hover:bg-white/15"
                >
                  {copy.telegramLabel}
                  <ArrowUpRight size={17} />
                </a>
              </div>
            </section>
          </article>
        </div>

        <footer className="border-t border-slate-200 bg-white px-5 py-8">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-between gap-4 text-center text-sm text-slate-500 sm:flex-row sm:text-left">
            <span>© 2026 Kinti</span>
            <Link
              href={legalPath(locale, otherKind)}
              className="font-bold text-emerald-800 hover:underline"
            >
              {copy.otherDocument}
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
