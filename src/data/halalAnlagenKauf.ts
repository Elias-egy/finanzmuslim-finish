import { halalAnlagen, type Anlage, type Kategorie } from "@/data/halalAnlagen";
import { ANLAGEN_KAUFBAR, type AnlageKaufbar } from "@/data/anlagenKaufbar";

/**
 * Die Kauf-Tabelle der Vorlage „Halal-Anlagen“: jede Anlage mit den Häusern, bei denen sie laut
 * Eigenbeleg des Anbieters kaufbar ist (Plan 27.09.2026, Entscheidung 8). Nur die volle Fassung
 * lädt diese Datei. Eine Anlage ohne belegtes Haus steht nicht in der Tabelle, sondern unter
 * `ohneBeleg` (Memory „Kaufbarkeit braucht Eigenbeleg“).
 */
export const KAUF_GRUPPEN: { kategorie: Kategorie; titel: string }[] = [
  { kategorie: "aktien", titel: "Aktien-ETFs und Fonds" },
  { kategorie: "sukuk", titel: "Sukuk, die islamische Alternative zu Anleihen" },
  { kategorie: "gold", titel: "Gold, physisch hinterlegt" },
  { kategorie: "silber", titel: "Silber, physisch hinterlegt" },
  { kategorie: "rohstoffe", titel: "Platin, Palladium und Korb" },
];

export type KaufZeile = { anlage: Anlage; kaufbar: AnlageKaufbar };

const kaufbarFuer = (a: Anlage) => (a.isin ? ANLAGEN_KAUFBAR[a.isin] : undefined);

export const kaufZeilen: KaufZeile[] = halalAnlagen
  .map((anlage) => ({ anlage, kaufbar: kaufbarFuer(anlage) }))
  .filter((z): z is KaufZeile => (z.kaufbar?.kaufbar.length ?? 0) > 0);

export const kaufGruppen = KAUF_GRUPPEN.map((g) => ({
  ...g,
  zeilen: kaufZeilen.filter((z) => z.anlage.kategorie === g.kategorie),
})).filter((g) => g.zeilen.length > 0);

/** Anlagen der Datenbank ohne belegtes Haus. Krypto gehört nicht ins Depot, sondern an eine Börse. */
export const ohneBeleg = halalAnlagen.filter((a) => a.kategorie !== "krypto" && !kaufZeilen.some((z) => z.anlage === a));
export const krypto = halalAnlagen.filter((a) => a.kategorie === "krypto");
