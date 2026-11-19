import { describe, expect, it } from "vitest";
import { BANKEN, bankNachId, bankPreis, bankWerte, freieWahl, schnellwahl, suche, suchNorm, wahlVon } from "@/data/bankSuche";
import { KONTOPREISE } from "@/data/kontopreise";

const erste = (s: string) => suche(s)[0];
const leer = (t?: string) => (t ?? "").replace(/\u00a0/g, " ");
const namen = (s: string) => suche(s).map((v) => v.wahl.name);

describe("Banksuche im Bankkonto-Check (RN8)", () => {
  it("Eingabe wird normalisiert: klein, Umlaute und ß aufgelöst, Satzzeichen weg", () => {
    expect(suchNorm("  Nürnberg-Süd!  ")).toBe("nuernberg sued");
    expect(suchNorm("Straße")).toBe("strasse");
    expect(suchNorm("ING-DiBa")).toBe("ing diba");
  });

  it("„v“ zeigt sofort Volksbank, „s“ sofort Sparkasse", () => {
    expect(erste("v").wahl.id).toBe("grp-volksbank");
    expect(erste("V").wahl.name).toBe("Volksbank");
    expect(erste("s").wahl.id).toBe("grp-sparkasse");
  });

  it("alles mit spark, ksk, kreissparkasse, stadtsparkasse, haspa ist Sparkasse (Gruppe zuerst)", () => {
    for (const e of ["spk", "spark", "Kreissparkasse Köln", "Stadtsparkasse München", "ksk", "KSK Köln", "haspa", "Sparkasse Köln Bonn"]) {
      expect(erste(e).wahl.id).toBe("grp-sparkasse");
    }
  });

  it("volks, raiff, vr, vb, genossenschaft ist Volksbank, auch mit Ort dahinter", () => {
    for (const e of ["volks", "Raiffeisenbank", "vr", "vb", "genossenschaft", "Volksbank Mittelhessen", "Raiffeisenbank Oberland"]) {
      expect(erste(e).wahl.id).toBe("grp-volksbank");
    }
  });

  it("Sparda-Bank und PSD Bank sind eigene Gruppen", () => {
    expect(erste("sparda").wahl.id).toBe("grp-sparda");
    expect(erste("psd").wahl.id).toBe("grp-psd");
  });

  it("Tippfehler bis Abstand 1 zählen (Sparkase, comdirekt)", () => {
    expect(erste("Sparkase").wahl.id).toBe("grp-sparkasse");
    expect(erste("comdirekt").wahl.id).toBe("comdirect");
    expect(erste("Volksbnak").wahl.id).toBe("grp-volksbank");
    expect(erste("Commerzbnak").wahl.id).toBe("commerzbank");
  });

  it("Berliner Volksbank trifft genau die Bank mit belegtem Preis", () => {
    const e = erste("Berliner Volksbank");
    expect(e.wahl.id).toBe("berliner-volksbank");
    expect(leer(bankPreis(e.wahl)?.wert)).toBe("3,95 €");
  });

  it("ing diba, ing-diba und deutsche führen zu ING und Deutsche Bank", () => {
    expect(erste("ing diba").wahl.id).toBe("ing");
    expect(erste("ING-DiBa").wahl.id).toBe("ing");
    expect(erste("deutsche").wahl.id).toBe("deutsche-bank");
    expect(erste("Deutsche Bank").wahl.id).toBe("deutsche-bank");
    expect(erste("Norris Bank").wahl.id).toBe("norisbank");
  });

  it("große Banken aus dem Auftrag sind alle da", () => {
    for (const e of ["Targobank", "Santander", "Revolut", "Trade Republic", "HypoVereinsbank", "Consorsbank", "1822direkt", "KT Bank"]) {
      const v = erste(e);
      expect(v.eintrag, e).toBeTruthy();
    }
    expect(erste("Santander").wahl.name).toBe("Santander");
  });

  it("Phantasiebank wird nie „nicht gefunden“: der erste Vorschlag ist „übernehmen“ mit der Eingabe als Bankname", () => {
    const v = suche("Phantasiebank");
    expect(v).toHaveLength(1);
    expect(v[0].wahl.kind).toBe("frei");
    expect(v[0].wahl.name).toBe("Phantasiebank");
    expect(v[0].wahl.gruppe).toBe("andere");
    expect(bankPreis(v[0].wahl)).toBeNull();
  });

  it("keine Eingabe bleibt ohne Vorschlag: Zeichen ohne Buchstaben und lange Texte gehen als Bankname durch", () => {
    expect(suche("")).toEqual([]);
    expect(suche("   ")).toEqual([]);
    expect(suche("!!!")[0].wahl.kind).toBe("frei");
    expect(freieWahl("x".repeat(100)).name).toHaveLength(40);
    for (const z of ["q", "xyz", "Bäckerei Müller", "123", "ß"]) expect(suche(z).length, z).toBeGreaterThanOrEqual(1);
  });

  it("jeder Name und jedes Alias der Liste wird gefunden und liefert sich selbst als ersten oder gleichwertigen Treffer", () => {
    for (const b of BANKEN) {
      expect(suche(b.name).some((v) => v.wahl.id === b.id), b.name).toBe(true);
      for (const a of b.aliase) expect(suche(a).some((v) => v.wahl.id === b.id), `${b.name}:${a}`).toBe(true);
    }
  });

  it("Preis nur aus kontopreise.ts: mehrere Konten gleich „ab“, Gruppen und freie Eingaben nie eine Zahl", () => {
    const ing = bankPreis(wahlVon(bankNachId("ing")!))!;
    expect(leer(ing.wert)).toBe("ab 0 €");
    expect(ing.zusatz[0]).toBe("Girokonto");
    const noris = bankPreis(wahlVon(bankNachId("norisbank")!))!;
    expect(leer(noris.wert)).toBe("ab 0 €");
    expect(bankPreis(wahlVon(bankNachId("grp-sparkasse")!))).toBeNull();
    expect(bankPreis(wahlVon(bankNachId("grp-volksbank")!))).toBeNull();
    expect(bankPreis(wahlVon(bankNachId("grp-psd")!))).toBeNull();
    expect(bankPreis(freieWahl("Meine Bank vor Ort"))).toBeNull();
    // Gibt es einen Preis, steht er so in kontopreise.ts.
    for (const b of BANKEN.filter((x) => x.produkte.length > 0)) {
      const kleinster = Math.min(...b.produkte.map((p) => KONTOPREISE[p.id].aktiv));
      const wert = leer(bankPreis(wahlVon(b))!.wert);
      expect(wert, b.name).toContain(String(kleinster).replace(".", ","));
    }
  });

  it("Schnellwahl: achtundzwanzig Banken mit Logo-Domain, die ersten acht in der Reihenfolge des Auftrags, dahinter RN16-05", () => {
    expect(schnellwahl().map((b) => b.name)).toEqual([
      "Sparkasse",
      "Volksbank",
      "Deutsche Bank",
      "Commerzbank",
      "Postbank",
      "ING",
      "DKB",
      "N26",
      "comdirect",
      "C24",
      "Trade Republic",
      "Consorsbank",
      "HypoVereinsbank",
      "Targobank",
      "Revolut",
      "Santander",
      "Sparda-Bank",
      "BBBank",
      "PSD Bank",
      "1822direkt",
      "Ziraat Bank",
      "İşbank",
      "KT Bank",
      "bunq",
      "Vivid",
      "Volkswagen Bank",
      "apoBank",
      "GLS Bank",
    ]);
    expect(schnellwahl().every((b) => b.domain)).toBe(true);
  });

  it("RN16-05: fehlende Häuser sind über die Suche zu finden, auch ohne Sonderzeichen, und haben keine geratenen Werte", () => {
    expect(namen("ziraat")[0]).toBe("Ziraat Bank");
    expect(namen("isbank")[0]).toBe("İşbank");
    expect(namen("İş Bankası")[0]).toBe("İşbank");
    expect(namen("vw bank")[0]).toBe("Volkswagen Bank");
    expect(namen("apobank")[0]).toBe("apoBank");
    expect(namen("oldenburgische")[0]).toBe("OLB");
    const w = bankWerte(wahlVon(bankNachId("ziraat-bank")!));
    expect([w.zinsfrei, w.keinDispo, w.karteOhneKredit, w.applePay, w.kontowechsel]).toEqual([null, null, null, null, null]);
    expect(bankPreis(wahlVon(bankNachId("isbank")!))).toBeNull();
  });

  it("Banken ohne Treffer in der Vergleichsliste haben trotzdem eine Messgruppe, der freie Text steht nie darin", () => {
    const gruppen = new Set(BANKEN.map((b) => b.gruppe));
    expect([...gruppen].sort()).toEqual(["andere", "direktbank", "grossbank", "sparkasse", "volksbank"]);
    expect(namen("Sparkasse").length).toBeGreaterThan(0);
  });
});
