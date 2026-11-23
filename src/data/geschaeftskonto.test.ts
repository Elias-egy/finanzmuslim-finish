import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { geschaeftskontoVergleich, GESCHAEFT_FILTER, GESCHAEFT_ZEILEN } from "./geschaeftskontoVergleich";
import { geschaeftskontoAnzeige } from "./anzeige/geschaeftskonto";
import { GESCHAEFT_FINANZ_MAX } from "./finanzMax";
import { partnerLinks } from "./partnerLinks";
import { START_LINKS } from "./startLinks";
import { findStartPartner } from "./investmentStart";
import { ALLE_ACHTUNG_SAETZE, ALLE_OFFENEN_SAETZE, ALLE_ZINS_SAETZE, verwahrAchtung, zinsHinweis } from "./zinsHinweise";
import { baueSpalten, type RohAnbieter } from "./vergleichHelfer";
import { reihenfolgeAntwortGeschaeft, sortiertSatzGeschaeft } from "./reihenfolgeText";
import { GESCHAEFT_FAQ } from "./geschaeftskontoFaq";
import { zahlwort } from "./anzahlen";
import { geschaeftStufe, LINK_VORRANG, nummerEins, rangfolge } from "@/lib/rangfolge";
import { siegerDerSeite } from "@/lib/vergleichAssistent";
import { luecken } from "@/lib/vollstaendig";
import VergleichGeschaeftskonto from "@/pages/VergleichGeschaeftskonto";

const mitLink = (liste: RohAnbieter[], haus: string): RohAnbieter[] => liste.map((a) => (a.haus === haus ? { ...a, link: `/out/${haus}` } : a));
/** Die Daten ohne jeden Partnerlink, für Fälle „noch kein Link“. */
const ohneLinks = (liste: RohAnbieter[]): RohAnbieter[] => liste.map((a) => ({ ...a, link: undefined }));
const rang = (liste: RohAnbieter[]) => rangfolge(liste, "geschaeftskonto", { finanzMax: GESCHAEFT_FINANZ_MAX });
const HAEUSER = ["accountable", "dkb", "ethikbank", "grenke", "ing", "lexware", "n26", "revolut", "tide", "vivid"];
/** Die 13 Häuser, die seit VG2-04 (Elias, 23.11.2026) dazukommen, mit der Zahl ihrer Tarife bei Finanzfluss. */
const NEU: Record<string, number> = {
  bunq: 4, commerzbank: 4, "deutsche-bank": 4, finom: 3, fyrst: 3, gls: 1, holvi: 4, hvb: 1, kontist: 3, postbank: 4, qonto: 7, targobank: 3, wise: 1,
};
/** Zins offen: Der Anbieter schreibt nichts Ausdrückliches. Wise ist belegt mit Zins. */
const OFFENE = Object.keys(NEU).filter((h) => h !== "wise");
/** VG3 KT Bank (23.11.2026): kein Tarif aus dem Finanzfluss-Vergleich, Werte von kt-bank.de. */
const KT_HAUS = "kt-bank";
const ausFinanzfluss = (liste: RohAnbieter[]) => liste.filter((a) => a.haus !== KT_HAUS);

