import { describe, expect, it } from "vitest";
import { brokerVergleich, DEPOT_FINANZ_MAX, DEPOT_ZEILEN } from "./brokerVergleich";
import { girokontoVergleich, GIRO_FINANZ_MAX, GIRO_ZEILEN } from "./girokontoVergleich";
import { kryptoVergleich, KRYPTO_FINANZ_MAX, KRYPTO_ZEILEN } from "./kryptoVergleich";
import { screenerVergleich, SCREENER_ZEILEN } from "./screenerVergleich";
import { ANLAGE_ZEILE, ANLAGEN_KAUFBAR } from "./anlagenKaufbar";
import { kaufstatus } from "./kaufstatus";
import { korrigiereAnbieter } from "./vergleichKorrekturen";
import { edelmetallVergleich, EDELMETALL_FINANZ_MAX, EDELMETALL_WEGE, EDELMETALL_ZEILEN, GOLD_ISINS, SILBER_ISINS, WEGE_ZEILEN } from "./edelmetallVergleich";
import { steuersoftwareVergleich } from "./steuersoftwareVergleich";
import { FINANZ_MAX_SUMME } from "@/lib/bewertung";
import { AMPEL_GEWICHTE, ANTEIL_N, rangfolge } from "@/lib/rangfolge";
import type { RohAnbieter } from "./vergleichHelfer";
import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";

const faelle: Array<["depot" | "girokonto" | "krypto", RohAnbieter[], VergleichsZeile[], Record<string, number>, number]> = [
  ["depot", brokerVergleich, DEPOT_ZEILEN, DEPOT_FINANZ_MAX, 56],
  ["girokonto", girokontoVergleich, GIRO_ZEILEN, GIRO_FINANZ_MAX, 57],
  ["krypto", kryptoVergleich, KRYPTO_ZEILEN, KRYPTO_FINANZ_MAX, 27],
];

