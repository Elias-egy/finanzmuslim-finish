/**
 * Die zwei Stimmen der Verkaufsseite vor dem Halal-Finanz-Check (/check): eine unter dem Hero-Foto, eine unter dem
 * Gründer-Satz (Perspective-Funnel, Seite „Start“). Elias liefert echte Testimonials, bis dahin stehen hier keine:
 * Vault raw/2026-11-15-elias-rn6-02-erst-sales-page-perspective-eins-zu-eins.md („Keine erfundenen Stimmen, nur echte“).
 *
 * Solange ein Eintrag fehlt, zeigt der Entwicklungsmodus einen gelb gestrichelten Platzhalter an der Stelle, im
 * Produktionsbuild entfällt die Karte (stimmeAnzeige). Sterne stehen nur da, wo der Eintrag selbst eine Zahl
 * mitbringt, nie von uns gesetzt. Foto nur ein echtes, Pfad unter /public.
 */
export type Stimme = {
  /** Für welchen Check die Stimme gilt (RN8): Bankkonto-Check, Depot-Check oder beide. Ohne Angabe gilt sie für beide. */
  art?: "konto" | "depot" | "alle";
  zitat: string;
  name: string;
  /** Eine kurze Zeile hinter dem Namen, etwa „Erstes Depot 2025“. */
  zeile?: string;
  foto?: string;
  sterne?: 1 | 2 | 3 | 4 | 5;
};

export const STIMMEN: Stimme[] = [
  // Erste echte Stimme (Elias RN16-16, 17.11.2026, Vault raw/2026-11-17-elias-rn16-16-erste-stimme-rolf-k-ohne-sterne.md):
  // „du“ auf Elias' Wunsch zu „Elias“, ohne Sterne („macht die Sterne mal raus“).
  {
    art: "depot",
    zitat: "Ich hatte vor Elias' Beratung überhaupt keine Ahnung von ETFs und ETCs. Bei Fragen hat mir Elias sehr schnell und gut weitergeholfen.",
    // RN16-18: Name buchstabiert „R-E-U-F-K“, Depot bei Smartbroker+ („Nur Smart Broker sollte sein bei Rolf K.“).
    name: "Reuf K.",
    zeile: "Depot bei Smartbroker+",
  },
];

/**
 * Die Stimmen, die zur Stelle passen (Elias RN15-01: „einmal eine, die alle abdeckt. Und dann immer, wenn was kommt, genau welche, die da passen“):
 *  - „alle“ (Verkaufsseite vor dem Check): nur die allgemeinen, die alles abdecken,
 *  - „konto“ oder „depot“ (Ergebnis): erst die der Art, dann die allgemeinen,
 *  - ohne Angabe: alle Stimmen.
 * Nie eine Stimme der falschen Art (eine Konto-Stimme steht nicht im Depot-Check und nicht auf der allgemeinen Seite).
 */
export const stimmenFuer = (art?: "konto" | "depot" | "alle", stimmen: readonly Stimme[] = STIMMEN): Stimme[] => {
  if (!art) return [...stimmen];
  const allgemein = stimmen.filter((s) => !s.art || s.art === "alle");
  if (art === "alle") return allgemein;
  return [...stimmen.filter((s) => s.art === art), ...allgemein];
};

export type StimmeAnzeige = "echt" | "platzhalter" | "keine";

/** Was an Stelle 0 oder 1 steht: die echte Stimme, im Entwicklungsmodus der Platzhalter, sonst nichts. */
export const stimmeAnzeige = (index: number, dev: boolean, stimmen: readonly Stimme[] = STIMMEN): StimmeAnzeige =>
  stimmen[index] ? "echt" : dev ? "platzhalter" : "keine";

/** Die Stimme im Freebie-Kasten (CheckEinstieg): die erste der passenden Art, ohne echte Stimme nichts (nie ein Platzhalter live). */
export const stimmeFuerEinstieg = (art: "konto" | "depot", stimmen: readonly Stimme[] = STIMMEN): Stimme | undefined =>
  stimmenFuer(art, stimmen)[0];

