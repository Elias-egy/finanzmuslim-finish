import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { geschaeftskontoVergleich, GESCHAEFT_DRAUSSEN, GESCHAEFT_FILTER, GESCHAEFT_ZEILEN } from "./geschaeftskontoVergleich";
import { geschaeftskontoAnzeige } from "./anzeige/geschaeftskonto";
import { GESCHAEFT_FINANZ_MAX } from "./finanzMax";
import { partnerLinks } from "./partnerLinks";
import { ALLE_ACHTUNG_SAETZE, ALLE_ZINS_SAETZE, verwahrAchtung, zinsHinweis } from "./zinsHinweise";
import { baueSpalten, type RohAnbieter } from "./vergleichHelfer";
import { reihenfolgeAntwortGeschaeft, sortiertSatzGeschaeft } from "./reihenfolgeText";
import { GESCHAEFT_FAQ } from "./geschaeftskontoFaq";
import { nummerEins, rangfolge } from "@/lib/rangfolge";
import { siegerDerSeite } from "@/lib/vergleichAssistent";
import { luecken } from "@/lib/vollstaendig";
import VergleichGeschaeftskonto from "@/pages/VergleichGeschaeftskonto";

const mitLink = (liste: RohAnbieter[], haus: string): RohAnbieter[] => liste.map((a) => (a.haus === haus ? { ...a, link: `/out/${haus}` } : a));
const rang = (liste: RohAnbieter[]) => rangfolge(liste, "geschaeftskonto", { finanzMax: GESCHAEFT_FINANZ_MAX });
const HAEUSER = ["accountable", "ethikbank", "grenke", "ing", "lexware", "n26", "tide", "vivid"];

