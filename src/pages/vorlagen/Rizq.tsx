import Seo from "@/components/Seo";
import VorlagenSeite from "@/components/VorlagenSeite";
import { vorlageBySlug } from "@/data/vorlagen";
import { duas, type Dua } from "@/data/duas";

const v = vorlageBySlug("rizq")!;

const DuaKarte = ({ d }: { d: Dua }) => (
  <article className="card-surface p-5 md:p-6">
    <div className="flex flex-wrap items-baseline justify-between gap-3">
      <span className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">{d.nr}</span>
      <span className="text-[12px] text-muted-foreground">{d.when}</span>
    </div>
    <p
      dir="rtl"
      lang="ar"
      style={{ fontFamily: '"Geeza Pro","Al Bayan",Tahoma,serif' }}
      className={`mt-3 text-right leading-loose text-foreground ${d.kurz ? "text-[22px]" : "text-[24px]"}`}
    >
      {d.ar}
    </p>
    <p className="mt-3 text-[14px] italic leading-relaxed text-muted-foreground">{d.tr}</p>
    <p className="mt-2 text-[15px] leading-relaxed text-foreground/90">{d.de}</p>
    <p className="mt-3 border-t border-border pt-2 text-[12px] leading-relaxed text-muted-foreground">
      {d.quelle}
    </p>
  </article>
);

