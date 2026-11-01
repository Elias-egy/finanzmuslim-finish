import { useEffect } from "react";
import Seo from "@/components/Seo";
import NaechsterTeil from "@/components/NaechsterTeil";
import GiroAufruf from "@/components/vorlagen/GiroAufruf";
import PdfKnopf from "@/components/vorlagen/PdfKnopf";
import {
  AMPEL_QUELLEN,
  AMPEL_RECHTSHINWEIS,
  AmpelKarte,
  bewertung,
  legende,
  type Farbe,
} from "@/components/vorlagen/ampelTeile";
import { vorlageBySlug } from "@/data/vorlagen";
import { optinFreebie, vollPfad } from "@/data/optin";
import { zeilen } from "@/data/vertragsAmpel";

/**
 * Der volle Halal Vertrags-Check, das Freebie zum Wort „Vertrag“, nur über die Danke-Seite und den Link aus der Mail
 * (noindex, nicht in der Sitemap). Die offene Seite ist `VertragsAmpel.tsx`.
 *
 * Seit MC7d15 (01.11.2026) im Stil der Liste (Vault `memory/freebie-top3-statt-rot-guide-unten.md`): oben der Titel und
 * die drei Farben, dann je Farbe die Verträge als Karten, nach Grün (dort steht das Depot) die Top 3 Depots, der Kasten
 * „Dein nächster Schritt“ ganz unten, kein Krypto-Aufruf, PDF-Knopf im Kopf. Brotkrumen, die beiden Vergleichs-Kästen,
 * die Newsletter-Anmeldung und die Tabelle für den Laptop sind weg, damit der Leser beim Thema bleibt. Die Texte der
 * Verträge sind unverändert (`src/data/vertragsAmpel.ts`). Seit dem Feedback am selben Abend (Vault
 * `raw/2026-11-01-elias-mc7d15-feedback-alle-freebies.md`) ohne Gelb-Erklärung und drei Fragen, und nach Grün steht der
 * Girokonto-Aufruf statt der Top 3 Depots.
 */
const v = vorlageBySlug("vertrags-ampel")!;
const freebie = optinFreebie("vertrags-ampel")!;
const pfad = vollPfad(freebie);
const farben: Farbe[] = ["gruen", "gelb", "rot"];
// Klickzählung je Stelle, Kennungen in src/lib/attribution.ts.
const vertragLink = (ziel: string, stelle: "top2" | "alle") => `${ziel}?src=vtg${stelle}`;

const Gruppe = ({ farbe }: { farbe: Farbe }) => {
  const gruppe = zeilen.filter((z) => z.farbe === farbe);
  const b = bewertung[farbe];
  return (
    <section id={`farbe-${farbe}`} className="reveal mt-12 scroll-mt-20" aria-labelledby={`titel-${farbe}`}>
      <h2 id={`titel-${farbe}`} className="flex items-center gap-2.5 text-[24px] font-extrabold leading-tight text-foreground">
        <span className={`h-4 w-4 shrink-0 rounded-full ${b.punkt}`} aria-hidden />
        {b.wort}: {gruppe.length} Verträge
      </h2>
      <p className="mt-1 text-[16px] leading-snug text-foreground/80">{legende.find((l) => l.farbe === farbe)!.text}</p>
      <div className="mt-4 grid gap-2">
        {gruppe.map((z) => (
          <AmpelKarte key={z.vertrag} z={z} />
        ))}
      </div>
    </section>
  );
};

const VertragsAmpelVoll = () => {
  // Sanftes Einblenden beim Scrollen wie in der Liste.
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
    <main className="bg-background" data-freebie="vertrags-check" data-vorlage={v.slug}>
      <Seo
        title="Halal Vertrags-Check: alle zwölf Verträge mit Farbe | finanzmuslim"
        description="Sieh alle zwölf Verträge aus dem Alltag nach Farbe geordnet, jeweils mit der Bedingung dahinter."
        path={pfad}
        noindex
      />

      <div className="container max-w-2xl py-8 md:py-12">
        <header className="rounded-3xl bg-hero p-6 md:p-8">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[38px]">
            Haram oder halal: <span className="whitespace-nowrap">12 Verträge</span> aus dem Alltag
          </h1>
          <nav aria-label="Farben" className="mt-5 flex flex-wrap gap-1.5">
            {farben.map((f) => (
              <a
                key={f}
                href={`#farbe-${f}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-white px-3 text-[14px] font-semibold text-foreground ring-1 ring-black/5"
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${bewertung[f].punkt}`} aria-hidden />
                <span className="font-extrabold tabular-nums">{zeilen.filter((z) => z.farbe === f).length}</span>{" "}
                {bewertung[f].wort}
              </a>
            ))}
          </nav>
          <PdfKnopf wort="vertrag" className="mt-4" />
        </header>
        <p className="mt-2 px-2 text-[12px] text-muted-foreground">Bekannte Positionen, keine Fatwa.</p>

        <Gruppe farbe="gruen" />

        {/* Unter dem Girokonto, dem letzten grünen Vertrag, der Girokonto-Aufruf statt des Depot-Aufrufs (Elias, 01.11.2026,
            MC7d15: „Dann unter Girokonto machst du dann die Werbung rein. Girokonto ohne Zinsen“). */}
        <section className="reveal mt-10" aria-labelledby="giro">
          <h2 id="giro" className="text-[24px] font-extrabold leading-tight text-foreground">
            Girokonto ohne Zinsen
          </h2>
          <div className="mt-1">
            <GiroAufruf link={vertragLink} />
          </div>
        </section>

        <Gruppe farbe="gelb" />
        <Gruppe farbe="rot" />

        <NaechsterTeil wort="vertrag" className="mt-12" />

        <footer className="mt-12 space-y-2 border-t border-border pt-6 text-[12px] leading-relaxed text-muted-foreground">
          <p>{AMPEL_QUELLEN}</p>
          <p>{AMPEL_RECHTSHINWEIS}</p>
        </footer>
      </div>
    </main>
  );
};

export default VertragsAmpelVoll;
