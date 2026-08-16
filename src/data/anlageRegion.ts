/**
 * Ein geografisches Zeichen je Anlage, rechts in der Liste.
 *
 * Grundlage ist der **Auftrag des Fonds**, nicht eine geschätzte Gewichtung.
 * Der MSCI World Islamic liegt zwar schwer in den USA, sein Index ist aber
 * ein Weltindex. Eine US-Flagge daneben wäre eine Behauptung, die wir nicht
 * belegen können und die sich mit jeder Indexanpassung ändert. Deshalb: Welt
 * bleibt Welt, USA bleibt USA.
 *
 * Bei Gold und Silber zählt der Lagerort, denn den gibt der Anbieter an.
 * Die Londoner Tresore sind der Normalfall, Swiss Gold liegt in der Schweiz.
 *
 * Hinweis zur Darstellung: Länderflaggen sind Emoji. Auf iPhone, Android und
 * Mac werden sie als Flagge gezeichnet, unter Windows zeigt Chrome stattdessen
 * die Länderkürzel. Deshalb steht neben jedem Zeichen ein Wort, das für sich
 * allein verständlich ist.
 */

export type Region = { zeichen: string; label: string };

const WELT: Region = { zeichen: "🌍", label: "Welt" };
const SCHWELLEN: Region = { zeichen: "🌏", label: "Schwellenländer" };
const USA: Region = { zeichen: "🇺🇸", label: "USA" };
const EUROPA: Region = { zeichen: "🇪🇺", label: "Europa" };
const LONDON: Region = { zeichen: "🇬🇧", label: "London" };
const SCHWEIZ: Region = { zeichen: "🇨🇭", label: "Schweiz" };

const nachIsin: Record<string, Region> = {
  // Aktien, Weltindizes
  IE00B27YCN58: WELT, // iShares MSCI World Islamic
  IE000UOXRAM8: WELT, // Invesco Dow Jones Islamic Global Developed Markets
  IE000LFC57H7: WELT, // Invesco MSCI ACWI Islamic M-Series
  IE000X9FTI22: WELT, // HSBC MSCI World Islamic Screened
  IE00BMYMHS24: WELT, // HANetf Saturna Al-Kawthar Global Focused Equity
  LU2458330086: WELT, // Franklin Shariah Technology, globaler Auftrag

  // Aktien, Regionen
  IE00B296QM64: USA, // iShares MSCI USA Islamic
  IE000I5NV504: USA, // HSBC MSCI USA Islamic Screened
  IE000AGFZM58: EUROPA, // HSBC MSCI Europe Islamic Screened
  IE00B4ZJ4634: EUROPA, // Comgest Growth Europe
  IE00B27YCP72: SCHWELLEN, // iShares MSCI Emerging Markets Islamic
  IE0009BC6K22: SCHWELLEN, // HSBC MSCI EM Islamic Screened Capped

  // Sukuk, weltweit begeben
  IE000929U2U9: WELT, // iShares USD Sukuk
  LU3123443510: WELT, // Xtrackers II Salam USD Global Aggregate Sukuk
  LU1150255971: WELT, // BNP Paribas Islamic Fund Hilal Income

  // Metalle, Lagerort
  IE00B579F325: LONDON, // Invesco Physical Gold ETC
  XS3384723154: LONDON, // Invesco Physical Gold II
  JE00B1VS3770: LONDON, // WisdomTree Physical Gold
  JE00BN2CJ301: LONDON, // WisdomTree Core Physical Gold
  JE00B588CD74: SCHWEIZ, // WisdomTree Physical Swiss Gold
  IE00B43VDT70: LONDON, // Invesco Physical Silver
  JE00B1VS3333: LONDON, // WisdomTree Physical Silver
  JE00BQRFDY49: LONDON, // WisdomTree Core Physical Silver
};

export const regionFuer = (isin: string): Region | undefined => nachIsin[isin];
