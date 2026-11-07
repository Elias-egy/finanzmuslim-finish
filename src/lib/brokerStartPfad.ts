/**
 * Wer die schlanke Depot-Startseite bekommt (src/data/brokerStart.ts, src/pages/BrokerStart.tsx). Eigene kleine Datei,
 * weil das Layout sie auf jeder Seite braucht: Dort läuft die Seite ohne Menü, Suche und Knopf im Kopf (Elias, CV21F
 * 08.11.2026: „hier jetzt ist zu viel Klickbares“, „es darf keine Konkurrenz geben“).
 */
export const BROKER_START_KURZNAMEN: readonly string[] = ["traders-place", "flatex", "smartbroker"];

/** Fassung „Depot da, noch leer“ (CV-LEER): nur mit ?src=dmleer… oder fbleer… in der Adresse. */
export const LEER_QUELLE = /^(?:dm|fb)leer[a-z0-9]*$/;

export const istLeerQuelle = (src: string | null | undefined): boolean => !!src && LEER_QUELLE.test(src);

export const istBrokerStartSeite = (pathname: string, search: string): boolean => {
  const m = pathname.match(/^\/dein-investmentstart\/([a-z0-9-]+)\/?$/);
  return !!m && BROKER_START_KURZNAMEN.includes(m[1]) && !istLeerQuelle(new URLSearchParams(search).get("src"));
};
