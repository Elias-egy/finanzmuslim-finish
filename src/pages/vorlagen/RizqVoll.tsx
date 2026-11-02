import { useEffect, type ReactNode } from "react";
import { BadgeCheck } from "lucide-react";
import Seo from "@/components/Seo";
import NaechsterTeil from "@/components/NaechsterTeil";
import FindeDeinAngebot from "@/components/FindeDeinAngebot";
import DuaKarte from "@/components/vorlagen/DuaKarte";
import PdfKnopf from "@/components/vorlagen/PdfKnopf";
import { RIZQ_QUELLEN, RIZQ_RECHTSHINWEIS, RizqWarum } from "@/components/vorlagen/rizqTeile";
import { optinFreebie, vollPfad } from "@/data/optin";
import { anliegen, duas, nummerVon } from "@/data/duas";
import { logosFuer } from "@/lib/anbieterLogos";

/**
 * Die volle Fassung von „Dua für jede Situation“, das Freebie zum Wort „Amin“, nur über den Link aus der Mail
 * (noindex, nicht in der Sitemap). Alle 14 Bittgebete, geordnet nach Anliegen statt nach Quran und Sunnah
 * (Elias, 27.09.2026). Die offene Seite mit dem Ausschnitt ist `Rizq.tsx`.
 *
 * Seit MC7d16 im Stil der anderen Freebies (Elias, 01.11.2026, Vault `raw/2026-11-01-elias-mc7d16-antworten-dua-kompakt.md`:
 * „soll ja wie das andere sein, also bisschen übersichtlicher … die Duas sollen relativ schnell kommen … zu viel
 * Vorgerede … vor allem für Handy“): kein Motivbild, keine Brotkrumen, oben Titel und Anliegen, die ersten Duas auf dem
 * ersten Bildschirm, nach dem ersten Anliegen „Warum Rizq mehr ist als Geld“, nach der gebenden Hand seit MC7d17 zwei
 * kleine Aufrufe (Girokonto, Depot), der Kasten ganz unten, Hinweise klein im Fuß.
 */
const freebie = optinFreebie("rizq")!;
const pfad = vollPfad(freebie);
const nachNummer = new Map(duas.map((d) => [nummerVon(d), d]));

/** Kurze Namen für die Knöpfe oben, damit sie am Handy in zwei Reihen passen. */
const KURZ = ["Jeden Tag", "Arbeit", "Schulden", "Entscheidungen"];

const amLink = (ziel: string, stelle: "giro" | "depot") => `${ziel}?src=am${stelle}`;

/** Die Girokonten für die Logos: wie im Girokonto-Aufruf ohne die Norisbank, bis ihr Anbieter-Beleg vorliegt (giroTop2.ts). */
const GIRO_LOGOS = logosFuer("Girokonto");
const giroLogos = GIRO_LOGOS.logos.filter((l) => !/norisbank/i.test(l.domain ?? ""));

/**
 * Die gebende Hand klein wie eine Dua-Karte, direkt nach den Duas zur Arbeit (Elias, 02.11.2026, MC7d16: „Die gebende
 * Hand ist besser als die nehmende Hand. Verbinden und viel kleiner“; Vault `raw/2026-11-02-elias-mc7d16-feedback-runde-3.md`).
 */
const GebendeHand = () => (
  <aside className="card-surface p-4">
    <p
      dir="rtl"
      lang="ar"
      style={{ fontFamily: '"Geeza Pro","Al Bayan",Tahoma,serif' }}
      className="text-right text-[20px] leading-loose text-foreground"
    >
      الْيَدُ الْعُلْيَا خَيْرٌ مِنَ الْيَدِ السُّفْلَى
    </p>
    <p className="mt-1 text-[15px] leading-snug text-foreground/90">„Die gebende Hand ist besser als die nehmende Hand.“</p>
    <p className="mt-2 border-t border-border pt-2 text-[12px] text-muted-foreground">
      Ṣaḥīḥ al-Buchari 1427, Ṣaḥīḥ Muslim 1033, überliefert von ʿAbdullāh ibn ʿUmar.
    </p>
  </aside>
);

/**
 * Statt des Top-3-Depot-Aufrufs zwei kleine Aufrufe mit Logos (Elias, ebenda: „nicht diese drei Gewinner, sondern diese
 * kleineren Call to Actions … die mit den Logos“), davor ein Satz in seiner Richtung („Gebe deine Halal Geld für Halal
 * aus und erwerbe es Halal … schaffe es in Deutschland auch deine Finanzen Halal zu regeln“). Beleg für Erwerb und
 * Ausgabe: at-Tirmidhi 2417 (Abū Barzah al-Aslamī, bei at-Tirmidhi ḥasan ṣaḥīḥ). Zwei FindeDeinAngebot auf einer Seite
 * weichen hier Elias' Wort. Runde 4 (Elias, 02.11.2026, MC7d17): Satz „Nach deinem Geld wirst du gefragt …“ mit Fundstelle
 * raus („damit man ein bisschen weniger zu lesen hat“), Rest hochgezogen.
 */
const HalalRegeln = () => (
  <div className="pt-4">
    <h3 className="text-[22px] font-extrabold leading-tight text-foreground">Erwirb dein Geld halal und gib es halal aus.</h3>
    <p className="mt-2 text-[16px] font-semibold leading-snug text-foreground">
      So regelst du deine Finanzen auch in Deutschland halal:
    </p>
    <div className="mt-3 grid gap-3">
      <FindeDeinAngebot
        titel="Ein Girokonto ohne Zinsen"
        text="Ich habe gerankt, welche Girokonten dir in Deutschland keine Zinsen zahlen."
        knopf="Zum Girokonto-Vergleich"
        logos={giroLogos}
        gesamt={GIRO_LOGOS.gesamt}
        ziel={amLink("/vergleich/girokonto", "giro")}
      />
      <FindeDeinAngebot
        titel="Ein Depot ohne Zinsen"
        text="Ich habe gerankt, bei welchen Depots dein Guthaben ohne Zinsen bleibt und du Islamic ETFs kaufst."
        knopf="Zum Depot-Vergleich"
        ziel={amLink("/vergleich/depot", "depot")}
      />
    </div>
  </div>
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
              <HalalRegeln />
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
