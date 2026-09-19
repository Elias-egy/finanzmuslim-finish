import { useState, type ReactNode } from "react";
import { ArrowRight, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import Seo, { vergleichJsonLd } from "@/components/Seo";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  VergleichsBrotkrumen,
  VergleichsLeiste,
  ReihenfolgeHinweis,
} from "./VergleichsRahmen";
import { VergleichsTabelle } from "./VergleichsTabelle";
import { VergleichsKarten } from "./VergleichsKarten";
import type { VergleichsZeile } from "./vergleichTypen";
import { baueSpalten, anzahlHalalGeprueft, type RohAnbieter } from "@/data/vergleichHelfer";

/** Vergleiche, für die es den geführten Einstieg gibt. */
const MIT_ASSISTENT = ["/vergleich/depot", "/vergleich/girokonto", "/vergleich/krypto"];

/**
 * Die gemeinsame Vorlage aller Vergleichsseiten.
 *
 * Depot und Girokonto liefern nur Texte, Zeilen und Anbieter. Alles Weitere
 * ist hier gleich, damit die beiden Seiten nicht auseinanderlaufen und ein
 * dritter Vergleich in einer halben Stunde steht.
 *
 * Auf dem Laptop die gedrehte Tabelle, auf dem Handy die Karten. Beide zeigen
 * dieselben Daten, nur anders sortiert.
 *
 * Handy (unter `lg`): Die erste Karte soll auf dem ersten Bildschirm stehen.
 * Einleitung, Kennzahlen und "Worauf wir achten" rutschen deshalb per `order`
 * unter die Liste, der Filter ist zugeklappt. Das DOM bleibt in der
 * Laptop-Reihenfolge, es gibt keinen Text doppelt.
 */
const NACH_LISTE = "order-1 lg:order-none";
const AM_ENDE = "order-2 lg:order-none";
export type VergleichsSeiteProps = {
  pfad: string;
  brotkrumen: string;
  titel: string;
  untertitel: string;
  seoTitel: string;
  seoText: string;
  einleitung: ReactNode;
  einheit: string;
  zeilen: VergleichsZeile[];
  anbieter: RohAnbieter[];
  /** `erlaubt`: welche Ampelstufen der Filter durchlässt. Standard nur geprüftes "gut". */
  filter: Array<{ key: string; label: string; erlaubt?: string[] }>;
  stand: string;
  standHinweis?: string;
  /** Woher die Kosten und Konditionen stammen, steht unter der Tabelle. */
  quellenHinweis: string;
  kriterien: Array<{ titel: string; text: string }>;
  /**
   * Überschrift über den Kriterien. Standard ist die Halal-Fassung. Ein
   * Vergleich ohne Halal-Frage, etwa Steuersoftware, setzt hier seine eigene.
   */
  kriterienTitel?: string;
  /**
   * Zahlen in der Leiste über der Tabelle. Standard sind die Halal-Merkmale.
   * Ein Vergleich ohne Halal-Merkmale zählt etwas anderes, sonst stünde dort
   * dreimal die Null.
   */
  kennzahlen?: Array<{ zahl: number; text: string }>;
  /** Ersetzt den Hinweis zur Reihenfolge, der sonst von Halal-Merkmalen spricht. */
  reihenfolge?: ReactNode;
  /** Freier Abschnitt unter der Tabelle. Für Erklärungen, die nur einen Vergleich betreffen. */
  zusatz?: ReactNode;
  faq: Array<{ frage: string; antwort: string }>;
  schluss: string;
};

