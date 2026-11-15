import { describe, expect, it } from "vitest";
import {
  CHECK_SRC,
  ETIKETT,
  FRAGEN,
  antwortZeilen,
  ergebnisAus,
  fragenGesamt,
  naechsteFrage,
  outLink,
  quelleAus,
  UEBERSCHRIFT,
  type Antworten,
} from "@/data/halalFinanzCheck";
import { istGueltigeQuelle, istHerkunft } from "@/lib/attribution";

const durch = (a: Antworten) => ergebnisAus(a, "aktienliste");
const durchB = (a: Antworten) => ergebnisAus(a, "aktienliste", "b");

describe("Halal-Finanz-Check (RN5, RN7)", () => {
  it("Fassung a: Konto zwei Fragen, Depot-Weg drei, „schon ein Depot“ zwei", () => {
    expect(naechsteFrage({})).toBe("ziel");
    expect(naechsteFrage({ ziel: "konto" })).toBe("filiale");
    expect(naechsteFrage({ ziel: "konto", filiale: "nein" })).toBeNull();
    expect(naechsteFrage({ ziel: "invest" })).toBe("erfahrung");
    expect(naechsteFrage({ ziel: "invest", erfahrung: "keine" })).toBe("praef");
    expect(naechsteFrage({ ziel: "invest", erfahrung: "erste" })).toBe("praef");
    expect(naechsteFrage({ ziel: "invest", erfahrung: "erste", praef: "halal" })).toBeNull();
    expect(naechsteFrage({ ziel: "invest", erfahrung: "depot" })).toBeNull();
    expect(naechsteFrage({ ziel: "beides" })).toBe("erfahrung");
    expect(naechsteFrage({ ziel: "beides", erfahrung: "keine", praef: "kosten" })).toBeNull();
    expect(fragenGesamt({ ziel: "konto" })).toBe(2);
    expect(fragenGesamt({ ziel: "invest" })).toBe(3);
    expect(fragenGesamt({ ziel: "invest", erfahrung: "depot" })).toBe(2);
  });

  it("Fassung b fragt auf dem Depot-Weg zuletzt den Monatsbetrag, der Konto-Weg bleibt gleich", () => {
    expect(naechsteFrage({ ziel: "invest", erfahrung: "keine", praef: "halal" }, "b")).toBe("betrag");
    expect(naechsteFrage({ ziel: "beides", erfahrung: "erste", praef: "kosten" }, "b")).toBe("betrag");
    expect(naechsteFrage({ ziel: "invest", erfahrung: "depot" }, "b")).toBe("betrag");
    expect(naechsteFrage({ ziel: "invest", erfahrung: "keine", praef: "halal", betrag: "unter50" }, "b")).toBeNull();
    expect(naechsteFrage({ ziel: "konto", filiale: "ja" }, "b")).toBeNull();
    expect(fragenGesamt({ ziel: "invest" }, "b")).toBe(4);
    expect(fragenGesamt({ ziel: "invest", erfahrung: "depot" }, "b")).toBe(3);
    expect(fragenGesamt({ ziel: "konto" }, "b")).toBe(2);
    expect(ergebnisAus({ ziel: "invest", erfahrung: "keine", praef: "halal" }, "aktienliste", "b")).toBeNull();
    expect(durch({ ziel: "invest", erfahrung: "keine", praef: "halal" })).not.toBeNull();
    expect(FRAGEN.betrag.titel).toBe("Wie viel möchtest du im Monat anlegen?");
    expect(FRAGEN.betrag.optionen.map((o) => o.titel)).toEqual(["Unter 50 €", "50 bis 200 €", "Über 200 €"]);
  });

  it("Der Monatsbetrag ändert das Ergebnis nicht, steht aber in „Deine Antworten“", () => {
    const basis = { ziel: "invest", erfahrung: "keine", praef: "kosten" } as const;
    const e1 = durchB({ ...basis, betrag: "unter50" })!;
    const e2 = durchB({ ...basis, betrag: "ueber200" })!;
    expect(e1.anbieter.out).toBe(e2.anbieter.out);
    expect(e1.warum).toBe(e2.warum);
    expect(antwortZeilen({ ...basis, betrag: "50bis200" })).toContain("50 bis 200 € im Monat");
  });

  it("Die Fragen sind die von Elias: Erfahrung, dann „Was ist dir wichtiger?“, alte Fragen entfallen", () => {
    expect(FRAGEN.ziel.optionen.map((o) => o.titel)).toEqual(["Mein Konto zinsfrei machen", "Halal investieren", "Beides"]);
    expect(FRAGEN.erfahrung.titel).toBe("Wie viel Erfahrung hast du mit dem Investieren?");
    expect(FRAGEN.erfahrung.optionen.map((o) => [o.titel, o.unter])).toEqual([
      ["Noch keine", "Ich fange gerade an"],
      ["Erste Schritte", "Sparplan oder ein paar Aktien"],
      ["Ich habe schon ein Depot", "Ich kaufe selbst"],
    ]);
    expect(FRAGEN.praef.titel).toBe("Was ist dir wichtiger?");
    const alles = JSON.stringify(FRAGEN);
    expect(alles).not.toMatch(/Wie willst du starten|Hast du schon ein Depot\?|Einmal einen Betrag|Erst ein zinsfreies Konto|Aktien aus der Liste/);
  });

  it("Unterzeilen der Frage „Was ist dir wichtiger?“ kommen nur aus den Vergleichsdaten", () => {
    const [halal, kosten] = FRAGEN.praef.optionen;
    expect(halal.unter).toMatch(/^12 von 12 Halal-ETFs und Fonds, 7 von 7 Edelmetalle$/);
    expect(kosten.unter).toMatch(/Depotgebühr, Sparplan ab/);
  });

  it("Halal-Auswahl führt zu flatex, Kosten zu Smartbroker+, die andere Bank steht als Alternative", () => {
    for (const erfahrung of ["keine", "erste"] as const) {
      const halal = durch({ ziel: "invest", erfahrung, praef: "halal" })!;
      expect(halal.anbieter.out).toBe("flatex");
      expect(halal.art).toBe("depot");
      expect(halal.alternative?.anbieter.out).toBe("smartbroker");
      const kosten = durch({ ziel: "invest", erfahrung, praef: "kosten" })!;
      expect(kosten.anbieter.out).toBe("smartbroker");
      expect(kosten.alternative?.anbieter.out).toBe("flatex");
    }
  });

  it("„Ich habe schon ein Depot“ führt zum Zweitdepot bei Smartbroker+ mit Konto-Kasten", () => {
    const e = durch({ ziel: "invest", erfahrung: "depot" })!;
    expect(e.art).toBe("zweitdepot");
    expect(e.anbieter.out).toBe("smartbroker");
    expect(e.knopf).toBe("Zweitdepot eröffnen");
    expect(e.danach?.konto).toBe(true);
    expect(e.danach?.anbieter.out).toBe("norisbank");
  });

  it("Beides: Konto groß, das Depot aus „Was ist dir wichtiger?“ als Schritt 2", () => {
    const e = durch({ ziel: "beides", erfahrung: "keine", praef: "halal" })!;
    expect(e.art).toBe("beides");
    expect(e.anbieter.out).toBe("norisbank");
    expect(e.danach?.anbieter.out).toBe("flatex");
    expect(e.danach?.konto).toBe(false);
    expect(durch({ ziel: "beides", erfahrung: "erste", praef: "kosten" })?.danach?.anbieter.out).toBe("smartbroker");
    expect(durch({ ziel: "beides", erfahrung: "depot" })?.danach?.satz).toMatch(/Zweitdepot bei Smartbroker/);
  });

  it("Konto: norisbank ohne Filiale, BBBank mit Filiale (Elias RN3-07)", () => {
    expect(durch({ ziel: "konto", filiale: "nein" })?.anbieter.out).toBe("norisbank");
    expect(durch({ ziel: "konto", filiale: "ja" })?.anbieter.out).toBe("bbbank-bettersmart");
  });

  it("Etikett heißt „beliebt“, nur an der Konto-Antwort der ersten Frage", () => {
    expect(ETIKETT).toBe("beliebt");
    const etiketten = Object.values(FRAGEN).flatMap((f) => f.optionen.map((o) => o.etikett).filter(Boolean));
    expect(etiketten).toEqual(["beliebt"]);
    expect(JSON.stringify(FRAGEN)).not.toMatch(/Leichtester|Beliebtester/);
  });

  it("flatex nennt den Kreditrahmen, jedes Konto das leere Tagesgeld", () => {
    expect(durch({ ziel: "invest", erfahrung: "keine", praef: "halal" })?.pflicht).toMatch(/Kreditrahmen/);
    expect(durch({ ziel: "konto", filiale: "nein" })?.pflicht).toMatch(/Tagesgeld/);
  });

  it("eine Empfehlung mit ein bis zwei Vorteilen, keine erfundenen Sterne oder Prozente", () => {
    const alle: Antworten[] = [
      { ziel: "konto", filiale: "nein" },
      { ziel: "konto", filiale: "ja" },
      { ziel: "invest", erfahrung: "keine", praef: "kosten" },
      { ziel: "invest", erfahrung: "erste", praef: "halal" },
      { ziel: "invest", erfahrung: "depot" },
      { ziel: "beides", erfahrung: "keine", praef: "halal" },
      { ziel: "beides", erfahrung: "depot" },
    ];
    for (const a of alle) {
      for (const e of [durch(a)!, durchB({ ...a, ...(a.ziel !== "konto" ? { betrag: "unter50" as const } : {}) })!]) {
        expect(e.vorteile.length).toBeGreaterThanOrEqual(1);
        expect(e.vorteile.length).toBeLessThanOrEqual(2);
        const text = [e.warum, ...e.vorteile, e.pflicht ?? "", e.danach?.satz ?? ""].join(" ");
        expect(text).not.toMatch(/Stern|%|Beliebteste|Finde, was zu dir passt|Traders Place/);
      }
    }
  });

  it("„Deine Antworten“ zeigt nur die gegebenen Antworten", () => {
    expect(antwortZeilen({ ziel: "konto", filiale: "ja" })).toEqual(["Konto zinsfrei machen", "Mit Filiale"]);
    expect(antwortZeilen({ ziel: "invest", erfahrung: "keine", praef: "kosten", betrag: "unter50" })).toEqual([
      "Halal investieren",
      "Noch keine Erfahrung",
      "Niedrige Kosten",
      "Unter 50 € im Monat",
    ]);
  });

  it("Knöpfe gehen über /out mit gültiger Kennung, die Fassung steht am Ende", () => {
    const e = durch({ ziel: "beides", erfahrung: "keine", praef: "halal" })!;
    expect(outLink("aktienliste", e.anbieter)).toBe("/out/norisbank?src=fcaknoa");
    expect(outLink("aktienliste", e.anbieter, "b")).toBe("/out/norisbank?src=fcaknob");
    expect(e.danach?.link).toBe("/out/flatex?src=fcakflza");
    expect(durchB({ ziel: "beides", erfahrung: "keine", praef: "halal", betrag: "unter50" })?.danach?.link).toBe("/out/flatex?src=fcakflzb");
    expect(durchB({ ziel: "invest", erfahrung: "keine", praef: "kosten", betrag: "unter50" })?.alternative?.link).toBe("/out/flatex?src=fcakflxb");
    for (const src of ["fcakno", "fcakflz", "fchpsb", "fcbobb", "fcakfla", "fcaknob", "fcakflzb", "fcqzsbxa"]) {
      expect(CHECK_SRC.test(src)).toBe(true);
      expect(istGueltigeQuelle(src)).toBe(true);
      expect(istHerkunft(src)).toBe(false);
    }
    expect(outLink("aktienliste", e.anbieter)).not.toMatch(/email/);
  });

  it("Die Kennung der Fassung ist je Fassung unterscheidbar, die Quelle steckt nur in der Kennung", () => {
    const a = durch({ ziel: "invest", erfahrung: "keine", praef: "halal" })!;
    const b = durchB({ ziel: "invest", erfahrung: "keine", praef: "halal", betrag: "50bis200" })!;
    expect(outLink("homepage", a.anbieter, "a")).toMatch(/src=fchpfla$/);
    expect(outLink("homepage", b.anbieter, "b")).toMatch(/src=fchpflb$/);
    const ak = ergebnisAus({ ziel: "invest", erfahrung: "keine", praef: "halal" }, "aktienliste")!;
    const bo = ergebnisAus({ ziel: "invest", erfahrung: "keine", praef: "halal" }, "boykottliste")!;
    expect(ak.warum).toBe(bo.warum);
    expect(ak.vorteile).toEqual(bo.vorteile);
  });

  it("Einstiege im Freebie-Kasten: Boykott-Überschrift ohne Boykott-Aussage über die Bank, unbekannte Quelle läuft als Startseite", () => {
    expect(UEBERSCHRIFT.boykottliste).not.toMatch(/Boykott/i);
    expect(quelleAus("irgendwas")).toBe("homepage");
    expect(quelleAus("halal-anlagen")).toBe("halal-anlagen");
  });
});
