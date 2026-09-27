import Seo from "@/components/Seo";
import VorlagenSeite from "@/components/VorlagenSeite";
import DuaKarte from "@/components/vorlagen/DuaKarte";
import { RIZQ_CTAS, RIZQ_EINLEITUNG, RIZQ_QUELLEN, RIZQ_RECHTSHINWEIS, RizqHinweis, RizqWarum } from "@/components/vorlagen/rizqTeile";
import { vorlageBySlug } from "@/data/vorlagen";
import { optinFreebie, vollPfad } from "@/data/optin";
import { anliegen, duas, nummerVon } from "@/data/duas";

/**
 * Die volle Fassung von „Dua für was?“, nur über die Danke-Seite und den Link aus der Mail
 * (noindex, nicht in der Sitemap). Alle 14 Bittgebete, geordnet nach Anliegen statt nach
 * Quran und Sunnah (Elias, 27.09.2026). Die offene Seite mit dem Ausschnitt ist `Rizq.tsx`.
 */
const v = vorlageBySlug("rizq")!;
const pfad = vollPfad(optinFreebie("rizq")!);
const nachNummer = new Map(duas.map((d) => [nummerVon(d), d]));

const GebendeHand = () => (
  <aside className="rounded-2xl bg-hero p-6 md:p-8">
    <p
      dir="rtl"
      lang="ar"
      style={{ fontFamily: '"Geeza Pro","Al Bayan",Tahoma,serif' }}
      className="text-right text-[20px] leading-loose text-foreground"
    >
      الْيَدُ الْعُلْيَا خَيْرٌ مِنَ الْيَدِ السُّفْلَى
    </p>
    <p className="mt-2 text-[14px] italic text-muted-foreground">Al-yadu l-ʿulyā khayrun mina l-yadi s-suflā</p>
    <p className="mt-2 text-[15px] font-medium leading-relaxed text-foreground">
      „Die gebende Hand ist besser als die nehmende Hand.“
    </p>
    <p className="mt-1 text-[12px] text-muted-foreground">
      Ṣaḥīḥ al-Buchari 1427, Ṣaḥīḥ Muslim 1033, überliefert von ʿAbdullāh ibn ʿUmar.
    </p>
    <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">
      Geben setzt voraus, dass zuerst etwas da ist. Als Muslim Vermögen aus halal Quellen aufzubauen ist deshalb kein
      Widerspruch zum Bittgebet, sondern seine Fortsetzung.
    </p>
    <a
      href="/vergleich/depot"
      className="mt-4 inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
    >
      Anbieter im Vergleich&nbsp;&nbsp;→
    </a>
  </aside>
);

const RizqVoll = () => (
  <>
    <Seo
      title="Dua für was? Alle 14 Bittgebete nach Anliegen | finanzmuslim"
      description="Alle 14 Duas für Rizq, geordnet nach Anliegen, mit Arabisch, Umschrift, Übersetzung und Fundstelle."
      path={pfad}
      noindex
    />
    <VorlagenSeite
      kicker={v.kicker}
      motiv={v.motiv}
      titel="Dua für was?"
      einleitung={RIZQ_EINLEITUNG}
      pdfPfad={v.pdfPfad}
      slug={v.slug}
      quellen={RIZQ_QUELLEN}
      rechtshinweis={RIZQ_RECHTSHINWEIS}
      ctas={RIZQ_CTAS}
    >
      <RizqWarum />

      <nav aria-label="Anliegen" className="flex flex-wrap gap-2">
        {anliegen.map((a, i) => (
          <a
            key={a.titel}
            href={`#anliegen-${i + 1}`}
            className="inline-flex min-h-[44px] items-center rounded-full border border-primary/25 bg-accent px-4 text-[14px] font-semibold text-primary hover:bg-primary/10"
          >
            {a.titel}
          </a>
        ))}
      </nav>

      {anliegen.map((a, i) => (
        <section key={a.titel} id={`anliegen-${i + 1}`} className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-foreground">{a.titel}</h2>
          <p className="mt-2 text-[15px] text-muted-foreground">{a.text}</p>
          <div className="mt-4 space-y-4">
            {a.nummern.map((n) => (
              <DuaKarte key={n} d={nachNummer.get(n)!} />
            ))}
            {i === 1 && <GebendeHand />}
          </div>
        </section>
      ))}

      <RizqHinweis />

      <section>
        <h2 className="text-2xl font-bold text-foreground">Was daneben steht</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          In den Quellen steht das Bittgebet nie allein. Drei Dinge werden ausdrücklich neben es gestellt.
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
              Nach dem Freitagsgebet heißt es, sich zu verteilen und nach Seiner Huld zu streben. Quran 62:10.
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

export default RizqVoll;
