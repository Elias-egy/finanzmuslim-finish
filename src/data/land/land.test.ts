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

describe("Länderlisten: Belege und Reihenfolge (DACH1, 23.11.2026)", () => {
  const HALAL = ["zinsfreiAbStart", "keinDispoAbStart", "karteOhneKredit", "echteCoins", "eigeneWallet", "zinsfreiesModell", "halalEtfsFonds", "halalSukuk", "halalEdelmetalle", "royalMint"];

  it("jedes belegte Halal-Feld hat eine Quelle mit Adresse und Zitat, nie grün ohne Beleg", () => {
    for (const [, daten] of LISTEN) {
      for (const liste of Object.values(daten)) {
        for (const a of liste.anbieter) {
          for (const k of HALAL) {
            const w = a.werte[k];
            if (w === null || w === undefined) continue;
            const quelle = a.quellen?.[k];
            expect(quelle?.url, `${a.id} ${k}`).toMatch(/^https:\/\//);
            expect(quelle?.hinweis?.length ?? 0, `${a.id} ${k}`).toBeGreaterThan(20);
          }
        }
      }
    }
  });

  it("keine deutschen Steuerversprechen und keine Gedankenstriche in sichtbaren Werten", () => {
    for (const [, daten] of LISTEN) {
      for (const liste of Object.values(daten)) {
        const texte = [...(liste.einleitung ?? []), liste.quellenHinweis ?? "", ...liste.anbieter.flatMap((a) => Object.values(a.werte).filter((w): w is string => typeof w === "string"))];
        for (const t of texte) {
          expect(t, t).not.toMatch(/steuerfrei|Abgeltungs/i);
          expect(t, t).not.toMatch(/[–—]/);
        }
      }
    }
  });

  it("die feste Reihenfolge nennt jeden Anbieter genau einmal", () => {
    for (const [, daten] of LISTEN) {
      for (const liste of Object.values(daten)) {
        if (liste.entwurf) continue;
        expect([...(liste.reihenfolge ?? [])].sort()).toEqual(liste.anbieter.map((a) => a.id).sort());
      }
    }
  });
});

describe("Länderlisten: nur im Land zugelassene Papiere zählen (DACH1, Korrektur 23.11.2026)", () => {
  it("„x von y“ nennt als y genau die Zahl zugelassener Papiere des Landes", () => {
    for (const [, daten] of LISTEN) {
      for (const liste of Object.values(daten)) {
        if (liste.entwurf || !liste.anteilN) continue;
        for (const a of liste.anbieter) {
          for (const [k, n] of Object.entries(liste.anteilN)) {
            const w = a.werte[k];
            if (typeof w !== "string") continue;
            // Nie „mind.“ auf der Seite (Regelbuch Nie), offene Papiere heißen „x von y bestätigt“ (Prüfung S-5).
            expect(w, `${a.id} ${k}`).toMatch(new RegExp(`^\\d+ von ${n}( bestätigt)?$`));
          }
        }
      }
    }
  });

  it("Österreich nennt nie USA- oder EM-Islamic oder HSBC als kaufbar", () => {
    for (const liste of Object.values(OESTERREICH)) {
      for (const a of liste.anbieter) {
        for (const k of ["halalEtfsFonds", "halalSukuk", "halalEdelmetalle"]) {
          const h = a.quellen?.[k]?.hinweis ?? "";
          const kaufbar = h.split("Nicht zugelassen")[0];
          expect(kaufbar, `${a.id} ${k}`).not.toMatch(/USA Islamic|Emerging Markets Islamic|HSBC/);
        }
      }
    }
  });
});