const Rizq = () => (
  <>
    <Seo
      title="14 Duas für Rizq, mit Quelle und Übersetzung | finanzmuslim"
      description="Sechs Bittgebete aus dem Quran, acht aus der Sunnah. Arabischer Wortlaut, Umschrift, deutsche Übersetzung und Fundstelle zu jedem Dua."
      path="/vorlagen/rizq"
      brotkrumen={[{ name: "Vorlagen", path: "/vorlagen" }, { name: "Duas für Rizq", path: "/vorlagen/rizq" }]}
    />
    <VorlagenSeite
      kicker={v.kicker}
      motiv={v.motiv}
      titel={v.titel}
      einleitung="Jedes Bittgebet hier steht mit arabischem Wortlaut, Umschrift, Übersetzung und Fundstelle. Kein Dua ist ein Automat, sie stehen hier, weil sie belegt sind, nicht weil sie ein Ergebnis versprechen."
      pdfPfad={v.pdfPfad}
      slug={v.slug}
      quellen="Quran: 2:201, 3:26, 3:173, 5:114, 28:24, 62:10, 71:10 bis 12. Deutsche Wiedergabe sinngemäß nach Bubenheim/Elyas. Hadith: Ṣaḥīḥ al-Buchari 1166, 2893, 6384, 6389; Ṣaḥīḥ Muslim 1015, 1054, 2588, 2690, 2704; Sunan at-Tirmidhi 3428, 3516, 3563; Sunan Ibn Māja 925, 3871; Sunan Abū Dāwūd 5074; al-Ḥākim, al-Mustadrak 1876. Die Nummerierung folgt der jeweils verbreiteten Zählung und kann je nach Ausgabe um wenige Stellen abweichen. Zum Überlieferungsgrad der einzelnen Hadithe äußert sich diese Seite nicht."
      rechtshinweis="Diese Seite sammelt überlieferte Bittgebete zu Bildungszwecken. Sie ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechts-, Steuer- oder Anlageberatung. Kein Bittgebet ist ein Versprechen auf ein bestimmtes Ergebnis. Prüfe den arabischen Wortlaut vor dem Auswendiglernen an einer gedruckten Ausgabe oder mit jemandem, der Arabisch liest."
      ctas={[
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
      ]}
    >
      <section className="rounded-2xl bg-hero p-6 md:p-8">
        <h2 className="text-xl font-bold text-foreground">Warum Rizq mehr ist als Geld</h2>
        <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">
          Rizq heißt Versorgung. Geld gehört dazu, aber auch Gesundheit, Zeit, Wissen und Menschen,
          die dir etwas beibringen. Wer nur um Geld bittet, bittet um den kleinsten Teil. Deshalb
          steht in mehreren dieser Duas das Wort <em>tayyib</em>, gut und rein, direkt neben dem
          Wort Rizq.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground">Aus dem Quran</h2>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Sechs Bittgebete, die im Quran selbst stehen.
        </p>
        <div className="mt-4 space-y-4">
          {duas.slice(0, 5).map((d) => (
            <DuaKarte key={d.nr} d={d} />
          ))}

          {/* Zwischen-CTA, bewusst mitten in der Quran-Liste statt erst am Ende:
              wer bis hier liest, ist im Thema, das ist der richtige Moment fuer
              den Bruecken-Gedanken von Bittgebet zu eigenem Handeln. */}
          <aside className="rounded-2xl bg-hero p-6 md:p-8">
            <p
              dir="rtl"
              lang="ar"
              style={{ fontFamily: '"Geeza Pro","Al Bayan",Tahoma,serif' }}
              className="text-right text-[20px] leading-loose text-foreground"
            >
              الْيَدُ الْعُلْيَا خَيْرٌ مِنَ الْيَدِ السُّفْلَى
            </p>
            <p className="mt-2 text-[14px] italic text-muted-foreground">
              Al-yadu l-ʿulyā khayrun mina l-yadi s-suflā
            </p>
            <p className="mt-2 text-[15px] font-medium leading-relaxed text-foreground">
              „Die gebende Hand ist besser als die nehmende Hand.“
            </p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Ṣaḥīḥ al-Buchari 1427, Ṣaḥīḥ Muslim 1033, überliefert von ʿAbdullāh ibn ʿUmar.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">
              Geben setzt voraus, dass zuerst etwas da ist. Als Muslim Vermögen aus halal Quellen
              aufzubauen ist deshalb kein Widerspruch zum Bittgebet, sondern seine Fortsetzung.
            </p>
            <a
              href="/vergleich/depot"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Anbieter im Vergleich&nbsp;&nbsp;→
            </a>
          </aside>

          {duas.slice(5, 6).map((d) => (
            <DuaKarte key={d.nr} d={d} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground">Aus der Sunnah</h2>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Acht überlieferte Bittgebete, mit Sammlung und Nummer zum Nachschlagen.
        </p>
        <div className="mt-4 space-y-4">
          {duas.slice(6).map((d) => (
            <DuaKarte key={d.nr} d={d} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.1)] p-6">
        <h2 className="text-xl font-bold text-foreground">Ein Hinweis, der zu diesem Blatt gehört</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-foreground/90">
          Der arabische Wortlaut ist nach den oben genannten Quellen wiedergegeben. Prüfe ihn vor
          dem Auswendiglernen an einem gedruckten Duabuch oder mit jemandem, der Arabisch liest.
          Bei Quranversen gilt die Rezitation nach den Regeln des Tajwid, eine Umschrift ersetzt
          sie nicht.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground">Was daneben steht</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          In den Quellen steht das Bittgebet nie allein. Drei Dinge werden ausdrücklich neben es
          gestellt.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="card-surface p-5">
            <h3 className="text-[16px] font-bold text-foreground">Die erlaubte Quelle</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              Ein Bittgebet um Rizq und ein Einkommen aus Zins passen nicht zusammen. Muslim 1015.
            </p>
          </div>
          <div className="card-surface p-5">
            <h3 className="text-[16px] font-bold text-foreground">Das Verstreuen auf der Erde</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              Nach dem Freitagsgebet heißt es, sich zu verteilen und nach Seiner Huld zu streben.
              Quran 62:10.
            </p>
          </div>
          <div className="card-surface p-5">
            <h3 className="text-[16px] font-bold text-foreground">Das Geben</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              Sadaqa mindert kein Vermögen, heißt es in der Überlieferung. Muslim 2588.
            </p>
          </div>
        </div>
      </section>
    </VorlagenSeite>
  </>
);

export default Rizq;
