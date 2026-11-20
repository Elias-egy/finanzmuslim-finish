import { ArrowRight, Check, X } from "lucide-react";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import { ANBIETER_LOGOS, logoMass } from "@/data/anbieterLogos";
import { LOGO_MASSE } from "@/data/anbieterLogoMasse";
import { bankPreis, bankWerte, schnellwahl, wahlVon, type BankAmpel } from "@/data/bankSuche";
import { depotNachId, depotSchnellwahl, depotWahlVon, depotWerte } from "@/data/depotSuche";
import { ETIKETT, FRAGEN, type Art } from "@/data/halalFinanzCheckKern";

/**
 * RN15 (Elias RN14-02: „So entsteht deine Empfehlung. Da will ich die Bilder einmal anpassen … Bilder …, die nicht generisch wirken“):
 * statt Stockfotos je Schritt eine kleine Szene aus der echten Oberfläche des Checks, als HTML gezeichnet (scharf, hell und dunkel):
 *  01 der Chat mit Elias' Foto, der ersten Frage und den Antwortknöpfen (Wortlaut aus FRAGEN.ziel),
 *  02 ein kleines Raster aus dem finanzmuslim-Vergleich (Logos, zwei Spalten; Werte gerechnet aus bankSuche und depotSuche, nichts von Hand),
 *  03 die Analyse mit Ring und drei Haken,
 *  04 der Eröffnen-Knopf mit einem Beispiel-Logo (seit RN16 BBBank und Scalable, nicht das häufigste Match),
 *  05 neu das Erfolgserlebnis „Herzlichen Glückwunsch“ mit grünem Haken und Konfetti.
 * Alle Maße in cqw (Breite des Bildrahmens), damit die Szene bei 110 px am Handy und 200 px am Laptop gleich aussieht. Nur span, weil die
 * Szene in einem Knopf steht. Für Lesehilfen ist die Szene stumm (aria-hidden); der Schritt hat Titel und Text daneben.
 */

export type SzeneId = "chat" | "raster" | "analyse" | "oeffnen" | "erfolg";

const bank = (id: string) => {
  const b = schnellwahl().find((x) => x.id === id);
  return b ? wahlVon(b) : undefined;
};

const Mark = ({ ja }: { ja: boolean | null }) =>
  ja === null ? (
    <span className="hc-sz-strich">–</span>
  ) : ja ? (
    <Check className="hc-sz-ja" />
  ) : (
    <X className="hc-sz-nein" />
  );

/**
 * Rahmen für ein Logo in der Szene: die optische Größe wie im Vergleich (logoMass, Höhe wie Finanzfluss), eingepasst in höchstens
 * `maxB` × `maxH` cqw. Im Rahmen füllt AnbieterLogo die ganze Fläche (CSS .hc-sz-logo), so bleibt der Ausschnitt der Datei richtig.
 */
const logoRahmen = (domain: string | undefined, maxB: number, maxH: number): React.CSSProperties => {
  const e = domain ? ANBIETER_LOGOS[domain] : undefined;
  const m = e ? logoMass(e, LOGO_MASSE[e.datei]) : undefined;
  if (!m) return { width: `${maxB}cqw`, height: `${maxH}cqw` };
  // Gleicher Maßstab für alle Logos einer Szene: 134 px im Vergleich entsprechen maxB cqw, gedeckelt durch die Höhe.
  const f = Math.min(maxB / 134, maxH / m.hoehe);
  return { width: `${m.breite * f}cqw`, height: `${m.hoehe * f}cqw` };
};

const ohneDispo = (a: BankAmpel | null): boolean | null => (a === null ? null : a === "gut");
/** Nur „0 €“ ohne „ab“ gilt als kostenlos; ein Betrag darüber als Kreuz; ohne belegten Preis ein Strich. */
const kostenlos = (wert: string | undefined): boolean | null => (wert === undefined ? null : /^0\s€$/.test(wert));

