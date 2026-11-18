/**
 * Stimmen (Testimonials) für den Halal-Finanz-Check: Testseite /check, Freebie-Kasten (CheckEinstieg) und Ergebnis.
 * Keine erfundenen Stimmen live (Vault raw/2026-11-15-elias-rn6-02-erst-sales-page-perspective-eins-zu-eins.md): eine Stimme steht im
 * Produktionsbuild erst mit bestaetigt: true, sonst nur im Entwicklungsmodus mit data-stimme-platzhalter. Sterne nur, wo der Eintrag selbst
 * eine Zahl mitbringt. Foto nur ein echtes, Pfad unter /public.
 */
import type { CheckQuelle } from "@/data/halalFinanzCheck";

export type StimmeId = "matin" | "bank-nebeneinander" | "reuf" | "skeptisch" | "klein-anfangen";

export type Stimme = {
  /** Für welchen Check die Stimme gilt (RN8): Bankkonto-Check, Depot-Check oder beide. Ohne Angabe gilt sie für beide. */
  art?: "konto" | "depot" | "alle";
  zitat: string;
  name: string;
  /** Eine kurze Zeile hinter dem Namen, etwa „Depot bei Smartbroker+“. */
  zeile?: string;
  foto?: string;
  sterne?: 1 | 2 | 3 | 4 | 5;
  /** Die Person hat ihren Text bestätigt. Nur dann steht die Stimme live; sonst nur im Entwicklungsmodus, als Platzhalter markiert. */
  bestaetigt?: boolean;
};

/**
 * Die fünf Stimmen (Elias RN16-27 bis RN16-32, 18.11.2026): zwei zum Bankkonto, drei zum Investieren. Wortlaut aus Elias' Diktat, nur
 * die Grammatik geglättet (RN16-30: „Du hast das umformuliert, mach's wie ich gesagt habe“). Elias gibt die Texte den Personen; live steht
 * eine Stimme erst, wenn die Person ihn bestätigt hat (bestaetigt: true) und Name samt Zeile von ihr stammen.
 */