describe("Geschäftskonto: Daten", () => {
  it("führt alle 71 Tarife von 23 Anbietern von Finanzfluss und dazu das KT GeschäftsKonto (VG3 KT Bank: 72 Tarife, 24 Anbieter), jede ID einmal, alphabetisch", () => {
    expect(geschaeftskontoVergleich).toHaveLength(72);
    expect(new Set(geschaeftskontoVergleich.map((a) => a.id)).size).toBe(72);
    expect([...new Set(geschaeftskontoVergleich.map((a) => a.haus))].sort()).toEqual([...HAEUSER, ...Object.keys(NEU), KT_HAUS].sort());
    const ist = geschaeftskontoVergleich.map((a) => `${a.name} ${a.produkt}`);
    expect(ist).toEqual([...ist].sort((a, b) => a.localeCompare(b, "de")));
  });

  it("hat von Tide 2, Vivid 9, N26 4, Lexware 2, Accountable 1, DKB 1, Grenke 3, EthikBank 1, ING 3 und Revolut 3 Tarifen", () => {
    const je = (h: string) => geschaeftskontoVergleich.filter((a) => a.haus === h).length;
    expect(HAEUSER.map(je)).toEqual([1, 1, 1, 3, 3, 2, 4, 3, 2, 9]);
  });

  it("hat von den 13 neuen Häusern genau die Zahl der Tarife von Finanzfluss (42), keiner der 71 Tarife fehlt", () => {
    const je = (h: string) => geschaeftskontoVergleich.filter((a) => a.haus === h).length;
    for (const [h, n] of Object.entries(NEU)) expect(je(h), h).toBe(n);
    expect(Object.values(NEU).reduce((s, n) => s + n, 0)).toBe(42);
    // VG3 KT Bank: Das KT GeschäftsKonto hat keine Finanzfluss-Zeile.
    expect(new Set(ausFinanzfluss(geschaeftskontoVergleich).map((a) => a.finanzfluss!.produkt)).size).toBe(71);
    expect(geschaeftskontoVergleich.find((a) => a.haus === KT_HAUS)!.finanzfluss).toBeUndefined();
  });

  it("belegt Zinsen, Dispo und Karte, wo ein Wert steht, mit Zitat und Adresse, die 29 ersten Zinsen nur auf der Domain des Anbieters", () => {
    // Accountable führt das Konto bei Swan und verweist in den AGB darauf („den Vertrag direkt mit Swan“).
    // Grenke: Das Preis- und Leistungsverzeichnis liegt bei Atruvia und ist von grenkebank.de/firmenkunden/geschaeftskonto.html verlinkt.
    const BANK: Record<string, string[]> = { "accountable.de": ["swan.io"], "grenkebank.de": ["atruvia.scene7.com"] };
    for (const a of geschaeftskontoVergleich) {
      for (const k of ["zinsfreiAbStart", "keinDispoAbStart", "karteOhneKredit"]) {
        const q = a.quellen?.[k];
        expect(q?.url, `${a.id} ${k}`).toMatch(/^https:\/\//);
        expect(q?.stand, `${a.id} ${k}`).toBe("23.11.2026");
        // Ein gesetzter Wert (grün, rot) trägt ein wörtliches Zitat. Ein offener Wert nur, wo es etwas Wörtliches gibt.
        if (a.werte[k] !== "unbekannt") expect(q?.hinweis, `${a.id} ${k}`).toContain("„");
      }
      if (a.werte.zinsfreiAbStart === "gut") {
        const host = new URL(a.quellen!.zinsfreiAbStart.url!).hostname.replace(/^www\./, "");
        const domains = [a.domain!, ...(BANK[a.domain!] ?? [])];
        expect(domains.some((d) => host === d || host.endsWith(`.${d}`)), `${a.id}: Zins belegt mit ${host}`).toBe(true);
      }
    }
  });

  it("nennt als Kostenquelle den Finanzfluss-Vergleich mit Stand 11.11.2026", () => {
    for (const a of ausFinanzfluss(geschaeftskontoVergleich)) {
      expect(a.quellen!.kontofuehrung.url).toBe("https://www.finanzfluss.de/vergleich/geschaeftskonto/");
      expect(a.quellen!.kontofuehrung.stand).toBe("11.11.2026");
    }
  });

  it("wertet bei den 29 ersten Tarifen Zinsen und Dispo grün und die Karte grün, nur Grenke (nur Kreditkarte) rot", () => {
    for (const a of geschaeftskontoVergleich.filter((x) => HAEUSER.includes(x.haus!))) {
      expect(a.werte.zinsfreiAbStart, a.id).toBe("gut");
      expect(a.werte.keinDispoAbStart, a.id).toBe("gut");
      expect(a.werte.karteOhneKredit, a.id).toBe(a.haus === "grenke" ? "schlecht" : "gut");
    }
  });

  it("stellt den Zins bei den 12 offenen Häusern auf offen (kein Urteil), bei Wise auf rot, nie auf grün", () => {
    for (const a of geschaeftskontoVergleich.filter((x) => OFFENE.includes(x.haus!))) expect(a.werte.zinsfreiAbStart, a.id).toBe("unbekannt");
    for (const a of geschaeftskontoVergleich.filter((x) => x.haus === "wise")) expect(a.werte.zinsfreiAbStart, a.id).toBe("schlecht");
    // VG3 KT Bank: 29 erste Tarife plus das KT GeschäftsKonto (Zins im Antrag wörtlich belegt).
    expect(geschaeftskontoVergleich.filter((a) => a.werte.zinsfreiAbStart === "gut")).toHaveLength(30);
    // Wo der Bericht Dispo oder Karte nicht belegt, steht „offen“, nirgends rot.
    const offen = geschaeftskontoVergleich.filter((a) => !HAEUSER.includes(a.haus!) && (a.werte.keinDispoAbStart === "unbekannt" || a.werte.karteOhneKredit === "unbekannt")).map((a) => a.haus);
    // VG3 KT Bank: Auch beim KT GeschäftsKonto steht die Karte auf offen (die Bedingungen der Bank widersprechen sich).
    expect([...new Set(offen)].sort()).toEqual(["commerzbank", "hvb", "kontist", "kt-bank", "qonto"]);
    for (const a of geschaeftskontoVergleich.filter((x) => !HAEUSER.includes(x.haus!))) {
      expect(a.werte.keinDispoAbStart, a.id).not.toBe("schlecht");
      expect(a.werte.karteOhneKredit, a.id).not.toBe("schlecht");
    }
  });

  it("zeigt „Offen“ in der Zelle der offenen Konten, nie ein Wort wie haram oder unerlaubt", () => {
    const spalten = baueSpalten(geschaeftskontoAnzeige, GESCHAEFT_ZEILEN, "geschaeftskonto");
    for (const s of spalten) {
      const roh = geschaeftskontoVergleich.find((a) => a.id === s.id)!;
      for (const k of ["zinsfreiAbStart", "keinDispoAbStart", "karteOhneKredit"])
        if (roh.werte[k] === "unbekannt") expect(s.werte[k].text, `${s.id} ${k}`).toBe("Offen");
    }
    expect(JSON.stringify(ALLE_ZINS_SAETZE)).not.toMatch(/haram|unerlaubt|verboten/i);
  });

  it("zeigt keinen Zinssatz, keine Rendite und kein Tagesgeld als Wert, Etikett oder Bonus", () => {
    for (const a of geschaeftskontoVergleich) {
      expect(a.etikett ?? null, a.id).toBeNull();
      for (const [k, w] of Object.entries(a.werte)) {
        if (typeof w === "string" && !["zinsfreiAbStart", "keinDispoAbStart", "karteOhneKredit"].includes(k))
          expect(w, `${a.id} ${k}`).not.toMatch(/Zins|Rendite|p\.\s?a\.|Tagesgeld|Geldmarkt|Bonus|Prämie|Cashback/i);
      }
    }
    expect(JSON.stringify(GESCHAEFT_ZEILEN)).not.toMatch(/Rendite|Bonus|Prämie/i);
  });

  it("nennt Tides 150-Euro-Bonus nicht: die Bedingungen sind nicht belegt", () => {
    const text = JSON.stringify(geschaeftskontoVergleich.filter((a) => a.haus === "tide").map((a) => a.werte));
    expect(text).not.toMatch(/150/);
  });

  it("zeigt alle 72 Tarife (71 von Finanzfluss und das KT GeschäftsKonto, VG3 KT Bank): jede Zeile hat einen Wert, jeder Wert der Note ist belegt oder ausdrücklich offen", () => {
    expect(geschaeftskontoAnzeige).toHaveLength(72); // VG3 KT Bank: 71 von Finanzfluss plus KT GeschäftsKonto
    for (const a of geschaeftskontoVergleich) expect(luecken(a, "geschaeftskonto", GESCHAEFT_ZEILEN), a.id).toEqual([]);
  });

  it("lässt einen Tarif ohne Beleg aus der Anzeige fallen, nichts wird geschätzt", () => {
    const ohne = { ...geschaeftskontoVergleich[0], werte: { ...geschaeftskontoVergleich[0].werte, keinDispoAbStart: null } };
    expect(luecken(ohne, "geschaeftskonto", GESCHAEFT_ZEILEN)).toContain("keinDispoAbStart");
  });

  it("hat Kostenpunkte je Kriterium, nie über dem Höchstwert", () => {
    for (const a of geschaeftskontoVergleich) {
      expect(Object.keys(a.finanzPunkte!).sort(), a.id).toEqual(Object.keys(GESCHAEFT_FINANZ_MAX).sort());
      for (const [k, p] of Object.entries(a.finanzPunkte!)) {
        expect(p, `${a.id} ${k}`).toBeGreaterThanOrEqual(0);
        expect(p, `${a.id} ${k}`).toBeLessThanOrEqual(GESCHAEFT_FINANZ_MAX[k]);
      }
    }
  });

  it("rechnet die Kostenpunkte von Tide Lite wie in der Hand nach", () => {
    const tide = geschaeftskontoVergleich.find((a) => a.id === "tide-lite")!;
    expect(Object.values(tide.finanzPunkte!).reduce((s, x) => s + x, 0)).toBeCloseTo(98.3, 5);
  });

  it("nimmt bei widersprüchlichen Angaben den niedrigeren Wert (Lexware Solo 2 statt 4, Accountable 1 statt 10 Unterkonten)", () => {
    const u = (id: string) => geschaeftskontoVergleich.find((a) => a.id === id)!.werte.unterkonten;
    expect([u("lexware-solo"), u("lexware-plus"), u("accountable-geschaeftskonto")]).toEqual(["2", "4", "1"]);
  });

  it("hat zu jedem Filter eine Zeile", () => {
    for (const f of GESCHAEFT_FILTER) expect(GESCHAEFT_ZEILEN.some((z) => z.key === f.key), f.key).toBe(true);
  });
});

describe("Geschäftskonto: KT Bank (VG3 KT Bank, 23.11.2026)", () => {
  const kt = geschaeftskontoVergleich.find((a) => a.id === "kt-bank-geschaeftskonto")!;

  it("führt das KT GeschäftsKonto mit den belegten Werten von kt-bank.de und ohne Partnerlink", () => {
    expect(kt.name).toBe("KT Bank");
    expect(kt.produkt).toBe("GeschäftsKonto");
    expect(kt.domain).toBe("kt-bank.de");
    expect(kt.link).toBeUndefined();
    expect(partnerLinks.some((p) => p.kurzname === "kt-bank" && p.aktiv)).toBe(false);
    expect(kt.werte).toMatchObject({
      zinsfreiAbStart: "gut",
      keinDispoAbStart: "gut",
      karteOhneKredit: "unbekannt",
      kontofuehrung: "0 €",
      buchungen: "Unbegrenzt kostenlos",
      debitkarte: "Mastercard, 50 € im Jahr",
      einzahlen: "Nicht möglich",
      einlagensicherung: "Ja (Deutschland)",
    });
  });

  it("belegt Zins und Dispo wörtlich im Antrag auf kt-bank.de, die Karte bleibt offen und nie rot", () => {
    expect(kt.quellen!.zinsfreiAbStart.url).toBe("https://www.kt-bank.de/dokumente/antrag-geschaeftskonto/");
    expect(kt.quellen!.zinsfreiAbStart.hinweis).toContain("„Die Kontoführung erfolgt unverzinslich.“");
    expect(kt.quellen!.keinDispoAbStart.hinweis).toContain("„Ein Dispositionskredit wird nicht eingeräumt.“");
    expect(kt.quellen!.keinDispoAbStart.url).toBe("https://www.kt-bank.de/dokumente/antrag-geschaeftskonto/");
    expect(kt.werte.karteOhneKredit).toBe("unbekannt");
    expect(kt.quellen!.karteOhneKredit.hinweis).toMatch(/widersprechen/);
  });

  it("nimmt alle Kosten von kt-bank.de statt von Finanzfluss und schreibt nichts hin, was die Bank nicht eindeutig sagt", () => {
    for (const k of ["kontofuehrung", "buchungen", "debitkarte", "abheben", "einzahlen", "unterkonten", "buchhaltung", "einlagensicherung", "fuerWen"]) {
      const q = kt.quellen![k];
      expect(q.url, k).toMatch(/^https:\/\/www\.kt-bank\.de\//);
      expect(q.stand, k).toBe("23.11.2026");
    }
    // Abheben (Produktseite dreimal, Verzeichnis einmal frei) und Unterkonten sind leer, die Rechtsformen offen.
    expect(kt.werte.abheben).toBe("Nicht eindeutig angegeben");
    expect(kt.werte.unterkonten).toBe("Nicht angegeben");
    expect([kt.werte.freiberufler, kt.werte.gewerbe, kt.werte.kapitalgesellschaft]).toEqual(["unbekannt", "unbekannt", "unbekannt"]);
    expect(kt.finanzPunkte!.abheben).toBe(0);
    expect(kt.finanzPunkte!.unterkonten).toBe(0);
  });

  it("steht in der Stufe belegt ohne Zins, mit Halal-Teil 2,5 (Karte offen), nicht auf Platz 1", () => {
    const r = rang(geschaeftskontoAnzeige);
    const b = r.gerankt.find((x) => x.anbieter.id === "kt-bank-geschaeftskonto")!;
    expect(geschaeftStufe(b.anbieter)).toBe(0);
    expect(b.halal).toBe(2.5);
    expect(b.platz).toBeGreaterThan(1);
    expect(zinsHinweis("geschaeftskonto", kt)).toMatch(/unverzinslich/);
  });
});

describe("Geschäftskonto: Partnerlinks", () => {
  it("setzt einen Link nur für einen aktiven Partner und sonst keinen", () => {
    for (const a of geschaeftskontoVergleich) {
      if (a.link) {
        const kurz = a.link.replace("/out/", "");
        expect(partnerLinks.some((p) => p.kurzname === kurz && p.aktiv), a.id).toBe(true);
      }
    }
    // Ein Tarif hat genau dann einen Link, wenn sein Partner aktiv ist (Tide: "tide", Vivid: "vivid-business", Accountable: "accountable").
    const aktiv = new Set(partnerLinks.filter((p) => p.aktiv).map((p) => p.kurzname));
    const partner: Record<string, string> = { tide: "tide", vivid: "vivid-business", accountable: "accountable" };
    for (const a of geschaeftskontoVergleich) expect(Boolean(a.link), a.id).toBe(Boolean(partner[a.haus!]) && aktiv.has(partner[a.haus!]));
  });

  it("gibt Grenke, N26, Lexware, EthikBank und ING nie einen Link", () => {
    for (const a of geschaeftskontoVergleich.filter((x) => ["grenke", "n26", "lexware", "ethikbank", "ing"].includes(x.haus!))) expect(a.link, a.id).toBeUndefined();
  });

  it("führt Accountable über financeAds ohne Sub-ID, Programm 3654, auf die Startseite", () => {
    const p = partnerLinks.find((x) => x.kurzname === "accountable")!;
    expect(p.aktiv).toBe(true);
    expect(p.ziel).toBe("/dein-investmentstart/accountable");
    expect(START_LINKS.accountable).toBe("https://www.financeads.net/tc.php?t=87591C3654128646T");
    expect(START_LINKS.accountable).not.toMatch(/SUBID|subid/i);
    expect(findStartPartner("accountable")?.link).toBe(START_LINKS.accountable);
    expect(geschaeftskontoVergleich.find((a) => a.id === "accountable-geschaeftskonto")!.link).toBe("/out/accountable");
  });
});

describe("Geschäftskonto: Rangfolge", () => {
  const stufe = geschaeftStufe;

  it("ordnet alle 72 Tarife (VG3 KT Bank: 71 plus KT GeschäftsKonto) mit Plätzen, keiner fällt heraus, keiner ist abgeraten", () => {
    const r = rang(geschaeftskontoAnzeige);
    expect(r.gerankt).toHaveLength(72);
    expect(r.nichtBewertet).toEqual([]);
    expect(r.abgeraten).toEqual([]);
    for (const b of r.gerankt) expect(b.note, b.anbieter.id).toBeGreaterThan(0);
  });

  it("ordnet in drei Stufen: erst belegt ohne Zins (30, VG3 KT Bank: 29 plus KT GeschäftsKonto), dann offen (41), ganz hinten belegt mit Zins (Wise)", () => {
    const r = rang(geschaeftskontoAnzeige);
    const stufen = r.gerankt.map((b) => stufe(b.anbieter));
    expect(stufen).toEqual([...stufen].sort((x, y) => x - y));
    expect(stufen.filter((x) => x === 0)).toHaveLength(30);
    expect(stufen.filter((x) => x === 1)).toHaveLength(41);
    expect(stufen.filter((x) => x === 2)).toHaveLength(1);
    expect(r.gerankt[71].anbieter.haus).toBe("wise");
    expect(r.gerankt[71].platz).toBe(72);
    // Innerhalb jeder Stufe steht die Liste nach Note.
    for (const st of [0, 1]) {
      const noten = r.gerankt.filter((b) => stufe(b.anbieter) === st).map((b) => b.note);
      expect(noten, `Stufe ${st}`).toEqual([...noten].sort((x, y) => y - x));
    }
  });

  it("macht nie einen offenen oder verzinsten Tarif zur Nummer 1 und rechnet sie ohne Urteil, nur mit belegten Punkten", () => {
    const r = rang(geschaeftskontoAnzeige);
    for (const b of r.gerankt.filter((x) => stufe(x.anbieter) > 0)) expect(b.uneingeschraenkt, b.anbieter.id).toBe(false);
    expect(r.gerankt[0].anbieter.werte.zinsfreiAbStart).toBe("gut");
    // Wise zahlt laut Anbieter Zinsen: der Halal-Teil ist 0, die Kosten zählen weiter.
    expect(r.gerankt[71].halal).toBe(0);
    expect(r.gerankt[71].kosten).toBeGreaterThan(0);
    // Ein offener Dispo oder eine offene Karte zählt 0 Punkte: Qonto hat keine belegte Karte, Halal-Teil also 2,5 statt 5.
    for (const b of r.gerankt.filter((x) => x.anbieter.haus === "qonto")) expect(b.halal, b.anbieter.id).toBe(2.5);
    // Alle übrigen offenen Konten mit belegter Dispo und Karte rechnen wie zinsfreie (Faktor 1): fyrst-base hat 5.
    expect(r.gerankt.find((x) => x.anbieter.id === "fyrst-base")!.halal).toBe(5);
  });

  it("stellt Grenke wegen der Kreditkarte ans Ende der belegten Stufe, nie auf Platz 1", () => {
    const r = rang(geschaeftskontoAnzeige);
    const grenke = r.gerankt.filter((b) => b.anbieter.haus === "grenke");
    expect(grenke).toHaveLength(3);
    for (const b of grenke) {
      expect(b.uneingeschraenkt, b.anbieter.id).toBe(false);
      expect(b.halal, b.anbieter.id).toBe(2.5);
    }
    // VG3 KT Bank: Das KT GeschäftsKonto (Karte offen, Halal-Teil ebenfalls 2,5) steht mit den drei Grenke-Tarifen am Ende der belegten Stufe.
    expect(r.gerankt.slice(26, 30).map((b) => b.anbieter.haus).sort()).toEqual(["grenke", "grenke", "grenke", "kt-bank"]);
    // Auch mit Partnerlink bleibt Grenke von Platz 1 weg.
    expect(rang(mitLink(geschaeftskontoAnzeige, "grenke")).gerankt[0].anbieter.haus).not.toBe("grenke");
  });

  it("gibt ohne Partnerlink keinen Kasten Nummer 1, die Liste ist trotzdem gerankt", () => {
    const basis = ohneLinks(geschaeftskontoAnzeige);
    // Der Platz 1 der Liste ist ein Konto ohne Einschränkung. Die Seite zeigt den Kasten nur, wenn dieses Konto einen Link hat.
    const sieger = siegerDerSeite(basis, "geschaeftskonto", GESCHAEFT_FINANZ_MAX);
    expect(sieger?.id).toBe("n26-business-smart");
    expect(sieger?.link).toBeUndefined();
    const r = rang(basis);
    expect(r.gerankt[0].platz).toBe(1);
    expect(r.gerankt[0].anbieter.id).toBe("n26-business-smart");
  });

  it("ranked unabhängig vom Link (Elias VG2-04): Accountable steht mit und ohne Link auf Platz 9, die Nummer 1 bleibt N26 ohne Link", () => {
    const mit = rang(geschaeftskontoAnzeige);
    const ohne = rang(ohneLinks(geschaeftskontoAnzeige));
    expect(mit.gerankt.map((b) => b.anbieter.id)).toEqual(ohne.gerankt.map((b) => b.anbieter.id));
    expect(mit.gerankt[0].anbieter.id).toBe("n26-business-smart");
    const acc = mit.gerankt.find((b) => b.anbieter.id === "accountable-geschaeftskonto")!;
    expect(acc.platz).toBe(9);
    expect(acc.note).toBe(ohne.gerankt.find((b) => b.anbieter.id === "accountable-geschaeftskonto")!.note);
    expect(nummerEins(mit).map((b) => b.anbieter.id)).toEqual(["n26-business-smart"]);
    // Der Kasten der Seite braucht einen Link am Sieger. Accountable steht nicht vorn, also kein Kasten.
    expect(siegerDerSeite(geschaeftskontoAnzeige, "geschaeftskonto", GESCHAEFT_FINANZ_MAX)?.link).toBeUndefined();
  });

  it("zeigt den Kasten von selbst, sobald das Konto ganz vorn einen Link hat, ändert aber die Reihenfolge nie", () => {
    const basis = rang(ohneLinks(geschaeftskontoAnzeige)).gerankt.map((b) => b.anbieter.id);
    for (const haus of ["tide", "vivid", "n26"]) {
      const liste = mitLink(ohneLinks(geschaeftskontoAnzeige), haus);
      expect(rang(liste).gerankt.map((b) => b.anbieter.id), haus).toEqual(basis);
    }
    const n26 = mitLink(ohneLinks(geschaeftskontoAnzeige), "n26");
    expect(siegerDerSeite(n26, "geschaeftskonto", GESCHAEFT_FINANZ_MAX)?.link).toBe("/out/n26");
  });

  it("ändert die Note nie durch einen Link", () => {
    const ohne = new Map(rang(geschaeftskontoAnzeige).gerankt.map((b) => [b.anbieter.id, b.note]));
    for (const b of rang(mitLink(mitLink(geschaeftskontoAnzeige, "tide"), "vivid")).gerankt) expect(b.note, b.anbieter.id).toBe(ohne.get(b.anbieter.id));
  });

  it("ändert die Rangfolge der anderen Vergleiche nicht: dort gilt der Link-Vorrang weiter", () => {
    expect(LINK_VORRANG.has("geschaeftskonto")).toBe(false);
    for (const k of ["depot", "girokonto", "krypto"] as const) expect(LINK_VORRANG.has(k), k).toBe(true);
  });
});

describe("Geschäftskonto: Sätze zu Zinsen", () => {
  const spalten = baueSpalten(geschaeftskontoAnzeige, GESCHAEFT_ZEILEN, "geschaeftskonto");

  it("gibt jedem Tarif einen Satz, der dem Beleg folgt", () => {
    for (const a of geschaeftskontoAnzeige) expect(zinsHinweis("geschaeftskonto", a), a.id).toBeTruthy();
    const satz = (id: string) => zinsHinweis("geschaeftskonto", geschaeftskontoAnzeige.find((a) => a.id === id)!);
    expect(satz("tide-lite")).toBe("Das Tagesgeldkonto wird automatisch mit eröffnet. Zahle dort nichts ein, dann fallen keine Zinsen an.");
    expect(satz("vivid-business-basic")).toBe("Zinsen gibt es nur auf dem Zinskonto, das du selbst eröffnen müsstest. Eröffne es nicht.");
    expect(satz("n26-business-go")).toMatch(/nicht verzinst/);
    expect(satz("ing-geschaeftskonto-m")).toMatch(/Business Extra-Konto/);
  });

  it("zeigt den Satz beim aufgeklappten Angebot", () => {
    for (const s of spalten) expect(s.werte.zinsfreiAbStart.zusatz, s.id).toBeTruthy();
  });

  it("verwechselt die Sätze der anderen Vergleiche nicht mit denen des Geschäftskontos", () => {
    expect(zinsHinweis("girokonto", { id: "n26-flex", haus: "n26", werte: { zinsfreiAbStart: "gut" } })).toMatch(/Tagesgeldkonto/);
    expect(zinsHinweis("girokonto", { id: "vivid-plus", haus: "vivid", werte: { zinsfreiAbStart: "gut" } })).toMatch(/Interest Rate Pocket/);
    expect(zinsHinweis("depot", { id: "n26-depot", haus: "n26", werte: { zinsfreiAbStart: "gut" } })).toMatch(/Tagesgeldkonto/);
    // Ein Haus, das nur in anderen Vergleichen einen Satz hat, bekommt im Geschäftskonto keinen.
    expect(zinsHinweis("geschaeftskonto", { id: "bbbank-konto", haus: "bbbank", werte: { zinsfreiAbStart: "gut" } })).toBeUndefined();
    expect(zinsHinweis("geschaeftskonto", { id: "n26-business-go", haus: "n26", werte: { zinsfreiAbStart: "teils" } })).toBeUndefined();
  });

  it("enthält bei den grünen Tarifen keinen Zinssatz und keine Prozentzahl, außer 0 % bei Grenke und EthikBank", () => {
    for (const a of geschaeftskontoAnzeige.filter((x) => x.werte.zinsfreiAbStart === "gut")) {
      const s = zinsHinweis("geschaeftskonto", a)!;
      const prozent = s.match(/\d[\d,.]*\s*%/g) ?? [];
      expect(prozent.every((p) => p.startsWith("0 %")), `${a.id}: ${s}`).toBe(true);
    }
    for (const s of ALLE_ZINS_SAETZE) expect(s).not.toMatch(/[–—]/);
  });

  it("sagt bei den 41 offenen Tarifen neutral „Noch offen“ und nennt den Anbieter, ohne Urteil und ohne Gedankenstrich", () => {
    const offene = geschaeftskontoAnzeige.filter((x) => x.werte.zinsfreiAbStart === "unbekannt");
    expect(offene).toHaveLength(41);
    for (const a of offene) {
      const s = zinsHinweis("geschaeftskonto", a)!;
      expect(s, a.id).toMatch(/^Noch offen: Wir fragen bei .+ nach, ob das Konto ohne Zinsen läuft\./);
      expect(s, a.id).not.toMatch(/haram|halal|unerlaubt|verboten|[–—]/i);
    }
    for (const s of ALLE_OFFENEN_SAETZE) expect(s).not.toMatch(/[–—!]|Ticket|Gegenprobe|Chrome/i);
    // Commerzbank: die Landingpage wirbt groß mit dem Tagesgeld, das steht im Satz, im Wortlaut.
    const comm = zinsHinweis("geschaeftskonto", geschaeftskontoAnzeige.find((x) => x.id === "commerzbank-premiumgeschaeftskonto")!)!;
    expect(comm).toContain("„3,75% p.a. Guthabenszins“");
    expect(comm).toContain("Tagesgeldkonto");
    // Postbank: der Satz aus den AGB, wortgleich.
    expect(zinsHinweis("geschaeftskonto", geschaeftskontoAnzeige.find((x) => x.id === "postbank-business-giro")!)).toContain("„zur Verzinsung der Guthaben ist die Bank nicht verpflichtet“");
  });

  it("sagt bei Wise, dass Cashback auf das Guthaben läuft, und lässt offen, ob man es abschalten kann", () => {
    const wise = geschaeftskontoAnzeige.find((x) => x.id === "wise-business")!;
    const satz = zinsHinweis("geschaeftskonto", wise)!;
    expect(satz).toMatch(/Cashback/);
    expect(satz).toMatch(/abschalten kannst, ist offen/);
    expect(wise.quellen!.zinsfreiAbStart.hinweis).toContain("„Wise pays cashback each month based on the EUR, GBP and USD you hold in your Wise account.“");
    expect(wise.quellen!.zinsfreiAbStart.url).toBe("https://wise.com/help/articles/b8sVSdAzytqVamfajSirb/how-does-balance-cashback-work");
    // Die Sätze zu den anderen Vergleichen bleiben.
    expect(zinsHinweis("depot", { id: "wise-x", haus: "wise", werte: { zinsfreiAbStart: "teils" } })).toMatch(/Melde dich davon ab/);
  });

  it("nennt das Verwahrentgelt nur bei N26 und Lexware, nur im Geschäftskonto, ohne Gedankenstrich", () => {
    expect(verwahrAchtung("geschaeftskonto", { haus: "n26" })).toMatch(/50\.000 €/);
    expect(verwahrAchtung("geschaeftskonto", { haus: "lexware" })).toMatch(/100\.000 €/);
    expect(verwahrAchtung("geschaeftskonto", { haus: "tide" })).toBeUndefined();
    expect(verwahrAchtung("girokonto", { haus: "n26" })).toBeUndefined();
    for (const s of ALLE_ACHTUNG_SAETZE) expect(s).not.toMatch(/[–—]/);
    const n26 = spalten.find((s) => s.id === "n26-business-go")!;
    expect(n26.werte.zinsfreiAbStart.achtung).toMatch(/Verwahrentgelt/);
    expect(spalten.find((s) => s.id === "tide-lite")!.werte.zinsfreiAbStart.achtung).toBeUndefined();
  });
});

describe("Geschäftskonto: Texte", () => {
  it("sagt wahr, wie die Note entsteht: halb Halal, halb Kosten, ohne „beliebt“", () => {
    for (const t of [sortiertSatzGeschaeft(), reihenfolgeAntwortGeschaeft()]) {
      expect(t).not.toMatch(/beliebt|Lesern/i);
      expect(t).toMatch(/zur Hälfte|je zur Hälfte/);
      expect(t).not.toMatch(/[–—]/);
    }
  });
});

describe("Geschäftskonto: Seite", () => {
  // Der Server-Render meldet useLayoutEffect, das im Browser läuft. Die Meldung ist hier ohne Belang.
  const leise = vi.spyOn(console, "error").mockImplementation(() => undefined);
  const html = renderToString(createElement(MemoryRouter, { initialEntries: ["/vergleich/geschaeftskonto"] }, createElement(VergleichGeschaeftskonto)));
  leise.mockRestore();

  it("trägt Titel und Unterzeile wie Finanzfluss", () => {
    expect(html).toContain("Geschäftskonto-Vergleich 2026");
    expect(html).toContain("Die besten Geschäftskonten für Muslime 11/2026");
  });

  it("zeigt ohne Link an Platz 1 keinen Kasten, trägt aber alle Konten mit den Kennzahlen 72, 30 und 41 (VG3 KT Bank) und „Offen“ in den Zellen", () => {
    expect(html).not.toContain('aria-label="Bestes Geschäftskonto"');
    expect(html).toContain("Offen");
    expect(html).toContain("Wise");
    expect(html).toContain("Qonto Enterprise");
    expect(html).not.toMatch(/Aktion: \d/);
    expect(html).not.toMatch(/Geldmarktfonds-Rendite/);
    const text = html.replace(/<svg.*?<\/svg>/gs, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    expect(text).toMatch(/72 Konten im Vergleich/);
    expect(text).toMatch(/24 Anbieter/);
    expect(text).toMatch(/30 belegt ohne Zinsen nutzbar/);
    expect(text).toContain("Zusätzlich ist die KT Bank drin (Angaben von kt-bank.de, Stand 23.11.2026)");
    expect(text).toMatch(/41 Zinsen noch offen/);
  });

  it("hat sieben Fragen, darunter die zu Zinskonten ohne Urteil eines Gelehrten", () => {
    expect(GESCHAEFT_FAQ).toHaveLength(7);
    const fragen = GESCHAEFT_FAQ.map((f) => f.frage);
    for (const f of ["Brauche ich als Selbstständiger ein Geschäftskonto?", "Welche Rechtsform passt zu welchem Konto?", "Sind Zinskonten und Geldmarktfonds bei Geschäftskonten erlaubt?", "Was heißt „Offen“ bei den Zinsen?", "Wie entsteht die Reihenfolge?"])
      expect(fragen).toContain(f);
    const zins = GESCHAEFT_FAQ.find((f) => f.frage.startsWith("Sind Zinskonten"))!;
    expect(zins.antwort).toMatch(/^Das sind Zinsprodukte\. Wir empfehlen sie nicht/);
    const alles = JSON.stringify(GESCHAEFT_FAQ);
    expect(alles).not.toMatch(/Sheikh|Fatwa|Hourani|ist haram|ist halal|Gedankenstrich|[–—]/i);
    expect(GESCHAEFT_FAQ.find((f) => f.frage === "Wie entsteht die Reihenfolge?")!.antwort).toBe(reihenfolgeAntwortGeschaeft());
  });

  it("nennt in der Kostenfrage die Spanne aus den Daten", () => {
    const k = GESCHAEFT_FAQ.find((f) => f.frage === "Was kostet ein Geschäftskonto?")!.antwort;
    expect(k).toContain("von 0 € bis 296 €");
    const kostenlos = geschaeftskontoAnzeige.filter((a) => a.werte.kontofuehrung === "0 €").length;
    expect(k).toContain(`${zahlwort(kostenlos, true)} Konten in dieser Liste haben keine Kontoführung`);
  });
});
