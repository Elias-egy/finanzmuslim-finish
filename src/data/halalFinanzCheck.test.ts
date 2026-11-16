import { describe, expect, it } from "vitest";
import {
  ANGEBOTE_GETESTET,
  ART_JE_QUELLE,
  CHECK_SRC,
  ANLAGE_TEXT,
  ETIKETT,
  ETIKETT_LISTE,
  ETIKETT_PLAN,
  ETIKETT_VERGLEICH,
  checkSrc,
  type CheckQuelle,
  FRAGEN,
  KEIN_PREIS,
  KEIN_WERT,
  PASSUNG_MAX,
  antwortZeilen,
  artVon,
  checkEinstiegLink,
  ergebnisAus,
  ersteAntwortAus,
  frageFuer,
  hinweisJeQuelle,
  royalMintKaufbar,
  zielFrage,
  fragenGesamt,
  naechsteFrage,
  outLink,
  passungAusWerten,
  passungProzent,
  quelleAus,
  UEBERSCHRIFT,
  type Antworten,
  type DepotErgebnis,
  type KontoErgebnis,
} from "@/data/halalFinanzCheck";
import { BROKER_KARTEN } from "@/data/brokerFreebie";
import { freieWahl, KEINE_BANK, suche, wahlVon, bankNachId } from "@/data/bankSuche";
import { depotNachId, depotWahlVon, depotWerte, freieDepotWahl } from "@/data/depotSuche";
import { istGueltigeQuelle, istHerkunft } from "@/lib/attribution";

const durch = (a: Antworten) => ergebnisAus(a, "aktienliste");
const durchB = (a: Antworten) => ergebnisAus(a, "aktienliste", "b");
const konto = (a: Antworten) => durch(a) as KontoErgebnis;
const depot = (a: Antworten, b = false) => (b ? durchB(a) : durch(a)) as DepotErgebnis;
const bank = (id: string) => wahlVon(bankNachId(id)!);
const heuteDepot = (id: string) => depotWahlVon(depotNachId(id)!);
const leer = (t?: string) => (t ?? "").replace(/\u00a0/g, " ");
const FL = BROKER_KARTEN.find((d) => d.id === "flatex-depot")!;
const SB = BROKER_KARTEN.find((d) => d.id === "smartbroker-plus-depot")!;

