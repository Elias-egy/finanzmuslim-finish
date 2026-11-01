/**
 * Texte und Blöcke, die die offene Seite „Dua für jede Situation“ (bis MC7d15 „Dua für was?“) und ihre volle Fassung teilen.
 * Enthält kein Bittgebet, deshalb darf die offene Seite es laden.
 */
export const RIZQ_QUELLEN =
  "Quran: 2:201, 3:26, 3:173, 5:114, 28:24, 62:10, 71:10 bis 12. Deutsche Wiedergabe sinngemäß nach Bubenheim/Elyas. Hadith: Ṣaḥīḥ al-Buchari 1166, 2893, 6384, 6389; Ṣaḥīḥ Muslim 1015, 1054, 2588, 2690, 2704; Sunan at-Tirmidhi 3428, 3516, 3563; Sunan Ibn Māja 925, 3871; Sunan Abū Dāwūd 5074; al-Ḥākim, al-Mustadrak 1876. Die Nummerierung folgt der jeweils verbreiteten Zählung und kann je nach Ausgabe um wenige Stellen abweichen. Zum Überlieferungsgrad der einzelnen Hadithe äußert sich diese Seite nicht.";

export const RIZQ_RECHTSHINWEIS =
  "Diese Seite sammelt überlieferte Bittgebete zu Bildungszwecken. Sie ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechts-, Steuer- oder Anlageberatung. Kein Bittgebet ist ein Versprechen auf ein bestimmtes Ergebnis. Prüfe den arabischen Wortlaut vor dem Auswendiglernen an einer gedruckten Ausgabe oder mit jemandem, der Arabisch liest.";

export const RIZQ_EINLEITUNG =
  "Finde das Bittgebet für dein Anliegen: Arbeit, Schulden oder eine Entscheidung. Kein Dua ist ein Automat, jedes steht hier, weil es belegt ist.";

export const RIZQ_CTAS = [
  {
    titel: "Erlaubte Quelle, nachprüfbar",
    text: "Anlagen mit Angabe, wer sie geprüft hat, und Link auf das Zertifikat. Keine Behauptung ohne Beleg.",
    buttonLabel: "Geprüfte Anlagen",
    to: "/halal-anlagen",
  },
  {
    titel: "Wo dein Geld liegt, ohne dass Zins mitläuft",
    text: "Welcher Anbieter halale Anlagen führt, was er kostet und wo im Hintergrund doch Zinsen gutgeschrieben werden.",
    buttonLabel: "Depot-Vergleich",
    to: "/vergleich/depot",
  },
];

/**
 * „Warum Rizq mehr ist als Geld“ mit der kleinen Grafik (Elias, 01.11.2026, MC7d15: „Da kannst du eine kleine Grafik
 * machen“). Seit MC7d16 ohne Icons und kürzer (Elias: „da sind die Zeichen auch nicht richtig eingebaut … zu viel
 * Vorgerede“): ein Balken in fünf Farben, Geld ist ein Teil davon.
 */
export const RizqWarum = () => (
  <section className="rounded-3xl bg-accent p-5 md:p-6" aria-labelledby="rizq-warum">
    <h2 id="rizq-warum" className="text-[22px] font-extrabold leading-tight text-foreground">
      Warum Rizq mehr ist als Geld
    </h2>
    <p className="mt-2 text-[16px] leading-snug text-foreground/80">Rizq heißt Versorgung. Geld ist nur ein Teil davon.</p>
    <div className="mt-4 flex h-3 gap-[3px]" aria-hidden>
      {RIZQ_TEILE.map((t) => (
        <span key={t.wort} className="h-full flex-1 first:rounded-l-full last:rounded-r-full" style={{ background: t.farbe }} />
      ))}
    </div>
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Was zu Rizq gehört">
      {RIZQ_TEILE.map((t) => (
        <li key={t.wort} className="flex items-center gap-1.5 text-[14px] font-semibold text-foreground">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: t.farbe }} aria-hidden />
          {t.wort}
        </li>
      ))}
    </ul>
    <p className="mt-4 text-[16px] leading-snug text-foreground/80">
      Darum steht in mehreren dieser Duas <em>tayyib</em>, gut und rein, direkt neben dem Wort Rizq.
    </p>
  </section>
);

const RIZQ_TEILE = [
  { wort: "Geld", farbe: "#E0A21A" },
  { wort: "Gesundheit", farbe: "#0E9F8A" },
  { wort: "Zeit", farbe: "#0057FA" },
  { wort: "Wissen", farbe: "#705FF1" },
  { wort: "Menschen", farbe: "#F26B1D" },
];

export const RizqHinweis = () => (
  <section className="rounded-2xl border border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.1)] p-6">
    <h2 className="text-xl font-bold text-foreground">Ein Hinweis, der zu diesem Blatt gehört</h2>
    <p className="mt-2 text-[15px] leading-relaxed text-foreground/90">
      Der arabische Wortlaut ist nach den oben genannten Quellen wiedergegeben. Prüfe ihn vor dem Auswendiglernen an einem
      gedruckten Duabuch oder mit jemandem, der Arabisch liest. Bei Quranversen gilt die Rezitation nach den Regeln des
      Tajwid, eine Umschrift ersetzt sie nicht.
    </p>
  </section>
);
