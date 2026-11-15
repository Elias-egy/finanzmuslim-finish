import { describe, expect, it } from "vitest";
import {
  ANGEBOTE_GETESTET,
  ART_JE_QUELLE,
  CHECK_SRC,
  ETIKETT,
  FRAGEN,
  KEIN_PREIS,
  PASSUNG_MAX,
  antwortZeilen,
  artVon,
  checkEinstiegLink,
  ergebnisAus,
  ersteAntwortAus,
  fragenGesamt,
  naechsteFrage,
  outLink,
  passungProzent,
  quelleAus,
  UEBERSCHRIFT,
  type Antworten,
  type DepotErgebnis,
  type KontoErgebnis,
} from "@/data/halalFinanzCheck";
import { BROKER_KARTEN } from "@/data/brokerFreebie";
import { freieWahl, KEINE_BANK, suche, wahlVon, bankNachId } from "@/data/bankSuche";
import { istGueltigeQuelle, istHerkunft } from "@/lib/attribution";

const durch = (a: Antworten) => ergebnisAus(a, "aktienliste");
const durchB = (a: Antworten) => ergebnisAus(a, "aktienliste", "b");
const konto = (a: Antworten) => durch(a) as KontoErgebnis;
const depot = (a: Antworten, b = false) => (b ? durchB(a) : durch(a)) as DepotErgebnis;
const bank = (id: string) => wahlVon(bankNachId(id)!);
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

  it("Depot-Check fragt nie nach dem heutigen Depot oder der Bank, Fassung a drei Fragen, Fassung b mit Monatsbetrag", () => {
    const d: Antworten = { art: "depot" };
    expect(naechsteFrage(d)).toBe("erfahrung");
    expect(naechsteFrage({ ...d, erfahrung: "keine" })).toBe("praef");
    expect(naechsteFrage({ ...d, erfahrung: "erste", praef: "halal" })).toBeNull();
    expect(naechsteFrage({ ...d, erfahrung: "depot" })).toBeNull();
    expect(naechsteFrage({ ...d, erfahrung: "keine", praef: "halal" }, "b")).toBe("betrag");
    expect(naechsteFrage({ ...d, erfahrung: "depot" }, "b")).toBe("betrag");
    expect(naechsteFrage({ ...d, erfahrung: "keine", praef: "halal", betrag: "unter50" }, "b")).toBeNull();
    expect(fragenGesamt(d)).toBe(3);
    expect(fragenGesamt({ ...d, erfahrung: "depot" })).toBe(2);
    expect(fragenGesamt(d, "b")).toBe(4);
    for (const a of [d, { ...d, erfahrung: "keine" as const }, { ...d, erfahrung: "keine" as const, praef: "kosten" as const }]) {
      expect(naechsteFrage(a, "b")).not.toBe("bank");
      expect(naechsteFrage(a, "b")).not.toBe("zahlung");
    }
    expect(FRAGEN.betrag.titel).toBe("Wie viel möchtest du im Monat anlegen?");
    expect(FRAGEN.erfahrung.titel).toBe("Wie viel Erfahrung hast du mit dem Investieren?");
    expect(FRAGEN.praef.titel).toBe("Was ist dir wichtiger?");
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

  it("Überschrift „Von der <Bank> zur norisbank“, bei „Noch kein Konto“ „Dein Bankkonto: norisbank“", () => {
    expect(konto(sparkasse).ueberschrift).toBe("Von der Sparkasse zur norisbank");
    expect(konto({ ...sparkasse, bank: bank("deutsche-bank") }).ueberschrift).toBe("Von der Deutschen Bank zur norisbank");
    expect(konto({ ...sparkasse, bank: bank("n26") }).ueberschrift).toBe("Von N26 zur norisbank");
    expect(konto({ ...sparkasse, bank: bank("grp-volksbank"), zahlung: "bar" }).ueberschrift).toBe("Von der Volksbank zur BBBank");
    expect(konto({ ...sparkasse, bank: KEINE_BANK }).ueberschrift).toBe("Dein Bankkonto: norisbank");
    expect(konto({ ...sparkasse, bank: KEINE_BANK, zahlung: "bar" }).ueberschrift).toBe("Dein Bankkonto: BBBank");
    expect(konto({ ...sparkasse, bank: freieWahl("Phantasiebank") }).ueberschrift).toBe("Von deiner Bank zur norisbank");
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
    expect(mitFiliale.ueberschrift).toBe("Von der norisbank zur BBBank");
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
  it("Halal-Auswahl führt zu flatex, Kosten zu Smartbroker+, kein Girokonto-Kasten, keine Alternative", () => {
    for (const erfahrung of ["keine", "erste"] as const) {
      const halal = depot({ art: "depot", erfahrung, praef: "halal" });
      expect(halal.anbieter.out).toBe("flatex");
      expect(halal.art).toBe("depot");
      const kosten = depot({ art: "depot", erfahrung, praef: "kosten" });
      expect(kosten.anbieter.out).toBe("smartbroker");
      for (const e of [halal, kosten]) {
        expect(Object.keys(e)).not.toContain("danach");
        expect(Object.keys(e)).not.toContain("alternative");
        expect(JSON.stringify(e)).not.toMatch(/norisbank|Girokonto|Alternative/);
      }
    }
  });

  it("„Ich habe schon ein Depot“ führt zum Zweitdepot bei Smartbroker+ mit einem Knopf", () => {
    const e = depot({ art: "depot", erfahrung: "depot" });
    expect(e.art).toBe("zweitdepot");
    expect(e.anbieter.out).toBe("smartbroker");
    expect(e.knopf).toBe("Zweitdepot eröffnen");
  });

  it("flatex nennt den Kreditrahmen", () => {
    expect(depot({ art: "depot", erfahrung: "keine", praef: "halal" }).pflicht).toMatch(/Kreditrahmen/);
  });

  it("Beides geht in den Bankkonto-Weg: Konto-Ergebnis ohne Depot", () => {
    const e = konto({ ziel: "beides", zahlung: "karte", bank: bank("ing") });
    expect(e.art).toBe("konto");
    expect(JSON.stringify(e)).not.toMatch(/flatex|Depot/i);
  });
});

describe("Passung in Prozent (RN8-03), berechnet und nie fest", () => {
  const a = (praef: "halal" | "kosten", extra: Antworten = {}): Antworten => ({ art: "depot", erfahrung: "keine", praef, ...extra });

  it("Halal-Anlagen wichtig: flatex höher als Smartbroker+; Kosten wichtig: umgekehrt", () => {
    expect(passungProzent(FL, a("halal"))).toBeGreaterThan(passungProzent(SB, a("halal")));
    expect(passungProzent(SB, a("kosten"))).toBeGreaterThan(passungProzent(FL, a("kosten")));
    for (const betrag of ["unter50", "50bis200", "ueber200"] as const) {
      expect(passungProzent(FL, a("halal", { betrag }))).toBeGreaterThan(passungProzent(SB, a("halal", { betrag })));
      expect(passungProzent(SB, a("kosten", { betrag }))).toBeGreaterThan(passungProzent(FL, a("kosten", { betrag })));
    }
  });

  it("das empfohlene Depot trägt die Zahl, gerundet, höchstens 98, nie 100", () => {
    for (const praef of ["halal", "kosten"] as const) {
      for (const erfahrung of ["keine", "erste"] as const) {
        const e = depot({ art: "depot", erfahrung, praef });
        expect(Number.isInteger(e.passung)).toBe(true);
        expect(e.passung).toBeLessThanOrEqual(PASSUNG_MAX);
        expect(e.passung).toBeGreaterThan(50);
      }
    }
    expect(PASSUNG_MAX).toBe(98);
    expect(depot({ art: "depot", erfahrung: "depot" }).passung).toBeLessThanOrEqual(98);
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
    const basis = { art: "depot", erfahrung: "keine", praef: "halal" } as const;
    const e1 = depot({ ...basis, betrag: "unter50" }, true);
    const e2 = depot({ ...basis, betrag: "ueber200" }, true);
    expect(e1.anbieter.out).toBe(e2.anbieter.out);
    expect(e1.warum).toBe(e2.warum);
    expect(e1.passung).toBeLessThan(e2.passung);
    expect(antwortZeilen({ ...basis, betrag: "50bis200" })).toContain("50 bis 200 € im Monat");
  });

  it("Bankkonto-Ergebnisse tragen keine Prozentzahl", () => {
    expect(JSON.stringify(konto({ art: "konto", zahlung: "karte", bank: bank("ing") }))).not.toMatch(/passung|%/);
  });
});

describe("Kennung am Knopf", () => {
  it("Knöpfe gehen über /out mit gültiger Kennung, die Fassung steht am Ende", () => {
    const e = konto({ art: "konto", zahlung: "karte", bank: bank("ing") });
    expect(outLink("aktienliste", e.anbieter)).toBe("/out/norisbank?src=fcaknoa");
    expect(outLink("aktienliste", e.anbieter, "b")).toBe("/out/norisbank?src=fcaknob");
    expect(durchB({ art: "depot", erfahrung: "keine", praef: "kosten", betrag: "unter50" })).toMatchObject({ link: "/out/smartbroker?src=fcaksbb" });
    for (const src of ["fcakno", "fcakflz", "fchpsb", "fcbobb", "fcakfla", "fcaknob", "fcakflzb", "fcqzsbxa"]) {
      expect(CHECK_SRC.test(src)).toBe(true);
      expect(istGueltigeQuelle(src)).toBe(true);
      expect(istHerkunft(src)).toBe(false);
    }
  });

  it("Die Kennung der Fassung ist je Fassung unterscheidbar, die Quelle steckt nur in der Kennung", () => {
    const a = depot({ art: "depot", erfahrung: "keine", praef: "halal" });
    const b = depot({ art: "depot", erfahrung: "keine", praef: "halal", betrag: "50bis200" }, true);
    expect(outLink("homepage", a.anbieter, "a")).toMatch(/src=fchpfla$/);
    expect(outLink("homepage", b.anbieter, "b")).toMatch(/src=fchpflb$/);
    const ak = ergebnisAus({ art: "depot", erfahrung: "keine", praef: "halal" }, "aktienliste") as DepotErgebnis;
    const bo = ergebnisAus({ art: "depot", erfahrung: "keine", praef: "halal" }, "boykottliste") as DepotErgebnis;
    expect(ak.warum).toBe(bo.warum);
    expect(ak.vorteile).toEqual(bo.vorteile);
    expect(ak.passung).toBe(bo.passung);
  });
});