describe("Halal-Finanz-Check, zwei Arten auf einem Gerüst (RN8)", () => {
  it("ohne art kommt zuerst „Was suchst du gerade?“ (Elias RN8-06), Bankkonto und Noch unsicher führen in den Bankkonto-Weg, Depot in den Depot-Weg", () => {
    expect(naechsteFrage({})).toBe("ziel");
    expect(FRAGEN.ziel.titel).toBe("Was suchst du gerade?");
    expect(FRAGEN.ziel.warum).toBe(
      "Salam! Ich habe 35 Depots und 54 Girokonten selbst getestet, um Muslimen zu helfen, und will dir nur das zeigen, was wirklich zu dir passt.",
    );
    expect(FRAGEN.ziel.optionen.map((o) => o.titel)).toEqual(["Neues Bankkonto", "Depot zum Investieren", "Noch unsicher"]);
    expect(artVon({ ziel: "konto" })).toBe("konto");
    expect(artVon({ ziel: "unsicher" })).toBe("konto");
    expect(artVon({ ziel: "beides" })).toBe("konto");
    expect(artVon({ ziel: "invest" })).toBe("depot");
    expect(naechsteFrage({ ziel: "unsicher" })).toBe("zahlung");
    expect(naechsteFrage({ ziel: "invest" })).toBe("hatDepot");
  });

  it("Bankkonto-Check hat genau zwei Fragen: Wie bezahlst du, Bank von heute", () => {
    const a: Antworten = { art: "konto" };
    expect(naechsteFrage(a)).toBe("zahlung");
    expect(naechsteFrage({ ...a, zahlung: "karte" })).toBe("bank");
    expect(naechsteFrage({ ...a, zahlung: "karte", bank: bank("grp-sparkasse") })).toBeNull();
    expect(fragenGesamt(a)).toBe(2);
    expect(fragenGesamt({ ziel: "konto" })).toBe(3);
    expect(FRAGEN.zahlung.titel).toBe("Wie bezahlst du meistens?");
    expect(FRAGEN.zahlung.optionen.map((o) => o.titel)).toEqual(["Fast nur mit Karte", "Karte und ab und zu Bargeld", "Viel Bargeld, ich will in eine Filiale"]);
    expect(FRAGEN.bank.titel).toBe("Bei welcher Bank bist du heute?");
  });

  it("Depot-Check (RN10-07): Hast du schon ein Depot, nur bei Ja „Wo hast du dein Depot?“, dann „Was ist dir wichtiger?“, „Worin willst du investieren?“, in Fassung b zuletzt der Monatsbetrag", () => {
    // Elias RN10-07: „Hast du schon ein Depot oder nicht? Bei welchem Depot bist du … was ist dir besonders wichtig … worin willst du investieren“.
    const d: Antworten = { art: "depot" };
    expect(naechsteFrage(d)).toBe("hatDepot");
    expect(naechsteFrage({ ...d, hatDepot: "nein" })).toBe("praef");
    expect(naechsteFrage({ ...d, hatDepot: "nein", praef: "halal" })).toBe("anlage");
    expect(naechsteFrage({ ...d, hatDepot: "nein", praef: "halal", anlage: "etf" })).toBeNull();
    // Nur „Ja“ fragt nach dem heutigen Depot, vor „Was ist dir wichtiger?“.
    expect(naechsteFrage({ ...d, hatDepot: "ja" })).toBe("depotHeute");
    expect(naechsteFrage({ ...d, hatDepot: "ja", depotHeute: heuteDepot("trade-republic-depot") })).toBe("praef");
    expect(naechsteFrage({ ...d, hatDepot: "ja", depotHeute: heuteDepot("trade-republic-depot"), praef: "kosten" })).toBe("anlage");
    expect(naechsteFrage({ ...d, hatDepot: "ja", depotHeute: freieDepotWahl("Mein Depot"), praef: "kosten", anlage: "aktien" })).toBeNull();
    expect(naechsteFrage({ ...d, hatDepot: "nein", depotHeute: undefined })).not.toBe("depotHeute");
    // Fassung b: der Monatsbetrag kommt zuletzt, auf beiden Wegen.
    expect(naechsteFrage({ ...d, hatDepot: "nein", praef: "halal", anlage: "gold" }, "b")).toBe("betrag");
    const mitDepot: Antworten = { ...d, hatDepot: "ja", depotHeute: heuteDepot("ing-direkt-depot"), praef: "halal", anlage: "etf" };
    expect(naechsteFrage(mitDepot, "b")).toBe("betrag");
    expect(naechsteFrage({ ...mitDepot, betrag: "unter50" }, "b")).toBeNull();
    expect(naechsteFrage({ ...d, hatDepot: "nein", praef: "halal", anlage: "gold", betrag: "unter50" }, "b")).toBeNull();
    // Fragenzahl: drei ohne Depot, vier mit Depot, in Fassung b eine mehr; mit der ersten Frage („ziel“) noch eine.
    expect(fragenGesamt(d)).toBe(3);
    expect(fragenGesamt({ ...d, hatDepot: "ja" })).toBe(4);
    expect(fragenGesamt(d, "b")).toBe(4);
    expect(fragenGesamt({ ...d, hatDepot: "ja" }, "b")).toBe(5);
    expect(fragenGesamt({ ziel: "invest" })).toBe(4);
    expect(fragenGesamt({ ziel: "invest", hatDepot: "ja" })).toBe(5);
    expect(fragenGesamt({ ziel: "invest", hatDepot: "ja" }, "b")).toBe(6);
    // Der Depot-Weg fragt nie nach der Bank oder der Zahlung, und nie mehr nach Erfahrung oder Eigenschaft.
    const ids = new Set<string>();
    for (const a of [d, { ...d, hatDepot: "nein" as const }, { ...d, hatDepot: "nein" as const, praef: "kosten" as const }, { ...d, hatDepot: "nein" as const, praef: "kosten" as const, anlage: "gold" as const }]) {
      const n = naechsteFrage(a, "b");
      ids.add(String(n));
      expect(n).not.toBe("bank");
      expect(n).not.toBe("zahlung");
    }
    expect(ids).toEqual(new Set(["hatDepot", "praef", "anlage", "betrag"]));
    expect(Object.keys(FRAGEN)).not.toContain("erfahrung");
    expect(Object.keys(FRAGEN)).not.toContain("eigenschaft");
    expect(FRAGEN.betrag.titel).toBe("Wie viel möchtest du im Monat anlegen?");
    expect(FRAGEN.hatDepot.titel).toBe("Hast du schon ein Depot?");
    expect(FRAGEN.hatDepot.optionen.map((o) => o.titel)).toEqual(["Ja", "Nein, noch nicht"]);
    expect(FRAGEN.depotHeute.titel).toBe("Wo hast du dein Depot?");
    expect(FRAGEN.praef.titel).toBe("Was ist dir wichtiger?");
    expect(FRAGEN.anlage.titel).toBe("Worin willst du investieren?");
  });

  it("„Worin willst du investieren?“ (Elias RN10-07): drei Antworten, ETFs, Einzelne Aktien, Gold und Silber, für jeden Weg gleich", () => {
    expect(FRAGEN.anlage.optionen.map((o) => o.wert)).toEqual(["etf", "aktien", "gold"]);
    expect(FRAGEN.anlage.optionen.map((o) => o.titel)).toEqual(["ETFs", "Einzelne Aktien", "Gold und Silber"]);
    for (const a of [{ art: "depot", hatDepot: "nein", praef: "halal" }, { art: "depot", hatDepot: "ja", praef: "kosten" }] as Antworten[]) {
      expect(frageFuer("anlage", a)).toEqual(FRAGEN.anlage);
    }
    expect(ANLAGE_TEXT).toEqual({ etf: "ETFs", aktien: "Einzelne Aktien", gold: "Gold und Silber" });
  });

  it("das grüne Etikett der ersten Frage hängt nur an der Quelle (Elias RN10-07): Standard Bankkonto „am beliebtesten“, bei den zwei Anlagen-Listen Depot „passt zu deiner Liste“", () => {
    expect(ETIKETT_LISTE).toBe("passt zu deiner Liste");
    const etiketten = (q: Parameters<typeof zielFrage>[0]) => zielFrage(q).optionen.map((o) => [o.wert, o.etikett ?? null]);
    for (const q of ["homepage", "kopf", "menue", "quiz", "boykottliste"] as const) {
      expect(etiketten(q), q).toEqual([["konto", "am beliebtesten"], ["invest", null], ["unsicher", null]]);
      expect(hinweisJeQuelle(q)).toEqual({ ziel: "konto", etikett: "am beliebtesten" });
    }
    for (const q of ["aktienliste", "halal-anlagen"] as const) {
      expect(etiketten(q), q).toEqual([["konto", null], ["invest", "passt zu deiner Liste"], ["unsicher", null]]);
      expect(hinweisJeQuelle(q)).toEqual({ ziel: "invest", etikett: "passt zu deiner Liste" });
    }
    // Sonst ist die Frage überall dieselbe: Titel, Blase, Antworten.
    for (const q of ["homepage", "aktienliste", "halal-anlagen", "boykottliste"] as const) {
      const f = zielFrage(q);
      expect(f.titel).toBe("Was suchst du gerade?");
      expect(f.warum).toBe(FRAGEN.ziel.warum);
      expect(f.optionen.map((o) => o.titel)).toEqual(["Neues Bankkonto", "Depot zum Investieren", "Noch unsicher"]);
      expect(frageFuer("ziel", {}, q)).toEqual(f);
    }
    // Alle anderen Fragen tragen nie ein Etikett, auch nicht je Quelle.
    for (const q of ["homepage", "aktienliste"] as const) {
      for (const id of ["zahlung", "hatDepot", "praef", "anlage", "betrag"] as const) expect(frageFuer(id, {}, q).optionen.every((o) => !o.etikett)).toBe(true);
    }
  });

  it("jede Frage hat eine erste Sprechblase mit einem Satz, warum Elias fragt", () => {
    for (const f of Object.values(FRAGEN)) {
      expect(f.warum.length, f.id).toBeGreaterThan(10);
      expect(f.warum, f.id).not.toMatch(/–|—/);
      // Ausrufezeichen nur im Gruß „Salam!“ der ersten Frage (Elias' Wortlaut RN8-06).
      expect(f.warum.replace(/^Salam!/, ""), f.id).not.toMatch(/!/);
    }
    expect(ANGEBOTE_GETESTET).toBe(89);
  });

  it("Etikett heißt „am beliebtesten“, im Standard nur an „Neues Bankkonto“ (Elias RN8-06), sonst an keiner Antwort", () => {
    expect(ETIKETT).toBe("am beliebtesten");
    const etiketten = Object.values(FRAGEN).flatMap((f) => f.optionen.map((o) => o.etikett).filter(Boolean));
    expect(etiketten).toEqual(["am beliebtesten"]);
  });

  it("die Art hängt am Freebie: Boykott-Liste Bankkonto, Aktien-Liste und Halal-Anlagen-Liste Depot", () => {
    expect(ART_JE_QUELLE.boykottliste).toBe("konto");
    expect(ART_JE_QUELLE.aktienliste).toBe("depot");
    expect(ART_JE_QUELLE["halal-anlagen"]).toBe("depot");
    expect(UEBERSCHRIFT.boykottliste).toBe("Du achtest beim Einkaufen drauf. Und bei deiner Bank?");
    expect(quelleAus("irgendwas")).toBe("homepage");
  });

  it("die acht weiteren Freebie-Stellen (RN10-07) haben je eine eigene Quelle, Kennung und Art, und das Etikett folgt dem Freebie", () => {
    const neu = {
      "vertrags-ampel": ["va", "konto"],
      "auto-abo": ["aa", "konto"],
      "baraka-blocker": ["bb", "konto"],
      rizq: ["rq", "konto"],
      "gold-plan": ["gp", "depot"],
      "sukuk-plan": ["sp", "depot"],
      "portfolio-plan": ["pp", "depot"],
      "broker-vergleich": ["bv", "depot"],
    } as const;
    const kennungen = new Set<string>();
    for (const [q, [kurz, art]] of Object.entries(neu)) {
      expect(quelleAus(q), q).toBe(q);
      expect(ART_JE_QUELLE[q as CheckQuelle], q).toBe(art);
      expect(UEBERSCHRIFT[q as CheckQuelle].length, q).toBeGreaterThan(10);
      expect(UEBERSCHRIFT[q as CheckQuelle], q).not.toMatch(/–|—|!|Finde, was zu dir passt/);
      const e = durchB({ art: "depot", hatDepot: "nein", praef: "kosten", anlage: "etf", betrag: "unter50" }) as DepotErgebnis;
      const src = checkSrc(q as CheckQuelle, e.anbieter, "b");
      expect(src, q).toBe(`fc${kurz}sbb`);
      expect(CHECK_SRC.test(src), q).toBe(true);
      expect(istGueltigeQuelle(src), q).toBe(true);
      expect(istHerkunft(src), q).toBe(false);
      expect(src.length).toBeLessThanOrEqual(12);
      kennungen.add(kurz);
    }
    // Kein Kürzel doppelt, auch nicht mit den alten sieben.
    expect(kennungen.size).toBe(8);
    for (const alt of ["ak", "ha", "bo", "hp", "ko", "me", "qz"]) expect(kennungen.has(alt)).toBe(false);
    // Das Etikett: Konto-Freebies Standard, Anlagen-Freebies Depot mit dem Wort, das zum Freebie passt.
    expect(hinweisJeQuelle("vertrags-ampel")).toEqual({ ziel: "konto", etikett: ETIKETT });
    expect(hinweisJeQuelle("rizq")).toEqual({ ziel: "konto", etikett: ETIKETT });
    for (const q of ["gold-plan", "sukuk-plan", "portfolio-plan"] as const) expect(hinweisJeQuelle(q)).toEqual({ ziel: "invest", etikett: ETIKETT_PLAN });
    expect(hinweisJeQuelle("broker-vergleich")).toEqual({ ziel: "invest", etikett: ETIKETT_VERGLEICH });
    expect(ETIKETT_PLAN).toBe("passt zu deinem Plan");
    expect(ETIKETT_VERGLEICH).toBe("passt zu deinem Vergleich");
    // Nur die zwei diktierten Quellen tragen „passt zu deiner Liste“.
    const liste = (Object.keys(UEBERSCHRIFT) as CheckQuelle[]).filter((q) => hinweisJeQuelle(q).etikett === ETIKETT_LISTE);
    expect(liste.sort()).toEqual(["aktienliste", "halal-anlagen"]);
    expect(zielFrage("gold-plan").optionen.map((o) => [o.wert, o.etikett ?? null])).toEqual([["konto", null], ["invest", "passt zu deinem Plan"], ["unsicher", null]]);
    // Unbekannte Werte laufen weiter als „homepage“.
    expect(quelleAus("gold")).toBe("homepage");
  });

  it("Freebie-Adresse: quelle, start=2 und die Antwort auf „Was suchst du gerade?“, Bankname nie darin", () => {
    expect(checkEinstiegLink("boykottliste", "konto")).toBe("/check?quelle=boykottliste&start=2&a1=konto");
    expect(checkEinstiegLink("aktienliste", "invest")).toBe("/check?quelle=aktienliste&start=2&a1=invest");
    for (const art of [undefined, "konto", "depot"] as const) {
      expect(ersteAntwortAus(art, "konto")).toEqual({ ziel: "konto" });
      expect(ersteAntwortAus(art, "invest")).toEqual({ ziel: "invest" });
      expect(ersteAntwortAus(art, "unsicher")).toEqual({ ziel: "unsicher" });
      expect(ersteAntwortAus(art, "unsinn")).toEqual({});
      expect(ersteAntwortAus(art, null)).toEqual({});
    }
  });

  it("alte Freebie-Adressen laufen sinnvoll weiter: Zahlungsart führt zum Bankkonto-Weg, Erfahrung zu Depot und „Hast du schon ein Depot?“", () => {
    expect(ersteAntwortAus("konto", "bar")).toEqual({ art: "konto", zahlung: "bar" });
    expect(ersteAntwortAus("konto", "karte-bar")).toEqual({ art: "konto", zahlung: "karte-bar" });
    expect(ersteAntwortAus("depot", "keine")).toEqual({ ziel: "invest", hatDepot: "nein" });
    expect(ersteAntwortAus("depot", "erste")).toEqual({ ziel: "invest", hatDepot: "nein" });
    expect(ersteAntwortAus("depot", "depot")).toEqual({ ziel: "invest", hatDepot: "ja" });
    // Eine Antwort der anderen Art gilt nicht.
    expect(ersteAntwortAus("depot", "karte")).toEqual({});
    expect(ersteAntwortAus("konto", "erste")).toEqual({});
    expect(naechsteFrage(ersteAntwortAus("depot", "depot"))).toBe("depotHeute");
    expect(naechsteFrage(ersteAntwortAus("depot", "keine"))).toBe("praef");
    expect(naechsteFrage(ersteAntwortAus("konto", "karte"))).toBe("bank");
  });
});

