import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import CheckEinstieg from "@/components/CheckEinstieg";
import type { CheckQuelle } from "@/data/halalFinanzCheck";

const zeige = (quelle: CheckQuelle) =>
  render(
    <MemoryRouter>
      <CheckEinstieg quelle={quelle} />
    </MemoryRouter>,
  );

const ziele = (c: HTMLElement) => [...c.querySelectorAll("a")].map((a) => a.getAttribute("href"));
const pillen = (c: HTMLElement) => c.querySelectorAll(".ce-wahlen")[0];

describe("Werbung für den Check im Freebie (RN16-09): ein Knopf, kleine Vorschau des Checks, Stimme", () => {
  it("genau ein Link, der den Check ganz normal öffnet, mit der Quelle des Freebies; kein „Quiz starten“, die Fragen laufen nicht im Kasten", () => {
    for (const quelle of ["boykottliste", "aktienliste", "halal-anlagen", "gold-plan", "rizq"] as const) {
      const { container, unmount } = zeige(quelle);
      // RN16-13: zwei Knöpfe, beide „Match finden“ auf denselben Check.
      expect(ziele(container), quelle).toEqual([`/check?quelle=${quelle}`, `/check?quelle=${quelle}`]);
      expect([...container.querySelectorAll("a")].map((a) => a.textContent)).toEqual(["Match finden", "Match finden"]);
      expect(container.textContent).not.toMatch(/Quiz starten|Check starten/);
      expect(container.querySelector("aside")?.getAttribute("data-check-einstieg")).toBe(quelle);
      unmount();
    }
  });

  it("oben kein Foto, nur der Satz „selbst getestet und die gesucht, die du als Muslim am besten nehmen kannst“, je Art mit der richtigen Zahl", () => {
    const k = zeige("boykottliste");
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("54 Bankkonten, 35 Depots. Ich habe sie alle getestet.");
    expect(k.container.textContent).toContain("Viele Muslime wissen nicht, dass ihr Bankkonto ihnen Zinsen zahlt oder einen Dispo einräumt. Deshalb habe ich fast 90 Anbieter verglichen und einen Test gebaut");
  });

  it("die Vorschau zeigt die echte erste Frage mit „beliebt“ am Bankkonto und aus Anlagen-Freebies orange „passt zu …“ am Depot (RN16-08)", () => {
    const k = zeige("boykottliste");
    expect(pillen(k.container).textContent).toBe("Neues BankkontobeliebtDepot zum Investieren");
    k.unmount();
    const d = zeige("aktienliste");
    expect(pillen(d.container).textContent).toBe("Neues BankkontobeliebtDepot zum Investierenpasst zu deiner Liste");
  });

  it("das Match in der Vorschau ist gerechnet und trägt eine Prozentzahl", () => {
    const { container } = zeige("boykottliste");
    expect(container.querySelector(".ce-ring-zahl")?.textContent).toMatch(/^\d+%$/);
  });

  it("bestätigte Stimmen stehen ohne Platzhalter-Markierung (RN18-02: Matin bestätigt)", () => {
    const { container } = zeige("boykottliste");
    const f = container.querySelector("figure");
    expect(f?.getAttribute("data-stimme")).toBe("matin");
    expect(f?.hasAttribute("data-stimme-platzhalter")).toBe(false);
  });

  it("bis zu drei Stimmen untereinander, kein Wischen (RN16-10, RN16-11)", () => {
    const { container } = zeige("boykottliste");
    expect(container.querySelectorAll(".ce-stimmen figure").length).toBeLessThanOrEqual(2);
    expect(container.querySelector(".ce-punkt")).toBeNull();
  });
});

describe("Stimmen je Freebie (Elias RN16-32)", () => {
  it("Boykott-Liste: nur Matin (RN18-03); Aktien-Liste: Skeptisch, dann Reuf", () => {
    const ids = (q: CheckQuelle) => [...zeige(q).container.querySelectorAll(".ce-stimmen figure")].map((f) => f.getAttribute("data-stimme"));
    if (import.meta.env.DEV) {
      expect(ids("boykottliste")).toEqual(["matin"]);
      expect(ids("aktienliste")).toEqual(["skeptisch", "reuf"]);
    } else {
      expect(ids("boykottliste")).toEqual(["matin"]);
      expect(ids("aktienliste")).toEqual(["skeptisch", "reuf"]);
    }
  });
});
