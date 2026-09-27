/**
 * Texte und Blöcke, die die offene Seite „Dua für was?“ und ihre volle Fassung teilen.
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

export const RizqWarum = () => (
  <section className="rounded-2xl bg-hero p-6 md:p-8">
    <h2 className="text-xl font-bold text-foreground">Warum Rizq mehr ist als Geld</h2>
    <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">
      Rizq heißt Versorgung. Geld gehört dazu, aber auch Gesundheit, Zeit, Wissen und Menschen, die dir etwas beibringen.
      Wer nur um Geld bittet, bittet um den kleinsten Teil. Deshalb steht in mehreren dieser Duas das Wort <em>tayyib</em>,
      gut und rein, direkt neben dem Wort Rizq.
    </p>
  </section>
);

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
