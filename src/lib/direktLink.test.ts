import { beforeEach, describe, expect, it } from "vitest";
import { startPartner } from "@/data/investmentStart";
import { partnerLinks } from "@/data/partnerLinks";
import { direktLink, ohneZwischenseite } from "./direktLink";

const finde = (k: string) => startPartner.find((p) => p.kurzname === k)!;

describe("Zwischenseite nur mit Video (Elias, 05.11.2026, H16)", () => {
  beforeEach(() => sessionStorage.clear());

  it("lässt Depots auf ihrer Startseite und schickt alle anderen direkt", () => {
    for (const p of startPartner) expect(ohneZwischenseite(p), p.kurzname).toBe(p.art !== "depot");
  });

  it("führt jede Startseite ohne Zwischenseite auf einen externen Link", () => {
    for (const p of startPartner.filter(ohneZwischenseite)) expect(p.link, p.kurzname).toMatch(/^https:\/\//);
  });

  it("hat für jeden aktiven Partnerlink ohne Video eine Startseite mit Affiliate-Link", () => {
    for (const l of partnerLinks.filter((x) => x.aktiv && x.kurzname !== "scalable")) {
      expect(startPartner.some((p) => p.kurzname === l.kurzname), l.kurzname).toBe(true);
    }
  });

  it("setzt die Quelle aus ?src mit d für direkt in die SubID", () => {
    const p = startPartner.find((x) => ohneZwischenseite(x) && x.link.includes("{SUBID}"));
    if (!p) return;
    expect(direktLink(p, "?src=gbkopf")).toBe(p.link.replace("{SUBID}", "gbkopfd"));
    expect(direktLink(p, "")).toBe(p.link.replace("{SUBID}", "gbkopfd"));
  });

  it("nimmt start, wenn keine gültige Quelle da ist", () => {
    const p = finde("bbbank-bettersmart");
    expect(direktLink(p, "?src=<x>")).toBe(p.link.replace("{SUBID}", "startd"));
  });
});
