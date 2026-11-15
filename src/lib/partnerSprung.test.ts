import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { startPartner } from "@/data/investmentStart";
import { partnerLinks } from "@/data/partnerLinks";
import { START_LINKS, startLink } from "@/data/startLinks";
import { direktLink } from "@/lib/direktLink";
import { outZiel } from "@/lib/partnerSprung";
import { ladePartnerSprung, partnerKlick } from "@/lib/partnerKlick";

describe("PH4: Sofort-Sprung vom Knopf zum Anbieter", () => {
  beforeEach(() => sessionStorage.clear());

  it("hat jeden Startseiten-Link genau einmal in der kleinen Tabelle", () => {
    expect(Object.keys(START_LINKS).length).toBe(startPartner.length);
    for (const p of startPartner) expect(startLink(p.kurzname), p.kurzname).toBe(p.link);
    expect(startLink("gibtsnicht")).toBeUndefined();
    expect(startLink("toString")).toBeUndefined();
  });

  it("führt jeden aktiven Partner ohne investmentStart.ts dorthin, wo /out vorher hinführte", () => {
    for (const l of partnerLinks.filter((x) => x.aktiv)) {
      const p = startPartner.find((x) => x.kurzname === l.kurzname);
      const erwartet = p?.link ? direktLink(p, "?src=gbkopf") : /^https?:\/\//.test(l.ziel) ? `${l.ziel}${l.ziel.includes("?") ? "&" : "?"}src=gbkopf` : null;
      expect(outZiel(l.kurzname, "?src=gbkopf")?.ziel ?? null, l.kurzname).toBe(erwartet);
    }
  });

  it("lässt inaktive, unbekannte und „Depot da, noch leer“ über die Seite /out laufen", () => {
    const inaktiv = partnerLinks.find((x) => !x.aktiv)!;
    expect(outZiel(inaktiv.kurzname, "")).toBeNull();
    expect(outZiel("gibtsnicht", "")).toBeNull();
    expect(outZiel("scalable", "?src=dmleergold")).toBeNull();
  });
});

describe("PH4: Klick auf einen Knopf zu /out", () => {
  const assign = vi.fn();
  const original = window.location;
  beforeEach(async () => {
    await ladePartnerSprung();
    Object.defineProperty(window, "location", { configurable: true, value: { ...original, origin: original.origin, href: original.href, assign } });
    document.addEventListener("click", partnerKlick, true);
  });
  afterEach(() => {
    document.removeEventListener("click", partnerKlick, true);
    Object.defineProperty(window, "location", { configurable: true, value: original });
    assign.mockReset();
    document.body.innerHTML = "";
  });

  const knopf = (href: string, extra: Record<string, string> = {}) => {
    const a = document.createElement("a");
    a.href = href;
    for (const [k, v] of Object.entries(extra)) a.setAttribute(k, v);
    a.innerHTML = "<span>Zum Angebot*</span>";
    document.body.appendChild(a);
    return a;
  };

  it("springt beim Tippen direkt zum Anbieter und hält die eigene Navigation an", () => {
    const a = knopf("/out/norisbank");
    const e = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
    a.querySelector("span")!.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
    expect(assign).toHaveBeenCalledWith(startLink("norisbank"));
  });

  it("lässt neuen Tab, Mittelklick und Taste mit Klick in Ruhe", () => {
    const a = knopf("/out/norisbank", { target: "_blank" });
    a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));
    const b = knopf("/out/norisbank");
    b.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, metaKey: true }));
    b.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 1 }));
    expect(assign).not.toHaveBeenCalled();
  });

  it("fasst andere Links nicht an", () => {
    const a = knopf("/vergleich/depot");
    const e = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
    a.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(false);
    expect(assign).not.toHaveBeenCalled();
  });
});
