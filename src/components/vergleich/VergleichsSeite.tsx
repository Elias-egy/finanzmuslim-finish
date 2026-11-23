import { useState, type ReactNode } from "react";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import eliasAutor from "@/assets/elias-autor.webp";
import Seo, { vergleichJsonLd } from "@/components/Seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  VergleichsBrotkrumen,
  Kennzahlen,
  NummerEins,
  ZweiNummerEins,
  ReihenfolgeHinweis,
} from "./VergleichsRahmen";
import { VergleichsTabelle } from "./VergleichsTabelle";
import { FilterLeiste } from "./FilterLeiste";
import { WeitereVergleiche } from "./WeitereVergleiche";
import { SEITE, VergleichsKarten } from "./VergleichsKarten";
import type { VergleichsZeile } from "./vergleichTypen";
import {
  baueSpalten,
  anzahlHalalGeprueft,
  meisteHalalVon,
  type RohAnbieter,
} from "@/data/vergleichHelfer";
import { LINK_VORRANG, rangfolge, type RangKategorie } from "@/lib/rangfolge";
import { siegerDerSeite } from "@/lib/vergleichAssistent";
import { ANSICHT_A3, ansichtA3, platzZeilen, type AnsichtEintrag } from "@/lib/platzAnsicht";
import { LandWahl } from "@/components/land/LandWahl";
import { LandInVorbereitung } from "@/components/land/LandInVorbereitung";
import { freigegebeneLaender, hatLandVersion, landFreigegeben, landVergleich } from "@/data/land";
import { BEISPIEL_EINTRAG } from "@/data/land/beispiel";
import { filterFuerLand, finanzMaxFuerLand, LAND_SPRACHE, zeilenFuerLand } from "@/data/land/landTexte";
import { LAENDER, landPfad } from "@/lib/land";
import { festeOrdnung } from "@/lib/landRangfolge";
import { useLand } from "@/lib/useLand";

/** Vergleiche, für die es den geführten Einstieg gibt. */
/** „29.10.2026“ wird „29. Oktober 2026“, wie bei Finanzfluss „Aktualisiert am: 7. November 2026“. */
const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const datumLang = (d: string) => {
  const m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(d.trim());
  return m ? `${Number(m[1])}. ${MONATE[Number(m[2]) - 1]} ${m[3]}` : d;
};

/* PH1 (15.11.2026), Elias: „Vergleich kann dieses ein paar Fragen sehen, was zu dir passt, kann raus. Dann haben wir es
   ein bisschen kompakter … das gleiche dann wahrscheinlich auch bei Depot.“ Girokonto und Depot ohne Kasten. */
const MIT_ASSISTENT = ["/vergleich/krypto"];

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
const NACH_LISTE = "order-1";
const AM_ENDE = "order-2";
/**
 * Laptop: Kopf links, Kasten mit der Nummer 1 rechts, danach gleich Filter und
 * Tabelle. Vorher standen Einleitung, Kennzahlen, Hinweis und "Worauf wir achten"
 * untereinander davor, die Tabelle begann erst nach zwei Bildschirmen (Elias,
 * 19.09.2026: "du siehst ja nichts vom Vergleich"). Das Raster hat zwei Spalten,
 * alles außer dem Kopf läuft über beide.
 */
const RASTER = "lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:grid-rows-[auto_1fr] lg:gap-x-12";
const RASTER_KASTEN_BREIT = "xl:grid-cols-[minmax(0,1fr)_540px]";
const BREIT = "lg:col-span-2";
/**
 * Mit Nummer 1 beginnt der Kasten rechts schon neben den Brotkrumen und wird ab `xl` breit
 * (Gründe in zwei Spalten). So endet er etwa auf Höhe des Kopfs links, darunter folgt gleich
 * die Tabelle (Elias, 07.10.2026: Leerraum links neben dem Kasten).
 */
const KOPF_LINKS = "lg:col-start-1 lg:row-start-1";
const KASTEN_OBEN = "lg:row-start-1 lg:row-span-2 lg:mt-0";
const KASTEN_NEBEN_KOPF = "lg:row-start-2 lg:mt-6";
/**
 * Girokonto und Depot am Laptop wie Finanzfluss (Elias PH5-01, 16.11.2026): rechts neben dem Text zwei Kennzahlen, darunter
 * der Autor, ganz rechts der schmale Kasten der Nummer 1, alles auf Höhe der Unterzeile. Gemessen bei Finanzfluss 1440 px:
 * Kennzahlen je 170 px, Kasten 252 px, zusammen 628 px.
 */