describe("Ergebnis Bankkonto", () => {
  const sparkasse = { art: "konto", zahlung: "karte", bank: bank("grp-sparkasse") } as const;

  it("nur „Viel Bargeld, ich will in eine Filiale“ führt zur BBBank, alle anderen zur norisbank", () => {
    expect(konto({ ...sparkasse, zahlung: "karte" }).anbieter.out).toBe("norisbank");
    expect(konto({ ...sparkasse, zahlung: "karte-bar" }).anbieter.out).toBe("norisbank");
    expect(konto({ ...sparkasse, zahlung: "bar" }).anbieter.out).toBe("bbbank-bettersmart");
  });

  it("Überschrift wie im Original: „Dein Match: ein kostenloses Girokonto bei norisbank“, bei der BBBank „… bei der BBBank“, unabhängig von der heutigen Bank (Elias RN9-01)", () => {
    // Früher „Von der Sparkasse zur norisbank“; seit RN10 steht die Überschrift des Originals, die heutige Bank steht nur im Vergleich darunter.
    const noris = "Dein Match: ein kostenloses Girokonto bei norisbank";
    expect(konto(sparkasse).ueberschrift).toBe(noris);
    expect(konto({ ...sparkasse, bank: bank("deutsche-bank") }).ueberschrift).toBe(noris);
    expect(konto({ ...sparkasse, bank: bank("n26") }).ueberschrift).toBe(noris);
    expect(konto({ ...sparkasse, bank: KEINE_BANK }).ueberschrift).toBe(noris);
    expect(konto({ ...sparkasse, bank: freieWahl("Phantasiebank") }).ueberschrift).toBe(noris);
    const bb = "Dein Match: ein kostenloses Girokonto bei der BBBank";
    expect(konto({ ...sparkasse, bank: bank("grp-volksbank"), zahlung: "bar" }).ueberschrift).toBe(bb);
    expect(konto({ ...sparkasse, bank: KEINE_BANK, zahlung: "bar" }).ueberschrift).toBe(bb);
  });

  it("Konto-Ergebnis trägt satz, kartenTitel, preis „0 € im Monat“ und vorteile (Elias RN9-01)", () => {
    const e = konto(sparkasse);
    expect(e.satz).toContain("Du zahlst fast nur mit Karte.");
    expect(e.satz).toContain("norisbank");
    expect(konto({ ...sparkasse, zahlung: "bar" }).satz).toContain("BBBank");
    expect(e.kartenTitel).toBe("Girokonto ohne Zinsen auf dein Guthaben");
    expect(e.preis).toBe("0 € im Monat");
    expect(e.vorteile.length).toBeGreaterThanOrEqual(3);
    expect(leer(e.vorteile[0])).toMatch(/^0 € Kontoführung unter 30 oder ab 500 € Geldeingang im Monat, sonst 3,90 €/);
    expect(e.vorteile.every((v) => v.length > 5)).toBe(true);
  });

  it("vergleichTitel „<Bank> und norisbank im Vergleich“, bei freiem Text „Deine Bank und …“, bei „Noch kein Konto“ weder links noch Titel", () => {
    expect(konto(sparkasse).vergleichTitel).toBe("Sparkasse und norisbank im Vergleich");
    expect(konto({ ...sparkasse, bank: bank("deutsche-bank") }).vergleichTitel).toBe("Deutsche Bank und norisbank im Vergleich");
    expect(konto({ ...sparkasse, bank: bank("grp-volksbank"), zahlung: "bar" }).vergleichTitel).toBe("Volksbank und BBBank im Vergleich");
    expect(konto({ ...sparkasse, bank: freieWahl("Phantasiebank") }).vergleichTitel).toBe("Deine Bank und norisbank im Vergleich");
    const keine = konto({ ...sparkasse, bank: KEINE_BANK });
    expect(keine.links).toBeUndefined();
    expect(keine.vergleichTitel).toBeUndefined();
    expect(keine.rechts.name).toBe("norisbank");
  });

  it("links nur belegte Werte: Gruppen und freie Eingaben nie eine Zahl, belegte Banken „ab“ mit Produktnamen", () => {
    expect(konto(sparkasse).links?.zeilen[0].wert).toBe(KEIN_PREIS);
    expect(konto({ ...sparkasse, bank: bank("grp-volksbank") }).links?.zeilen[0].wert).toBe(KEIN_PREIS);
    expect(konto({ ...sparkasse, bank: freieWahl("Phantasiebank") }).links?.zeilen[0].wert).toBe(KEIN_PREIS);
    const ing = konto({ ...sparkasse, bank: bank("ing") }).links!;
    expect(leer(ing.zeilen[0].wert)).toBe("ab 0 €");
    expect(ing.produkt).toBe("Girokonto");
    expect(konto({ ...sparkasse, bank: bank("berliner-volksbank") }).links?.zeilen[0].wert.replace(/\u00a0/g, " ")).toBe("3,95 €");
    // Ohne belegten Preis keine Eröffnungszeile links, damit nirgends geraten wird.
    expect(konto(sparkasse).links?.zeilen).toHaveLength(1);
    expect(konto(sparkasse).rechts.zeilen).toHaveLength(1);
    expect(konto({ ...sparkasse, bank: bank("ing") }).rechts.zeilen.map((z) => z.label)).toEqual(["Kontoführung im Monat", "Eröffnung"]);
  });

  it("rechts die norisbank mit den Werten aus den Daten: 0 € unter 30 oder ab 500 € Geldeingang, sonst 3,90 €", () => {
    const r = konto(sparkasse).rechts;
    expect(r.name).toBe("norisbank");
    expect(r.zeilen[0].wert).toBe("0 €");
    expect(leer(r.zeilen[0].zusatz?.[0])).toBe("unter 30 oder ab 500 € Geldeingang im Monat, sonst 3,90 €");
  });

  it("genau ein Knopf, der Satz aus KONTO_PFLICHT, kein Depot, keine Alternative, keine Prozente", () => {
    const e = konto(sparkasse);
    expect(e.knopf).toBe("Konto eröffnen");
    expect(e.link).toBe("/out/norisbank?src=fcaknoa");
    expect(e.pflicht).toMatch(/Keine Zinsen auf dein Guthaben/);
    expect(e.pflicht).toMatch(/Tagesgeld/);
    const text = JSON.stringify(e);
    expect(text).not.toMatch(/flatex|Smartbroker|Depot|Alternative|Freitagsbrief|%|danach/i);
    expect(Object.keys(e)).not.toContain("passung");
    expect(Object.keys(e)).not.toContain("alternative");
    expect(Object.keys(e)).not.toContain("danach");
  });

  it("der Bankname steht nie im Link, nur im Zustand der Seite", () => {
    for (const b of [bank("grp-sparkasse"), bank("ing"), freieWahl("Meine Spezialbank 123"), KEINE_BANK]) {
      const e = konto({ art: "konto", zahlung: "karte", bank: b });
      expect(e.link).toMatch(/^\/out\/norisbank\?src=fcaknoa$/);
      expect(e.link).not.toMatch(/sparkasse|ing|spezial/i);
    }
  });

  it("wählt jemand die norisbank als heutige Bank: freundlicher Satz, kein Knopf, kein Link", () => {
    const e = konto({ art: "konto", zahlung: "karte", bank: bank("norisbank") });
    expect(e.schonDa).toBe(true);
    expect(e.ueberschrift).toBe("Du hast schon ein Konto ohne Zinsen auf dein Guthaben");
    expect(e.link).toBeUndefined();
    expect(e.knopf).toBe("");
    // Mit Filiale ist die BBBank die Empfehlung, die norisbank-Kundschaft bekommt dann das normale Ergebnis.
    const mitFiliale = konto({ art: "konto", zahlung: "bar", bank: bank("norisbank") });
    expect(mitFiliale.schonDa).toBe(false);
    expect(mitFiliale.ueberschrift).toBe("Dein Match: ein kostenloses Girokonto bei der BBBank");
    expect(mitFiliale.vergleichTitel).toBe("norisbank und BBBank im Vergleich");
  });

  it("BBBank zeigt die Startprämie aus den Daten, die norisbank keine", () => {
    expect(konto({ ...sparkasse, zahlung: "bar" }).praemie).toBe("50 € Startprämie für Neukunden".replace(" ", "\u00a0"));
    expect(konto(sparkasse).praemie).toBeUndefined();
  });

  it("jede Eingabe der Suche führt zu einem Ergebnis, auch Phantasiebank", () => {
    for (const eingabe of ["v", "s", "spk", "Sparkase", "Berliner Volksbank", "ing diba", "deutsche", "comdirekt", "Phantasiebank"]) {
      const wahl = suche(eingabe)[0].wahl;
      const e = konto({ art: "konto", zahlung: "karte-bar", bank: wahl });
      expect(e.rechts.name, eingabe).toBe("norisbank");
      expect(e.link, eingabe).toBeTruthy();
    }
  });
});