describe.each(faelle)("Vergleichsdaten %s", (kategorie, anbieter, zeilen, max, anzahl) => {
  it("enthält alle Produkte aus dem Finanzfluss-Vergleich, jede ID einmal", () => {
    expect(anbieter).toHaveLength(anzahl);
    expect(new Set(anbieter.map((a) => a.id)).size).toBe(anzahl);
  });

  it("steht alphabetisch, Abgeratene am Ende", () => {
    const schluessel = (a: RohAnbieter) =>
      `${a.abgeraten ? 1 : 0}${`${a.name} ${a.produkt}`.toLowerCase()}`;
    const ist = anbieter.map(schluessel);
    const soll = [...ist].sort((a, b) => a.localeCompare(b, "de"));
    expect(ist).toEqual(soll);
  });

  it("gibt keinem Anbieter einen Partnerlink, von dem wir abraten", () => {
    for (const a of anbieter) {
      if (a.abgeraten) expect(a.link, a.id).toBeUndefined();
    }
  });

  it("raet nur ab, wenn Zinsen ab Start laufen, nicht wegen eines Abos", () => {
    // Ein rotes Bezahlmodell trifft nur die kostenpflichtige Stufe. eToro und
    // Revolut sind kostenlos zinsfrei nutzbar, nur ihr Abo rechnet sich ueber
    // Zinsen. Wer davon abraet, verurteilt den ganzen Anbieter fuer etwas, das
    // niemand buchen muss. Elias am 23.09.2026: jede Stufe zaehlt fuer sich.
    for (const a of anbieter) {
      expect(Boolean(a.abgeraten), a.id).toBe(a.werte.zinsfreiAbStart === "schlecht");
    }
  });

  it("hat für jedes Halal-Merkmal der Bewertung eine Zeile", () => {
    const merkmale = kategorie === "depot" ? Object.keys(ANTEIL_N) : AMPEL_GEWICHTE[kategorie].map(([k]) => k);
    const keys = zeilen.map((z) => z.key);
    for (const key of ["zinsfreiAbStart", ...merkmale]) {
      expect(keys).toContain(key);
    }
  });

  it("bleibt mit den Finanzpunkten unter der Höchstpunktzahl", () => {
    const summeMax = Object.values(max).reduce((a, b) => a + b, 0);
    expect(summeMax).toBe(FINANZ_MAX_SUMME[kategorie]);
    for (const a of anbieter) {
      for (const [k, v] of Object.entries(a.finanzPunkte ?? {})) {
        if (k === "abzug") continue;
        expect(v, `${a.id} ${k}`).toBeLessThanOrEqual(max[k] + 1e-9);
      }
      const summe = Object.values(a.finanzPunkte ?? {}).reduce((x, y) => x + y, 0);
      expect(summe, a.id).toBeLessThanOrEqual(summeMax);
    }
  });

  it("belegt jeden Halal-Wert mit einer Quelle", () => {
    const halal = zeilen.filter((z) => z.gruppe === "halal").map((z) => z.key);
    for (const a of anbieter) {
      for (const key of halal) {
        if (a.werte[key] !== null && a.werte[key] !== undefined) {
          expect(a.quellen?.[key], `${a.id} ${key}`).toBeDefined();
        }
      }
    }
  });

  it("schreibt Halal-Anlagen als 'x von N' oder 'mind. x von N'", () => {
    const gesamt: Record<string, number> = { halalEtfsFonds: 12, halalSukuk: 3, halalEdelmetalle: 7 };
    for (const a of anbieter) {
      for (const [key, n] of Object.entries(gesamt)) {
        const w = a.werte[key];
        if (w === null || w === undefined) continue;
        const m = String(w).match(/^(mind\. )?(\d+) von (\d+)$/);
        expect(m, `${a.id} ${key}: ${w}`).not.toBeNull();
        expect(Number(m![3]), `${a.id} ${key}`).toBe(n);
        expect(Number(m![2]), `${a.id} ${key}`).toBeLessThanOrEqual(n);
      }
    }
  });

  it("vergibt keine Note, wenn Zinsen nicht abschaltbar sind, und nie Nummer 1 ohne belegtes Zins-Tor", () => {
    const r = rangfolge(anbieter, kategorie, { finanzMax: max });
    const gerankt = new Map(r.gerankt.map((b) => [b.anbieter.id, b]));
    for (const a of anbieter) {
      const tuer = a.werte.zinsfreiAbStart;
      if (tuer === "schlecht") expect(gerankt.has(a.id), a.id).toBe(false);
      else if (tuer !== "gut" && tuer !== "teils") {
        // Nicht belegtes Tor: bewertet, aber der Halal-Teil zählt nichts und es kann nie Nummer 1 werden.
        expect(gerankt.get(a.id)?.halal, a.id).toBe(0);
        expect(gerankt.get(a.id)?.uneingeschraenkt, a.id).toBe(false);
      }
    }
  });
});

/* Der Screener-Vergleich hat keine Finanzfluss-Quelle und keine Note. Geprueft
   wird deshalb nur, was auch dort gelten muss: eindeutige IDs, alphabetische
   Reihenfolge und ein Beleg hinter jedem Halal-Wert. */
describe("Vergleichsdaten screening-apps", () => {
  it("hat eindeutige IDs und steht alphabetisch", () => {
    const namen = screenerVergleich.map((a) => a.name.toLowerCase());
    expect(new Set(screenerVergleich.map((a) => a.id)).size).toBe(screenerVergleich.length);
    expect(namen).toEqual([...namen].sort((a, b) => a.localeCompare(b, "de")));
  });

  it("belegt jeden eingetragenen Wert mit einer Quelle", () => {
    const keys = SCREENER_ZEILEN.filter((z) => !z.key.startsWith("__")).map((z) => z.key);
    for (const a of screenerVergleich) {
      for (const key of keys) {
        const wert = a.werte[key];
        if (wert !== null && wert !== undefined) {
          expect(a.quellen?.[key], `${a.id} ${key}`).toBeDefined();
        }
      }
    }
  });

  it("nennt keinen Partnerlink, weil es keine Partnerschaft gibt", () => {
    for (const a of screenerVergleich) expect(a.link, a.id).toBeUndefined();
  });
});

