import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { beitragPfad, wissenBeitraege } from "./wissenBeitraege";
import { alleRouten, weiterleitungen, wissenUmzug } from "./routen";

/* SEO43: /wissen wird /blog. Das Register, die Sitemap und die Weiterleitungen müssen dieselben Adressen tragen,
   und das Datum auf der Übersicht ist das Datum, das die Seite selbst zeigt. */
const datei = (slug: string) => {
  const name = slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("");
  return slug === "halal-etfs" ? "src/pages/blog/HalalEtf.tsx" : `src/pages/wissen/${name}.tsx`;
};

describe("Blog-Register", () => {
  const pfade = alleRouten().map((r) => r.pfad);

  it("jeder Beitrag liegt unter /blog und steht in der Sitemap", () => {
    for (const b of wissenBeitraege) {
      expect(beitragPfad(b).startsWith("/blog/")).toBe(true);
      expect(pfade).toContain(beitragPfad(b));
    }
  });

  it("keine Sitemap-Adresse liegt noch unter /wissen", () => {
    expect(pfade.filter((p) => p === "/wissen" || p.startsWith("/wissen/"))).toEqual([]);
  });

  it("jede alte /wissen-Adresse leitet direkt auf eine echte Seite, ohne Kette", () => {
    const von = new Set(weiterleitungen.map((w) => w.von));
    for (const w of weiterleitungen.filter((w) => w.von.startsWith("/wissen"))) {
      expect(pfade).toContain(w.nach);
      expect(von.has(w.nach)).toBe(false);
    }
    expect(wissenUmzug.length).toBe(23);
  });

  it("das Datum auf der Übersicht ist das Datum der Seite", () => {
    for (const b of wissenBeitraege) {
      const quelltext = readFileSync(datei(b.slug), "utf8");
      // Beiträge im neuen Aufbau (halal-etfs, halal-gold-kaufen) tragen das Datum in AKTUALISIERT.
      const iso = quelltext.match(/AKTUALISIERT = \{ text: "[^"]*", iso: "(\d{4})-(\d{2})-(\d{2})/);
      if (iso) {
        const monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
        expect(b.datum).toBe(`${Number(iso[3])}. ${monate[Number(iso[2]) - 1]} ${iso[1]}`);
      } else {
        const geaendert = quelltext.match(/dateModified="([^"]*)"/)?.[1] ?? quelltext.match(/datePublished="([^"]*)"/)?.[1];
        expect(b.datum, b.slug).toBe(geaendert);
      }
    }
  });
});