// RN16-37 (18.11.): Endfassungen aus Elias' Text. Matin: Sparkassen-Dispo statt 6,55 % „fast 12 Prozent“ (Preisaushänge 11/2026: Bielefeld
// 10,90 %, Trier 11,10 %, Heilbronn 11,617 %, Zwickau 12,97 %), Matin gleicht mit seinem Auszug ab. Bank nebeneinander: Commerzbank statt
// Sparkasse, 4,90 € Kontoführung (kontopreise.ts, Entgeltinformation GiroKonto). Skeptisch: Aktien-Liste nennt je Titel die Musaffa-Fundstelle.
// Klein anfangen: Traders Place Sparplan 0 €, Sparrate ab 1 € (brokerVergleich.ts).
export const ALLE_STIMMEN: Record<StimmeId, Stimme> = {
  // RN16-20 bis RN16-26: Matin, Foto aus Elias' Upload (RN16-26), ohne Sterne (RN16-23).
  matin: {
    art: "konto",
    zitat: "Ich bin manchmal ins Minus gerutscht und hab nicht gecheckt, dass da Zinsen draufkommen. Waren am Ende fast 12 Prozent bei der Sparkasse. Ich hab gewechselt und mit dem Wechselservice alles rübergezogen. Hat reibungslos geklappt.",
    // RN18-07 (Elias: „Nicht Zinsen zahlen wollte ich auf keinen Fall, sondern ich habe gewechselt … So, dass es ein bisschen kürzer ist.“).
    // RN18-02 (Elias: „Martin, Artin und Halil haben ihren Text gesehen und sind einverstanden“), RN18-04: 12 Prozent stimmen.
    bestaetigt: true,
    // RN17-04 (Elias: „Und ich würde Martin M. nehmen, dann ist alles mit Punkt.“): Vorname und Anfangsbuchstabe wie Reuf K.
    name: "Matin M.",
    zeile: "Girokonto bei norisbank",
    // RN17-28: Foto ist das vierte Newsletter-Gesicht (src/assets/leser/leser-4.webp, blauer Hintergrund), näher geschnitten.
    foto: "/bilder/check/stimme-matin.webp",
  },
  // RN16-31 („mir hat gefallen, dass meine momentane Bank … nebeneinander gestellt wurden … sehr übersichtlich und gut zum Vergleichen“),
  // RN16-32: Konto bei norisbank. Name folgt von der Person.
  "bank-nebeneinander": {
    art: "konto",
    zitat: "Ich hab meine Commerzbank und die anderen zum ersten Mal direkt nebeneinander gesehen. Ich zahl da seit Jahren 4,90 € im Monat Kontoführung und hab es nie gemerkt. Hab noch am selben Abend das Konto bei der BBBank eröffnet.",
    // RN18-08 (Elias: „mach Commerzbank wieder rein. Ich hab's jetzt und schreib Pascal K.“).
    name: "Pascal K.",
    bestaetigt: true,
    // RN17-02 (Elias: „ich habe meine Commerzbank, da würde ich sagen, Girokonto bei BB Bank“).
    zeile: "Girokonto bei BBBank",
  },
  // RN16-16, RN16-18: erste echte Stimme, Name buchstabiert „R-E-U-F-K“, Depot bei Smartbroker+.
  reuf: {
    art: "depot",
    zitat: "Ich hatte vor Elias' Beratung überhaupt keine Ahnung von ETFs und ETCs. Bei Fragen hat mir Elias sehr schnell und gut weitergeholfen.",
    name: "Reuf K.",
    zeile: "Depot bei Smartbroker+",
    bestaetigt: true,
  },
  // RN16-29 (Elias' Satz wortgleich), RN16-32: Depot bei flatex.
  skeptisch: {
    art: "depot",
    zitat: "Ich war skeptisch, weil auf Insta jeder irgendwas als halal verkauft. Hier stand bei jeder Aktie dabei, woher die Einstufung kommt. Das hat mich überzeugt, weil ich es selbst nachprüfen konnte.",
    // RN17-12 (Elias: „bei dem mit, war skeptisch, kann das kommen mit Artin E. … das gleiche Bild, was wir bei Newsletter haben … das
    // allererste … ein bisschen näher … Hintergrund … blau verschwommen“): src/assets/leser/leser-1.webp, Person mit macOS-Vision
    // enger geschnitten; RN17-19: von Codex in eine verschwommene Straße eingesetzt (Unsplash, MAK, „an empty street with a building in the background“, itoMkVLeWgc), ohne weißen Saum.
    name: "Artin E.",
    foto: "/bilder/check/stimme-artin.webp",
    zeile: "Depot bei flatex",
    // RN18-02: Text gesehen und einverstanden.
    bestaetigt: true,
  },
  // RN16-29, RN16-30 („Vor allem der zweite Satz“), RN16-32: Traders Place. 0 € Depot, Order und Sparplan laut brokerVergleich.ts.
  "klein-anfangen": {
    art: "depot",
    // RN17-06 bis -08 (Elias: „eher sowas wie 50 € im Monat anfangen. Und deswegen vor allem niedrige Kosten“, „anstatt dieses klein
    // angefangen, aber angefangen, Alhamdulillah … was viel Simpleres“, „Definitive Empfehlung von mir.“). 0 € je Sparplan-Rate laut
    // Depot-Vergleich (etfSparplanKosten Traders Place).
    zitat: "Ich wollte erstmal mit 50 € im Monat anfangen und habe Traders Place als Ergebnis bekommen. Da zahl ich 0 € Ordergebühr auf meinen Sparplan. Das Ergebnis hat wirklich sehr gut gepasst.",
    // RN17-10 (Elias: „bei den 50 € Traders Place Ding Halil S nehmen“); Foto folgt aus seinem WhatsApp-Profil.
    name: "Halil S.",
    // RN17-13: Foto aus Halils WhatsApp-Profil (Vault raw/2026-11-18-elias-rn17-13-foto-halil.png), quadratisch um das Gesicht.
    foto: "/bilder/check/stimme-halil.webp",
    zeile: "Depot bei Traders Place",
    // RN18-02: Text gesehen und einverstanden.
    bestaetigt: true,
  },
};

/** Die echten, bestätigten Stimmen. */
export const STIMMEN: Stimme[] = Object.values(ALLE_STIMMEN).filter((s) => s.bestaetigt);

/** Stellen: die Freebies (Quelle des Kastens), die Testseite vor dem Check und das Ergebnis je Art. */
export type StimmenStelle = CheckQuelle | "check" | "ergebnis-konto" | "ergebnis-depot";

// RN18-03 kurz raus, RN18-08 wieder rein als Pascal K.
const KONTO_PAAR: StimmeId[] = ["matin", "bank-nebeneinander"];
/**
 * Welche Stimmen wo stehen (Elias RN16-32: „auf der Hauptseite 3 auf den Freebies 2. Die 2 müssen passend sein, die 3 müssen die
 * stärksten sein, die immer gezeigt werden“; Boykott „typische Zinsfreiheit … Bankkonten-Testimonials“, Aktien „mit Halal“). Plan von
 * Elias mit „Ja, kannst du einbauen“ bestätigt.
 */