/* Der Edelmetall-Vergleich zeigt die Depots des Depot-Vergleichs noch einmal nach Gold und Silber
   (Elias, 06.10.2026). Die drei Wege stehen daneben als Abschnitt und werden nicht gerankt. */
describe("Vergleichsdaten edelmetalle", () => {
  const zahl = (w: unknown) => Number(String(w ?? "").match(/(\d+) von \d+$/)?.[1]);

  it("nimmt nur Depots des Depot-Vergleichs auf, ohne rotes Zins-Tor und mit belegtem Papier", () => {
    expect(new Set(edelmetallVergleich.map((a) => a.id)).size).toBe(edelmetallVergleich.length);
    const erwartet = brokerVergleich
      .filter((a) => !a.abgeraten && a.werte.zinsfreiAbStart !== "schlecht" && (a.halalAnlagenPunkte?.halalEdelmetalle ?? 0) > 0)
      .map((a) => a.id);
    expect(edelmetallVergleich.map((a) => a.id)).toEqual(erwartet);
    expect(erwartet.length).toBeGreaterThanOrEqual(10);
  });

  it("übernimmt Link, Kosten und Zins-Tor unverändert aus dem Depot-Vergleich", () => {
    for (const a of edelmetallVergleich) {
      const depot = brokerVergleich.find((b) => b.id === a.id)!;
      expect(a.link, a.id).toBe(depot.link);
      expect(a.finanzPunkte, a.id).toEqual(depot.finanzPunkte);
      expect(a.werte.zinsfreiAbStart, a.id).toBe(depot.werte.zinsfreiAbStart);
    }
  });

  it("teilt die belegte Edelmetall-Zeile ohne Rest in Gold und Silber", () => {
    expect([GOLD_ISINS.length, SILBER_ISINS.length]).toEqual([4, 3]);
    for (const a of edelmetallVergleich) {
      expect(zahl(a.werte.gold) + zahl(a.werte.silber), a.id).toBe(zahl(a.werte.halalEdelmetalle));
      expect(String(a.werte.gold), a.id).toMatch(/^(mind\. )?[0-4] von 4$/);
      expect(String(a.werte.silber), a.id).toMatch(/^(mind\. )?[0-3] von 3$/);
      for (const key of ["gold", "silber"]) expect(a.quellen?.[key], `${a.id} ${key}`).toBeDefined();
    }
  });

  it("hat für jede Zeile der Seite einen Wert aus dem Depot-Vergleich oder der Zählung", () => {
    const depotKeys = DEPOT_ZEILEN.map((z) => z.key);
    for (const z of EDELMETALL_ZEILEN) expect([...depotKeys, "gold", "silber"], z.key).toContain(z.key);
    const summe = Object.values(EDELMETALL_FINANZ_MAX).reduce((x, y) => x + y, 0);
    expect(summe).toBe(FINANZ_MAX_SUMME.edelmetall);
  });

  it("belegt bei den drei Wegen jeden Halal-Wert mit einer Quelle und verlinkt keinen Partner", () => {
    const halal = WEGE_ZEILEN.filter((z) => z.gruppe === "halal").map((z) => z.key);
    expect(EDELMETALL_WEGE.length).toBe(3);
    for (const a of EDELMETALL_WEGE) {
      expect(a.link, a.id).toBeUndefined();
      for (const key of halal) {
        expect(a.werte[key], `${a.id} ${key}`).not.toBeNull();
        expect(a.quellen?.[key], `${a.id} ${key}`).toBeDefined();
      }
    }
  });
});

/*
 * Elias, 20.09.2026: "Wenn etwas Zinsen hat und du sagst, hat keine Zinsen, dann ist es das
 * Schlimmste, was man mir antun kann." Ein Ja bei den Zinsfragen braucht deshalb einen Beleg
 * von der Seite des Anbieters selbst. Finanzfluss, Presse oder Blogs reichen nicht.
 */
