import { describe, expect, it } from "vitest";
import { weiterleitungen } from "./routen";
import { START_LINKS } from "./startLinks";
import { partnerLinks } from "./partnerLinks";
import { beitragJsonLd } from "@/components/Seo";

/** RN20 (Prüfbericht RN19 Punkt 2 und 8): Partnerwege als echte Dateien, Artikel-Schema mit Bild. */
describe("Partnerwege", () => {
  it("jeder /weiter/<kurzname> wird als Datei erzeugt und zeigt auf den Partnerlink", () => {
    for (const [kurzname, link] of Object.entries(START_LINKS)) {
      const w = weiterleitungen.find((x) => x.von === `/weiter/${kurzname}`);
      expect(w, kurzname).toBeDefined();
      expect(w!.nach).toBe(link.replace("{SUBID}", "startw"));
    }
  });

  it("/out/<kurzname> gibt es nur für aktive Partner", () => {
    for (const p of partnerLinks) {
      expect(weiterleitungen.some((x) => x.von === `/out/${p.kurzname}`), p.kurzname).toBe(p.aktiv);
    }
  });
});

describe("Artikel-Schema", () => {
  it("BlogPosting trägt ein Bild, standardmäßig die Vorschaukarte der Seite", () => {
    const [artikel] = beitragJsonLd({ titel: "T", beschreibung: "B", path: "/blog/sukuk", datePublished: "16. August 2026", faq: [] }) as Record<string, unknown>[];
    expect(artikel.image).toBe("https://finanzmuslim.com/og/blog--sukuk.jpg");
    expect(artikel.url).toBe("https://finanzmuslim.com/blog/sukuk");
  });

  it("ein eigenes Titelbild hat Vorrang", () => {
    const [artikel] = beitragJsonLd({ titel: "T", beschreibung: "B", path: "/blog/sukuk", datePublished: "16. August 2026", image: "https://finanzmuslim.com/x.jpg", faq: [] }) as Record<string, unknown>[];
    expect(artikel.image).toBe("https://finanzmuslim.com/x.jpg");
  });
});
