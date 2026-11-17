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

const titel = (c: HTMLElement) => [...c.querySelectorAll("li")].map((li) => li.querySelector("a span.block")?.textContent);
const gruen = (c: HTMLElement) => [...c.querySelectorAll("li")].map((li) => li.querySelector("[data-etikett]")?.textContent ?? null);
const orange = (c: HTMLElement) => [...c.querySelectorAll("li")].map((li) => li.querySelector("[data-hinweis]")?.textContent ?? null);

describe("Einstieg aus dem Freebie (RN10-07, RN16-07, RN16-08): überall dieselbe Frage, Bankkonto grün, Depot orange aus Anlagen-Freebies", () => {
  it("Boykott-Liste: Zeile „Du achtest beim Einkaufen drauf. Und bei deiner Bank?“, erste Frage „Was suchst du gerade?“, Bankkonto mit „am beliebtesten“", () => {
    const { container } = zeige("boykottliste");
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Du achtest beim Einkaufen drauf. Und bei deiner Bank?");
    expect(container.textContent).toContain("Was suchst du gerade?");
    expect(ziele(container)).toEqual([
      "/check?quelle=boykottliste&start=2&a1=konto",
      "/check?quelle=boykottliste&start=2&a1=invest",
      "/check?quelle=boykottliste&start=2&a1=unsicher",
    ]);
    expect(titel(container)).toEqual(["Neues Bankkonto", "Depot zum Investieren", "Noch unsicher"]);
    expect(gruen(container)).toEqual(["am beliebtesten", null, null]);
    expect(orange(container)).toEqual([null, null, null]);
  });

  it("Aktien-Liste und Halal-Anlagen-Liste: Bankkonto bleibt grün „am beliebtesten“, Depot trägt orange „passt zu deiner Liste“ (RN16-08)", () => {
    for (const quelle of ["aktienliste", "halal-anlagen"] as const) {
      const { container, unmount } = zeige(quelle);
      expect(container.textContent).toContain("Was suchst du gerade?");
      expect(ziele(container)).toEqual([
        `/check?quelle=${quelle}&start=2&a1=konto`,
        `/check?quelle=${quelle}&start=2&a1=invest`,
        `/check?quelle=${quelle}&start=2&a1=unsicher`,
      ]);
      expect(gruen(container)).toEqual(["am beliebtesten", null, null]);
      expect(orange(container)).toEqual([null, "passt zu deiner Liste", null]);
      unmount();
    }
  });

  it("jede Stelle trägt ihr eigenes ?quelle=, und jede öffnet denselben Check mit der gewählten Antwort", () => {
    for (const quelle of ["boykottliste", "aktienliste", "halal-anlagen", "homepage"] as const) {
      const { container, unmount } = zeige(quelle);
      for (const h of ziele(container)) expect(h).toMatch(new RegExp(`^/check\\?quelle=${quelle}&start=2&a1=(konto|invest|unsicher)$`));
      unmount();
    }
  });

  it("die acht weiteren Freebies tragen ihre eigene Quelle und das Etikett, das zu ihnen passt", () => {
    const erwartet: [CheckQuelle, string | null][] = [
      ["vertrags-ampel", null],
      ["auto-abo", null],
      ["baraka-blocker", null],
      ["rizq", null],
      ["gold-plan", "passt zu deinem Plan"],
      ["sukuk-plan", "passt zu deinem Plan"],
      ["portfolio-plan", "passt zu deinem Plan"],
      ["broker-vergleich", "passt zu deinem Vergleich"],
    ];
    for (const [quelle, depot] of erwartet) {
      const { container, unmount } = zeige(quelle);
      expect(container.querySelector("aside")?.getAttribute("data-check-einstieg"), quelle).toBe(quelle);
      expect(ziele(container), quelle).toEqual([1, 2, 3].map((i) => `/check?quelle=${quelle}&start=2&a1=${["konto", "invest", "unsicher"][i - 1]}`));
      expect(gruen(container), quelle).toEqual(["am beliebtesten", null, null]);
      expect(orange(container), quelle).toEqual([null, depot, null]);
      unmount();
    }
  });

  it("ohne echte Stimme steht live keine Stimme: im Entwicklungsmodus nur der gelb gestrichelte Platzhalter, nie ein ausgedachtes Zitat als echt", () => {
    const { container } = zeige("boykottliste");
    const f = container.querySelector("figure");
    if (import.meta.env.DEV) expect(f?.hasAttribute("data-stimme-platzhalter")).toBe(true);
    else expect(f).toBeNull();
  });

  it("Elias und „selbst getestet“ oben, keine Fragenzahl, die nicht stimmt, kein Knopf „Quiz starten“ (RN16-07)", () => {
    const { container } = zeige("aktienliste");
    expect(container.querySelector("[data-getestet]")?.textContent).toContain("35 Depots und 54 Girokonten selbst getestet");
    expect(container.textContent).toContain("Unter 60 Sekunden");
    expect(container.textContent).not.toMatch(/Quiz starten|Check starten/);
    expect(container.textContent).not.toMatch(/2 Fragen|Bankkonto-Check|Depot-Check/);
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