/** Marke und Bank sind verschiedene Domains, die Dokumente der Bank verlinkt die Marke selbst.
 *  finvesto.de/downloads führt auf die Bedingungen der FNZ Bank. Nur mit so einem Beleg eintragen. */
const BANK_DOMAINS: Record<string, string[]> = {
  "finvesto.de": ["fnz.de"],
};

describe("Zinsfragen nur mit Beleg vom Anbieter", () => {
  it("nimmt keine positive Nachkorrektur ohne konkreten Beleg an", () => {
    const roh: RohAnbieter[] = [{ id: "probe", name: "Probe", produkt: "Konto", domain: "probe.de", werte: { zinsfreiAbStart: null, zinsfreiesModell: null } }];
    const [ungeprueft] = korrigiereAnbieter(roh, { probe: { zinsfreiAbStart: "gut", zinsfreiesModell: "gut" } });
    expect(ungeprueft.werte.zinsfreiAbStart).toBeNull();
    expect(ungeprueft.werte.zinsfreiesModell).toBeNull();
    expect(ungeprueft.quellen?.zinsfreiAbStart).toBeUndefined();
  });
  const faelle = [
    ["depot", brokerVergleich, ["zinsfreiAbStart"]],
    ["girokonto", girokontoVergleich, ["zinsfreiAbStart"]],
    ["krypto", kryptoVergleich, ["zinsfreiAbStart", "zinsfreiesModell"]],
  ] as const;
  for (const [kat, liste, keys] of faelle) {
    it(kat, () => {
      for (const a of liste) {
        for (const k of keys) {
          const w = a.werte[k];
          if (w !== "gut" && w !== "teils") continue;
          const url = a.quellen?.[k]?.url ?? "";
          const host = url ? new URL(url).hostname.replace(/^www\./, "") : "";
          const domains = [a.domain, ...(BANK_DOMAINS[a.domain ?? ""] ?? [])].filter((d): d is string => !!d);
          const eigen = domains.some((d) => host === d || host.endsWith(`.${d}`) || d.endsWith(`.${host}`));
          expect(eigen, `${a.name} ${a.produkt}: ${k}=${w} belegt mit ${host || "nichts"}`).toBe(true);
        }
      }
    });
  }
});