/**
 * RN11 (Elias RN10-08: „Du kannst die Sternbewertung und so auch schon reinpacken. Dann weiß ich ungefähr, wie das aussieht.“):
 * RN15 (Elias RN15-01): zwei Konto-Beispiele („Ich habe ein Konto bei norisbank eröffnet …“) für das Ergebnis, eine allgemeine für die
 * Verkaufsseite; alle nur Platzhalter, echte Texte liefert Elias.
 * Beispiel-Stimmen mit Sternen, NUR im Entwicklungsmodus an der Stelle des Platzhalters (CheckStimme). Nie live: der Produktionsbuild
 * zeigt ohne echte Stimme nichts (stimmeAnzeige). Wortlaut nach den Beispielen in Elias' Perspective-Funnel 6afa2cd179f7bfa91bb900d0.
 */
export const BEISPIEL_STIMMEN: Stimme[] = [
  // RN16-20 (Elias: „bei meinem alten Konto konnte ich ins Minus gehen. Und ich wusste nicht, dass das verzinst wird. Ich konnte alle
  // Sachen rüberziehen … m-a-t-i-n.m … Girokonto bei Norris Bank“), nur als Beispiel im Entwicklungsmodus.
  {
    art: "konto",
    zitat: "Bei meinem alten Konto konnte ich ins Minus gehen und wusste nicht, dass das verzinst wird. Bei der neuen Bank konnte ich alles rüberziehen.",
    name: "Matin M.",
    zeile: "Girokonto bei norisbank",
    // RN16-24: Foto aus dem Newsletter-Kreis (4. Leserbild), enger ums Gesicht
    foto: "/bilder/check/stimme-matin.webp",
    // RN16-23: „mach mal die Sterne weg“
  },
  {
    art: "konto",
    zitat: "Ich habe ein Konto bei der norisbank eröffnet. Den Wechsel von meiner alten Bank hat sie mir abgenommen.",
    name: "Hatice D.",
    zeile: "Wechsel zur norisbank",
    sterne: 5,
  },
  {
    art: "konto",
    zitat: "Ich habe jahrelang für mein Konto gezahlt, ohne es zu merken. Der Wechsel war einfacher als gedacht.",
    name: "Meryem K.",
    zeile: "Girokonto ohne Kontoführungsgebühr",
    sterne: 5,
  },
  {
    art: "depot",
    zitat: "Ich wusste nicht, welcher Broker zu meinem Sparplan passt. Nach der Empfehlung habe ich in einer Woche angefangen.",
    name: "Yusuf A.",
    zeile: "Endlich ein Depot, das passt",
    sterne: 5,
  },
  {
    art: "alle",
    zitat: "Ein paar Fragen, und die Antwort passte zu meiner Situation statt zu irgendeiner Bestenliste.",
    name: "Samir B.",
    zeile: "Ich habe mich verstanden gefühlt",
    sterne: 5,
  },
];

/**
 * Bilder anderer Menschen neben „Über 22.000 Menschen informieren sich bei Finanzmuslim“ (Elias RN9-03: „nicht ein Bild von mir,
 * sondern zwei, drei Bilder von anderen Leuten“). Echte Bilder kommen nach Elias' Antwort (echte Leser mit Erlaubnis oder Bilder wie im
 * Original). Bis dahin zeigt nur der Entwicklungsmodus die drei Porträts des Originals, live nichts.
 */
export const LEUTE_BILDER: string[] = [];
/** Nur Entwicklung: die drei Porträts aus Elias' Perspective-Original (Blueprint rn10 Abschnitt 2.2, Unsplash crop=faces), nie live. */
export const LEUTE_BEISPIEL = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=faces&fit=crop&w=160&h=160&q=72",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=faces&fit=crop&w=160&h=160&q=72",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=faces&fit=crop&w=160&h=160&q=72",
];
export const leuteBilder = (dev: boolean, echt: readonly string[] = LEUTE_BILDER): string[] =>
  echt.length > 0 ? [...echt] : dev ? [...LEUTE_BEISPIEL] : [];
