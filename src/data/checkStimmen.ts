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
  /** Statt des Zitats der echte Screenshot der Nachricht (Elias RN16-35); das Zitat bleibt als Bildbeschreibung. */
  screenshot?: string;
  sterne?: 1 | 2 | 3 | 4 | 5;
  /** Die Person hat ihren Text bestätigt. Nur dann steht die Stimme live; sonst nur im Entwicklungsmodus, als Platzhalter markiert. */
  bestaetigt?: boolean;
};

/**
 * Die fünf Stimmen (Elias RN16-27 bis RN16-32, 18.11.2026): zwei zum Bankkonto, drei zum Investieren. Wortlaut aus Elias' Diktat, nur
 * die Grammatik geglättet (RN16-30: „Du hast das umformuliert, mach's wie ich gesagt habe“). Elias gibt die Texte den Personen; live steht
 * eine Stimme erst, wenn die Person ihn bestätigt hat (bestaetigt: true) und Name samt Zeile von ihr stammen.
 */
export const ALLE_STIMMEN: Record<StimmeId, Stimme> = {
  // RN16-20 bis RN16-26: Matin, Foto aus Elias' Upload (RN16-26), ohne Sterne (RN16-23).
  matin: {
    art: "konto",
    // RN16-35 (Elias: „wie das aussehen würde, wenn man wirklich den Screenshot einblendet … von Martin als Beispiel nur … Konto bei
    // Norris Bank. Ja, Martin.m“): Ansicht mit Screenshot; der Screenshot ist Elias' Beispielbild, nur im Entwicklungsmodus.
    zitat: "Eine absolut herausragende Beratung! Ich habe mich von Anfang an bestens aufgehoben und kompetent beraten gefühlt. Die Erreichbarkeit war jederzeit gegeben, Rückmeldungen kamen stets schnell und zuverlässig, und auch fachlich konnte mir jede meiner Fragen verständlich und fundiert beantwortet werden. Eine klare Weiterempfehlung!",
    screenshot: "/bilder/check/stimme-matin-chat.webp",
    name: "matin.m",
    zeile: "Konto bei norisbank",
    foto: "/bilder/check/stimme-matin.webp",
  },
  // RN16-31 („mir hat gefallen, dass meine momentane Bank … nebeneinander gestellt wurden … sehr übersichtlich und gut zum Vergleichen“),
  // RN16-32: Konto bei norisbank. Name folgt von der Person.
  "bank-nebeneinander": {
    art: "konto",
    zitat: "Mir hat gefallen, dass meine momentane Bank und die anderen nebeneinandergestellt wurden. Das war sehr übersichtlich und gut zum Vergleichen.",
    name: "Name folgt",
    zeile: "Girokonto bei norisbank",
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
    zitat: "Ich war ehrlich gesagt skeptisch, weil auf Insta jeder irgendwas als halal verkauft. Hier stand bei den Sachen dabei, woher die Info kommt, und das hat mir gefallen.",
    name: "Name folgt",
    zeile: "Depot bei flatex",
  },
  // RN16-29, RN16-30 („Vor allem der zweite Satz“), RN16-32: Traders Place. 0 € Depot, Order und Sparplan laut brokerVergleich.ts.
  "klein-anfangen": {
    art: "depot",
    zitat: "Ich wollte erstmal klein anfangen. Es wurde ein Broker ausgewählt, der 0 Euro Gebühren hat. Ich bin sehr zufrieden, Alhamdulillah.",
    name: "Name folgt",
    zeile: "Depot bei Traders Place",
  },
};

/** Die echten, bestätigten Stimmen. */
export const STIMMEN: Stimme[] = Object.values(ALLE_STIMMEN).filter((s) => s.bestaetigt);

/** Stellen: die Freebies (Quelle des Kastens), die Testseite vor dem Check und das Ergebnis je Art. */
export type StimmenStelle = CheckQuelle | "check" | "ergebnis-konto" | "ergebnis-depot";

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
  "portfolio-plan": ["reuf", "klein-anfangen"],
  "broker-vergleich": ["klein-anfangen", "skeptisch"],
  "ergebnis-konto": KONTO_PAAR,
  "ergebnis-depot": ["reuf", "klein-anfangen"],
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
export const LEUTE_BILDER: string[] = [];
/** Nur Entwicklung: die drei Porträts aus Elias' Perspective-Original (Blueprint rn10 Abschnitt 2.2, Unsplash crop=faces), nie live. */
export const LEUTE_BEISPIEL = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=faces&fit=crop&w=160&h=160&q=72",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=faces&fit=crop&w=160&h=160&q=72",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=faces&fit=crop&w=160&h=160&q=72",
];
export const leuteBilder = (dev: boolean, echt: readonly string[] = LEUTE_BILDER): string[] =>
  echt.length > 0 ? [...echt] : dev ? [...LEUTE_BEISPIEL] : [];
