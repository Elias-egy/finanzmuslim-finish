import { useEffect, type ReactNode } from "react";
import { BadgeCheck } from "lucide-react";
import Seo from "@/components/Seo";
import NaechsterTeil from "@/components/NaechsterTeil";
import DepotAufruf from "@/components/vorlagen/DepotAufruf";
import DuaKarte from "@/components/vorlagen/DuaKarte";
import PdfKnopf from "@/components/vorlagen/PdfKnopf";
import { RIZQ_QUELLEN, RIZQ_RECHTSHINWEIS, RizqWarum } from "@/components/vorlagen/rizqTeile";
import { optinFreebie, vollPfad } from "@/data/optin";
import { anliegen, duas, nummerVon } from "@/data/duas";

/**
 * Die volle Fassung von „Dua für jede Situation“, das Freebie zum Wort „Amin“, nur über den Link aus der Mail
 * (noindex, nicht in der Sitemap). Alle 14 Bittgebete, geordnet nach Anliegen statt nach Quran und Sunnah
 * (Elias, 27.09.2026). Die offene Seite mit dem Ausschnitt ist `Rizq.tsx`.
 *
 * Seit MC7d16 im Stil der anderen Freebies (Elias, 01.11.2026, Vault `raw/2026-11-01-elias-mc7d16-antworten-dua-kompakt.md`:
 * „soll ja wie das andere sein, also bisschen übersichtlicher … die Duas sollen relativ schnell kommen … zu viel
 * Vorgerede … vor allem für Handy“): kein Motivbild, keine Brotkrumen, oben Titel und Anliegen, die ersten Duas auf dem
 * ersten Bildschirm, nach dem ersten Anliegen „Warum Rizq mehr ist als Geld“, der Depot-Aufruf nach der gebenden Hand
 * (vorher ein Knopf „Anbieter im Vergleich“), der Kasten ganz unten, Hinweise klein im Fuß.
 */
const freebie = optinFreebie("rizq")!;
const pfad = vollPfad(freebie);
const nachNummer = new Map(duas.map((d) => [nummerVon(d), d]));

/** Kurze Namen für die Knöpfe oben, damit sie am Handy in zwei Reihen passen. */
const KURZ = ["Jeden Tag", "Arbeit", "Schulden", "Entscheidungen"];

const amLink = (ziel: string, stelle: "top3" | "nr1" | "alle") => `${ziel}?src=am${stelle}`;

const GebendeHand = () => (
  <aside className="card-surface p-4 md:p-6">
    <p
      dir="rtl"
      lang="ar"
      style={{ fontFamily: '"Geeza Pro","Al Bayan",Tahoma,serif' }}
      className="text-right text-[22px] leading-loose text-foreground"
    >
      الْيَدُ الْعُلْيَا خَيْرٌ مِنَ الْيَدِ السُّفْلَى
    </p>
    <p className="mt-2 text-[16px] font-semibold leading-snug text-foreground">
      „Die gebende Hand ist besser als die nehmende Hand.“
    </p>
    <p className="mt-1 text-[12px] text-muted-foreground">
      Ṣaḥīḥ al-Buchari 1427, Ṣaḥīḥ Muslim 1033, überliefert von ʿAbdullāh ibn ʿUmar.
    </p>
    <p className="mt-3 text-[16px] leading-snug text-foreground/80">
      Geben setzt voraus, dass zuerst etwas da ist. Vermögen aus halal Quellen aufzubauen ist deshalb kein Widerspruch zum
      Bittgebet, sondern seine Fortsetzung.
    </p>
  </aside>
);

const Anliegen = ({ i, nach }: { i: number; nach?: ReactNode }) => {
  const a = anliegen[i];
  return (
    <section id={`anliegen-${i + 1}`} className="reveal mt-10 scroll-mt-20" aria-labelledby={`titel-anliegen-${i + 1}`}>
      <h2 id={`titel-anliegen-${i + 1}`} className="text-[24px] font-extrabold leading-tight text-foreground">
        {a.titel}
      </h2>
      <p className="mt-1 text-[16px] leading-snug text-foreground/70">{a.text}</p>
      <div className="mt-4 space-y-3">
        {a.nummern.map((n) => (
          <DuaKarte key={n} d={nachNummer.get(n)!} />
        ))}
        {nach}
      </div>
    </section>
  );
};