const RASTER_KOPF_FF = "xl:grid-cols-[minmax(0,1fr)_628px]";
const AUTOR_KASTEN = "flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3";
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
  /**
   * Mit Kategorie und Höchstpunkten steht oben die Nummer 1. Sie entsteht aus
   * derselben Ordnung wie im geführten Vergleich: nur Belegtes zählt, ein Partnerlink
   * ändert keine Note (Regel 2 in `rangfolge.ts`). Die übrige Liste folgt der Rangfolge, sobald jeder
   * Anbieter ohne rotes Zins-Merkmal eine Note hat, sonst bleibt sie alphabetisch.
   */
  kategorie?: RangKategorie;
  finanzMax?: Record<string, number>;
  /**
   * Plätze ja, Kasten nein: Die Liste folgt der Rangfolge und jede Spalte trägt ihren Platz, oben
   * steht aber keine „Nummer 1“. Für Vergleiche, in denen mehrere gleichauf vorn liegen oder die
   * Wahl am eigenen Fall hängt (Steuersoftware, Halal-Aktien-Apps).
   */
  ohneNummerEins?: boolean;
  /** Ein Satz direkt über der Liste: wonach sie sortiert ist, gern mit Link zur Methodik. */
  sortiertNach?: ReactNode;
  /**
   * Nur Girokonto (Elias PH2-01): Karten am Handy wie bei Finanzfluss mit vier Kacheln statt Hakenliste, Platz 1 hellblau,
   * Karten mit Bonus orange, und der Satz „Sortiert nach unserer Note“ steht am Handy unter der Liste statt darüber.
   * `besonders`: Zeile „Besonders“ je Anbieter-ID (Finanzfluss „Besondere Eigenschaften“).
   */
  giro?: { besonders: Record<string, string[]> };
  /**
   * Nur Depot (Elias, 15.11.2026: „Mach das auch beim Depot-Vergleich“): dieselben Karten wie beim Girokonto mit vier Kacheln
   * (Halal-ETFs, Sukuk, Depotgebühr, Kosten pro Order), Platz 1 hellblau, Bonus hellorange, und am Laptop dieselben Spaltenköpfe.
   */
  depot?: boolean;
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
  /** Wie viele Kennzahlen am Laptop stehen. Standard zwei. */
  kennzahlenMax?: number;
  /** Ersetzt den Hinweis zur Reihenfolge, der sonst von Halal-Merkmalen spricht. */
  reihenfolge?: ReactNode;
  /** Freier Abschnitt unter der Tabelle. Für Erklärungen, die nur einen Vergleich betreffen. */
  zusatz?: ReactNode;
  /** Direkt unter dem Titel, auch am Handy vor der Liste: ein Produkt, das der Vergleich vorn nennt (Gold: Royal Mint). */
  vorneweg?: ReactNode;
  /** Auszeichnungen wie bei Finanzfluss, nur mit Kriterium aus den Daten (Elias CV17F, CV18F):
      `nummerEins` steht im Kasten und am Platz 1, `meisteHalal` am gerankten Anbieter mit den meisten
      belegten Halal-Anlagen, wenn er allein vorn liegt und nicht schon Platz 1 ist. Mit `zweiNummerEins` stehen
      beide zusammen im Kasten oben (`ZweiNummerEins`, Depot, Elias A11). */
  auszeichnungen?: { nummerEins?: string; meisteHalal?: string; zweiNummerEins?: string };
  faq: Array<{ frage: string; antwort: string }>;
  /** Blogteil unter der Tabelle wie bei Finanzfluss (`VergleichsRatgeber`). Ersetzt den Kriterien-Kasten und die
      Fragen; `faq` speist weiter die strukturierten Daten und soll dieselben Fragen tragen. */
  ratgeber?: ReactNode;
  /** Beiträge aus dem Blog, die zu diesem Vergleich gehören (RN19): Rücklink der Ketten Beitrag, Vergleich, Anbieter. */
  weiterlesen?: { to: string; name: string; text: string }[];
  schluss: string;
  /** Nur Ansicht A3 (lokal): die ganze Datendatei, damit versteckte Angebote grau einsortiert stehen. */
  ansichtAlle?: RohAnbieter[];
};