export const STIMMEN_JE_STELLE: Partial<Record<StimmenStelle, StimmeId[]>> = {
  check: ["matin", "reuf", "skeptisch"],
  boykottliste: KONTO_PAAR,
  "vertrags-ampel": KONTO_PAAR,
  "auto-abo": KONTO_PAAR,
  "baraka-blocker": KONTO_PAAR,
  rizq: KONTO_PAAR,
  aktienliste: ["skeptisch", "reuf"],
  "halal-anlagen": ["reuf", "skeptisch"],
  "gold-plan": ["reuf", "klein-anfangen"],
  "sukuk-plan": ["reuf", "klein-anfangen"],
  "etf-plan": ["klein-anfangen", "reuf"],
  "portfolio-plan": ["reuf", "klein-anfangen"],
  "broker-vergleich": ["klein-anfangen", "skeptisch"],
  "ergebnis-konto": KONTO_PAAR,
  "ergebnis-depot": ["reuf", "klein-anfangen"],
};

/**
 * Zwei weitere Stimmen im Kasten am Ende jedes Freebies (Elias RN16-41: „die 2 relevanten oben und 2 weniger passende, aber trotzdem
 * noch welche, die okay sind, unten“). Nie dieselben wie oben. Ohne Quelle: Matin und Reuf.
 */
const KONTO_UNTEN: StimmeId[] = ["reuf", "skeptisch"];
export const STIMMEN_UNTEN_JE_QUELLE: Partial<Record<CheckQuelle, StimmeId[]>> = {
  boykottliste: KONTO_UNTEN,
  "vertrags-ampel": KONTO_UNTEN,
  "auto-abo": KONTO_UNTEN,
  "baraka-blocker": KONTO_UNTEN,
  rizq: KONTO_UNTEN,
  aktienliste: ["klein-anfangen", "matin"],
  "halal-anlagen": ["klein-anfangen", "matin"],
  "gold-plan": ["skeptisch", "matin"],
  "sukuk-plan": ["skeptisch", "matin"],
  "etf-plan": ["skeptisch", "matin"],
  "portfolio-plan": ["skeptisch", "matin"],
  "broker-vergleich": ["reuf", "matin"],
};

export type StimmeAnStelle = Stimme & { id: StimmeId; beispiel: boolean };

/**
 * Die Stimmen einer Stelle in ihrer Reihenfolge: live nur bestätigte, im Entwicklungsmodus alle (unbestätigte als Beispiel markiert).
 * Eine Stelle ohne Eintrag (Startseite, Menü) bekommt die der Testseite.
 */
export const stimmenAn = (stelle: StimmenStelle, dev: boolean, alle: Record<StimmeId, Stimme> = ALLE_STIMMEN): StimmeAnStelle[] =>
  (STIMMEN_JE_STELLE[stelle] ?? STIMMEN_JE_STELLE.check!)
    .map((id) => ({ ...alle[id], id, beispiel: !alle[id].bestaetigt }))
    .filter((s) => dev || !s.beispiel);

/**
 * Bilder anderer Menschen neben „Über 22.000 Menschen informieren sich bei Finanzmuslim“ (Elias RN9-03: „nicht ein Bild von mir,
 * sondern zwei, drei Bilder von anderen Leuten“). Echte Bilder kommen nach Elias' Antwort (echte Leser mit Erlaubnis oder Bilder wie im
 * Original). Bis dahin zeigt nur der Entwicklungsmodus die drei Porträts des Originals, live nichts.
 */
// RN17-24 (Elias: „nimm mal das von Halil. Das von Martin und das, was ich dir jetzt gegeben habe, bei den so viele Leute informieren sich.
// Jetzt brauchen wir noch irgendwie eine Frau, aber das kriegen wir noch hin. Also mach erstmal die 3 Bilder rein.“): drei echte Leser.
export const LEUTE_BILDER: string[] = ["/bilder/check/stimme-matin.webp", "/bilder/check/leute-3.webp", "/bilder/check/stimme-halil.webp"];
/** Nur Entwicklung: die drei Porträts aus Elias' Perspective-Original (Blueprint rn10 Abschnitt 2.2, Unsplash crop=faces), nie live. */
export const LEUTE_BEISPIEL = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=faces&fit=crop&w=160&h=160&q=72",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=faces&fit=crop&w=160&h=160&q=72",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=faces&fit=crop&w=160&h=160&q=72",
];
export const leuteBilder = (dev: boolean, echt: readonly string[] = LEUTE_BILDER): string[] =>
  echt.length > 0 ? [...echt] : dev ? [...LEUTE_BEISPIEL] : [];

/** Die zwei Stimmen unten im Freebie (RN16-41), live nur bestätigte. */
export const stimmenUnten = (quelle: CheckQuelle | undefined, dev: boolean, alle: Record<StimmeId, Stimme> = ALLE_STIMMEN): StimmeAnStelle[] =>
  ((quelle && STIMMEN_UNTEN_JE_QUELLE[quelle]) || (["matin", "reuf"] as StimmeId[]))
    .map((id) => ({ ...alle[id], id, beispiel: !alle[id].bestaetigt }))
    .filter((s) => dev || !s.beispiel);
