/**
 * Farben, Legende und Pille der Vertrags-Ampel. Enthält keine Bewertung eines Vertrags, deshalb
 * darf die offene Seite es laden.
 */
export type Farbe = "gruen" | "gelb" | "rot";

/** Ampelfarben ausschließlich fuer Bewertungen. */
export const bewertung: Record<Farbe, { wort: string; punkt: string; pille: string }> = {
  gruen: {
    wort: "Grün",
    punkt: "bg-[hsl(var(--success))]",
    pille: "border-[hsl(var(--success)/0.35)] bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))]",
  },
  gelb: {
    wort: "Gelb",
    punkt: "bg-[hsl(var(--warning))]",
    pille: "border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.14)] text-[hsl(38_92%_32%)]",
  },
  rot: {
    wort: "Rot",
    punkt: "bg-[hsl(var(--destructive))]",
    pille: "border-[hsl(var(--destructive)/0.35)] bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))]",
  },
};

export const legende: { farbe: Farbe; text: string }[] = [
  { farbe: "gruen", text: "Zulässig, solange die Bedingung daneben erfüllt bleibt." },
  {
    farbe: "gelb",
    text: "Grundsätzlich problematisch, aber es gibt anerkannte Ausnahmen. Mit einem Gelehrten klären.",
  },
  { farbe: "rot", text: "Der Zins oder die Spekulation steckt im Vertrag selbst. Keine Bedingung rettet ihn." },
];

export const Pille = ({ farbe }: { farbe: Farbe }) => {
  const b = bewertung[farbe];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[13px] font-bold ${b.pille}`}>
      <span className={`h-3 w-3 rounded-full ${b.punkt}`} aria-hidden />
      {b.wort}
    </span>
  );
};

/** Urteil als Pille: Farbpunkt und Wort, damit die Farbe nicht allein trägt. */
export const UrteilPille = ({ farbe, urteil }: { farbe: Farbe; urteil: string }) => (
  <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[13px] font-bold ${bewertung[farbe].pille}`}>
    <span className={`h-3 w-3 shrink-0 rounded-full ${bewertung[farbe].punkt}`} aria-hidden />
    {urteil}
  </span>
);

export const Legende = () => (
  <section>
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

export const WarumGelb = () => (
  <section className="rounded-2xl bg-hero p-6 md:p-8">
    <h2 className="text-xl font-bold text-foreground">Warum es überhaupt Gelb gibt</h2>
    <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">
      Vieles ist nicht per se erlaubt oder verboten, sondern hängt an der Bedingung. Eine Versicherung, die du freiwillig
      abschließt, ist etwas anderes als eine, die der Gesetzgeber vorschreibt. Gelb heißt: prüfen, nicht raten.
    </p>
  </section>
);

/** Ein Vertrag als Karte, auf dem Handy und in der offenen Seite. */
export const AmpelKarte = ({ z }: { z: { vertrag: string; unter: string; farbe: Farbe; woran: string } }) => (
  <div className="card-surface p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <span className="block text-[16px] font-bold text-foreground">{z.vertrag}</span>
        <span className="mt-1 block text-[13px] text-muted-foreground">{z.unter}</span>
      </div>
      <Pille farbe={z.farbe} />
    </div>
    <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">{z.woran}</p>
  </div>
);

export const AMPEL_QUELLEN =
  "Zinsverbot: Quran 2:275 und 2:279, deutsche Übersetzung nach Bubenheim/Elyas. Glücksspiel und Spekulation: Quran 5:90. Screening von Anlagen: AAOIFI, Shariah Standard No. 21, Financial Paper, Shares and Bonds. Versicherung, Kreditkarte, Ratenkauf: Die hier wiedergegebene Einordnung folgt der Mehrheitsposition zeitgenössischer Fiqh-Gremien, insbesondere der OIC Islamic Fiqh Academy und AAOIFI. Die genauen Beschlussnummern sind noch nicht geprüft und werden nachgetragen.";

export const AMPEL_RECHTSHINWEIS =
  "Diese Seite gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Sie ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechts-, Steuer- oder Anlageberatung. In Zweifelsfällen, besonders bei allem, was gelb markiert ist, wende dich an einen Gelehrten, dem du vertraust, und lege ihm deinen konkreten Vertrag vor. Innerhalb der Rechtsschulen gibt es zu einzelnen Punkten abweichende Auffassungen.";

export const AMPEL_EINLEITUNG =
  "Depot, Kreditkarte, Versicherung, Ratenzahlung, Leasing. Zwölf Verträge, die fast jeder hat oder angeboten bekommt, jeweils mit einer klaren Farbe und der Bedingung dahinter.";

export const AMPEL_CTAS = [
  {
    titel: "Ein Konto ohne Zinsfalle",
    text: "Welches Girokonto ohne Guthabenzins und ohne aufgedrängten Dispo auskommt, und welche Karte ohne Kreditrahmen funktioniert.",
    buttonLabel: "Zu den Vergleichen",
    to: "/vergleiche",
  },
  {
    titel: "Das Depot als Ersatz für die Rentenversicherung",
    text: "Welcher Anbieter halale Anlagen führt und was er kostet. Dieselbe Funktion, ohne Zinsvertrag.",
    buttonLabel: "Depot-Vergleich",
    to: "/vergleich/depot",
  },
];
