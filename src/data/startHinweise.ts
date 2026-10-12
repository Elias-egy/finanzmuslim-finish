import { hinweiseAmAngebot, type AngebotsHinweis, type VergleichsZeile } from "@/components/vergleich/vergleichTypen";
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
  const passende = liste.filter((a) => a.link === `/out/${kurzname}`);
  return baueSpalten(passende, zeilen, art).flatMap((s) =>
    hinweiseAmAngebot(s, zeilen).map((h) => ({
      ...h,
      titel: passende.length > 1 ? `${s.produkt}, ${h.titel}` : h.titel,
    })),
  );
};