type RasterZeile = { name: string; domain?: string; match?: boolean; a: React.ReactNode; b: React.ReactNode };

const rasterKonto = (): { kopf: [string, string]; zeilen: RasterZeile[] } => {
  const zeile = (id: string): RasterZeile | null => {
    const w = bank(id);
    if (!w) return null;
    return { name: w.name, domain: w.domain, a: <Mark ja={kostenlos(bankPreis(w)?.wert)} />, b: <Mark ja={ohneDispo(bankWerte(w).keinDispo)} /> };
  };
  // RN16 (Elias RN15-03: „ich würde nicht Norris Bank nehmen … da in diesen Schritt 2, DKB, Commerzbank und Sparkasse als Beispiel“):
  // ohne norisbank und ohne hervorgehobene Zeile, damit das Ergebnis später nicht abgesprochen wirkt.
  return {
    kopf: ["0 €", "Ohne Dispo"],
    zeilen: [zeile("dkb"), zeile("commerzbank"), zeile("grp-sparkasse")].filter((z): z is RasterZeile => Boolean(z)),
  };
};

const rasterDepot = (): { kopf: [string, string]; zeilen: RasterZeile[] } => {
  const kurz = (t: string | null | undefined) => (t ? t.replace(/^mind\. /, "").replace(" von ", "/") : "–");
  const zeile = (id: string): RasterZeile | null => {
    const d = depotSchnellwahl().find((x) => x.id === id);
    if (!d) return null;
    const w = depotWerte(depotWahlVon(d));
    return { name: d.name, domain: d.domain, a: <b>{kurz(w?.etfs)}</b>, b: <b>{kurz(w?.sukuk)}</b> };
  };
  return {
    kopf: ["Halal-ETFs", "Sukuk"],
    // RN16: wie beim Konto keine Depots, die der Check empfiehlt (flatex, Smartbroker+), sondern häufige Depots von heute.
    zeilen: [zeile("trade-republic-depot"), zeile("ing-direkt-depot"), zeile("comdirect-depot")].filter(
      (z): z is RasterZeile => Boolean(z),
    ),
  };
};

const KONFETTI = [
  ["8%", "14%", "#ff8a3d", "-20deg"],
  ["24%", "90%", "#0057fa", "35deg"],
  ["84%", "18%", "#0f8a4f", "15deg"],
  ["92%", "88%", "#f5a300", "-40deg"],
  ["70%", "8%", "#705ff1", "60deg"],
  ["16%", "40%", "#f5a300", "10deg"],
  ["78%", "86%", "#ff8a3d", "-15deg"],
  ["30%", "10%", "#0f8a4f", "-60deg"],
  ["6%", "82%", "#705ff1", "25deg"],
  ["94%", "42%", "#0057fa", "-25deg"],
] as const;

