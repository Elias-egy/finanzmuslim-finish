import { bewertung, UrteilPille, type Farbe } from "@/components/vorlagen/ampelTeile";
import type { GoldFall } from "@/data/goldCheck";

/**
 * Legende, Grundregel und Fall-Karte des Gold-Checks. Enthält kein Urteil über einen Fall, deshalb
 * darf die offene Seite es laden. Die Fälle selbst stehen in `goldCheck.ts` (voll) und
 * `goldCheckAusschnitt.ts` (offen).
 */
const legende: { farbe: Farbe; text: string }[] = [
  { farbe: "gruen", text: "Zulässig, solange die Bedingung im Grund erfüllt ist." },
  { farbe: "gelb", text: "Kommt auf den Vertrag an, oder Gelehrte sind uneins. Prüfen, nicht raten." },
  { farbe: "rot", text: "Fällt weg. Keine Bedingung rettet dieses Geschäft, das Beispiel zeigt den sauberen Weg." },
];

export const GoldLegende = () => (
  <section aria-label="Was die Farben bedeuten">
    <div className="grid gap-4 md:grid-cols-3">
      {legende.map((l) => (
        <div key={l.farbe} className="card-surface p-5">
          <div className="flex items-center gap-3">
            <span className={`h-5 w-5 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15)] ${bewertung[l.farbe].punkt}`} aria-hidden />
            <span className="text-[17px] font-bold text-foreground">{bewertung[l.farbe].wort}</span>
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{l.text}</p>
        </div>
      ))}
    </div>
  </section>
);

export const Grundregel = () => (
  <section className="rounded-2xl bg-hero p-6 md:p-8" aria-labelledby="grundregel">
    <span className="badge-new">Die Grundregel</span>
    <h2 id="grundregel" className="mt-3 text-2xl font-bold text-foreground">
      Hand zu Hand
    </h2>
    <p className="mt-3 text-[17px] leading-relaxed text-foreground/90">
      Gold gilt im Islam als Geld, nicht als gewöhnliche Ware. Deshalb wechseln Geld und Gold im selben Moment den
      Besitzer, und Gold gegen Gold geht nur im gleichen Gewicht.
    </p>
    <p className="mt-3 text-[16px] leading-relaxed text-foreground/90">
      Hand zu Hand heißt nicht, dass du den Barren in der Hand halten musst. Es reicht, wenn dir ein bestimmtes Stück
      oder ein fest zugeteilter Anteil gehört, sobald dein Geld unwiderruflich rausgeht.
    </p>
  </section>
);

/** Ein Fall mit Urteil, Grund und Beispiel. */
export const FallKarte = ({ f }: { f: GoldFall }) => (
  <article className="card-surface p-5 md:p-6" aria-labelledby={`fall-${f.id}`}>
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 id={`fall-${f.id}`} className="text-[17px] font-bold text-foreground">
          {f.fall}
        </h3>
        <span className="mt-1 block text-[13px] text-muted-foreground">{f.unter}</span>
      </div>
      <UrteilPille farbe={f.farbe} urteil={f.urteil} />
    </div>
    <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">{f.grund}</p>
    <div className="mt-4 rounded-xl bg-accent p-4">
      <span className="text-[12px] font-bold uppercase tracking-wide text-primary">Beispiel</span>
      <p className="mt-1 text-[15px] leading-relaxed text-foreground/90">{f.beispiel}</p>
    </div>
  </article>
);

export const GOLD_EINLEITUNG =
  "Prüfe zehn Wege, Gold zu kaufen, vom Barren beim Händler bis zum Sparplan. Zu jedem das Urteil, der Grund und ein Beispiel aus der Praxis.";

export const GOLD_QUELLEN =
  "Grundregel: Hadith von Ubada ibn as-Samit, Sahih Muslim 1587. Tausch, Zuteilung und Kartenzahlung: AAOIFI Shariah Standard No. 57, Gold and Its Trading Controls, Ziffern 3/1, 3/4 und 10/4, Gold-ETFs Ziffer 10/3. Beispielbeträge rechnen mit dem Goldpreis aus unserem Zakat-Rechner, den Stand nennt jedes Beispiel. Angaben zu INAIA, Royal Mint und WisdomTree: Seiten und Zertifikate der Anbieter, Stand 16.09.2026, verlinkt im Edelmetall-Vergleich.";

export const GOLD_RECHTSHINWEIS =
  "Diese Seite gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Sie ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechts-, Steuer- oder Anlageberatung. Bei allem, was gelb markiert ist, lege deinen konkreten Vertrag einem Gelehrten vor, dem du vertraust.";

export const GOLD_CTAS = [
  {
    titel: "Alle Wege zu echtem Gold",
    text: "Sieh Barren, Sparplan mit Zuteilung und zertifizierte ETCs nebeneinander, mit Anbietern und Nachweisen.",
    buttonLabel: "Edelmetall-Vergleich",
    to: "/vergleich/edelmetalle",
  },
  {
    titel: "Zakat auf dein Gold",
    text: "Rechne Gold, Silber und Ersparnisse zusammen und sieh, ob du über dem Nisab liegst.",
    buttonLabel: "Zum Zakat-Rechner",
    to: "/zakat-rechner",
  },
];