export const VergleichsSeite = ({
  pfad,
  brotkrumen,
  titel,
  untertitel,
  seoTitel,
  seoText,
  einleitung,
  einheit,
  zeilen,
  anbieter,
  filter,
  stand,
  standHinweis,
  quellenHinweis,
  kriterien,
  kriterienTitel = "Worauf wir bei Halal achten",
  kennzahlen,
  reihenfolge,
  zusatz,
  faq,
  schluss,
}: VergleichsSeiteProps) => {
  const [aktiv, setAktiv] = useState<string[]>([]);
  const [filterOffen, setFilterOffen] = useState(false);

  const umschalten = (key: string) =>
    setAktiv((alt) => (alt.includes(key) ? alt.filter((k) => k !== key) : [...alt, key]));

  /* Ein Filter greift nur auf geprueftes "gut". Unbekannt faellt bewusst raus:
     wer nach Anbietern ohne Guthabenzins sucht, will keine Anbieter sehen,
     bei denen wir es schlicht nicht wissen. */
  const gefiltert = anbieter.filter((a) =>
    aktiv.every((k) => {
      const erlaubt = filter.find((f) => f.key === k)?.erlaubt ?? ["gut"];
      return erlaubt.includes(String(a.werte[k]));
    }),
  );

  const spalten = baueSpalten(gefiltert, zeilen);
  const halalAnzahl = zeilen.filter((z) => z.gruppe === "halal").length;

  return (
    <main className="bg-background">
      <Seo
        title={seoTitel}
        description={seoText}
        path={pfad}
        jsonLd={vergleichJsonLd({ titel: seoTitel, beschreibung: seoText, path: pfad, faq })}
        brotkrumen={[
          { name: "Vergleiche", path: "/vergleiche" },
          { name: brotkrumen, path: pfad },
        ]}
      />

      <div className="container flex flex-col py-6 md:py-14">
        <VergleichsBrotkrumen titel={brotkrumen} />

        <header className="mt-4 max-w-3xl lg:mt-6">
          <h1 className="text-[28px] font-bold leading-tight text-foreground md:text-4xl">{titel}</h1>
          <p className="mt-2 text-[16px] text-muted-foreground lg:text-[17px]">{untertitel}</p>
          <p className="mt-1 text-[13px] text-muted-foreground lg:hidden">Elias El-Gendy · Stand: {stand}</p>
        </header>

        <div className={`${NACH_LISTE} mt-10 max-w-3xl space-y-3 text-[17px] leading-[26px] text-foreground/90 lg:mt-5`}>
          {einleitung}
        </div>

        {MIT_ASSISTENT.includes(pfad) && (
          <Link
            to="/vergleich/start"
            className="mt-4 flex min-h-[56px] items-center justify-between gap-3 rounded-xl border border-primary/30 bg-hero px-4 py-2.5 text-[15px] text-foreground transition-colors hover:border-primary lg:mt-6 lg:max-w-3xl"
          >
            <span>
              <span className="font-bold">Ein paar Fragen statt {anbieter.length} {einheit}.</span> Sieh, was zu dir passt.
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          </Link>
        )}

        <VergleichsLeiste
          className={NACH_LISTE}
          kennzahlen={
            kennzahlen ?? [
              { zahl: anbieter.length, text: `${einheit} im Vergleich` },
              { zahl: halalAnzahl, text: "Halal-Merkmale" },
              { zahl: anzahlHalalGeprueft(anbieter, zeilen), text: "Halal vollständig geprüft" },
            ]
          }
          stand={stand}
          standHinweis={standHinweis}
        />

        {reihenfolge ?? <ReihenfolgeHinweis einheit={einheit} />}

        <section className={`${NACH_LISTE} card-surface mt-10 p-6 md:p-8`}>
          <h2 className="text-xl font-bold text-foreground">{kriterienTitel}</h2>
          <ul className="mt-4 space-y-4">
            {kriterien.map((punkt) => (
              <li key={punkt.titel}>
                <p className="text-[15px] font-semibold text-foreground">{punkt.titel}</p>
                <p className="text-[15px] text-muted-foreground">{punkt.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[15px]">
            <Link to="/vergleiche/methodik" className="font-semibold text-primary hover:underline">
              So entsteht die Bewertung
            </Link>
          </p>
        </section>

        <section className="mt-4 rounded-lg border border-border lg:mt-10 lg:p-5" aria-label="Filter">
          <button
            type="button"
            onClick={() => setFilterOffen((o) => !o)}
            aria-expanded={filterOffen}
            className="flex min-h-[52px] w-full items-center gap-2.5 px-4 text-left text-[15px] font-semibold text-foreground lg:hidden"
          >
            <SlidersHorizontal className="h-[18px] w-[18px] text-primary" aria-hidden />
            Filter
            {aktiv.length > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[12px] font-bold text-primary-foreground">{aktiv.length}</span>
            )}
            <span className="ml-auto text-[14px] font-normal text-muted-foreground">
              {gefiltert.length} von {anbieter.length}
            </span>
            <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${filterOffen ? "rotate-180" : ""}`} aria-hidden />
          </button>
          <div
            className={`${filterOffen ? "flex" : "hidden"} flex-col gap-4 border-t border-border p-4 md:flex-row md:items-center md:justify-between lg:flex lg:border-t-0 lg:p-0`}
          >
            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-6">
              {filter.map((f) => (
                <label
                  key={f.key}
                  className="flex min-h-[44px] cursor-pointer items-center gap-3 text-[15px] text-foreground"
                >
                  <Switch
                    checked={aktiv.includes(f.key)}
                    onCheckedChange={() => umschalten(f.key)}
                  />
                  <span>{f.label}</span>
                </label>
              ))}
            </div>
            <p className="hidden text-[14px] text-muted-foreground md:shrink-0 lg:block">
              {gefiltert.length} von {anbieter.length} {einheit}
            </p>
          </div>
        </section>

        {gefiltert.length === 0 ? (
          <p className="mt-6 rounded-lg border border-border p-6 text-[15px] text-muted-foreground">
            Zu dieser Auswahl liegen noch keine geprüften {einheit} vor. Die Merkmale sind
            eingetragen, aber noch nicht nachgesehen.
          </p>
        ) : (
          <>
            {/* Laptop: gedrehte Tabelle. Handy: Karten. */}
            <div className="mt-6 hidden lg:block">
              <VergleichsTabelle zeilen={zeilen} spalten={spalten} />
            </div>
            <div className="mt-4 lg:hidden">
              <VergleichsKarten zeilen={zeilen} spalten={spalten} />
            </div>
          </>
        )}

        <p className="mt-6 text-[13px] text-muted-foreground">{quellenHinweis}</p>
        <p className="mt-2 text-[13px] text-muted-foreground">
          * Mit Stern markierte Links sind Werbe- oder Affiliate-Links. Wenn du darüber ein Produkt
          abschließt, erhalte ich eine Provision. Für dich entstehen dadurch keine Mehrkosten.
        </p>

        {zusatz && <div className={AM_ENDE}>{zusatz}</div>}

        <section className={`${AM_ENDE} mt-14 max-w-3xl`}>
          <h2 className="text-2xl font-bold text-foreground">Häufige Fragen</h2>
          <Accordion type="single" collapsible className="mt-4">
            {faq.map((item) => (
              <AccordionItem key={item.frage} value={item.frage}>
                <AccordionTrigger className="text-left text-[16px] font-semibold">
                  {item.frage}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                  {item.antwort}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <p className={`${AM_ENDE} mt-12 text-[13px] leading-relaxed text-muted-foreground`}>{schluss}</p>
      </div>
    </main>
  );
};

export default VergleichsSeite;