describe("Gegenprüfung 20.09.2026", () => {
  it("trennt optionale Erträge von echten Startzinsen", () => {
    const depot = (id: string) => brokerVergleich.find((a) => a.id === id)!;
    const giro = (id: string) => girokontoVergleich.find((a) => a.id === id)!;
    const krypto = (id: string) => kryptoVergleich.find((a) => a.id === id)!;
    expect(depot("trade-republic-depot").werte.zinsfreiAbStart).toBe("gut");
    expect(depot("scalable-capital-prime-plus-broker").werte.zinsfreiAbStart).toBe("gut");
    expect(depot("consorsbank-depot").werte.zinsfreiAbStart).toBe("gut");
    expect(depot("xtb-depot").werte.zinsfreiAbStart).toBe("schlecht");
    expect(giro("ing-girokonto").werte.zinsfreiAbStart).toBe("gut");
    expect(giro("1822direkt-girodirekt").werte.zinsfreiAbStart).toBe("gut");
    expect(giro("norisbank-top-girokonto").werte.zinsfreiAbStart).toBe("gut");
    // 27.09.2026: Targobank legt den Guthabenzins ins Preisverzeichnis (AGB 1.6), dort hat nur
    // das Vorteils-Konto eine Zinszeile. Der Dispo (seit 28.09.2026 gelb statt rot) kostet Halal-Punkte.
    expect(giro("targobank-online-konto").werte.zinsfreiAbStart).toBe("gut");
    expect(giro("targobank-online-konto").werte.keinDispoAbStart).toBe("teils");
    // Am 20.09. war Coinbase ungeprueft, die Domain sperrt jeden Abruf ohne Browser.
    // Am 23.09.2026 kam die schriftliche Antwort (Fall 27569519): keine automatischen
    // Zinsen, Coinbase One enthaelt weder Zinsen noch gesperrte Token.
    expect(krypto("coinbase-advanced").werte.zinsfreiAbStart).toBe("gut");
    // Schriftliche Anbieterantworten mit Zitat geben frei (Bitvavo 18.09., Smartbroker+ 16.09.).
    expect(krypto("bitvavo-standard").werte.zinsfreiesModell).toBe("gut");
    expect(krypto("smartbroker-plus-krypto").werte.zinsfreiAbStart).toBe("gut");
    expect(krypto("smartbroker-plus-krypto").werte.zinsfreiesModell).toBe("gut");
    // BISON hatte am 20.09. keinen Beleg fuer das Bezahlmodell. Seit 23.09.2026 liegt einer vor
    // (bisonapp.com/select: "Es faellt keine Membership-Gebuehr an."), deshalb jetzt gut.
    expect(krypto("bison-app").werte.zinsfreiesModell).toBe("gut");
    expect(krypto("kraken-pro").werte.zinsfreiesModell).toBe("gut");
  });

  // Elias, 28.09.2026 (Frage 8): Trade Republics eigene Handelsliste gilt, die App-Gegenprobe entfaellt.
  it("zeigt die zwei Trade-Republic-Goldtreffer nach der Handelsliste als kaufbar", () => {
    for (const isin of ["IE00B579F325", "XS3384723154"]) {
      expect(ANLAGEN_KAUFBAR[isin].kaufbar.some((x) => x.anbieter === "Trade Republic")).toBe(true);
    }
    expect(brokerVergleich.find((a) => a.id === "trade-republic-depot")?.werte.halalEdelmetalle).toBe("7 von 7");
  });
});

/*
 * Elias, 20.09.2026: Wir haben behauptet, Invesco Physical Gold sei bei Trade Republic kaufbar,
 * ohne Einzelbeleg. Seitdem gilt fuer die Kaufbarkeit dieselbe Regel wie fuer die Zinsen:
 * Beleg aus der Wertpapiersuche oder Produktliste des Anbieters selbst. Ohne Beleg wird die
 * Zeile gar nicht gezeigt, statt sie als kaufbar auszugeben.
 */
