import { describe, expect, it } from "vitest";
import { euro } from "@/lib/vergleichAssistent";
import { GIRO_FINANZ_MAX, girokontoVergleich } from "./girokontoVergleich";
import { KONTOPREISE, KONTOPREIS_OFFEN, OHNE_BEDINGUNG_PUNKTE, kontopreisText, punkteKontofuehrung } from "./kontopreise";

/** Dokumente, die der Anbieter auf einer anderen Domain ablegt und selbst verlinkt. Nur mit Grund eintragen. */
const DOKUMENT_DOMAINS: Record<string, string[]> = {
  // Atruvia ist der IT-Dienstleister der Volks- und Raiffeisenbanken; die Banken verlinken ihre Entgeltinformationen dorthin.
  "bbbank.de": ["atruvia.scene7.com"],
  "berliner-volksbank.de": ["atruvia.scene7.com"],
  "meinebank.de": ["atruvia.scene7.com"],
  "psd-nuernberg.de": ["atruvia.scene7.com"],
  // Pax-BKC verlinkt ihre Entgeltinformation von pax-bkc.de/service/rechtliche-hinweise.html auf vr-dokumente.de.
  "pax-bank.de": ["vr-dokumente.de"],
  // Kontoanbieter ist die Solaris SE, tomorrow.one/de-DE/rechtliche-dokumente/ verlinkt deren Dokumente.
  "tomorrow.one": ["solarisgroup.com"],
  // Dokumentablage der Websites, verlinkt von bforbank.de und monese.com.
  "bforbank.de": ["bforbank.cdn.prismic.io"],
  "monese.com": ["cdn.prod.website-files.com"],
};

const ids = girokontoVergleich.map((a) => a.id);

describe("Kontoführung beim Anbieter geprüft (Elias, 27.09.2026: wie Finanzfluss, komplett)", () => {
  it("rechnet die Punkte nach der Finanzfluss-Formel", () => {
    expect([0, 1, 2.95, 3, 4.9, 5, 5.9, 9.99, 13.99, 18.99, 60].map(punkteKontofuehrung)).toEqual([15, 7.5, 5, 5, 3, 3, 0, 0, -1, -1, -6]);
    expect(GIRO_FINANZ_MAX.ohneBedingung).toBe(OHNE_BEDINGUNG_PUNKTE);
  });

  it("führt jedes Girokonto genau einmal, geprüft oder offen", () => {
    for (const id of ids) {
      const geprueft = id in KONTOPREISE;
      const offen = id in KONTOPREIS_OFFEN;
      expect(geprueft !== offen, `${id}: geprüft ${geprueft}, offen ${offen}`).toBe(true);
    }
    for (const id of [...Object.keys(KONTOPREISE), ...Object.keys(KONTOPREIS_OFFEN)]) {
      expect(ids, `${id} gibt es im Vergleich nicht`).toContain(id);
    }
  });

  it.each(Object.entries(KONTOPREISE))("%s: Preise, Bedingung und Beleg passen zusammen", (id, k) => {
    expect(k.aktiv).toBeGreaterThanOrEqual(0);
    expect(k.grundpreis).toBeGreaterThanOrEqual(k.aktiv);
    expect(!!k.bedingung, "Bedingung genau dann, wenn aktiv unter dem Grundpreis liegt").toBe(k.aktiv < k.grundpreis);
    if (k.guenstiger) expect(k.guenstiger.preis).toBeLessThan(k.aktiv);
    expect(euro(kontopreisText(k)), "erster Betrag im Text ist der Preis als aktives Konto").toBe(k.aktiv);

    const a = girokontoVergleich.find((x) => x.id === id);
    const host = new URL(k.url).hostname.replace(/^www\./, "");
    const domains = [a?.domain, ...(DOKUMENT_DOMAINS[a?.domain ?? ""] ?? [])].filter((d): d is string => !!d);
    expect(domains.some((d) => host === d || host.endsWith(`.${d}`)), `${id}: Beleg von ${host}`).toBe(true);
    expect(k.stand).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
    expect(k.zitate.length).toBeGreaterThan(0);
    expect(k.zitate.every((z) => z.trim().length > 0 && !z.includes("„") && !z.includes("“"))).toBe(true);
  });

  it("zeigt im Vergleich genau den geprüften Text und rechnet die Punkte daraus", () => {
    for (const a of girokontoVergleich) {
      const k = KONTOPREISE[a.id];
      if (!k) continue;
      expect(a.werte.kontofuehrung, a.id).toBe(kontopreisText(k));
      if (!a.finanzPunkte || Object.keys(a.finanzPunkte).length === 0) continue;
      expect(a.finanzPunkte.kontofuehrung, a.id).toBe(punkteKontofuehrung(k.aktiv));
      expect(a.finanzPunkte.ohneBedingung, a.id).toBe(k.grundpreis === 0 ? OHNE_BEDINGUNG_PUNKTE : 0);
    }
  });

  it("gibt offenen Konten keine Extrapunkte und SumUp keine Finanzpunkte", () => {
    for (const a of girokontoVergleich) {
      if (a.id in KONTOPREIS_OFFEN && a.finanzPunkte && Object.keys(a.finanzPunkte).length > 0) {
        expect(a.finanzPunkte.ohneBedingung, a.id).toBe(0);
      }
    }
    expect(girokontoVergleich.find((a) => a.id === "sumup-privatkonto")?.finanzPunkte).toEqual({});
  });

  it("nennt bei der Postbank die Bedingung (Ankerfall)", () => {
    const p = girokontoVergleich.find((a) => a.id === "postbank-giro-pur");
    const text = String(p?.werte.kontofuehrung);
    expect(text.startsWith("0 €")).toBe(true);
    expect(text).toContain("900 €");
    expect(text).toContain("5,90 €");
    expect(p?.finanzPunkte?.kontofuehrung).toBe(15);
    expect(p?.finanzPunkte?.ohneBedingung).toBe(0);
  });
});
