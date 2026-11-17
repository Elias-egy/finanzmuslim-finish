import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import CheckEinstieg from "@/components/CheckEinstieg";
import type { CheckQuelle } from "@/data/halalFinanzCheck";
import { stimmeFuerEinstieg, stimmenFuer, type Stimme } from "@/data/checkStimmen";

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
      expect(ziele(container), quelle).toEqual([`/check?quelle=${quelle}`]);
      expect(container.querySelector("a")?.textContent).toBe("Match finden");
      expect(container.textContent).not.toMatch(/Quiz starten|Check starten/);
      expect(container.querySelector("aside")?.getAttribute("data-check-einstieg")).toBe(quelle);
      unmount();
    }
  });

  it("oben kein Foto, nur der Satz „selbst getestet und die gesucht, die du als Muslim am besten nehmen kannst“, je Art mit der richtigen Zahl", () => {
    const k = zeige("boykottliste");
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Du achtest beim Einkaufen drauf. Und bei deiner Bank?");
    expect(k.container.textContent).toContain("Ich habe 54 Girokonten selbst getestet und die gesucht, die du als Muslim am besten nehmen kannst.");
    k.unmount();
    const d = zeige("aktienliste");
    expect(d.container.textContent).toContain("Ich habe 35 Depots selbst getestet und die gesucht, die du als Muslim am besten nehmen kannst.");
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

  it("ohne echte Stimme steht live keine Stimme: im Entwicklungsmodus nur die Beispiel-Stimme als Platzhalter markiert", () => {
    const { container } = zeige("boykottliste");
    const f = container.querySelector("figure");
    if (import.meta.env.DEV) expect(f?.hasAttribute("data-stimme-platzhalter")).toBe(true);
    else expect(f).toBeNull();
  });
});

describe("Stimmen je Art", () => {
  const stimmen: Stimme[] = [
    { art: "konto", zitat: "K", name: "A" },
    { art: "depot", zitat: "D", name: "B" },
    { art: "alle", zitat: "X", name: "C" },
    { zitat: "O", name: "D" },
  ];
  it("eine Art sieht nur ihre eigenen und die für alle, nie die der anderen Art", () => {
    expect(stimmenFuer("konto", stimmen).map((s) => s.zitat)).toEqual(["K", "X", "O"]);
    expect(stimmenFuer("depot", stimmen).map((s) => s.zitat)).toEqual(["D", "X", "O"]);
    expect(stimmenFuer(undefined, stimmen)).toHaveLength(4);
    // Die allgemeine Seite (Elias RN15-01: „einmal eine, die alle abdeckt“) sieht nur die, die alles abdecken.
    expect(stimmenFuer("alle", stimmen).map((s) => s.zitat)).toEqual(["X", "O"]);
    expect(stimmeFuerEinstieg("konto", stimmen)?.zitat).toBe("K");
    expect(stimmeFuerEinstieg("depot", [stimmen[0]])).toBeUndefined();
  });
});
