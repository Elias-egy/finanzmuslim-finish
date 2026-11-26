import { describe, expect, it } from "vitest";
import { rangfolge } from "@/lib/rangfolge";
import { stilVon, STIL_GRUEN } from "@/components/vergleich/karteStil";
import type { VergleichsSpalte } from "@/components/vergleich/vergleichTypen";
import { geschaeftskontoAnzeige } from "./anzeige/geschaeftskonto";
import { girokontoAnzeige } from "./anzeige/girokonto";
import { GESCHAEFT_FINANZ_MAX } from "./finanzMax";
import { GIRO_FINANZ_MAX } from "./girokontoVergleich";
import { ISLAMIC_KONTO_FILTER, ISLAMIC_KONTO_TEXT } from "./islamicKonto";

/** VG8-04 (Elias 25.11.2026): KT Bank trägt in beiden Konto-Vergleichen den Farbton und den Filter „Islamic-Konto“, der Platz bleibt. */
const filtere = (liste: typeof girokontoAnzeige) => liste.filter((a) => ISLAMIC_KONTO_FILTER.erlaubt.includes(String(a.werte[ISLAMIC_KONTO_FILTER.key])));
const ohneMerkmal = (liste: typeof girokontoAnzeige) =>
  liste.map((a) => {
    const { islamicKonto: _weg, ...rest } = a.werte;
    return { ...a, werte: rest };
  });
const spalte = (id: string) => ({ id, anbieter: "x", produkt: "y", werte: {}, etikett: null } as unknown as VergleichsSpalte);

describe("Islamic-Konto (KT Bank)", () => {
  it("heißt Islamic-Konto und filtert auf den gesetzten Wert", () => {
    expect(ISLAMIC_KONTO_TEXT).toBe("Islamic-Konto");
    expect(ISLAMIC_KONTO_FILTER).toEqual({ key: "islamicKonto", label: "Islamic-Konto", erlaubt: ["true"] });
  });

  it("Filter zeigt im Geschäftskonto-Vergleich nur KT Bank", () => {
    expect(filtere(geschaeftskontoAnzeige).map((a) => a.id)).toEqual(["kt-bank-geschaeftskonto"]);
  });

  it("Filter zeigt im Girokonto-Vergleich nur KT Bank", () => {
    expect(filtere(girokontoAnzeige).map((a) => a.id)).toEqual(["kt-bank-girokonto"]);
  });

  it("KT Bank trägt das Etikett in zartem Grün, andere Konten nicht", () => {
    for (const id of ["kt-bank-girokonto", "kt-bank-geschaeftskonto"]) {
      expect(stilVon(spalte(id))).toEqual({ stil: STIL_GRUEN, text: "Islamic-Konto" });
    }
    expect(stilVon(spalte("dkb-girokonto"))).toBeNull();
    expect(STIL_GRUEN.karte).toContain("emerald");
    expect(STIL_GRUEN.karte).not.toContain("primary");
  });

  it("Rangfolge und Plätze sind mit und ohne Merkmal gleich (Geschäftskonto)", () => {
    const mit = rangfolge(geschaeftskontoAnzeige, "geschaeftskonto", { finanzMax: GESCHAEFT_FINANZ_MAX }).gerankt;
    const ohne = rangfolge(ohneMerkmal(geschaeftskontoAnzeige), "geschaeftskonto", { finanzMax: GESCHAEFT_FINANZ_MAX }).gerankt;
    expect(mit.map((b) => [b.anbieter.id, b.platz, b.note])).toEqual(ohne.map((b) => [b.anbieter.id, b.platz, b.note]));
    // VG12 (25.11.2026): bunq (4) und Finom (3) jetzt belegt ohne Zins, die belegte Stufe wächst von 30 auf 37, KT Bank (Karte offen) bleibt an ihrem Ende.
    // VG14 (26.11.2026): Holvi (4) und Postbank (4) dazu, die belegte Stufe hat 45 Tarife, KT Bank bleibt an ihrem Ende.
    expect(mit.find((b) => b.anbieter.id === "kt-bank-geschaeftskonto")!.platz).toBe(43);
  });

  it("Rangfolge und Plätze sind mit und ohne Merkmal gleich (Girokonto)", () => {
    const mit = rangfolge(girokontoAnzeige, "girokonto", { finanzMax: GIRO_FINANZ_MAX }).gerankt;
    const ohne = rangfolge(ohneMerkmal(girokontoAnzeige), "girokonto", { finanzMax: GIRO_FINANZ_MAX }).gerankt;
    expect(mit.map((b) => [b.anbieter.id, b.platz, b.note])).toEqual(ohne.map((b) => [b.anbieter.id, b.platz, b.note]));
    expect(mit.find((b) => b.anbieter.id === "kt-bank-girokonto")!.platz).toBe(40);
  });
});
