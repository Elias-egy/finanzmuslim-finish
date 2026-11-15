import { describe, expect, it } from "vitest";
import {
  ANGEBOTE_GETESTET,
  ART_JE_QUELLE,
  CHECK_SRC,
  EIGENSCHAFT_TEXT,
  ETIKETT,
  FRAGEN,
  KEIN_PREIS,
  KEIN_WERT,
  PASSUNG_MAX,
  antwortZeilen,
  artVon,
  checkEinstiegLink,
  eigenschaftenFuer,
  ergebnisAus,
  ersteAntwortAus,
  frageFuer,
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
    expect(naechsteFrage({ ziel: "invest" })).toBe("erfahrung");
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

  it("Depot-Check (RN10): Erfahrung, nur bei „schon ein Depot“ „Wo hast du dein Depot?“, dann „Was ist dir wichtiger?“, die Eigenschaft in der Mitte, in Fassung b zuletzt der Monatsbetrag", () => {
    // Elias RN9-03: nach „Ich habe schon ein Depot“ kommt „Wo hast du dein Depot?“; RN9-04: die Frage nach der wichtigsten Eigenschaft steht in der Mitte.
    const d: Antworten = { art: "depot" };
    expect(naechsteFrage(d)).toBe("erfahrung");
    expect(naechsteFrage({ ...d, erfahrung: "keine" })).toBe("praef");
    expect(naechsteFrage({ ...d, erfahrung: "erste" })).toBe("praef");
    expect(naechsteFrage({ ...d, erfahrung: "erste", praef: "halal" })).toBe("eigenschaft");
    expect(naechsteFrage({ ...d, erfahrung: "erste", praef: "halal", eigenschaft: "sparplan" })).toBeNull();
    // Nur der Weg „schon ein Depot“ fragt nach dem heutigen Depot, vor „Was ist dir wichtiger?“.
    expect(naechsteFrage({ ...d, erfahrung: "depot" })).toBe("depotHeute");
    expect(naechsteFrage({ ...d, erfahrung: "depot", depotHeute: heuteDepot("trade-republic-depot") })).toBe("praef");
    expect(naechsteFrage({ ...d, erfahrung: "depot", depotHeute: heuteDepot("trade-republic-depot"), praef: "kosten" })).toBe("eigenschaft");
    expect(naechsteFrage({ ...d, erfahrung: "depot", depotHeute: freieDepotWahl("Mein Depot"), praef: "kosten", eigenschaft: "wechsel" })).toBeNull();
    for (const erfahrung of ["keine", "erste"] as const) expect(naechsteFrage({ ...d, erfahrung, depotHeute: undefined })).not.toBe("depotHeute");
    // Fassung b: der Monatsbetrag kommt zuletzt, auf beiden Wegen.
    expect(naechsteFrage({ ...d, erfahrung: "keine", praef: "halal", eigenschaft: "gebuehr" }, "b")).toBe("betrag");
    const mitDepot: Antworten = { ...d, erfahrung: "depot", depotHeute: heuteDepot("ing-direkt-depot"), praef: "halal", eigenschaft: "wechsel" };
    expect(naechsteFrage(mitDepot, "b")).toBe("betrag");
    expect(naechsteFrage({ ...mitDepot, betrag: "unter50" }, "b")).toBeNull();
    expect(naechsteFrage({ ...d, erfahrung: "keine", praef: "halal", eigenschaft: "gebuehr", betrag: "unter50" }, "b")).toBeNull();
    // Fragenzahl: drei ohne Depot, vier mit Depot, in Fassung b eine mehr; mit der ersten Frage („ziel“) noch eine.
    expect(fragenGesamt(d)).toBe(3);
    expect(fragenGesamt({ ...d, erfahrung: "depot" })).toBe(4);
    expect(fragenGesamt(d, "b")).toBe(4);
    expect(fragenGesamt({ ...d, erfahrung: "depot" }, "b")).toBe(5);
    expect(fragenGesamt({ ziel: "invest" })).toBe(4);
    expect(fragenGesamt({ ziel: "invest", erfahrung: "depot" })).toBe(5);
    expect(fragenGesamt({ ziel: "invest", erfahrung: "depot" }, "b")).toBe(6);
    // Der Depot-Weg fragt nie nach der Bank oder der Zahlung.
    for (const a of [d, { ...d, erfahrung: "keine" as const }, { ...d, erfahrung: "keine" as const, praef: "kosten" as const }]) {
      expect(naechsteFrage(a, "b")).not.toBe("bank");
      expect(naechsteFrage(a, "b")).not.toBe("zahlung");
    }
    expect(FRAGEN.betrag.titel).toBe("Wie viel möchtest du im Monat anlegen?");
    expect(FRAGEN.erfahrung.titel).toBe("Wie viel Erfahrung hast du mit dem Investieren?");
    expect(FRAGEN.depotHeute.titel).toBe("Wo hast du dein Depot?");
    expect(FRAGEN.praef.titel).toBe("Was ist dir wichtiger?");
    expect(FRAGEN.eigenschaft.titel).toBe("Welche dieser drei Eigenschaften ist dir am wichtigsten?");
  });

  it("Eigenschaften (Elias RN9-04): drei je Weg, ohne Depot nie „Wechsel“, mit Depot steht „Wechsel“ zuerst", () => {
    for (const erfahrung of ["keine", "erste"] as const) {
      for (const praef of ["halal", "kosten"] as const) {
        const e = eigenschaftenFuer({ art: "depot", erfahrung, praef });
        expect(e).toHaveLength(3);
        expect(e).not.toContain("wechsel");
      }
    }
    for (const praef of ["halal", "kosten"] as const) {
      const e = eigenschaftenFuer({ art: "depot", erfahrung: "depot", praef });
      expect(e).toHaveLength(3);
      expect(e[0]).toBe("wechsel");
    }
    expect(eigenschaftenFuer({ art: "depot", erfahrung: "keine", praef: "halal" })).toEqual(["gold-sukuk", "sparplan", "gebuehr"]);
    expect(eigenschaftenFuer({ art: "depot", erfahrung: "keine", praef: "kosten" })).toEqual(["gebuehr", "order", "sparplan"]);
    // Die Frage trägt die Antworten des Wegs mit ihrem Text.
    const frage = frageFuer("eigenschaft", { art: "depot", erfahrung: "depot", praef: "kosten" });
    expect(frage.optionen.map((o) => o.wert)).toEqual(["wechsel", "gebuehr", "order"]);
    expect(frage.optionen.map((o) => o.titel)).toEqual(frage.optionen.map((o) => EIGENSCHAFT_TEXT[o.wert as keyof typeof EIGENSCHAFT_TEXT]));
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

  it("Etikett heißt „am beliebtesten“, nur an „Neues Bankkonto“ (Elias RN8-06)", () => {
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

  it("Freebie-Adresse: art, quelle, start=2 und die erste Antwort, Bankname nie darin", () => {
    expect(checkEinstiegLink("konto", "boykottliste", "karte")).toBe("/check?art=konto&quelle=boykottliste&start=2&a1=karte");
    expect(checkEinstiegLink("depot", "aktienliste", "keine")).toBe("/check?art=depot&quelle=aktienliste&start=2&a1=keine");
    expect(ersteAntwortAus("konto", "bar")).toEqual({ art: "konto", zahlung: "bar" });
    expect(ersteAntwortAus("depot", "erste")).toEqual({ art: "depot", erfahrung: "erste" });
    expect(ersteAntwortAus("konto", "unsinn")).toEqual({});
    expect(ersteAntwortAus("depot", "karte")).toEqual({});
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
  const ohne = (praef: "halal" | "kosten", extra: Antworten = {}): Antworten => ({ art: "depot", erfahrung: "keine", praef, eigenschaft: praef === "halal" ? "gold-sukuk" : "gebuehr", ...extra });
  const mit = (id: string, praef: "halal" | "kosten", extra: Antworten = {}): Antworten => ({
    art: "depot",
    erfahrung: "depot",
    depotHeute: heuteDepot(id),
    praef,
    eigenschaft: "wechsel",
    ...extra,
  });

  it("Halal-Auswahl führt zu flatex, Kosten zu Smartbroker+, kein Girokonto-Kasten, keine Alternative, Art immer „depot“", () => {
    for (const erfahrung of ["keine", "erste"] as const) {
      const halal = depot({ ...ohne("halal"), erfahrung });
      expect(halal.anbieter.out).toBe("flatex");
      expect(halal.art).toBe("depot");
      expect(halal.ueberschrift).toBe("Dein Match: ein Halal-Depot bei flatex");
      const kosten = depot({ ...ohne("kosten"), erfahrung });
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

  it("„Ich habe schon ein Depot“ führt nicht mehr zum Zweitdepot: dieselbe Zuordnung wie ohne Depot, Art „depot“, Knopf „Depot eröffnen“ (Elias RN9-03)", () => {
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
      const e = depot({ art: "depot", erfahrung: "depot", depotHeute: heute, praef: "halal", eigenschaft: "wechsel" });
      expect(e.links?.zeilen).toHaveLength(8);
      for (const z of e.links!.zeilen) expect(z.wert, `${heute.name} ${z.label}`).toBe(KEIN_WERT);
      expect(KEIN_WERT).toBe("–");
      // Das Match rechts hat dagegen echte Werte und eine Passung.
      expect(e.rechts?.zeilen[0].wert).toMatch(/^\d+ %$/);
    }
    const frei = depot({ art: "depot", erfahrung: "depot", depotHeute: freieDepotWahl("Phantasiedepot"), praef: "halal", eigenschaft: "wechsel" });
    expect(frei.vergleichTitel).toBe("Dein Depot und flatex im Vergleich");
    expect(frei.links?.name).toBe("Phantasiedepot");
    expect(depotWerte(freieDepotWahl("x"))).toBeNull();
    expect(depotWerte(heuteDepot("grp-sparkasse"))).toBeNull();
  });

  it("ohne heutiges Depot (Erfahrung „keine“ oder „erste“) keine Spalten und kein Vergleichstitel", () => {
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

  it("vorteile: die gewählte Eigenschaft steht zuerst, höchstens vier, keine Doppelten", () => {
    const fl = (eigenschaft: Antworten["eigenschaft"]) => depot({ ...ohne("halal"), eigenschaft }).vorteile;
    expect(fl("sparplan")[0]).toBe(`Sparplan ab ${FL.sparplanAb}`);
    expect(fl("gebuehr")[0]).toBe(`${FL.depotgebuehr} Depotgebühr`);
    expect(fl("gold-sukuk")[0]).toBe(`Gold und Silber ${FL.gold}, Sukuk ${FL.sukuk}`);
    const sb = (eigenschaft: Antworten["eigenschaft"]) => depot({ ...ohne("kosten"), eigenschaft }).vorteile;
    expect(sb("order")[0]).toBe(`Order ${SB.order}`);
    expect(sb("gebuehr")[0]).toBe(`${SB.depotgebuehr} Depotgebühr`);
    // „Wechsel“ nur auf dem Weg mit Depot, mit dem Übertrag-Beleg aus brokerStart.ts.
    expect(depot(mit("trade-republic-depot", "halal")).vorteile[0]).toMatch(/Übertrag/);
    expect(depot(mit("trade-republic-depot", "kosten")).vorteile[0]).toMatch(/Übertrag/);
    for (const e of ["gold-sukuk", "sparplan", "gebuehr", "order"] as const) {
      for (const praef of ["halal", "kosten"] as const) {
        const v = depot({ ...ohne(praef), eigenschaft: e }).vorteile;
        expect(v.length).toBeLessThanOrEqual(4);
        expect(v.length).toBeGreaterThanOrEqual(3);
        expect(new Set(v).size).toBe(v.length);
      }
    }
  });

  it("Beides geht in den Bankkonto-Weg: Konto-Ergebnis ohne Depot", () => {
    const e = konto({ ziel: "beides", zahlung: "karte", bank: bank("ing") });
    expect(e.art).toBe("konto");
    expect(JSON.stringify(e)).not.toMatch(/flatex|Depot/i);
  });
});

describe("Passung in Prozent (RN8-03), berechnet und nie fest", () => {
  const ohneD = (praef: "halal" | "kosten"): Antworten => ({ art: "depot", erfahrung: "keine", praef });
  const a = (praef: "halal" | "kosten", extra: Antworten = {}): Antworten => ({ art: "depot", erfahrung: "keine", praef, ...extra });

  it("Halal-Anlagen wichtig: flatex höher als Smartbroker+; Kosten wichtig: umgekehrt", () => {
    expect(passungProzent(FL, a("halal"))).toBeGreaterThan(passungProzent(SB, a("halal")));
    expect(passungProzent(SB, a("kosten"))).toBeGreaterThan(passungProzent(FL, a("kosten")));
    for (const betrag of ["unter50", "50bis200", "ueber200"] as const) {
      expect(passungProzent(FL, a("halal", { betrag }))).toBeGreaterThan(passungProzent(SB, a("halal", { betrag })));
      expect(passungProzent(SB, a("kosten", { betrag }))).toBeGreaterThan(passungProzent(FL, a("kosten", { betrag })));
    }
  });

  it("das empfohlene Depot trägt die Zahl, gerundet, höchstens 98, nie 100, auf beiden Wegen", () => {
    for (const praef of ["halal", "kosten"] as const) {
      for (const erfahrung of ["keine", "erste"] as const) {
        for (const eigenschaft of eigenschaftenFuer({ art: "depot", erfahrung, praef })) {
          const e = depot({ art: "depot", erfahrung, praef, eigenschaft });
          expect(Number.isInteger(e.passung), `${praef} ${eigenschaft}`).toBe(true);
          expect(e.passung).toBeLessThanOrEqual(PASSUNG_MAX);
          expect(e.passung).toBeGreaterThan(50);
        }
      }
      for (const eigenschaft of eigenschaftenFuer({ art: "depot", erfahrung: "depot", praef })) {
        const e = depot({ art: "depot", erfahrung: "depot", depotHeute: heuteDepot("trade-republic-depot"), praef, eigenschaft });
        expect(Number.isInteger(e.passung)).toBe(true);
        expect(e.passung).toBeLessThanOrEqual(98);
        expect(e.passung).toBeGreaterThan(50);
      }
    }
    expect(PASSUNG_MAX).toBe(98);
  });

  it("die Eigenschaft ändert die Gewichte (Elias RN9-04): sie hebt das Depot, das in ihr stark ist, nie das Depot selbst", () => {
    const basis = (praef: "halal" | "kosten", eigenschaft: Antworten["eigenschaft"]) => a(praef, { eigenschaft });
    // Gold und Sukuk wiegt bei flatex (viel Halal-Auswahl) mehr als bei Smartbroker+.
    const abstandHalal = (e: Antworten["eigenschaft"]) => passungProzent(FL, basis("halal", e)) - passungProzent(SB, basis("halal", e));
    expect(abstandHalal("gold-sukuk")).toBeGreaterThan(0);
    // Dieselben Antworten ohne und mit Eigenschaft rechnen anders, mindestens eine Eigenschaft verschiebt die Zahl.
    const ohneE = passungProzent(SB, a("kosten"));
    const verschoben = (["gebuehr", "order", "sparplan", "gold-sukuk"] as const).some((e) => passungProzent(SB, basis("kosten", e)) !== ohneE);
    expect(verschoben).toBe(true);
    // Unterschiedliche Eigenschaften geben nicht überall dieselbe Zahl.
    const zahlen = (["gold-sukuk", "sparplan", "gebuehr", "order"] as const).map((e) => passungProzent(FL, basis("halal", e)));
    expect(new Set(zahlen).size).toBeGreaterThan(1);
    // Das Depot bleibt, wie die Eigenschaft auch fällt.
    for (const e of ["gold-sukuk", "sparplan", "gebuehr"] as const) expect(depot({ ...ohneD("halal"), eigenschaft: e }).anbieter.out).toBe("flatex");
    for (const e of ["gebuehr", "order", "sparplan"] as const) expect(depot({ ...ohneD("kosten"), eigenschaft: e }).anbieter.out).toBe("smartbroker");
    // „Wechsel“ legt Gewicht auf Halal und ohne Zinsen: flatex bleibt vor Smartbroker+ bei „Halal“.
    expect(passungProzent(FL, a("halal", { erfahrung: "depot", eigenschaft: "wechsel" }))).toBeGreaterThan(
      passungProzent(SB, a("halal", { erfahrung: "depot", eigenschaft: "wechsel" })),
    );
  });

  it("passungAusWerten rechnet die Werte eines fremden Depots wie die einer Karte, höchstens 98", () => {
    const w = depotWerte(heuteDepot("trade-republic-depot"))!;
    const p = passungAusWerten(w, a("halal", { erfahrung: "depot", eigenschaft: "wechsel" }));
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
    const basis = { art: "depot", erfahrung: "keine", praef: "halal", eigenschaft: "gebuehr" } as const;
    const e1 = depot({ ...basis, betrag: "unter50" }, true);
    const e2 = depot({ ...basis, betrag: "ueber200" }, true);
    expect(e1.anbieter.out).toBe(e2.anbieter.out);
    expect(e1.satz).toBe(e2.satz);
    expect(e1.vorteile).toEqual(e2.vorteile);
    expect(e1.passung).toBeLessThan(e2.passung);
    expect(antwortZeilen({ ...basis, betrag: "50bis200" })).toContain("50 bis 200 € im Monat");
    // Die gewählte Eigenschaft steht auch bei „Deine Antworten“.
    expect(antwortZeilen(basis)).toContain(EIGENSCHAFT_TEXT.gebuehr);
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
    expect(durchB({ art: "depot", erfahrung: "keine", praef: "kosten", eigenschaft: "gebuehr", betrag: "unter50" })).toMatchObject({ link: "/out/smartbroker?src=fcaksbb" });
    for (const src of ["fcakno", "fcakflz", "fchpsb", "fcbobb", "fcakfla", "fcaknob", "fcakflzb", "fcqzsbxa"]) {
      expect(CHECK_SRC.test(src)).toBe(true);
      expect(istGueltigeQuelle(src)).toBe(true);
      expect(istHerkunft(src)).toBe(false);
    }
  });

  it("Die Kennung der Fassung ist je Fassung unterscheidbar, die Quelle steckt nur in der Kennung", () => {
    const basis = { art: "depot", erfahrung: "keine", praef: "halal", eigenschaft: "gold-sukuk" } as const;
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
    const e = depot({ art: "depot", erfahrung: "depot", depotHeute: heuteDepot("trade-republic-depot"), praef: "halal", eigenschaft: "wechsel" });
    expect(e.link).toBe("/out/flatex?src=fcakfla");
    expect(e.link).not.toMatch(/trade|republic/i);
  });
});
