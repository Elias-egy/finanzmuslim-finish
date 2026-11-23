import { describe, expect, it } from "vitest";
import { partnerLinks } from "@/data/partnerLinks";
import { landFreigegeben, landHatFreigegebenes, landVergleich, landSchluessel, hatLandVersion } from "./index";
import { LAND_VERGLEICHE, landVonKurzname } from "./typen";
import { OESTERREICH } from "./oesterreich";
import { SCHWEIZ } from "./schweiz";
import { BEISPIEL_EINTRAG } from "./beispiel";
import { alleRouten, bewusstDraussen, landEntwuerfe, nichtIndexiert } from "@/data/routen";

const LISTEN = [
  ["at", OESTERREICH],
  ["ch", SCHWEIZ],
] as const;

describe("Länderlisten (DACH1)", () => {
  it("kennt genau die Vergleiche mit Länderversion", () => {
    expect(Object.keys(LAND_VERGLEICHE).sort()).toEqual([
      "/vergleich/depot",
      "/vergleich/edelmetalle",
      "/vergleich/etf-sparplan",
      "/vergleich/girokonto",
      "/vergleich/krypto",
    ]);
    expect(landSchluessel("/at/vergleich/depot")).toBe("depot");
    expect(hatLandVersion("/vergleich/steuersoftware")).toBe(false);
    expect(landVergleich("de", "/vergleich/depot")).toBeNull();
  });

  it("zeigt nur, was fertig ist: Entwurf oder leere Liste ist nie öffentlich", () => {
    for (const [land, daten] of LISTEN) {
      for (const [schluessel, liste] of Object.entries(daten)) {
        const pfad = Object.entries(LAND_VERGLEICHE).find(([, s]) => s === schluessel)![0];
        const fertig = !liste.entwurf && liste.anbieter.length > 0;
        expect(landFreigegeben(land, pfad)).toBe(fertig);
      }
    }
    expect(landFreigegeben("de", "/vergleich/depot")).toBe(true);
  });

  it("jede fertige Liste hat Stand, Quelle, eigene Links und ein Land in jedem Kurznamen", () => {
    for (const [land, daten] of LISTEN) {
      for (const liste of Object.values(daten)) {
        if (liste.entwurf) continue;
        expect(liste.stand, "fertige Liste braucht ein Prüfdatum").toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
        expect(liste.quellenHinweis, "fertige Liste braucht einen Quellenhinweis").toBeTruthy();
        for (const a of liste.anbieter) {
          if (!a.link) continue;
          const kurz = a.link.replace("/out/", "");
          const partner = partnerLinks.find((p) => p.kurzname === kurz);
          expect(partner, `${a.id}: Partnerlink ${kurz} fehlt in partnerLinks.ts`).toBeTruthy();
          expect(landVonKurzname(kurz)).toBe(land);
          expect(partner!.land).toBe(land);
        }
      }
    }
  });

  it("Länder-Partnerlinks tragen ihr Land und deutsche Links tragen keins", () => {
    for (const p of partnerLinks) {
      const land = landVonKurzname(p.kurzname);
      if (land) expect(p.land, `${p.kurzname}`).toBe(land);
      else expect(p.land ?? "de", `${p.kurzname}`).toBe("de");
    }
  });

  it("der Beispiel-Eintrag steht in keiner Liste", () => {
    for (const [, daten] of LISTEN) {
      for (const liste of Object.values(daten)) {
        expect(liste.anbieter.some((a) => a.id === BEISPIEL_EINTRAG.id)).toBe(false);
      }
    }
  });

  it("Sitemap und Index: unfertige Länderseiten sind noindex und nicht in der Sitemap", () => {
    const sitemap = new Set(alleRouten().map((r) => r.pfad));
    const draussen = new Set(bewusstDraussen.map((d) => d.pfad));
    for (const pfad of landEntwuerfe()) {
      expect(sitemap.has(pfad), pfad).toBe(false);
      expect(nichtIndexiert).toContain(pfad);
      expect(draussen.has(pfad), pfad).toBe(true);
    }
    // Länderübersicht erscheint nur mit mindestens einem fertigen Vergleich im Land.
    expect(sitemap.has("/at/vergleiche")).toBe(landHatFreigegebenes("at"));
    expect(sitemap.has("/ch/vergleiche")).toBe(landHatFreigegebenes("ch"));
  });
});