export const VergleichsSeite = ({
  pfad,
  brotkrumen,
  titel,
  untertitel,
  seoTitel,
  seoText,
  einheit,
  zeilen: zeilenDe,
  anbieter: anbieterDe,
  filter: filterDe,
  stand: standDe,
  standHinweis: standHinweisDe,
  kategorie,
  finanzMax: finanzMaxDe,
  ohneNummerEins = false,
  sortiertNach: sortiertNachDe,
  giro,
  depot,
  quellenHinweis: quellenHinweisDe,
  kriterien: kriterienDe,
  kriterienTitel = "Worauf wir bei Halal achten",
  kennzahlen,
  kennzahlenMax,
  reihenfolge,
  zusatz: zusatzDe,
  vorneweg: vorneWegDe,
  auszeichnungen,
  faq: faqDe,
  ratgeber: ratgeberDe,
  weiterlesen: weiterlesenDe,
  schluss,
  ansichtAlle: ansichtAlleDe,
  einleitung: einleitungDe,
}: VergleichsSeiteProps) => {
  const sortiertUnten = Boolean(giro && sortiertNachDe);
  const stil = Boolean(giro || depot);
  const [aktiv, setAktiv] = useState<string[]>([]);

  /* DACH1 (23.11.2026): Länderversionen. Die Adresse sagt das Land (`/at/…`, `/ch/…`), `pfad` bleibt die deutsche
     Grundadresse. Ohne fertige Liste zeigt die Seite „in Vorbereitung“, nichts wird aus Deutschland übernommen. Mit
     `?beispiel=1` im Entwicklungsserver steht ein erfundener Beispielanbieter drin, nur um das Bild zu sehen. */
  const land = useLand();
  const { search } = useLocation();
  const eigeneListe = land !== "de" ? landVergleich(land, pfad) : null;
  const beispiel = import.meta.env.DEV && land !== "de" && new URLSearchParams(search).get("beispiel") === "1";
  const anbieter = land === "de" ? anbieterDe : beispiel ? [BEISPIEL_EINTRAG] : (eigeneListe?.anbieter ?? []);
  /* Prüfung DACH1 M-3: Ein Entwurf mit Daten (Schweiz) zeigt öffentlich auch nur „In Vorbereitung“. Im Entwicklungsserver
     zeigt `?entwurf=1` die Liste trotzdem, damit die Daten für später sichtbar bleiben. */
  const entwurfAnsehen = import.meta.env.DEV && new URLSearchParams(search).get("entwurf") === "1";
  if (land !== "de" && (anbieter.length === 0 || (eigeneListe?.entwurf && !beispiel && !entwurfAnsehen))) {
    return <LandInVorbereitung land={land} pfad={pfad} brotkrumen={brotkrumen} titel={titel} />;
  }
  const zeilen = land === "de" ? zeilenDe : zeilenFuerLand(zeilenDe, land);
  const filter = land === "de" ? filterDe : filterFuerLand(filterDe, land);
  /* DACH1 Prüfung 2 (S-7): Auf Länderseiten kein Weg zu deutschen Inhalten mit deutschen Steuer- oder Produktaussagen.
     Aus „Mehr dazu“ bleiben nur Vergleiche, die es im Land fertig gibt, mit der Adresse des Landes; Blog, Datenbank und
     Methodik (deutsche Zählung) fallen weg. */
  const weiterlesen =
    land === "de"
      ? weiterlesenDe
      : weiterlesenDe
          ?.filter((w) => hatLandVersion(w.to) && landFreigegeben(land, w.to) && w.to !== pfad)
          .map((w) => ({ ...w, to: landPfad(w.to, land) }));
  const finanzMax = land === "de" || !finanzMaxDe ? finanzMaxDe : finanzMaxFuerLand(finanzMaxDe, land);
  const stand = land === "de" ? standDe : (eigeneListe?.stand ?? standDe);
  const standHinweis = land === "de" ? standHinweisDe : undefined;
  const quellenHinweis = land === "de" ? quellenHinweisDe : (eigeneListe?.quellenHinweis ?? "");
  const ansichtAlle = land === "de" ? ansichtAlleDe : undefined;
  const ratgeber = land === "de" ? ratgeberDe : undefined;
  const vorneweg = land === "de" ? vorneWegDe : undefined;
  /* Der freie Abschnitt unter der Tabelle ist deutscher Text (Edelmetalle: Händler in Deutschland, deutsches Steuerrecht). */
  const zusatz = land === "de" ? zusatzDe : undefined;
  const kriterien = (!beispiel && eigeneListe?.kriterien) || kriterienDe;
  const faq = land === "de" ? faqDe : [];
  const einleitung =
    land === "de" ? (
      einleitungDe
    ) : eigeneListe?.einleitung && !beispiel ? (
      <>
        {eigeneListe.einleitung.map((satz) => (
          <p key={satz}>{satz}</p>
        ))}
      </>
    ) : (
      <p>{LAND_SPRACHE[land].einleitung}</p>
    );
  const landSeite = land !== "de" ? LAND_SPRACHE[land] : null;
  /* Feste Rangfolge eines Landes: der Satz über der Liste sagt, wonach sie geordnet ist, nicht der deutsche Notensatz. */
  const sortiertNach =
    landSeite && eigeneListe?.reihenfolge && !beispiel ? (
      <>
        {landSeite.rangHinweis}
      </>
    ) : (
      sortiertNachDe
    );
  const seoPfad = landPfad(pfad, land);
  /* DACH1 Prüfung S-3: Die Beschreibung zählt die Länderliste, nie die deutsche Liste. Eigener Text mit „{anzahl}“ aus der
     Länderliste, sonst der deutsche Text mit der Zahl des Landes und dem Land am Ende. */
  const seoBeschreibung = !landSeite
    ? seoText
    : eigeneListe?.seoText && !beispiel
      ? eigeneListe.seoText.replace("{anzahl}", String(anbieter.length))
      : `${seoText.replace(/\d+/, String(anbieter.length))} Für ${landSeite.seoZusatz}.`;
  /* hreflang nur, wenn es mindestens zwei fertige Fassungen gibt; jede Seite nennt sich selbst, x-default ist Deutschland. */
  const fassungen = hatLandVersion(pfad) ? freigegebeneLaender(pfad) : [];
  const alternates =
    fassungen.length > 1
      ? [
          ...fassungen.map((l) => ({ hreflang: LAENDER[l].hreflang, path: landPfad(pfad, l) })),
          { hreflang: "x-default", path: landPfad(pfad, "de") },
        ]
      : undefined;

  const umschalten = (key: string) =>
    setAktiv((alt) =>
      alt.includes(key) ? alt.filter((k) => k !== key) : [...alt, key],
    );

  /* Ein Filter greift nur auf geprueftes "gut". Unbekannt faellt bewusst raus:
     wer nach Anbietern ohne Guthabenzins sucht, will keine Anbieter sehen,
     bei denen wir es schlicht nicht wissen. */
  const gefiltert = anbieter.filter((a) =>
    aktiv.every((k) => {
      const erlaubt = filter.find((f) => f.key === k)?.erlaubt ?? ["gut"];
      return erlaubt.includes(String(a.werte[k]));
    }),
  );

  /* Ist jeder Anbieter ohne rotes Zins-Merkmal gerankt, steht die Liste in der Reihenfolge der
     Rangfolge und jede Spalte trägt ihren Platz. Sonst bleibt es alphabetisch. */
  const rang =
    kategorie && finanzMax ? rangfolge(anbieter, kategorie, { finanzMax, anteilN: beispiel ? undefined : eigeneListe?.anteilN }) : null;
  /* DACH1: Länderlisten mit fester Rangfolge (`reihenfolge` in src/data/land/). Platz und Nummer 1 kommen aus
     `festeOrdnung`, die Note nur, wenn sie in dieser Reihenfolge absteigt. */
  const fest =
    !beispiel && eigeneListe?.reihenfolge && kategorie
      ? festeOrdnung(anbieter, eigeneListe.reihenfolge, kategorie, rang)
      : null;
  const sieger = fest
    ? ohneNummerEins
      ? null
      : (anbieter.find((a) => a.id === fest.siegerId) ?? null)
    : kategorie && finanzMax && !ohneNummerEins
      ? siegerDerSeite(anbieter, kategorie, finanzMax)
      : null;
  const platz = fest
    ? fest.platz
    : rang && rang.nichtBewertet.length === 0
      ? new Map(rang.gerankt.map((b) => [b.anbieter.id, b.platz]))
      : null;
  const noteVon =
    rang && (!fest || fest.noteZeigen) ? new Map(rang.gerankt.map((b) => [b.anbieter.id, b.note])) : null;
  const nummerEinsText = auszeichnungen?.nummerEins ?? "Unsere Nummer 1";
  const meisteHalalId =
    auszeichnungen?.meisteHalal && platz ? meisteHalalVon(anbieter, zeilen, new Set(platz.keys()), sieger?.id) : null;
  const zweiter = auszeichnungen?.zweiNummerEins && meisteHalalId ? (anbieter.find((a) => a.id === meisteHalalId) ?? null) : null;
  /** Kopf wie Finanzfluss am breiten Laptop (ab `xl`): Kennzahlen, Autor und schmaler Kasten rechts. */
  const kopfFF = stil && !zweiter && (Boolean(sieger) || ohneNummerEins);
  /* VG3: Ohne Nummer 1 (Geschäftskonto, solange kein Link vorn steht) bleibt der Kopf wie Finanzfluss, nur ohne den
     schmalen Kasten: zwei Kennzahlen und der Autor rechts neben dem Text. */
  const kopfOhneKasten = kopfFF && !sieger;
  const nachRang = platz
    ? [
        ...gefiltert
          .filter((a) => platz.has(a.id))
          .sort((p, q) => platz.get(p.id)! - platz.get(q.id)!),
        ...gefiltert.filter((a) => !platz.has(a.id)),
      ]
    : gefiltert;
  const sortiert = sieger
    ? [
        ...nachRang.filter((a) => a.id === sieger.id),
        ...nachRang.filter((a) => a.id !== sieger.id),
      ]
    : nachRang;
  /* DACH1 Prüfung 2: Länderlisten zeigen statt eines Zählwerts den Namen dessen, was bestätigt ist (`anzeige`). Die
     Rangfolge oben rechnet mit dem gespeicherten Wert, nur was man sieht, wechselt. */
  const anzeigeRegeln = !beispiel ? eigeneListe?.anzeige : undefined;
  const zeige = (a: RohAnbieter): RohAnbieter => {
    if (!anzeigeRegeln) return a;
    const werte = { ...a.werte };
    for (const [key, ersatz] of Object.entries(anzeigeRegeln)) {
      const w = werte[key];
      if (typeof w === "string" && ersatz[w]) werte[key] = ersatz[w];
    }
    return { ...a, werte };
  };
  const siegerAnzeige = sieger ? zeige(sieger) : null;
  const spaltenLive = baueSpalten(
    sortiert.map((a) => {
      /* Der Platz steht als Zahl im Reiter, nicht mehr als Etikett „Platz n“ (Finanzfluss, Elias CV17F). */
      const mitNote = {
        ...zeige(a),
        note: a.note ?? noteVon?.get(a.id) ?? null,
        platz: platz?.get(a.id) ?? (a.id === sieger?.id ? 1 : undefined),
      };
      return a.id === sieger?.id
        ? { ...mitNote, etikett: { text: nummerEinsText, ton: "empfehlung" as const } }
        : a.id === meisteHalalId
          ? { ...mitNote, etikett: { text: auszeichnungen!.meisteHalal!, ton: "bonus" as const } }
          : mitNote;
    }),
    zeilen,
    kategorie,
  );

  /* Ansicht A3: alle Angebote der Datendatei, versteckte grau an ihrer Stelle, oben die Zerlegung der Note. */
  const ansicht =
    ANSICHT_A3 && ansichtAlle && kategorie && finanzMax
      ? ansichtA3(anbieter, ansichtAlle, kategorie, finanzMax, zeilen)
      : null;
  const ansichtZeilen = ansicht && kategorie && finanzMax ? platzZeilen(kategorie, finanzMax) : [];
  const tabellenZeilen = ansicht
    ? [...zeilen.filter((z) => z.key === "__angebot"), ...ansichtZeilen, ...zeilen.filter((z) => z.key !== "__angebot")]
    : zeilen;
  const spalten = ansicht
    ? (() => {
        const live = new Map(spaltenLive.map((sp) => [sp.id, sp]));
        const passt = (a: RohAnbieter) =>
          aktiv.every((k) => (filter.find((f) => f.key === k)?.erlaubt ?? ["gut"]).includes(String(a.werte[k])));
        const reihe = ansicht.filter((e) => passt(e.anbieter));
        const vorn = sieger ? reihe.filter((e) => e.anbieter.id === sieger.id) : [];
        return [...vorn, ...reihe.filter((e) => e.anbieter.id !== sieger?.id)].map((e) => {
          const basis =
            live.get(e.anbieter.id) ??
            baueSpalten([{ ...e.anbieter, etikett: { text: "Nicht auf der Seite", ton: "platz" as const } }], zeilen, kategorie)[0];
          return { ...basis, grau: e.grau, zerlegung: e.platz };
        });
      })()
    : spaltenLive;

  return (
    <main className="bg-background">
      <Seo
        title={landSeite ? `${seoTitel} (${landSeite.seoZusatz})` : seoTitel}
        description={seoBeschreibung}
        path={seoPfad}
        noindex={beispiel}
        alternates={alternates}
        locale={LAENDER[land].hreflang.replace("-", "_")}
        jsonLd={vergleichJsonLd({
          titel: seoTitel,
          beschreibung: seoBeschreibung,
          path: seoPfad,
          faq,
          stand,
          anbieter: spalten.map((sp) => sp.anbieter),
        })}
        brotkrumen={[
          { name: "Vergleiche", path: landPfad("/vergleiche", land) },
          { name: brotkrumen, path: seoPfad },
        ]}
      />

      <div className={`container flex flex-col py-6 md:py-10 ${RASTER} ${kopfOhneKasten ? "" : kopfFF ? RASTER_KOPF_FF : sieger ? RASTER_KASTEN_BREIT : ""}`}>
        <div className={sieger ? KOPF_LINKS : BREIT}>
          {hatLandVersion(pfad) ? (
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <VergleichsBrotkrumen titel={brotkrumen} mitLandWahl />
              <LandWahl />
            </div>
          ) : (
            <VergleichsBrotkrumen titel={brotkrumen} />
          )}
          {beispiel && (
            <p className="mt-3 rounded-lg border border-warning/50 bg-warning/10 px-4 py-2 text-[14px] text-foreground">
              Nur Entwicklung: erfundene Beispieldaten, nicht live.
            </p>
          )}
        </div>

        {/* Handy: `contents`, damit die Einleitung per `order` unter die Liste rutschen kann.
            Laptop: ein Block links oben, neben der Nummer 1. */}
        <div className="contents lg:col-start-1 lg:row-start-2 lg:block">
          <header className="mt-4 max-w-3xl lg:mt-6">
            {/* Wie Finanzfluss: große H1 mit Jahr, Unterzeile in voller Farbe, dann Autor mit Foto
                und Datum des letzten Datenstands (Elias CV17F: „immer aktualisiert am …“). */}
            <h1 className="text-[34px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[48px]">
              {(!beispiel && eigeneListe?.titel) || titel}
            </h1>
            <p className="mt-3 text-[20px] leading-snug text-foreground md:text-[26px]">
              {(!beispiel && eigeneListe?.untertitel) || untertitel}
            </p>
            <div className={`mt-4 ${AUTOR_KASTEN} lg:inline-flex lg:pr-6 ${kopfFF ? "xl:hidden" : ""}`}>
              <img src={eliasAutor} alt="Elias El-Gendy" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
              <p className="text-[15px] leading-snug">
                <span className="block font-semibold text-foreground">Elias El-Gendy</span>
                <span className="text-muted-foreground">Aktualisiert am: {datumLang(stand)}</span>
              </p>
            </div>
          </header>

          {vorneweg && <div className="mt-5 max-w-3xl">{vorneweg}</div>}

          <div
            className={`${NACH_LISTE} mt-10 max-w-3xl space-y-3 text-[17px] leading-[26px] text-foreground/90 lg:order-none lg:mt-4 lg:text-[16px] lg:leading-[25px]`}
          >
            {einleitung}
          </div>

          {MIT_ASSISTENT.includes(pfad) && land === "de" && (
            <Link
              to="/check?quelle=quiz"
              className="mt-4 flex min-h-[50px] items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-[15px] text-foreground transition-colors hover:border-primary lg:mt-5 lg:max-w-3xl"
            >
              <span>
                <span className="font-bold">
                  Ein paar Fragen statt {anbieter.length} {einheit}.
                </span>{" "}
                Sieh, was zu dir passt.
              </span>
              <ArrowRight
                className="h-5 w-5 shrink-0 text-primary"
                aria-hidden
              />
            </Link>
          )}

        </div>

        {/* Filter wie Finanzfluss (VG3): am Laptop über die ganze Breite direkt vor der Liste (Zeile 3 des Rasters), am Handy vor
            der Nummer 1. Ohne Filter keine Leiste: ein Filter, der nichts kürzt, kostet nur Platz. */}
        {filter.length > 0 && (
          <div className={`${BREIT} lg:row-start-3`}>
            <FilterLeiste
              filter={filter}
              aktiv={aktiv}
              umschalten={umschalten}
              zuruecksetzen={() => setAktiv([])}
              anzahl={gefiltert.length}
            />
          </div>
        )}

        {/* Rechte Spalte am Laptop, auf dem Handy direkt unter dem Einstieg: die Nummer 1, darunter die Kennzahlen. */}
        <aside
          className={`mt-4 lg:col-start-2 lg:self-start ${sieger ? KASTEN_OBEN : KASTEN_NEBEN_KOPF} ${
            kopfOhneKasten
              ? "xl:mt-[78px] xl:grid xl:grid-cols-2 xl:gap-3"
              : kopfFF
                ? "xl:mt-[118px] xl:grid xl:grid-cols-[1fr_1fr_252px] xl:gap-3"
                : ""
          }`}
        >
          {kopfFF && (
            /* Nur ab `xl`: zwei Kennzahlen wie Finanzfluss („56 Überprüfte Produkte“), darunter der Autor (am Handy und
               schmalen Laptop steht er unter der Unterzeile, hier ausgeblendet). */
            <>
              {[
                { Icon: Search, zahl: anbieter.length, text: `Überprüfte ${einheit}` },
                { Icon: ShieldCheck, zahl: anbieter.filter((a) => a.werte.zinsfreiAbStart === "gut").length, text: "Ohne Zinsen nutzbar" },
              ].map(({ Icon, zahl, text }) => (
                <div key={text} className="hidden flex-col items-center justify-start rounded-lg border border-border bg-card px-3 pb-4 pt-6 text-center xl:flex">
                  <p className="flex items-center gap-2 text-[28px] font-semibold leading-none text-foreground">
                    <Icon className="h-6 w-6" aria-hidden />
                    {zahl}
                  </p>
                  <p className="mt-2 text-[16px] leading-snug text-foreground">{text}</p>
                </div>
              ))}
              <div className={`hidden ${AUTOR_KASTEN} xl:col-span-2 xl:col-start-1 xl:row-start-2 xl:flex`}>
                <img src={eliasAutor} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                <p className="text-[16px] leading-snug">
                  <span className="block text-foreground">Elias El-Gendy</span>
                  <span className="text-muted-foreground">Aktualisiert am: {datumLang(stand)}</span>
                </p>
              </div>
            </>
          )}
          {sieger && zweiter && (
            <ZweiNummerEins
              titel={auszeichnungen!.zweiNummerEins!}
              zeilen={zeilen}
              eintraege={[
                { anbieter: sieger, auszeichnung: nummerEinsText, ton: "empfehlung", note: noteVon?.get(sieger.id) ?? null, zeigt: "kosten", spalte: spalten.find((sp) => sp.id === sieger.id) },
                { anbieter: zweiter, auszeichnung: auszeichnungen!.meisteHalal!, ton: "bonus", note: noteVon?.get(zweiter.id) ?? null, zeigt: "halal", spalte: spalten.find((sp) => sp.id === zweiter.id) },
              ]}
            />
          )}
          {sieger && !zweiter && (
            <div className={kopfFF ? "xl:col-start-3 xl:row-span-2 xl:row-start-1" : ""}>
            <NummerEins
              anbieter={siegerAnzeige ?? sieger}
              zeilen={zeilen}
              einheit={einheit}
              linkVorrang={kategorie ? LINK_VORRANG.has(kategorie) : false}
              spalte={baueSpalten([siegerAnzeige ?? sieger], zeilen, kategorie)[0]}
              auszeichnung={nummerEinsText}
              note={noteVon?.get(sieger.id) ?? null}
              giro={giro}
              depot={depot}
            />
            </div>
          )}
          {!sieger && (
          <Kennzahlen
            className={kopfOhneKasten ? "hidden lg:grid xl:hidden" : "hidden lg:grid"}
            max={kennzahlenMax}
            kennzahlen={
              kennzahlen ?? [
                { zahl: anbieter.length, text: `${einheit} im Vergleich` },
                {
                  zahl: anzahlHalalGeprueft(anbieter, zeilen),
                  text: "Halal vollständig geprüft",
                },
              ]
            }
            stand={stand}
            standHinweis={standHinweis}
          />
          )}
        </aside>

        {!sieger && !fest && !sortiertNach && (
          <div className={BREIT}>
            {reihenfolge ?? <ReihenfolgeHinweis einheit={einheit} />}
          </div>
        )}

        {!ratgeber && (
        <section
          className={`${AM_ENDE} ${BREIT} mt-10 rounded-lg border border-border bg-card p-6 md:p-8`}
        >
          <h2 className="text-xl font-bold text-foreground">
            {kriterienTitel}
          </h2>
          <ul className="mt-4 space-y-4">
            {kriterien.map((punkt) => (
              <li key={punkt.titel}>
                <p className="text-[15px] font-semibold text-foreground">
                  {punkt.titel}
                </p>
                <p className="text-[15px] text-muted-foreground">
                  {punkt.text}
                </p>
              </li>
            ))}
          </ul>
          {land === "de" && (
          <p className="mt-5 text-[15px]">
            <Link
              to="/vergleiche/methodik"
              className="font-semibold text-primary hover:underline"
            >
              So entsteht die Bewertung
            </Link>
          </p>
          )}
        </section>
        )}

        {gefiltert.length === 0 ? (
          <p
            className={`${BREIT} mt-6 rounded-lg border border-border p-6 text-[15px] text-muted-foreground`}
          >
            Zu dieser Auswahl gibt es keine {einheit}. Nimm einen Filter heraus,
            dann siehst du alle.
          </p>
        ) : (
          <>
            {sortiertNach && !sortiertUnten && (
              <p className={`${BREIT} mt-5 text-[14px] leading-snug text-muted-foreground lg:mt-8`}>
                {sortiertNach}
              </p>
            )}
            {ansicht && (
              <p className={`${BREIT} mt-4 rounded-lg border border-warning/50 bg-warning/10 px-4 py-2 text-[14px] text-foreground`}>
                Lokale Ansicht, nicht live: {ansicht.filter((e) => e.grau).length} graue Angebote stehen heute nicht auf der Seite, gelb
                markiert sind Zellen mit „mind.“. Rot abgeratene, die nicht auf der Seite stehen, fehlen hier.
              </p>
            )}
            {/* Laptop: gedrehte Tabelle. Handy: Karten. Mit `giro` steht der Satz zur Reihenfolge am Handy unter den
                Karten, am Laptop weiter über der Tabelle (`order`, ein Satz, kein Doppel). */}
            <div className={sortiertUnten ? `${BREIT} flex flex-col` : "contents"}>
            <div className={`${BREIT} ${sortiertNach ? "mt-3" : "mt-6"} hidden lg:block`}>
              <VergleichsTabelle zeilen={tabellenZeilen} spalten={spalten} stil={stil} kontoLabel={depot ? "Depot" : "Konto"} />
            </div>
            <div className={`${BREIT} ${sortiertNach && !sortiertUnten ? "mt-3" : "mt-4"} lg:hidden`}>
              {/* Der Kasten "Unsere Nummer 1" steht auf dem Handy direkt darüber, die Karte wäre doppelt. Beim Doppel-Kasten beide. */}
              <VergleichsKarten
                zeilen={zeilen}
                platzZeilen={ansichtZeilen}
                spalten={spalten.filter((sp) => sp.id !== sieger?.id && sp.id !== zweiter?.id)}
                zuerst={SEITE - (sieger ? 1 : 0) - (zweiter && sieger ? 1 : 0)}
                giro={giro}
                depot={depot}
              />
            </div>
            {sortiertUnten && (
              <p className="mt-4 text-[14px] leading-snug text-muted-foreground lg:order-first lg:mb-0 lg:mt-8">{sortiertNach}</p>
            )}
            </div>
          </>
        )}

        <p className={`${BREIT} mt-6 text-[13px] text-muted-foreground`}>
          {quellenHinweis}
        </p>
        <p className={`${BREIT} mt-2 text-[13px] text-muted-foreground`}>
          * Mit Stern markierte Links sind Werbe- oder Affiliate-Links. Wenn du
          darüber ein Produkt abschließt, erhalte ich eine Provision. Für dich
          entstehen dadurch keine Mehrkosten.{" "}
          {standHinweis ? `Stand: ${stand}. ${standHinweis}.` : `Stand: ${stand}.`}
          {land === "de" && (
            <>
              {" "}
              <Link to="/vergleiche/methodik" className="font-semibold text-primary hover:underline">
                So bewerten wir
              </Link>
            </>
          )}
        </p>

        {zusatz && <div className={`${AM_ENDE} ${BREIT}`}>{zusatz}</div>}

        {ratgeber ? (
          <div className={`${AM_ENDE} ${BREIT}`}>{ratgeber}</div>
        ) : faq.length === 0 ? null : (
        <section className={`${AM_ENDE} ${BREIT} mt-14 max-w-3xl`}>
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
        )}

        {weiterlesen && weiterlesen.length > 0 && (
          <aside className={`${AM_ENDE} ${BREIT} mt-12 max-w-3xl`} aria-labelledby="weiterlesen-blog">
            <p id="weiterlesen-blog" className="text-2xl font-bold text-foreground">
              {land === "de" ? "Mehr dazu im Blog" : "Mehr Vergleiche"}
            </p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {weiterlesen.map((w) => (
                <li key={w.to}>
                  <Link to={w.to} className="block h-full rounded-lg border border-border p-4 transition-colors hover:border-primary">
                    <span className="block text-[16px] font-semibold text-foreground">{w.name}</span>
                    <span className="mt-1 block text-[14px] text-muted-foreground">{w.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <WeitereVergleiche pfad={pfad} land={land} className={`${AM_ENDE} ${BREIT}`} />

        <p
          className={`${AM_ENDE} ${BREIT} mt-12 text-[13px] leading-relaxed text-muted-foreground`}
        >
          {schluss}
        </p>
      </div>
    </main>
  );
};

export default VergleichsSeite;
