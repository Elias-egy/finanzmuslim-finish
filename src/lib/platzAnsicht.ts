import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import type { RohAnbieter } from "@/data/vergleichHelfer";
import {
  ANTEIL_N,
  FAKTOR_ABSCHALTBAR,
  FAKTOR_KREDIT,
  depotHalal,
  rangfolge,
  sterne,
  type RangKategorie,
} from "@/lib/rangfolge";
import { luecken } from "@/lib/vollstaendig";
import BELEGE from "@/data/a3Belege.json";

/** Je Anlage: Name, Zeile, Status, Belegart, Stand, Quelle, Ausgabeaufschlag, Fonds. Erzeugt aus ~/rebrand recherche/anlagen.json (A4). */
type Beleg = { n: string; z: string; s: "ja" | "nein" | "offen"; b: string | null; st: string | null; u: string | null; a: string | null; f: boolean };
const BELEG = BELEGE as Record<string, Beleg[]>;

const BELEGART: Record<string, string> = {
  kaufmerkmal: "Kaufknopf beim Anbieter",
  anbieterliste: "Liste des Anbieters",
  schriftlich: "schriftlich vom Anbieter",
  app_elias: "von dir in der App",
  ausschluss: "vom Anbieter ausgeschlossen",
  vollstaendige_liste: "fehlt in seiner vollständigen Liste",
  portal: "Sparplan laut Finanzfluss",
  suche_anbieter_leer: "in seiner Suche nicht gefunden",
};

const belegSatz = (liste: Beleg[]) => {
  const zahl = new Map<string, number>();
  for (const x of liste) zahl.set(BELEGART[x.b ?? ""] ?? "ohne Beleg", (zahl.get(BELEGART[x.b ?? ""] ?? "ohne Beleg") ?? 0) + 1);
  if (zahl.size === 1) return `${liste.length}, ${[...zahl.keys()][0]}`;
  return `${liste.length}: ${[...zahl].map(([art, n]) => `${n} ${art}`).join(", ")}`;
};

/**
 * Nur für die lokale Ansicht A3 (Worktree fm-a3-ansicht, nie gepusht). Elias, 07.11.2026: Depot- und
 * Gold-Seite 1:1, Anbieter mit Lücken grau einsortiert, und zeigen, warum ein Platz so ist, wie er ist
 * (raw/2026-11-07-elias-a3-seite-eins-zu-eins-kopieren-grau-einordnen-flatex.md im Vault).
 * Jede Zahl kommt aus `rangfolge.ts`, hier wird nur zerlegt.
 */
export const ANSICHT_A3 = true;

export type PlatzZelle = { text: string; ton?: "verlust" | "voll" | "abzug" | "leer" };

const KOSTEN_LABEL: Record<string, string> = {
  depotgebuehr: "Depotgebühr",
  etfSparplanProzent: "ETF-Sparplan in Prozent",
  etfSparplanPauschal: "ETF-Sparplan pauschal",
  orderProzent: "Order in Prozent",
  orderPauschal: "Order pauschal",
  mindestsparrate: "Mindestsparrate",
  maximalsparrate: "Höchste Sparrate",
  intervalle: "Intervalle",
  handelsplaetze: "Handelsplätze",
  kapest: "Steuer wird abgeführt",
  kundenservice: "Kundenservice",
  app: "App-Bewertung",
};

const zahl = (x: number, stellen = 2) => x.toFixed(stellen).replace(".", ",");
const punkte = (x: number) => (Number.isInteger(x) ? String(x) : zahl(x, x * 10 === Math.round(x * 10) ? 1 : 2));

const PLATZ_GRUPPE = "platz" as const;