const RizqVoll = () => {
  // Sanftes Einblenden beim Scrollen wie in den anderen Freebies.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="bg-background" data-freebie="rizq" data-vorlage="rizq">
      <Seo
        title="Dua für jede Situation: alle 14 Bittgebete nach Anliegen | finanzmuslim"
        description="Lies alle 14 Duas für Rizq nach Anliegen: mit Arabisch, Übersetzung und Fundstelle."
        path={pfad}
        noindex
      />

      <div className="container max-w-2xl py-8 md:py-12">
        <header className="rounded-3xl bg-hero p-6 md:p-8">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[38px]">Dua für jede Situation</h1>
          <p className="mt-3 flex items-start gap-2 text-[16px] font-semibold leading-snug text-foreground">
            <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-gain" aria-hidden />
            <span>Alle {duas.length} mit Fundstelle aus Quran und Hadith.</span>
          </p>
          <nav aria-label="Anliegen" className="mt-5 flex flex-wrap gap-1.5">
            {anliegen.map((a, i) => (
              <a
                key={a.titel}
                href={`#anliegen-${i + 1}`}
                className="inline-flex min-h-[44px] items-center rounded-2xl bg-white px-3 text-[14px] font-semibold text-foreground ring-1 ring-black/5"
              >
                {KURZ[i] ?? a.titel}
              </a>
            ))}
          </nav>
          <PdfKnopf wort="amin" className="mt-4" />
        </header>
        <p className="mt-2 px-2 text-[12px] text-muted-foreground">Kein Dua ist ein Automat. Jedes steht hier, weil es belegt ist.</p>

        <Anliegen i={0} />

        <div className="reveal mt-10">
          <RizqWarum />
        </div>

        <Anliegen
          i={1}
          nach={
            <>
              <GebendeHand />
              {/* Statt des alten Knopfs „Anbieter im Vergleich“ der Depot-Aufruf aller Freebies (Vault
                  `memory/freebie-top3-statt-rot-guide-unten.md`). */}
              <div className="pt-6">
                <DepotAufruf titel="Die besten Broker für Muslime" link={amLink} />
              </div>
            </>
          }
        />

        {anliegen.slice(2).map((a, i) => (
          <Anliegen key={a.titel} i={i + 2} />
        ))}

        <section className="reveal mt-10" aria-labelledby="daneben">
          <h2 id="daneben" className="text-[24px] font-extrabold leading-tight text-foreground">
            Was daneben steht
          </h2>
          <p className="mt-1 text-[16px] leading-snug text-foreground/70">In den Quellen steht das Bittgebet nie allein.</p>
          <ul className="mt-4 grid gap-2">
            {DANEBEN.map((d) => (
              <li key={d.titel} className="card-surface p-4">
                <p className="text-[16px] font-bold text-foreground">{d.titel}</p>
                <p className="mt-1 text-[16px] leading-snug text-foreground/80">{d.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <NaechsterTeil wort="amin" className="mt-12" />

        <footer className="mt-12 space-y-2 border-t border-border pt-6 text-[12px] leading-relaxed text-muted-foreground">
          <p>
            Prüfe den arabischen Wortlaut vor dem Auswendiglernen an einem gedruckten Duabuch oder mit jemandem, der Arabisch
            liest. Bei Quranversen gilt die Rezitation nach den Regeln des Tajwid, eine Umschrift ersetzt sie nicht.
          </p>
          <p>{RIZQ_QUELLEN}</p>
          <p>{RIZQ_RECHTSHINWEIS}</p>
        </footer>
      </div>
    </main>
  );
};

/** Wortgleich aus der alten Fassung („Was daneben steht“), nur als Liste. */
const DANEBEN = [
  {
    titel: "Die erlaubte Quelle",
    text: "Ein Bittgebet um Rizq und ein Einkommen aus Zins passen nicht zusammen. Muslim 1015.",
  },
  {
    titel: "Das Verstreuen auf der Erde",
    text: "Nach dem Freitagsgebet heißt es, sich zu verteilen und nach Seiner Huld zu streben. Quran 62:10.",
  },
  {
    titel: "Das Geben",
    text: "Sadaqa mindert kein Vermögen, heißt es in der Überlieferung. Muslim 2588.",
  },
];

export default RizqVoll;
