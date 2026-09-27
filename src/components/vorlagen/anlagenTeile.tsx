import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { AnlageLogo } from "@/components/AnlageZeile";
import { RenditeWert } from "@/components/Rendite";
import type { Anlage, Kategorie } from "@/data/halalAnlagen";
import { ANZAHL_KAUFBAR } from "@/data/halalAnlagenZahl";
import { kursFuerAnlage, spanneVeraenderung, zeitraumReihe } from "@/lib/kurse";

/**
 * Texte und Blöcke, die die offene Seite „Halal-Anlagen“ und ihre volle Fassung teilen. Enthält
 * keine Kaufbarkeit, deshalb darf die offene Seite es laden.
 */

/** Farbpunkt je Anlageart, dieselben Farben wie in der Anlagendatenbank. */
export const artFarbe = (k: Kategorie) =>
  k === "sukuk"
    ? "hsl(var(--asset-sukuk))"
    : k === "gold" || k === "rohstoffe"
      ? "hsl(var(--asset-gold))"
      : k === "silber"
        ? "hsl(var(--asset-silber))"
        : k === "krypto"
          ? "hsl(var(--violet))"
          : "hsl(var(--primary))";

/** Kopf einer Anlage: Logo, Name mit Link zur Detailseite, ISIN und Prüfstelle, Entwicklung über ein Jahr. */
export const AnlageKopf = ({ a }: { a: Anlage }) => {
  const jahr = spanneVeraenderung(zeitraumReihe(kursFuerAnlage(a), "1j").reihe);
  return (
    <Link to={`/halal-anlagen/${a.slug}`} className="group flex items-center gap-3">
      <AnlageLogo a={a} />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold leading-snug text-foreground group-hover:text-primary md:text-[16px]">
          {a.name}
        </span>
        <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{a.zertifizierer}</span>
        <span className="mt-1 block text-[12px] text-muted-foreground [font-variant-numeric:tabular-nums]">
          {a.isin ?? a.kuerzel ?? ""}
        </span>
      </span>
      {jahr !== null && (
        <span className="flex shrink-0 flex-col items-end gap-0.5">
          <RenditeWert wert={jahr} mittel />
          <span className="text-[11px] text-muted-foreground">in 1 Jahr</span>
        </span>
      )}
      <ChevronRight className="h-4 w-4 shrink-0 text-primary" aria-hidden />
    </Link>
  );
};

export const ANLAGEN_SEO_TITEL = `Halal Anlagen Liste: ${ANZAHL_KAUFBAR} kaufbare Produkte mit ISIN | finanzmuslim`;

export const ANLAGEN_EINLEITUNG =
  "Finde die Halal-Anlagen mit Kaufbeleg: Aktien-ETFs, Sukuk und Edelmetalle. Zu jeder die ISIN, die Prüfstelle und die Anbieter, bei denen du sie kaufen kannst.";

export const ANLAGEN_QUELLEN =
  "Screening-Kriterien: AAOIFI, Shariah Standard No. 21, Financial Paper, Shares and Bonds. Gold und Silber: AAOIFI Standard No. 1, jeweils bestätigt durch das Zertifikat des genannten Panels. Kaufbarkeit: Einzelbeleg je Anbieter mit Datum, aus dessen Wertpapiersuche oder Produktliste, aus einem vom Anbieter verlinkten Verzeichnis oder aus meiner eigenen Prüfung in der App, Stand September 2026. Ein Anbieter, der hier fehlt, ist noch nicht geprüft, nicht ausgeschlossen. Zertifizierungen werden jährlich erneuert, vor dem Kauf selbst prüfen.";

export const ANLAGEN_RECHTSHINWEIS =
  "Die auf dieser Seite genannten Anlagen sind auch dann, wenn einzelne Emittenten oder Finanzinstrumente genannt werden, nicht als Anlageberatung zu verstehen und stellen weder direkt noch indirekt eine Empfehlung oder Aufforderung zum Kaufen, Halten oder Verkaufen eines Finanzinstruments dar. Dieser Inhalt dient ausschließlich zu Bildungszwecken. Alle Investitionsentscheidungen triffst du eigenverantwortlich. Vergangene Renditen sind keine Garantie für zukünftige Ergebnisse.";

export const ANLAGEN_CTAS = [
  {
    titel: "Nicht jeder Broker führt diese Anlagen",
    text: "Viele deutsche Anbieter haben weder Islamic-ETFs noch Sukuk oder physisch hinterlegtes Gold im Angebot. Wer was führt, steht im Vergleich.",
    buttonLabel: "Depot-Vergleich",
    to: "/vergleich/depot",
  },
  {
    titel: "Aktien selbst prüfen, in 60 Sekunden",
    text: "Der Spickzettel zeigt dir die drei Grenzwerte, nach denen jeder Screener entscheidet.",
    buttonLabel: "Zum Spickzettel",
    to: "/vorlagen/aktien-check",
  },
];

export const WasNicht = () => (
  <section className="rounded-2xl bg-hero p-6 md:p-8">
    <h2 className="text-xl font-bold text-foreground">Was diese Liste nicht ist</h2>
    <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">
      Keine Empfehlung und keine Anlageberatung. Eine Übersicht dessen, was es gibt und wer es geprüft hat. Du entscheidest,
      was zu dir passt.
    </p>
  </section>
);