describe("Ergebnis Depot", () => {
  const ohne = (praef: "halal" | "kosten", extra: Antworten = {}): Antworten => ({ art: "depot", hatDepot: "nein", praef, anlage: praef === "halal" ? "etf" : "aktien", ...extra });
  const mit = (id: string, praef: "halal" | "kosten", extra: Antworten = {}): Antworten => ({
    art: "depot",
    hatDepot: "ja",
    depotHeute: heuteDepot(id),
    praef,
    anlage: "etf",
    ...extra,
  });

  it("Halal-Auswahl führt zu flatex, Kosten zu Smartbroker+, kein Girokonto-Kasten, keine Alternative, Art immer „depot“", () => {
    for (const anlage of ["etf", "aktien", "gold"] as const) {
      const halal = depot({ ...ohne("halal"), anlage });
      expect(halal.anbieter.out).toBe("flatex");
      expect(halal.art).toBe("depot");
      expect(halal.ueberschrift).toBe("Dein Match: ein Halal-Depot bei flatex");
      const kosten = depot({ ...ohne("kosten"), anlage });
      expect(kosten.anbieter.out).toBe("smartbroker");
      expect(kosten.art).toBe("depot");
      expect(kosten.ueberschrift).toBe("Dein Match: ein günstiges Halal-Depot bei Smartbroker+");
      for (const e of [halal, kosten]) {
        expect(e.knopf).toBe("Depot eröffnen");
        expect(e.schonDa).toBe(false);
        expect(e.satz.length).toBeGreaterThan(20);
        expect(Object.keys(e)).not.toContain("danach");
        expect(Object.keys(e)).not.toContain("alternative");
        expect(Object.keys(e)).not.toContain("warum");
        expect(JSON.stringify(e)).not.toMatch(/norisbank|Girokonto|Alternative|Zweitdepot/);
      }
    }
  });

  it("„Ja, ich habe schon ein Depot“ führt nicht zum Zweitdepot: dieselbe Zuordnung wie ohne Depot, Art „depot“, Knopf „Depot eröffnen“ (Elias RN9-03)", () => {
    // Früher: Erfahrung „depot“ gab ein Zweitdepot bei Smartbroker+. Jetzt zählt auch hier „Was ist dir wichtiger?“.
    const halal = depot(mit("trade-republic-depot", "halal"));
    expect(halal.art).toBe("depot");
    expect(halal.anbieter.out).toBe("flatex");
    expect(halal.knopf).toBe("Depot eröffnen");
    const kosten = depot(mit("trade-republic-depot", "kosten"));
    expect(kosten.art).toBe("depot");
    expect(kosten.anbieter.out).toBe("smartbroker");
    expect(kosten.knopf).toBe("Depot eröffnen");
    for (const e of [halal, kosten]) expect(JSON.stringify(e)).not.toMatch(/zweitdepot/i);
  });

  it("ist das heutige Depot schon das Match: schonDa, „Dein Depot bei <Name> passt schon“, keine Spalten", () => {
    const fl = depot(mit("flatex-depot", "halal"));
    expect(fl.schonDa).toBe(true);
    expect(fl.ueberschrift).toBe("Dein Depot bei flatex passt schon");
    expect(fl.links).toBeUndefined();
    expect(fl.rechts).toBeUndefined();
    expect(fl.vergleichTitel).toBeUndefined();
    const sb = depot(mit("smartbroker-plus-depot", "kosten"));
    expect(sb.schonDa).toBe(true);
    expect(sb.ueberschrift).toBe("Dein Depot bei Smartbroker+ passt schon");
    // Das andere der beiden Depots ist nicht das Match: normales Ergebnis mit Vergleich.
    const andersrum = depot(mit("flatex-depot", "kosten"));
    expect(andersrum.schonDa).toBe(false);
    expect(andersrum.anbieter.out).toBe("smartbroker");
    expect(andersrum.vergleichTitel).toBe("flatex und Smartbroker+ im Vergleich");
  });

  it("anderes Depot von heute: links heute, rechts Match, Zeilen wie im Vergleich, Titel „<Depot> und <Match> im Vergleich“", () => {
    const e = depot(mit("trade-republic-depot", "halal"));
    expect(e.schonDa).toBe(false);
    expect(e.vergleichTitel).toBe("Trade Republic und flatex im Vergleich");
    expect(e.links?.name).toBe("Trade Republic");
    expect(e.rechts?.name).toBe("flatex");
    const labels = ["Passt zu deinen Antworten", "Halal-ETFs und Fonds", "Gold und Silber", "Sukuk", "Depotgebühr", "Order", "Sparplan ab", "Guthaben"];
    expect(e.links?.zeilen.map((z) => z.label)).toEqual(labels);
    expect(e.rechts?.zeilen.map((z) => z.label)).toEqual(labels);
    // Rechts steht die Passung des Matches, links das heutige Depot hat Werte aus dem Vergleich.
    expect(e.rechts?.zeilen[0].wert).toBe(`${e.passung} %`);
    expect(e.links?.zeilen[0].wert).toMatch(/^\d+ %$/);
    expect(Number(e.links!.zeilen[0].wert.replace(" %", ""))).toBeLessThanOrEqual(PASSUNG_MAX);
    // Rechts stehen die Werte der Brokerkarte.
    expect(e.rechts?.zeilen[1].wert).toBe(FL.etfs);
    expect(e.rechts?.zeilen[4].wert).toBe(FL.depotgebuehr);
    // Kosten-Match: Smartbroker+ rechts.
    const k = depot(mit("trade-republic-depot", "kosten"));
    expect(k.vergleichTitel).toBe("Trade Republic und Smartbroker+ im Vergleich");
    expect(k.rechts?.zeilen[5].wert).toBe(SB.order);
  });

  it("unbekannte Depots (Sparkasse-Gruppe, Volksbank, freier Text) zeigen „–“, nie eine Zahl", () => {
    for (const heute of [heuteDepot("grp-sparkasse"), heuteDepot("grp-volksbank"), heuteDepot("grp-deutsche-bank"), freieDepotWahl("Phantasiedepot")]) {
      const e = depot({ art: "depot", hatDepot: "ja", depotHeute: heute, praef: "halal", anlage: "etf" });
      expect(e.links?.zeilen).toHaveLength(8);
      for (const z of e.links!.zeilen) expect(z.wert, `${heute.name} ${z.label}`).toBe(KEIN_WERT);
      expect(KEIN_WERT).toBe("–");
      // Das Match rechts hat dagegen echte Werte und eine Passung.
      expect(e.rechts?.zeilen[0].wert).toMatch(/^\d+ %$/);
    }
    const frei = depot({ art: "depot", hatDepot: "ja", depotHeute: freieDepotWahl("Phantasiedepot"), praef: "halal", anlage: "etf" });
    expect(frei.vergleichTitel).toBe("Dein Depot und flatex im Vergleich");
    expect(frei.links?.name).toBe("Phantasiedepot");
    expect(depotWerte(freieDepotWahl("x"))).toBeNull();
    expect(depotWerte(heuteDepot("grp-sparkasse"))).toBeNull();
  });

  it("ohne heutiges Depot (Antwort „Nein, noch nicht“) keine Spalten und kein Vergleichstitel", () => {
    const e = depot(ohne("halal"));
    expect(e.links).toBeUndefined();
    expect(e.rechts).toBeUndefined();
    expect(e.vergleichTitel).toBeUndefined();
  });

  it("flatex nennt den Kreditrahmen, Smartbroker+ hat keine Pflicht, auch auf dem Depot-Weg", () => {
    expect(depot(ohne("halal")).pflicht).toMatch(/Kreditrahmen/);
    expect(depot(ohne("kosten")).pflicht).toBeUndefined();
    expect(depot(mit("trade-republic-depot", "halal")).pflicht).toMatch(/Kreditrahmen/);
  });

  it("vorteile: das gewählte Thema steht zuerst, höchstens vier, keine Doppelten, nur Werte aus dem Vergleich (RN10-07)", () => {
    const fl = (anlage: Antworten["anlage"]) => depot({ ...ohne("halal"), anlage }).vorteile;
    expect(fl("etf")[0]).toBe(`${FL.etfs} Halal-ETFs und Fonds aus meinem Vergleich`);
    expect(fl("aktien")[0]).toBe(`Order ${FL.order}`);
    expect(fl("gold")[0]).toMatch(/^Royal Mint Gold-ETC/);
    expect(fl("gold")[1]).toBe(`Gold und Silber ${FL.gold}`);
    const sb = (anlage: Antworten["anlage"]) => depot({ ...ohne("kosten"), anlage }).vorteile;
    expect(sb("etf")[0]).toBe(`${SB.etfs} Halal-ETFs und Fonds aus meinem Vergleich`);
    expect(sb("aktien")[0]).toBe(`Order ${SB.order}`);
    expect(sb("gold")[1]).toBe(`Gold und Silber ${SB.gold}`);
    for (const anlage of ["etf", "aktien", "gold"] as const) {
      for (const praef of ["halal", "kosten"] as const) {
        const v = depot({ ...ohne(praef), anlage }).vorteile;
        expect(v.length).toBeLessThanOrEqual(4);
        expect(v.length).toBeGreaterThanOrEqual(3);
        expect(new Set(v).size).toBe(v.length);
        expect(v.some((x) => /undefined|NaN/.test(x))).toBe(false);
      }
    }
    // Das Thema steht auch im Satz.
    expect(depot(ohne("halal", { anlage: "etf" })).satz).toContain("in ETFs investieren");
    expect(depot(ohne("kosten", { anlage: "aktien" })).satz).toContain("einzelne Aktien kaufen");
    expect(depot(ohne("halal", { anlage: "gold" })).satz).toContain("in Gold und Silber investieren");
  });

  it("Royal Mint (zertifiziert, auslieferbar) nur dort, wo anlagenKaufbar.ts den Kauf mit Anbieter-Beleg zeigt", () => {
    // Beide Häuser tragen im Datenbestand einen Einzelbeleg für XS2115336336; fehlt er, fällt die Zeile weg (nie ohne Beleg).
    expect(royalMintKaufbar("fl")).toBe(true);
    expect(royalMintKaufbar("sb")).toBe(true);
    for (const praef of ["halal", "kosten"] as const) {
      expect(depot(ohne(praef, { anlage: "gold" })).vorteile.filter((v) => /Royal Mint/.test(v))).toHaveLength(1);
      for (const anlage of ["etf", "aktien"] as const) expect(depot(ohne(praef, { anlage })).vorteile.join(" ")).not.toMatch(/Royal Mint/);
    }
  });

  it("Beides geht in den Bankkonto-Weg: Konto-Ergebnis ohne Depot", () => {
    const e = konto({ ziel: "beides", zahlung: "karte", bank: bank("ing") });
    expect(e.art).toBe("konto");
    expect(JSON.stringify(e)).not.toMatch(/flatex|Depot/i);
  });
});

