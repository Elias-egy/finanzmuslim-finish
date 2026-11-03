import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { nichtIndexiert, weiterleitungen } from "./routen";

// Kurze Adresse des Anfänger-Guides (MC7g, 02.11.2026): /anfaengerguide öffnet sofort das PDF. ManyChat und alte
// Mails zeigen auf /guides/finanzmuslim-einsteiger-guide.pdf, darum liegen beide Dateien gleich nebeneinander.
describe("Anfänger-Guide", () => {
  it("leitet die kurze Adresse direkt auf das PDF", () => {
    expect(weiterleitungen).toContainEqual({ von: "/anfaengerguide", nach: "/anfaengerguide.pdf" });
  });

  it("öffnet auch die alten Guide-Seiten sofort als PDF (MC7d17, gebaut in MC7h)", () => {
    expect(weiterleitungen).toContainEqual({ von: "/dein-guide/start-2026", nach: "/anfaengerguide.pdf" });
    expect(weiterleitungen).toContainEqual({ von: "/dein-guide/aufbau-2026", nach: "/guides/finanzmuslim-fortgeschritten-guide.pdf" });
    expect(nichtIndexiert).not.toContain("/dein-guide/start-2026");
    expect(nichtIndexiert).not.toContain("/dein-guide/aufbau-2026");
  });

  it("hat unter beiden Adressen dieselbe Datei", () => {
    const kurz = readFileSync("public/anfaengerguide.pdf");
    const alt = readFileSync("public/guides/finanzmuslim-einsteiger-guide.pdf");
    expect(kurz.equals(alt)).toBe(true);
  });
});