/** Die Zeilen „So entsteht der Platz“, je Kategorie. Schlüssel beginnen mit `__platz_`. */
export const platzZeilen = (kategorie: RangKategorie, finanzMax: Record<string, number>): VergleichsZeile[] => {
  const z = (key: string, label: string, hinweis?: string) =>
    ({ key: `__platz_${key}`, label, art: "text", gruppe: PLATZ_GRUPPE, hinweis }) as unknown as VergleichsZeile;
  const n = kategorie === "edelmetall" ? ANTEIL_N.halalEdelmetalle : Object.values(ANTEIL_N).reduce((s, x) => s + x, 0);
  return [
    z("fehlt", "Fehlt in der Tabelle", "Leere Zelle auf der Seite. Deshalb steht das Angebot heute nicht dort."),
    z("platz", "Platz"),
    z("note", "Note", "Halb Halal-Teil, halb Kosten-Teil."),
    z("sterne", "Sterne", "Note auf halbe Sterne gerundet."),
    z(
      "vorrang",
      kategorie === "edelmetall" ? "Vorrang Royal Mint" : "Vorrang eigener Link",
      kategorie === "edelmetall"
        ? "Depots mit belegtem Royal Mint Gold-ETC stehen vor allen anderen, danach die Note."
        : "Bei gleichen Sternen steht zuerst, was über unseren Link eröffnet werden kann, danach die Note.",
    ),
    z("sicher", `Alle ${n} Anlagen geklärt?`, "Geklärt heißt: für jede Anlage ein Ja oder Nein mit Beleg vom Anbieter oder aus deiner App-Suche."),
    z("ja", "Kaufbar", "Mit Beleg, woher das Ja kommt."),
    z("nein", "Nicht im Angebot", "Mit Beleg, woher das Nein kommt."),
    z("offen", "Noch offen", "Weder Ja noch Nein belegt. Zählt 0 Punkte, auf der Seite steht dann „mind.“."),
    z("anlagen", `Halal-Punkte (von ${n})`, "Jede kaufbare Anlage 1 Punkt. Fonds mit Ausgabeaufschlag zählen weniger: mit Rabatt 0,75, voller oder unbekannter Aufschlag 0,5 (Elias, 15.09.2026)."),
    z("halalVor", "Halal-Teil vor Abzug", `5 mal Halal-Punkte durch ${n}.`),
    z(
      "abzug",
      "Abzug Halal-Teil",
      `Kredit ab Start: minus ${Math.round((1 - FAKTOR_KREDIT) * 100)} %. Zinsen laufen, abschaltbar: minus ${Math.round((1 - FAKTOR_ABSCHALTBAR) * 100)} %. Zins-Merkmal nicht belegt: Halal-Teil 0.`,
    ),
    z("halal", "Halal-Teil (zählt halb)"),
    ...Object.keys(finanzMax).map((k) => z(`k_${k}`, `Punkte: ${KOSTEN_LABEL[k] ?? k}`)),
    z("kostenSumme", "Kostenpunkte gesamt"),
    z("kosten", "Kosten-Teil (zählt halb)", "5 mal Punkte durch Höchstpunkte."),
  ];
};

const ZEILEN_LABEL = (zeilen: VergleichsZeile[]) =>
  Object.fromEntries(zeilen.map((z) => [z.key, z.label])) as Record<string, string>;

/** Zerlegt Note und Platz eines Angebots in die Zellen der Zeilen `platzZeilen`. */
const zerlege = (
  a: RohAnbieter,
  kategorie: RangKategorie,
  finanzMax: Record<string, number>,
  b: { note: number; halal: number; kosten: number | null } | undefined,
  platzText: string,
  fehlt: string[],
  zeilen: VergleichsZeile[],
): Record<string, PlatzZelle> => {
  const zeilenN = kategorie === "edelmetall" ? { halalEdelmetalle: ANTEIL_N.halalEdelmetalle } : ANTEIL_N;
  const n = Object.values(zeilenN).reduce((s, x) => s + x, 0);
  const belegt = Object.keys(zeilenN).reduce((s, k) => s + (a.halalAnlagenPunkte?.[k] ?? 0), 0);
  const h = depotHalal(a, zeilenN);
  const tuer = a.werte.zinsfreiAbStart;
  const labels = { ...ZEILEN_LABEL(zeilen), finanzPunkte: "Kostenpunkte" };
  const belege = (BELEG[a.id] ?? []).filter((x) => x.z in zeilenN);
  const ja = belege.filter((x) => x.s === "ja");
  const nein = belege.filter((x) => x.s === "nein");
  const offen = belege.filter((x) => x.s === "offen");
  const weniger = ja.filter((x) => x.f && x.a !== "ohne");

  const abzug: PlatzZelle =
    tuer === "schlecht" || a.abgeraten
      ? { text: "Zinsen nicht abschaltbar: abgeraten, keine Note", ton: "verlust" }
      : tuer !== "gut" && tuer !== "teils"
      ? { text: "Zins-Merkmal fehlt: Halal-Teil 0", ton: "verlust" }
      : tuer === "teils"
        ? { text: `minus ${Math.round((1 - FAKTOR_ABSCHALTBAR) * 100)} %: Zinsen abschaltbar`, ton: "abzug" }
        : h.kredit
          ? { text: `minus ${Math.round((1 - FAKTOR_KREDIT) * 100)} %: Kredit ab Start`, ton: "abzug" }
          : { text: "keiner", ton: "voll" };

  const zellen: Record<string, PlatzZelle> = {
    __platz_fehlt: fehlt.length ? { text: fehlt.map((k) => labels[k] ?? k).join(", "), ton: "verlust" } : { text: "nichts", ton: "voll" },
    __platz_platz: { text: platzText },
    __platz_note: b ? { text: `${zahl(b.note)} = halb ${zahl(b.halal)} + halb ${zahl(b.kosten ?? 0)}` } : { text: "keine", ton: "leer" },
    __platz_sterne: b ? { text: zahl(sterne(b.note), 1) } : { text: "–", ton: "leer" },
    __platz_vorrang:
      kategorie === "edelmetall"
        ? String(a.werte.royalMint ?? "").startsWith("ja")
          ? { text: "ja, Royal Mint belegt", ton: "voll" }
          : { text: "nein", ton: "leer" }
        : a.link
          ? { text: "ja, eigener Link", ton: "voll" }
          : { text: "nein, kein Link", ton: "leer" },
    __platz_anlagen: {
      text: `${punkte(belegt)} von ${n}${
        weniger.length ? `: ${weniger.map((x) => `${x.n.split(" ")[0]} ${x.a === "reduziert" ? "0,75" : "0,5"}`).join(", ")}` : ""
      }`,
    },
    __platz_sicher: offen.length
      ? { text: `nein, ${offen.length} offen`, ton: "verlust" }
      : belege.length
        ? { text: `ja, alle ${n}`, ton: "voll" }
        : { text: "keine Belegdaten", ton: "verlust" },
    __platz_ja: { text: ja.length ? belegSatz(ja) : "0" },
    __platz_nein: { text: nein.length ? belegSatz(nein) : "0" },
    __platz_offen: offen.length
      ? { text: `${offen.length}: ${offen.map((x) => x.n).join(", ")}`, ton: "verlust" }
      : { text: "0", ton: "voll" },
    __platz_halalVor: { text: zahl(h.halalVorKredit) },
    __platz_abzug: abzug,
    __platz_halal: b ? { text: `${zahl(b.halal)} von 5` } : { text: "–", ton: "leer" },
  };

  let summe = 0;
  let max = 0;
  for (const [k, m] of Object.entries(finanzMax)) {
    const p = a.finanzPunkte?.[k];
    max += m;
    summe += p ?? 0;
    zellen[`__platz_k_${k}`] =
      typeof p !== "number" ? { text: `– von ${punkte(m)}`, ton: "verlust" } : { text: `${punkte(p)} von ${punkte(m)}`, ton: p >= m ? "voll" : undefined };
  }
  const abzugKosten = Math.min(0, a.finanzPunkte?.abzug ?? 0);
  zellen.__platz_kostenSumme = {
    text: `${punkte(Math.round((summe + abzugKosten) * 100) / 100)} von ${punkte(max)}${abzugKosten ? ` (Abzug ${punkte(abzugKosten)})` : ""}`,
  };
  zellen.__platz_kosten = b ? { text: `${zahl(b.kosten ?? 0)} von 5` } : { text: "–", ton: "leer" };
  return zellen;
};