export const SchrittSzene = ({ id, art }: { id: SzeneId; art?: Art }) => {
  const depot = art !== "konto";
  if (id === "chat") {
    const f = FRAGEN.ziel;
    return (
      <span className="hc-sz hc-sz--chat" aria-hidden>
        <span className="hc-sz-reihe">
          <img src="/elias-el-gendy.webp" alt="" width={28} height={28} />
          <span className="hc-sz-blase">{f.titel}</span>
        </span>
        <span className="hc-sz-wahlen">
          {f.optionen.slice(0, 2).map((o, n) => (
            <span key={o.wert} className={`hc-sz-wahl${(depot ? n === 1 : n === 0) ? " hc-sz-wahl--an" : ""}`}>
              {o.titel}
              {o.etikett === ETIKETT && !depot && <span className="hc-sz-etikett">beliebt</span>}
            </span>
          ))}
        </span>
      </span>
    );
  }
  if (id === "raster") {
    const r = depot ? rasterDepot() : rasterKonto();
    return (
      <span className="hc-sz hc-sz--raster" aria-hidden>
        <span className="hc-sz-tab">
          <span className="hc-sz-tkopf">
            <span />
            <span>{r.kopf[0]}</span>
            <span>{r.kopf[1]}</span>
          </span>
          {r.zeilen.map((z) => (
            <span key={z.name} className={`hc-sz-tzeile${z.match ? " hc-sz-tzeile--match" : ""}`}>
              <span className="hc-sz-tlogo">
                {z.domain && ANBIETER_LOGOS[z.domain] ? (
                  <span className="hc-sz-logo" style={logoRahmen(z.domain, 34, 7)}>
                    <AnbieterLogo name={z.name} domain={z.domain} gross />
                  </span>
                ) : (
                  // RN16: ohne Schriftzug-Datei (Sparkasse) der Name statt eines winzigen Rundbilds
                  <span className="hc-sz-tname">{z.name}</span>
                )}
              </span>
              <span className="hc-sz-twert">{z.a}</span>
              <span className="hc-sz-twert">{z.b}</span>
            </span>
          ))}
        </span>
      </span>
    );
  }
  if (id === "analyse") {
    // Beispiel aus dem echten Check: Konto „Fast nur mit Karte“ bei der ING ergibt 96 %, Depot „viele Halal-Anlagen“ und ETFs bei flatex 93 %.
    const prozent = depot ? 93 : 96;
    const zeilen = depot ? ["Halal-Anlagen", "Kosten", "Sparplan"] : ["Kosten", "Kein Dispo", "Dein Alltag"];
    return (
      <span className="hc-sz hc-sz--analyse" aria-hidden>
        <span className="hc-sz-ring">
          <svg viewBox="0 0 100 100">
            <circle className="hc-sz-ring-spur" cx="50" cy="50" r="44" />
            <circle className="hc-sz-ring-fuell" cx="50" cy="50" r="44" style={{ strokeDashoffset: (276.5 * (100 - prozent)) / 100 }} />
          </svg>
          <span className="hc-sz-ring-zahl">
            {prozent}
            <small>%</small>
          </span>
        </span>
        <span className="hc-sz-liste">
          {zeilen.map((t) => (
            <span key={t}>
              <Check className="hc-sz-ja" />
              {t}
            </span>
          ))}
        </span>
      </span>
    );
  }
  if (id === "oeffnen") {
    // RN16 (Elias RN15-03: „wenn ich sehe hier Schritt öffnen … Norris Bank und bei mir kommt Norris Bank raus, dann wirkt das so, ah, das
    // kann kein Zufall sein … mach Babybank dahin bei Schritt 4“): Konto mit BBBank, Depot entsprechend mit Scalable statt flatex.
    const sc = depotNachId("scalable-capital-free-broker");
    const a = depot ? { name: sc?.name ?? "Scalable Capital", domain: sc?.domain ?? "scalable.capital" } : { name: "BBBank", domain: "bbbank.de" };
    return (
      <span className="hc-sz hc-sz--oeffnen" aria-hidden>
        <span className="hc-sz-platte">
          <span className="hc-sz-logo" style={logoRahmen(a.domain, 44, 10)}>
            <AnbieterLogo name={a.name} domain={a.domain} gross />
          </span>
        </span>
        <span className="hc-sz-knopf">
          {depot ? "Depot eröffnen" : "Konto eröffnen"}
          <ArrowRight />
        </span>
      </span>
    );
  }
  return (
    <span className="hc-sz hc-sz--erfolg" aria-hidden>
      {KONFETTI.map(([x, y, c, r], n) => (
        <span key={n} className="hc-sz-konfetti" style={{ left: x, top: y, background: c, transform: `rotate(${r})` }} />
      ))}
      <span className="hc-sz-erfolg-haken">
        <Check />
      </span>
      <span className="hc-sz-erfolg-text">Herzlichen Glückwunsch</span>
    </span>
  );
};

export default SchrittSzene;
