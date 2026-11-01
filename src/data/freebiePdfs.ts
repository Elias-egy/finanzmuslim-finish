/**
 * Das PDF zum Runterladen je Freebie (Elias, 01.11.2026, MC7d14: „die Freebies, dass die einfach da in der Seite liegen
 * und man sie als PDF zusätzlich runterladen kann“, Vault `raw/2026-11-01-elias-mc7d14-ja-guides-pdf-freebies-seite.md`).
 * Seit MC7d15 entsteht das PDF aus der Seite selbst: `npx tsx scripts/freebie-pdf.ts` druckt jede Seite im Handy-Maß,
 * alles aufgeklappt, und legt die Datei unter `public/downloads/v/<schluessel>/` (per robots.txt gesperrt). Ändert sich
 * eine Seite, das Skript neu laufen lassen. Bewusst ohne Import mit `@/`, damit das Skript diese Datei direkt liest.
 */
export type FreebiePdf = {
  /** Die volle Seite, aus der gedruckt wird. */
  seite: string;
  /** Wo das PDF liegt; der Knopf auf der Seite zeigt hierhin. */
  datei: string;
  /** Name der Datei beim Speichern. */
  name: string;
  /** Alte offene Adressen, die dieselbe Datei bekommen (ein statischer Server kann ein PDF nicht umleiten). */
  auch?: string[];
};

export const FREEBIE_PDFS = {
  aktie: {
    seite: "/vorlagen/top-100-halal-aktien/voll-8mq4",
    datei: "/downloads/v/voll-8mq4/100-halal-aktien.pdf",
    name: "finanzmuslim-100-halal-aktien.pdf",
    auch: ["/downloads/100-halal-aktien.pdf"],
  },
  liste: {
    seite: "/vorlagen/halal-anlagen/voll-3tz9",
    datei: "/downloads/v/voll-3tz9/halal-anlagen-liste.pdf",
    name: "finanzmuslim-halal-investment-liste.pdf",
  },
  vertrag: {
    seite: "/vorlagen/vertrags-ampel/voll-6kd2",
    datei: "/downloads/v/voll-6kd2/vertrags-ampel.pdf",
    name: "finanzmuslim-halal-vertrags-check.pdf",
  },
  plan: {
    seite: "/dein-plan/invest-5rk8",
    datei: "/downloads/v/invest-5rk8/portfolio-plan.pdf",
    name: "finanzmuslim-portfolio-plan.pdf",
  },
  etf: {
    seite: "/dein-etf/etf-8wn3",
    datei: "/downloads/v/etf-8wn3/etf-plan.pdf",
    name: "finanzmuslim-etf-plan.pdf",
  },
  gold: {
    seite: "/dein-gold/gold-4hq7",
    datei: "/downloads/v/gold-4hq7/gold-plan.pdf",
    name: "finanzmuslim-gold-plan.pdf",
  },
  boykott: {
    seite: "/deine-boykottliste/bk-7m4q",
    datei: "/downloads/v/bk-7m4q/boykott-liste.pdf",
    name: "finanzmuslim-boykott-liste.pdf",
  },
} satisfies Record<string, FreebiePdf>;

export type FreebiePdfWort = keyof typeof FREEBIE_PDFS;
