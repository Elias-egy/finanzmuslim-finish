import { hinweiseAmAngebot, type AngebotsHinweis, type VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import { PRODUKT_UNTERSCHIEDE } from "./produktUnterschiede";
import { brokerVergleich, DEPOT_ZEILEN } from "./brokerVergleich";
import { girokontoVergleich, GIRO_ZEILEN } from "./girokontoVergleich";
import { kryptoVergleich, KRYPTO_ZEILEN } from "./kryptoVergleich";
import { baueSpalten, type RohAnbieter } from "./vergleichHelfer";

/**
 * Die Hinweise zur Startseite eines Anbieters: dieselben Ausnahmen wie beim aufgeklappten Angebot im
 * Vergleich (automatischer Kredit, kostenpflichtiger Tarif, Zinsen zum Abschalten). Sie stehen auf der
 * Seite mit dem Video, auf der man nach „Zum Angebot“ landet (Elias, 13.10.2026: „relativ offensichtlich,
 * aber halt auf der Videoseite“). Führen mehrere Produkte auf dieselbe Startseite, trägt der Titel das Produkt.
 */
export const startHinweise = (kurzname: string, art: string): AngebotsHinweis[] => {
  const quelle: Record<string, [RohAnbieter[], VergleichsZeile[]]> = {
    depot: [brokerVergleich, DEPOT_ZEILEN],
    girokonto: [girokontoVergleich, GIRO_ZEILEN],
    krypto: [kryptoVergleich, KRYPTO_ZEILEN],
  };
  const eintrag = quelle[art];
  if (!eintrag) return [];
  const [liste, zeilen] = eintrag;
  // Mehrere Produkte eines Hauses stehen in der Reihenfolge der Sätze in `produktUnterschiede.ts` (bei N26: Standard zuerst, Flex zuletzt).
  const folge = Object.keys((PRODUKT_UNTERSCHIEDE as Record<string, Record<string, unknown>>)[art] ?? {});
  const platz = (id: string) => (folge.indexOf(id) < 0 ? folge.length : folge.indexOf(id));
  const passende = liste.filter((a) => a.link === `/out/${kurzname}`).sort((a, b) => platz(a.id) - platz(b.id));
  return baueSpalten(passende, zeilen, art).flatMap((s) =>
    hinweiseAmAngebot(s, zeilen).map((h) => ({
      ...h,
      // Der Unterschied nennt die Produkte schon im Titel, dort reicht der Produktname.
      titel: passende.length > 1 ? (h.art === "unterschied" ? s.produkt : `${s.produkt}, ${h.titel}`) : h.titel,
    })),
  );
};