describe("Geschäftskonto: Daten", () => {
  it("führt 25 Tarife von 8 Anbietern, jede ID einmal, alphabetisch", () => {
    expect(geschaeftskontoVergleich).toHaveLength(25);
    expect(new Set(geschaeftskontoVergleich.map((a) => a.id)).size).toBe(25);
    expect([...new Set(geschaeftskontoVergleich.map((a) => a.haus))].sort()).toEqual(HAEUSER);
    const ist = geschaeftskontoVergleich.map((a) => `${a.name} ${a.produkt}`);
    expect(ist).toEqual([...ist].sort((a, b) => a.localeCompare(b, "de")));
  });

  it("hat von Tide 2, Vivid 9, N26 4, Lexware 2, Accountable 1, Grenke 3, EthikBank 1 und ING 3 Tarifen", () => {
    const je = (h: string) => geschaeftskontoVergleich.filter((a) => a.haus === h).length;
    expect(HAEUSER.map(je)).toEqual([1, 1, 3, 3, 2, 4, 2, 9]);
  });

  it("nimmt keinen der 15 Anbieter ohne Beleg auf", () => {
    expect(GESCHAEFT_DRAUSSEN).toHaveLength(15);
    for (const a of geschaeftskontoVergleich)
      for (const n of GESCHAEFT_DRAUSSEN) expect(a.name.toLowerCase(), `${a.id} gegen ${n}`).not.toContain(n.toLowerCase());
  });

  it("belegt Zinsen, Dispo und Karte jedes Tarifs mit Zitat und Adresse, Zinsen nur auf der Domain des Anbieters", () => {
    // Accountable führt das Konto bei Swan und verweist in den AGB darauf („den Vertrag direkt mit Swan“).
    // Grenke: Das Preis- und Leistungsverzeichnis liegt bei Atruvia und ist von grenkebank.de/firmenkunden/geschaeftskonto.html verlinkt.
    const BANK: Record<string, string[]> = { "accountable.de": ["swan.io"], "grenkebank.de": ["atruvia.scene7.com"] };
    for (const a of geschaeftskontoVergleich) {
      for (const k of ["zinsfreiAbStart", "keinDispoAbStart", "karteOhneKredit"]) {
        const q = a.quellen?.[k];
        expect(q?.url, `${a.id} ${k}`).toMatch(/^https:\/\//);
        expect(q?.hinweis, `${a.id} ${k}`).toContain("„");
        expect(q?.stand, `${a.id} ${k}`).toBe("23.11.2026");
      }
      const host = new URL(a.quellen!.zinsfreiAbStart.url!).hostname.replace(/^www\./, "");
      const domains = [a.domain!, ...(BANK[a.domain!] ?? [])];
      expect(domains.some((d) => host === d || host.endsWith(`.${d}`)), `${a.id}: Zins belegt mit ${host}`).toBe(true);
    }
  });

  it("nennt als Kostenquelle den Finanzfluss-Vergleich mit Stand 11.11.2026", () => {
    for (const a of geschaeftskontoVergleich) {
      expect(a.quellen!.kontofuehrung.url).toBe("https://www.finanzfluss.de/vergleich/geschaeftskonto/");
      expect(a.quellen!.kontofuehrung.stand).toBe("11.11.2026");
    }
  });

  it("wertet Zinsen und Dispo grün und die Karte grün, nur Grenke (nur Kreditkarte) rot", () => {
    for (const a of geschaeftskontoVergleich) {
      expect(a.werte.zinsfreiAbStart, a.id).toBe("gut");
      expect(a.werte.keinDispoAbStart, a.id).toBe("gut");
      expect(a.werte.karteOhneKredit, a.id).toBe(a.haus === "grenke" ? "schlecht" : "gut");
    }
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

  it("zeigt alle 25 Tarife: jede Zeile hat einen Wert, jeder Wert der Note ist belegt", () => {
    expect(geschaeftskontoAnzeige).toHaveLength(25);
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

describe("Geschäftskonto: Partnerlinks", () => {
  it("setzt einen Link nur für einen aktiven Partner und sonst keinen", () => {
    for (const a of geschaeftskontoVergleich) {
      if (a.link) {
        const kurz = a.link.replace("/out/", "");
        expect(partnerLinks.some((p) => p.kurzname === kurz && p.aktiv), a.id).toBe(true);
      }
    }
    // Solange kein Partner für Tide und Vivid eingetragen ist, hat kein Tarif einen Link.
    const aktiv = new Set(partnerLinks.filter((p) => p.aktiv).map((p) => p.kurzname));
    for (const a of geschaeftskontoVergleich.filter((x) => x.haus === "tide" || x.haus === "vivid"))
      expect(Boolean(a.link), a.id).toBe(aktiv.has(a.haus === "tide" ? "tide" : "vivid-business"));
  });

  it("gibt Grenke, N26, Lexware, Accountable, EthikBank und ING nie einen Link", () => {
    for (const a of geschaeftskontoVergleich.filter((x) => !["tide", "vivid"].includes(x.haus!))) expect(a.link, a.id).toBeUndefined();
  });
});

describe("Geschäftskonto: Rangfolge", () => {
  it("ordnet alle Tarife mit Plätzen, keiner fällt heraus, keiner ist abgeraten", () => {
    const r = rang(geschaeftskontoAnzeige);
    expect(r.gerankt).toHaveLength(25);
    expect(r.nichtBewertet).toEqual([]);
    expect(r.abgeraten).toEqual([]);
    for (const b of r.gerankt) expect(b.note, b.anbieter.id).toBeGreaterThan(0);
    expect(r.gerankt.map((b) => b.note)).toEqual([...r.gerankt.map((b) => b.note)].sort((a, b) => b - a).filter((_, i, l) => i >= 0 && l));
  });

  it("stellt Grenke wegen der Kreditkarte ans Ende, nie auf Platz 1", () => {
    const r = rang(geschaeftskontoAnzeige);
    const grenke = r.gerankt.filter((b) => b.anbieter.haus === "grenke");
    expect(grenke).toHaveLength(3);
    for (const b of grenke) {
      expect(b.uneingeschraenkt, b.anbieter.id).toBe(false);
      expect(b.halal, b.anbieter.id).toBe(2.5);
    }
    expect(r.gerankt.slice(-3).map((b) => b.anbieter.haus)).toEqual(["grenke", "grenke", "grenke"]);
    // Auch mit Partnerlink bleibt Grenke von Platz 1 weg.
    expect(rang(mitLink(geschaeftskontoAnzeige, "grenke")).gerankt[0].anbieter.haus).not.toBe("grenke");
  });

  it("gibt ohne Partnerlink keinen Kasten Nummer 1, die Liste ist trotzdem gerankt", () => {
    const sieger = siegerDerSeite(geschaeftskontoAnzeige, "geschaeftskonto", GESCHAEFT_FINANZ_MAX);
    // Der Platz 1 der Liste ist ein Konto ohne Einschränkung. Die Seite zeigt den Kasten nur, wenn dieses Konto einen Link hat.
    expect(sieger).not.toBeNull();
    expect(Boolean(sieger?.link)).toBe(geschaeftskontoAnzeige.some((a) => a.link && a.id === sieger?.id));
    const r = rang(geschaeftskontoAnzeige);
    expect(r.gerankt[0].platz).toBe(1);
  });

  it("zeigt den Kasten von selbst, sobald Tide oder Vivid einen Link haben und ganz vorn stehen", () => {
    const tide = mitLink(geschaeftskontoAnzeige, "tide");
    expect(siegerDerSeite(tide, "geschaeftskonto", GESCHAEFT_FINANZ_MAX)?.haus).toBe("tide");
    expect(siegerDerSeite(tide, "geschaeftskonto", GESCHAEFT_FINANZ_MAX)?.link).toBe("/out/tide");
    expect(nummerEins(rang(tide))[0].anbieter.haus).toBe("tide");

    const vivid = mitLink(geschaeftskontoAnzeige, "vivid");
    expect(siegerDerSeite(vivid, "geschaeftskonto", GESCHAEFT_FINANZ_MAX)?.haus).toBe("vivid");
    expect(rang(vivid).gerankt[0].anbieter.haus).toBe("vivid");
  });

  it("ändert die Note nie durch einen Link", () => {
    const ohne = new Map(rang(geschaeftskontoAnzeige).gerankt.map((b) => [b.anbieter.id, b.note]));
    for (const b of rang(mitLink(mitLink(geschaeftskontoAnzeige, "tide"), "vivid")).gerankt) expect(b.note, b.anbieter.id).toBe(ohne.get(b.anbieter.id));
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
    expect(zinsHinweis("geschaeftskonto", { id: "dkb-konto", haus: "dkb", werte: { zinsfreiAbStart: "gut" } })).toBeUndefined();
    expect(zinsHinweis("geschaeftskonto", { id: "n26-business-go", haus: "n26", werte: { zinsfreiAbStart: "teils" } })).toBeUndefined();
  });

  it("enthält keinen Zinssatz und keine Prozentzahl, außer 0 % bei Grenke und EthikBank", () => {
    for (const a of geschaeftskontoAnzeige) {
      const s = zinsHinweis("geschaeftskonto", a)!;
      const prozent = s.match(/\d[\d,.]*\s*%/g) ?? [];
      expect(prozent.every((p) => p.startsWith("0 %")), `${a.id}: ${s}`).toBe(true);
    }
    for (const s of ALLE_ZINS_SAETZE) expect(s).not.toMatch(/[–—]/);
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

  it("zeigt ohne Partnerlink keinen Kasten Nummer 1 und nennt keine Zinssätze", () => {
    expect(html).not.toContain("Bestes Geschäftskonto");
    expect(html).not.toMatch(/Aktion: \d/);
    expect(html).not.toMatch(/Geldmarktfonds-Rendite/);
  });

  it("hat sieben Fragen, darunter die zu Zinskonten ohne Urteil eines Gelehrten", () => {
    expect(GESCHAEFT_FAQ).toHaveLength(7);
    const fragen = GESCHAEFT_FAQ.map((f) => f.frage);
    for (const f of ["Brauche ich als Selbstständiger ein Geschäftskonto?", "Welche Rechtsform passt zu welchem Konto?", "Sind Zinskonten und Geldmarktfonds bei Geschäftskonten erlaubt?", "Wie entsteht die Reihenfolge?"])
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
    expect(k).toMatch(/^Das reicht .* Sieben Konten/);
  });
});