describe("Kaufbarkeit nur mit Beleg vom Anbieter", () => {
  it("belegt jede kaufbare Anlage mit einer Seite des Anbieters", () => {
    for (const [isin, eintrag] of Object.entries(ANLAGEN_KAUFBAR)) {
      for (const k of eintrag.kaufbar) {
        const ort = `${isin} / ${k.anbieter}`;
        expect(k.beleg, ort).toBeDefined();
        expect(["anbieter", "elias"], `${ort}: quelle ${k.beleg.quelle}`).toContain(k.beleg.quelle);
        expect(k.beleg.stand, ort).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
        // Belegmodell v2 (25.09.2026 abends): ein vom Anbieter selbst verlinktes Verzeichnis zählt, wenn die
        // Herkunft (die verlinkende Seite) auf seiner Domain liegt, z. B. Scalable -> ETP-Universum.
        const aufDomain = (u: string) => {
          const host = new URL(u).hostname.replace(/^www\./, "");
          return k.beleg.domains.some((d) => host === d || host.endsWith(`.${d}`) || d.endsWith(`.${host}`));
        };
        const eigen = aufDomain(k.beleg.url) || (k.beleg.herkunft ? aufDomain(k.beleg.herkunft) : false);
        expect(eigen, `${ort}: belegt mit ${new URL(k.beleg.url).hostname}`).toBe(true);
      }
    }
  });

  it("zeigt im Depot-Vergleich keine exakte Anlagen-Zahl, die nicht einzeln belegt ist", () => {
    // Rangfolge-Plan P1a (25.09.2026): tradegate.direct stand mit 9/12, 2/3, 7/7 da, belegt nur von der
    // Börse tradegate.de; Trade Republic mit 7/7 Edelmetallen, obwohl eine ISIN unklar ist.
    const zeilen = ["halalEtfsFonds", "halalSukuk", "halalEdelmetalle"] as const;
    for (const a of brokerVergleich) {
      const schluessel = [a.haus, a.finanzfluss?.produkt].filter(Boolean);
      for (const zeile of zeilen) {
        const m = String(a.werte[zeile] ?? "").match(/^(\d+) von (\d+)$/);
        if (!m) continue;
        const isins = Object.keys(ANLAGE_ZEILE).filter((isin) => ANLAGE_ZEILE[isin] === zeile);
        // Ein Eintrag unter dem Tarif geht vor dem Hauseintrag (anlagen_matrix.py): Das Pure Depot erbt
        // nicht die Fonds des comdirect Depots, die comdirect dort am 27.09.2026 ausgeschlossen hat.
        const produktName = `${a.name} ${a.produkt}`;
        const belegt = isins.filter((isin) => {
          const e = ANLAGEN_KAUFBAR[isin];
          if (!e) return false;
          const vom = (keys: unknown[]) => e.kaufbar.some((k) => [k.haus, ...(k.haeuser ?? [])].some((h) => keys.includes(h)));
          const produkt = a.finanzfluss?.produkt;
          if (produkt && (vom([produkt]) || e.nichtImAngebot.includes(produktName))) return vom([produkt]);
          return vom(schluessel);
        }).length;
        expect(Number(m[1]), `${a.id} ${zeile}: ${m[0]}, belegt ${belegt}`).toBe(belegt);
        expect(Number(m[2]), `${a.id} ${zeile}: Nenner`).toBe(isins.length);
      }
    }
  });

  it("lässt den Tarifeintrag vor dem Hauseintrag gelten (comdirect Pure Depot)", () => {
    // comdirect schriftlich am 27.09.2026 (Vorgang 11763010): Comgest und Gold „nur comdirect Depot“.
    const depot = { name: "comdirect", produkt: "Depot" };
    const pure = { name: "comdirect", produkt: "Pure Depot" };
    expect(kaufstatus("IE00B4ZJ4634", depot)).toBe("kaufbar");
    expect(kaufstatus("IE00B4ZJ4634", pure)).toBe("nicht");
    expect(kaufstatus("IE00B579F325", depot)).toBe("kaufbar");
    expect(kaufstatus("IE00B579F325", pure)).toBe("nicht");
    expect(kaufstatus("IE00B27YCN58", pure)).toBe("kaufbar");
    expect(kaufstatus("IE000X9FTI22", depot)).toBe("nicht");
  });

  it("nennt keinen Anbieter zugleich als kaufbar und als nicht im Angebot", () => {
    for (const [isin, eintrag] of Object.entries(ANLAGEN_KAUFBAR)) {
      const kaufbar = new Set(eintrag.kaufbar.map((k) => k.anbieter));
      for (const n of eintrag.nichtImAngebot) expect(kaufbar.has(n), `${isin} / ${n}`).toBe(false);
    }
  });
});

describe("Aufnahmeregel", () => {
  // Elias, 26.09.2026: Nur Depot und Girokonto zeigen Haram rot, weil man dort wissen muss,
  // wovon wir abraten. In allen anderen Vergleichen steht nur, was einen halalen Weg bietet.
  it.each([
    ["krypto", kryptoVergleich],
    ["steuer", steuersoftwareVergleich],
    ["screener", screenerVergleich],
    ["edelmetall", edelmetallVergleich],
  ] as const)("%s hat keinen abgeratenen Eintrag", (kategorie, liste) => {
    expect(rangfolge(liste, kategorie).abgeraten.map((x) => x.anbieter.id)).toEqual([]);
  });
});

