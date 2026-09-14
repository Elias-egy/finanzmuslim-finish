import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
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

/**
 * Die gemeinsame Vorlage aller Vergleichsseiten.
 *
 * Depot und Girokonto liefern nur Texte, Zeilen und Anbieter. Alles Weitere
 * ist hier gleich, damit die beiden Seiten nicht auseinanderlaufen und ein
 * dritter Vergleich in einer halben Stunde steht.
 *
 * Auf dem Laptop die gedrehte Tabelle, auf dem Handy die Karten. Beide zeigen
 * dieselben Daten, nur anders sortiert.
 */
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
  filter: Array<{ key: string; label: string }>;
  stand: string;
  standHinweis?: string;
  /** Woher die Kosten und Konditionen stammen, steht unter der Tabelle. */
  quellenHinweis: string;
  kriterien: Array<{ titel: string; text: string }>;
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
  faq,
  schluss,
}: VergleichsSeiteProps) => {
  const [aktiv, setAktiv] = useState<string[]>([]);

  const umschalten = (key: string) =>
    setAktiv((alt) => (alt.includes(key) ? alt.filter((k) => k !== key) : [...alt, key]));

  /* Ein Filter greift nur auf geprueftes "gut". Unbekannt faellt bewusst raus:
     wer nach Anbietern ohne Guthabenzins sucht, will keine Anbieter sehen,
     bei denen wir es schlicht nicht wissen. */
  const gefiltert = anbieter.filter((a) => aktiv.every((k) => a.werte[k] === "gut"));

  const spalten = baueSpalten(gefiltert, zeilen);
  const halalAnzahl = zeilen.filter((z) => z.gruppe === "halal").length;

  return (
    <main className="bg-background">
      <Seo title={seoTitel} description={seoText} path={pfad} brotkrumen={[
        { name: "Vergleiche", path: "/vergleiche" },
        { name: brotkrumen, path: pfad },
      ]} />

      <div className="container py-10 md:py-14">
        <VergleichsBrotkrumen titel={brotkrumen} />

        <header className="mt-6 max-w-3xl">
          <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">{titel}</h1>
          <p className="mt-2 text-[17px] text-muted-foreground">{untertitel}</p>
          <div className="mt-5 space-y-3 text-[17px] leading-[26px] text-foreground/90">
            {einleitung}
          </div>
        </header>

        <VergleichsLeiste
          kennzahlen={[
            { zahl: anbieter.length, text: `${einheit} im Vergleich` },
            { zahl: halalAnzahl, text: "Halal-Merkmale" },
            { zahl: anzahlHalalGeprueft(anbieter, zeilen), text: "Halal vollständig geprüft" },
          ]}
          stand={stand}
          standHinweis={standHinweis}
        />

        <ReihenfolgeHinweis einheit={einheit} />

        <section className="card-surface mt-10 p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground">Worauf wir bei Halal achten</h2>
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

        <section className="mt-10 rounded-lg border border-border p-4 md:p-5" aria-label="Filter">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
            <p className="text-[14px] text-muted-foreground md:shrink-0">
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
            <div className="mt-6 lg:hidden">
              <VergleichsKarten zeilen={zeilen} spalten={spalten} />
            </div>
          </>
        )}

        <p className="mt-6 text-[13px] text-muted-foreground">{quellenHinweis}</p>
        <p className="mt-2 text-[13px] text-muted-foreground">
          * Mit Stern markierte Links sind Werbe- oder Affiliate-Links. Wenn du darüber ein Produkt
          abschließt, erhalte ich eine Provision. Für dich entstehen dadurch keine Mehrkosten.
        </p>

        <section className="mt-14 max-w-3xl">
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

        <p className="mt-12 text-[13px] leading-relaxed text-muted-foreground">{schluss}</p>
      </div>
    </main>
  );
};

export default VergleichsSeite;