export type AnsichtEintrag = {
  anbieter: RohAnbieter;
  grau: boolean;
  platz: Record<string, PlatzZelle>;
  /** Note, wenn der Abzug im Halal-Teil (Kredit oder abschaltbare Zinsen) wegfiele. */
  ohneAbzug: number | null;
};

/**
 * Alle Angebote der Datendatei in einer Reihenfolge: die sichtbaren mit ihrem Live-Platz, die
 * versteckten an der Stelle, an der ihre Note sie heute einsortiert. Rot abgeratene, die nicht auf
 * der Seite stehen, fallen weg.
 */
export const ansichtA3 = (
  sichtbar: readonly RohAnbieter[],
  alle: readonly RohAnbieter[],
  kategorie: RangKategorie,
  finanzMax: Record<string, number>,
  zeilen: VergleichsZeile[],
): AnsichtEintrag[] => {
  const ids = new Set(sichtbar.map((a) => a.id));
  const versteckt = alle.filter((a) => !ids.has(a.id) && !a.abgeraten && a.werte.zinsfreiAbStart !== "schlecht");
  const live = rangfolge(sichtbar, kategorie, { finanzMax });
  const livePlatz = new Map(live.gerankt.map((b) => [b.anbieter.id, b.platz]));
  const gesamt = rangfolge([...sichtbar, ...versteckt], kategorie, { finanzMax });
  const urteil = new Map(gesamt.gerankt.map((b) => [b.anbieter.id, b]));
  const reihe = [...gesamt.gerankt.map((b) => b.anbieter), ...gesamt.nichtBewertet.map((x) => x.anbieter), ...gesamt.abgeraten.map((x) => x.anbieter)];
  return reihe.map((a) => {
    const grau = !ids.has(a.id);
    const b = urteil.get(a.id);
    const platzText = grau
      ? `nicht auf der Seite (wäre ${b ? b.platz : "–"} von ${gesamt.gerankt.length})`
      : livePlatz.has(a.id)
        ? `${livePlatz.get(a.id)} von ${live.gerankt.length}`
        : "abgeraten";
    const fehlt = grau ? luecken(a, kategorie, zeilen, { finanzMax }) : [];
    const zeilenN = kategorie === "edelmetall" ? { halalEdelmetalle: ANTEIL_N.halalEdelmetalle } : ANTEIL_N;
    const ohneAbzug = b ? Math.round((0.5 * depotHalal(a, zeilenN).halalVorKredit + 0.5 * (b.kosten ?? 0)) * 100) / 100 : null;
    return { anbieter: a, grau, platz: zerlege(a, kategorie, finanzMax, b, platzText, fehlt, zeilen), ohneAbzug };
  });
};

/** Ein Wert mit „mind.“: nicht alle Anlagen der Zeile sind beantwortet. */
export const istMindestens = (text: string | null | undefined) => typeof text === "string" && /^\s*mind\./.test(text);