describe("Passung in Prozent (RN8-03), berechnet und nie fest", () => {
  const ohneD = (praef: "halal" | "kosten"): Antworten => ({ art: "depot", hatDepot: "nein", praef });
  const a = (praef: "halal" | "kosten", extra: Antworten = {}): Antworten => ({ art: "depot", hatDepot: "nein", praef, ...extra });

  it("Halal-Anlagen wichtig: flatex höher als Smartbroker+; Kosten wichtig: umgekehrt", () => {
    expect(passungProzent(FL, a("halal"))).toBeGreaterThan(passungProzent(SB, a("halal")));
    expect(passungProzent(SB, a("kosten"))).toBeGreaterThan(passungProzent(FL, a("kosten")));
    for (const betrag of ["unter50", "50bis200", "ueber200"] as const) {
      expect(passungProzent(FL, a("halal", { betrag }))).toBeGreaterThan(passungProzent(SB, a("halal", { betrag })));
      expect(passungProzent(SB, a("kosten", { betrag }))).toBeGreaterThan(passungProzent(FL, a("kosten", { betrag })));
    }
  });

  it("das empfohlene Depot trägt die Zahl, gerundet, höchstens 98, nie 100, auf beiden Wegen und bei jeder Anlage", () => {
    for (const praef of ["halal", "kosten"] as const) {
      for (const anlage of ["etf", "aktien", "gold"] as const) {
        const e = depot({ art: "depot", hatDepot: "nein", praef, anlage });
        expect(Number.isInteger(e.passung), `${praef} ${anlage}`).toBe(true);
        expect(e.passung).toBeLessThanOrEqual(PASSUNG_MAX);
        expect(e.passung, `${praef} ${anlage}`).toBeGreaterThan(50);
        const m = depot({ art: "depot", hatDepot: "ja", depotHeute: heuteDepot("trade-republic-depot"), praef, anlage });
        expect(Number.isInteger(m.passung)).toBe(true);
        expect(m.passung).toBeLessThanOrEqual(98);
        expect(m.passung).toBeGreaterThan(50);
      }
    }
    expect(PASSUNG_MAX).toBe(98);
  });

  it("die Anlage ändert die Gewichte (Elias RN10-07): ETFs heben flatex (12 von 12), Einzelaktien die Order, Gold den Edelmetall-Anteil, nie das Depot selbst", () => {
    const mitAnlage = (praef: "halal" | "kosten", anlage: Antworten["anlage"]) => a(praef, { anlage });
    // ETFs: der Halal-ETF-Anteil zählt, flatex hat 12 von 12, Smartbroker+ 8 von 12: der Abstand wächst gegenüber dem Standard.
    const abstand = (anl: Antworten["anlage"]) => passungProzent(FL, mitAnlage("halal", anl)) - passungProzent(SB, mitAnlage("halal", anl));
    expect(abstand("etf")).toBeGreaterThan(abstand(undefined));
    // Einzelaktien: die Order zählt, Smartbroker+ (1 €) gewinnt gegenüber flatex (ab 5,90 €) an Boden.
    const abstandKosten = (anl: Antworten["anlage"]) => passungProzent(SB, mitAnlage("kosten", anl)) - passungProzent(FL, mitAnlage("kosten", anl));
    expect(abstandKosten("aktien")).toBeGreaterThan(abstandKosten(undefined));
    // Gold: flatex und Smartbroker+ haben beide 7 von 7, das Gold-Gewicht trennt sie nicht, es hebt beide gegenüber dem Standard.
    expect(passungProzent(FL, mitAnlage("halal", "gold"))).toBeGreaterThan(passungProzent(FL, mitAnlage("halal", undefined)));
    expect(FL.gold).toBe(SB.gold);
    // Dieselben Antworten ohne und mit Anlage rechnen anders, verschiedene Anlagen geben nicht überall dieselbe Zahl.
    const zahlen = (["etf", "aktien", "gold"] as const).map((x) => passungProzent(SB, mitAnlage("halal", x)));
    expect(new Set(zahlen).size).toBeGreaterThan(1);
    expect(zahlen.some((z) => z !== passungProzent(SB, mitAnlage("halal", undefined)))).toBe(true);
    // Das Depot bleibt, wie die Anlage auch fällt: „Was ist dir wichtiger?“ entscheidet.
    for (const x of ["etf", "aktien", "gold"] as const) {
      expect(depot({ ...ohneD("halal"), anlage: x }).anbieter.out).toBe("flatex");
      expect(depot({ ...ohneD("kosten"), anlage: x }).anbieter.out).toBe("smartbroker");
    }
  });

  it("Das Match bleibt von „Was ist dir wichtiger?“ bestimmt; bei Halal plus Einzelne Aktien oder Gold rechnet Smartbroker+ knapp höher, das Depot bleibt flatex (offen für Elias)", () => {
    // Kosten: Smartbroker+ liegt in jeder Anlage vor flatex. Halal: flatex liegt bei ETFs vor Smartbroker+ (12 von 12 gegen 8 von 12 ETFs).
    for (const x of ["etf", "aktien", "gold"] as const) {
      const k = a("kosten", { anlage: x });
      expect(passungProzent(SB, k), `kosten ${x}`).toBeGreaterThan(passungProzent(FL, k));
    }
    const he = a("halal", { anlage: "etf" });
    expect(passungProzent(FL, he)).toBeGreaterThan(passungProzent(SB, he));
    // Halal plus Einzelne Aktien oder Gold: die Order (flatex ab 5,90 €, Smartbroker+ 1 €) und das gleiche Gold (7 von 7 bei beiden) ziehen
    // Smartbroker+ knapp vorbei. Der Abstand ist klein (höchstens 5 Punkte), die Zuordnung folgt weiter der Wahl „Möglichst viele
    // Halal-Anlagen“ (Elias RN7: flatex Nummer 1, flatex hat die größte Halal-Auswahl).
    for (const x of ["aktien", "gold"] as const) {
      const ha = a("halal", { anlage: x });
      expect(Math.abs(passungProzent(SB, ha) - passungProzent(FL, ha)), `halal ${x}`).toBeLessThanOrEqual(5);
      expect(depot(ha).anbieter.out).toBe("flatex");
    }
  });

  it("passungAusWerten rechnet die Werte eines fremden Depots wie die einer Karte, höchstens 98", () => {
    const w = depotWerte(heuteDepot("trade-republic-depot"))!;
    const p = passungAusWerten(w, a("halal", { hatDepot: "ja", anlage: "etf" }));
    expect(Number.isInteger(p)).toBe(true);
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThanOrEqual(PASSUNG_MAX);
    // Gleiche Werte wie die Karte: gleiche Zahl.
    const fw = depotWerte(heuteDepot("flatex-depot"))!;
    expect(passungAusWerten(fw, a("halal"))).toBe(passungProzent(FL, a("halal")));
  });

  it("die Zahl folgt den Antworten und den Vergleichsdaten: eine kleine Monatsrate verteuert die Order bei flatex", () => {
    const klein = passungProzent(FL, a("halal", { betrag: "unter50" }));
    const gross = passungProzent(FL, a("halal", { betrag: "ueber200" }));
    expect(klein).toBeLessThan(gross);
    // Gleiche Antworten, gleiche Zahl; andere Antworten, andere Zahl.
    expect(passungProzent(FL, a("halal"))).toBe(passungProzent(FL, a("halal")));
    expect(passungProzent(FL, a("halal"))).not.toBe(passungProzent(FL, a("kosten")));
  });

  it("Fassung b: der Monatsbetrag ändert das Depot nicht, aber die Passung", () => {
    const basis = { art: "depot", hatDepot: "nein", praef: "halal", anlage: "aktien" } as const;
    const e1 = depot({ ...basis, betrag: "unter50" }, true);
    const e2 = depot({ ...basis, betrag: "ueber200" }, true);
    expect(e1.anbieter.out).toBe(e2.anbieter.out);
    expect(e1.satz).toBe(e2.satz);
    expect(e1.vorteile).toEqual(e2.vorteile);
    expect(e1.passung).toBeLessThan(e2.passung);
    expect(antwortZeilen({ ...basis, betrag: "50bis200" })).toContain("50 bis 200 € im Monat");
    // Die gewählte Anlage und die Depot-Antwort stehen auch bei „Deine Antworten“.
    expect(antwortZeilen(basis)).toContain(ANLAGE_TEXT.aktien);
    expect(antwortZeilen(basis)).toContain("Noch kein Depot");
    expect(antwortZeilen({ ...basis, hatDepot: "ja", depotHeute: heuteDepot("ing-direkt-depot") })).toEqual(["Schon ein Depot", "Depot bei ING", "Viele Halal-Anlagen", "Einzelne Aktien"]);
  });

  it("Bankkonto-Ergebnisse tragen keine Prozentzahl", () => {
    expect(JSON.stringify(konto({ art: "konto", zahlung: "karte", bank: bank("ing") }))).not.toMatch(/passung|%/);
  });
});

