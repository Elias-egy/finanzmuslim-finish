import type { RohAnbieter } from "@/data/vergleichHelfer";
import { anzeigeNote } from "@/lib/anzeigeNote";
import { BASIS, LINK_VORRANG, type RangKategorie, type Rangliste } from "@/lib/rangfolge";

/**
 * Feste Rangfolge der Länderlisten (DACH1, 23.11.2026). Vorbild ist die feste Reihenfolge, die der deutsche Code vom
 * 08.11. bis 15.11.2026 setzte (`LESER_REIHENFOLGE` und `leserZuerst` in `src/lib/rangfolge.ts`, Commit 55cb5c8): die
 * genannten Einträge in dieser Reihenfolge vorn, danach der Rest. Die Note rechnet `rangfolge()` wie in Deutschland.
 *
 * Es bleiben zwei deutsche Regeln:
 * - Regel 6 (Elias A11: „nicht etwas auf die 1 packen, wo wir keinen Link haben“): Platz 1 bekommt nur ein Eintrag mit
 *   eigenem Link und ohne Einschränkung. Erfüllt der erste der Liste das nicht, rückt der erste, der es erfüllt, nach vorn,
 *   alle anderen behalten ihre Reihenfolge.
 * - Regel 7 (Elias A11: „die Sterne dürfen ja nicht in der falschen Reihenfolge sein“): Die Note steht nur, wenn jeder
 *   Eintrag eine hat und sie in der festen Reihenfolge nie steigt. Sonst zeigt die Seite Plätze ohne Note.
 */
export type FesteOrdnung = {
  /** Platz je Anbieter-ID, 1 zuerst, ohne geteilte Plätze. */
  platz: Map<string, number>;
  /** Wer im Kasten „Unsere Nummer 1“ steht: Platz 1, wenn er Link und keine Einschränkung hat. */
  siegerId: string | null;
  /** Die Note zeigen: alle haben eine, und sie steigt in der Reihenfolge nie. */
  noteZeigen: boolean;
};

/** Ohne Einschränkung im Sinne von Regel 5 und 6: Zins-Tor grün, keine rote Grundlage, im Girokonto kein Dispo ab Start. */
const ohneEinschraenkung = (a: RohAnbieter, kategorie: RangKategorie, rang: Rangliste | null): boolean => {
  const bewertet = rang?.gerankt.find((b) => b.anbieter.id === a.id);
  if (bewertet) return bewertet.uneingeschraenkt;
  if (a.abgeraten || a.werte.zinsfreiAbStart !== "gut") return false;
  const basis = kategorie === "depot" || kategorie === "girokonto" || kategorie === "krypto" ? BASIS[kategorie] : [];
  if (basis.some((k) => a.werte[k] === "schlecht")) return false;
  return !(kategorie === "girokonto" && a.werte.keinDispoAbStart === "teils");
};

export const festeOrdnung = (
  anbieter: readonly RohAnbieter[],
  reihenfolge: readonly string[],
  kategorie: RangKategorie,
  rang: Rangliste | null,
): FesteOrdnung => {
  const nachId = new Map(anbieter.map((a) => [a.id, a]));
  const vorn = reihenfolge.map((id) => nachId.get(id)).filter((a): a is RohAnbieter => a !== undefined);
  const rest = anbieter.filter((a) => !reihenfolge.includes(a.id));
  const liste = [...vorn, ...rest];

  const mussLink = LINK_VORRANG.has(kategorie);
  const geeignet = (a: RohAnbieter) => ohneEinschraenkung(a, kategorie, rang) && (!mussLink || Boolean(a.link));
  const erster = liste.findIndex(geeignet);
  if (erster > 0) liste.unshift(...liste.splice(erster, 1));

  const platz = new Map(liste.map((a, i) => [a.id, i + 1]));
  const siegerId = liste.length > 0 && geeignet(liste[0]) && Boolean(liste[0].link) ? liste[0].id : null;

  const note = new Map(rang?.gerankt.map((b) => [b.anbieter.id, anzeigeNote(b.note)]) ?? []);
  const noten = liste.map((a) => note.get(a.id));
  const noteZeigen = noten.every((n) => n !== undefined) && noten.every((n, i) => i === 0 || n! <= noten[i - 1]!);
  return { platz, siegerId, noteZeigen };
};
