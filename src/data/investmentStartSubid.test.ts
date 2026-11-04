import { describe, expect, it } from "vitest";
import { startPartner } from "./investmentStart";

// CV4 (04.11.2026): jeder FinanceQuality-Link trägt die Kennung, financeAds nie (Teilnahmebedingungen).
describe("Kennung im Partner-Link", () => {
  it("steht in jedem FinanceQuality-Link", () => {
    const fq = startPartner.filter((p) => p.link.includes("neqty.net"));
    expect(fq.length).toBeGreaterThanOrEqual(8);
    for (const p of fq) expect(p.link).toMatch(/\?subid=\{SUBID\}$/);
  });
  it("fehlt in jedem financeAds-Link", () => {
    for (const p of startPartner.filter((x) => x.link.includes("financeads"))) expect(p.link).not.toContain("SUBID");
  });
});