describe("Kennung am Knopf", () => {
  it("Knöpfe gehen über /out mit gültiger Kennung, die Fassung steht am Ende (Kennungen unverändert)", () => {
    const e = konto({ art: "konto", zahlung: "karte", bank: bank("ing") });
    expect(outLink("aktienliste", e.anbieter)).toBe("/out/norisbank?src=fcaknoa");
    expect(outLink("aktienliste", e.anbieter, "b")).toBe("/out/norisbank?src=fcaknob");
    expect(durchB({ art: "depot", hatDepot: "nein", praef: "kosten", anlage: "aktien", betrag: "unter50" })).toMatchObject({ link: "/out/smartbroker?src=fcaksbb" });
    for (const src of ["fcakno", "fcakflz", "fchpsb", "fcbobb", "fcakfla", "fcaknob", "fcakflzb", "fcqzsbxa"]) {
      expect(CHECK_SRC.test(src)).toBe(true);
      expect(istGueltigeQuelle(src)).toBe(true);
      expect(istHerkunft(src)).toBe(false);
    }
  });

  it("Die Kennung der Fassung ist je Fassung unterscheidbar, die Quelle steckt nur in der Kennung", () => {
    const basis = { art: "depot", hatDepot: "nein", praef: "halal", anlage: "gold" } as const;
    const a = depot(basis);
    const b = depot({ ...basis, betrag: "50bis200" }, true);
    expect(outLink("homepage", a.anbieter, "a")).toMatch(/src=fchpfla$/);
    expect(outLink("homepage", b.anbieter, "b")).toMatch(/src=fchpflb$/);
    const ak = ergebnisAus(basis, "aktienliste") as DepotErgebnis;
    const bo = ergebnisAus(basis, "boykottliste") as DepotErgebnis;
    expect(ak.satz).toBe(bo.satz);
    expect(ak.vorteile).toEqual(bo.vorteile);
    expect(ak.passung).toBe(bo.passung);
  });

  it("auch auf dem Depot-Weg mit heutigem Depot bleibt die Kennung gleich, das heutige Depot steckt nie darin", () => {
    const e = depot({ art: "depot", hatDepot: "ja", depotHeute: heuteDepot("trade-republic-depot"), praef: "halal", anlage: "etf" });
    expect(e.link).toBe("/out/flatex?src=fcakfla");
    expect(e.link).not.toMatch(/trade|republic/i);
  });
});