describe("Halal-Merkmale mit Anbieterbeleg statt Finanzfluss", () => {
  // 27.09.2026: „Karte ohne Kredit“ zählt die Hälfte der Halal-Note im Girokonto. Belegt aus der Entgeltinformation
  // des Kontos, nicht aus dem Finanzfluss-Vergleich.
  it("belegt „Karte ohne Kredit“ bei jedem Girokonto beim Anbieter", () => {
    const ohne = girokontoVergleich
      .filter((a) => a.werte.karteOhneKredit === "gut" || a.werte.karteOhneKredit === "schlecht")
      .filter((a) => !a.quellen?.karteOhneKredit?.url || /finanzfluss\.de/.test(a.quellen.karteOhneKredit.url))
      .map((a) => a.id);
    expect(ohne).toEqual([]);
  });

  it("belegt „echte Coins“ und „eigene Wallet“ beim Anbieter, nicht bei Finanzfluss", () => {
    // binance-pro: kein eigener Satz zur Pro-Oberfläche gefunden; traders-place-krypto: Nachtrag vom 27.09.2026 läuft.
    const offen = new Set(["binance-pro", "traders-place-krypto"]);
    const ohne = kryptoVergleich
      .filter((a) => !offen.has(a.id))
      .flatMap((a) => (["echteCoins", "eigeneWallet"] as const).map((k) => [a, k] as const))
      .filter(([a, k]) => a.werte[k] === "gut" || a.werte[k] === "schlecht")
      .filter(([a, k]) => !a.quellen?.[k]?.url || /finanzfluss\.de/.test(a.quellen[k].url))
      .map(([a, k]) => `${a.id}.${k}`);
    expect(ohne).toEqual([]);
  });

  it("wertet „eigene Wallet“ nur mit Anbieterbeleg rot", () => {
    // traders-place-krypto: Sonderbedingungen Nr. 14 schließen die Übertragung nicht aus, Nachtrag an Traders Place 27.09.2026.
    const offen = new Set(["traders-place-krypto"]);
    const ohne = kryptoVergleich
      .filter((a) => a.werte.eigeneWallet === "schlecht" && !offen.has(a.id))
      .filter((a) => !a.quellen?.eigeneWallet?.url || /finanzfluss\.de/.test(a.quellen.eigeneWallet.url))
      .map((a) => a.id);
    expect(ohne).toEqual([]);
  });
});

describe("Dispo", () => {
  it("wertet einen Dispo höchstens gelb, nie rot (Elias, 28.09.2026)", () => {
    // Ein Dispo macht ein Konto nicht haram wie Zinsen, zählt aber in die Wertung.
    const rot = girokontoVergleich.filter((a) => a.werte.keinDispoAbStart === "schlecht").map((a) => a.id);
    expect(rot).toEqual([]);
  });
});

describe("Zahlen in Kacheltexten", () => {
  it("passen zu den Daten", async () => {
    const { ANZAHL_HALAL_ANLAGEN, ANZAHL_STEUERPROGRAMME, ANZAHL_DEPOTS, ANZAHL_KONTEN, ANZAHL_KRYPTO, ANZAHL_APPS } = await import("./anzahlen");
    const { halalAnlagen } = await import("./halalAnlagen");
    const anzeige = await import("./vergleichAnzeige");
    expect(ANZAHL_HALAL_ANLAGEN).toBe(halalAnlagen.length);
    // Gezählt wird, was der Vergleich zeigt, nicht was in der Datendatei steht.
    expect(ANZAHL_STEUERPROGRAMME).toBe(anzeige.steuerAnzeige.length);
    expect(ANZAHL_DEPOTS).toBe(anzeige.depotAnzeige.length);
    expect(ANZAHL_KONTEN).toBe(anzeige.girokontoAnzeige.length);
    expect(ANZAHL_KRYPTO).toBe(anzeige.kryptoAnzeige.length);
    expect(ANZAHL_APPS).toBe(anzeige.screenerAnzeige.length);
  });
});
