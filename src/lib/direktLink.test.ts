import { beforeEach, describe, expect, it } from "vitest";
import { startPartner } from "@/data/investmentStart";
import { partnerLinks } from "@/data/partnerLinks";
import { blockerFest, direktLink, imBlocker, ohneZwischenseite } from "./direktLink";
import { findStartPartner } from "@/data/investmentStart";

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
    sessionStorage.clear();
    expect(direktLink(p, "?src=gbkopf")).toBe(p.link.replace("{SUBID}", "gbkopfd"));
    // CV16F: Zeichnen schreibt nichts mehr in den Speicher, die Stelle wird nicht zur Herkunft.
    expect(direktLink(p, "")).toBe(p.link.replace("{SUBID}", "startd"));
    sessionStorage.setItem("amanah_src", "dmliste");
    expect(direktLink(p, "?src=gbkopf")).toBe(p.link.replace("{SUBID}", "dmlistegbkopfd"));
    sessionStorage.clear();
  });

  it("nimmt start, wenn keine gültige Quelle da ist", () => {
    const p = finde("bbbank-bettersmart");
    expect(direktLink(p, "?src=<x>")).toBe(p.link.replace("{SUBID}", "startd"));
  });
});

describe("Knöpfe trotz Werbeblocker sichtbar (06.11.2026, Smartbroker+ am Laptop ohne Knopf)", () => {
  // EasyList: ##a[href^="https://www.financeads.net/tc.php?"] versteckt jeden solchen Link auf jeder Seite.
  const easylist = (href: string) => href.startsWith("https://www.financeads.net/tc.php?") || href.startsWith("https://financeads.net/tc.php?");

  it("zeigt keinen Knopf mit einer Adresse, die EasyList versteckt", () => {
    for (const p of startPartner) {
      const { href } = blockerFest(p.kurzname, p.link.replace("{SUBID}", "starth"), true);
      expect(easylist(href), p.kurzname).toBe(false);
    }
  });

  it("führt jeden umgeleiteten Knopf über /weiter/<kurzname> zum selben Partnerlink", () => {
    const umgeleitet = startPartner.filter((p) => imBlocker(p.link));
    expect(umgeleitet.length).toBeGreaterThan(10);
    for (const p of umgeleitet) {
      expect(blockerFest(p.kurzname, p.link, true).href).toBe(`/weiter/${p.kurzname}`);
      expect(findStartPartner(p.kurzname)?.link).toBe(p.link);
    }
  });

  it("lässt Links anderer Netzwerke unverändert", () => {
    expect(blockerFest("traders-place", "https://c.neqty.net/trck/eclick/abc", true)).toEqual({ href: "https://c.neqty.net/trck/eclick/abc" });
  });
});
