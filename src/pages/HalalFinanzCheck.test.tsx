import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HalalFinanzCheck from "@/pages/HalalFinanzCheck";

/**
 * Halal-Finanz-Check RN7: zuerst die Verkaufsseite, dann die Fragen auf derselben Route. Fassung per Speicher gesetzt
 * (src/lib/abTest.ts, Schlüssel fm_ab_check-depotfrage), damit der Durchlauf bestimmt ist.
 */
const zeige = (adresse: string, fassung: "a" | "b" = "a") => {
  window.localStorage.setItem("fm_ab_check-depotfrage", fassung);
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[adresse]}>
        <HalalFinanzCheck />
      </MemoryRouter>
    </HelmetProvider>,
  );
};

const tippe = async (name: RegExp) => {
  fireEvent.click(screen.getAllByRole("button", { name })[0]);
  await act(async () => {
    vi.advanceTimersByTime(300);
  });
};

beforeEach(() => {
  vi.useFakeTimers();
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  vi.useRealTimers();
  window.localStorage.clear();
});

describe("Halal-Finanz-Check Seite", () => {
  it("zeigt bei jeder Quelle zuerst die Verkaufsseite, nicht die erste Frage", () => {
    for (const quelle of ["aktienliste", "halal-anlagen", "boykottliste", "homepage"]) {
      const { unmount } = zeige(`/check?quelle=${quelle}`);
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Welches Konto und Depot passt zu deinem Glauben und deinem Geld?");
      expect(screen.queryByText("Was willst du als Erstes halal machen?")).toBeNull();
      expect(screen.getAllByRole("button", { name: /Check starten/ }).length).toBeGreaterThanOrEqual(3);
      unmount();
    }
  });

  it("Reihenfolge der Verkaufsseite: Hero, Gründer-Satz, Kriterien, Bekommst, Fragen, Schluss", () => {
    const { container } = zeige("/check?quelle=aktienliste");
    const text = container.textContent ?? "";
    const reihe = [
      "HALAL-FINANZ-CHECK",
      "3 Fragen",
      "Ich wollte investieren, ohne einen Cent Riba.",
      "Was der Check für dich prüft",
      "Das bekommst du",
      "Das lassen wir weg",
      "Deine Frage fehlt? Schreib mir auf Instagram.",
      "Noch unsicher, womit du startest?",
      "Werbelink",
    ].map((t) => text.indexOf(t));
    expect(reihe.every((i) => i >= 0)).toBe(true);
    expect([...reihe].sort((a, b) => a - b)).toEqual(reihe);
  });

  it("Stimmen-Platzhalter stehen nur im Entwicklungsmodus an der Stelle (Test läuft im Entwicklungsmodus)", () => {
    const { container } = zeige("/check?quelle=aktienliste");
    expect(container.querySelectorAll("[data-stimme-platzhalter]")).toHaveLength(2);
    expect(container.textContent).toContain("Hier kommt deine echte Stimme 1");
    expect(container.textContent).toContain("Hier kommt deine echte Stimme 2");
  });

  it("„Check starten“ öffnet auf derselben Route die erste Frage, bei jeder Quelle ohne Freebie-Zeile", async () => {
    for (const quelle of ["aktienliste", "halal-anlagen", "boykottliste", "homepage"]) {
      const { unmount, container } = zeige(`/check?quelle=${quelle}`);
      await tippe(/^Check starten/);
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Was willst du als Erstes halal machen?");
      expect(container.textContent).not.toMatch(/Aktien aus der Liste|ETFs und Gold aus deiner Liste|Du achtest beim Einkaufen/);
      expect(screen.getAllByText("beliebt").length).toBe(1);
      unmount();
    }
  });

  it("Konto-Weg: Verkaufsseite, Konto, Filiale, Ergebnis", async () => {
    zeige("/check?quelle=aktienliste");
    await tippe(/^Check starten/);
    await tippe(/Mein Konto zinsfrei machen/);
    await tippe(/Nein, alles per App/);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Dein Match: norisbank");
    expect(screen.getByText("Passt am besten")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Konto eröffnen\*/ }).getAttribute("href")).toBe("/out/norisbank?src=fcaknoa");
  });

  it("Fassung a: Investieren, Erfahrung, „Was ist dir wichtiger?“ endet nach drei Fragen", async () => {
    zeige("/check", "a");
    await tippe(/^Check starten/);
    await tippe(/Halal investieren/);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Wie viel Erfahrung hast du mit dem Investieren?");
    await tippe(/Noch keine/);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Was ist dir wichtiger?");
    await tippe(/Möglichst niedrige Kosten/);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Dein Match: Smartbroker+");
    expect(screen.getByText("Deine Antworten")).toBeTruthy();
    expect(screen.getByText("Lieber die Alternative?")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Depot eröffnen\*/ }).getAttribute("href")).toBe("/out/smartbroker?src=fchpsba");
    expect(screen.getByText(/Zinsfreies Girokonto bei der norisbank/)).toBeTruthy();
  });

  it("Fassung b: nach „Was ist dir wichtiger?“ kommt der Monatsbetrag, das Ergebnis bleibt", async () => {
    zeige("/check", "b");
    await tippe(/^Check starten/);
    await tippe(/Halal investieren/);
    await tippe(/Erste Schritte/);
    await tippe(/Möglichst viele Halal-Anlagen/);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Wie viel möchtest du im Monat anlegen?");
    await tippe(/50 bis 200 €/);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Dein Match: flatex");
    expect(screen.getByText("50 bis 200 € im Monat")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Depot eröffnen\*/ }).getAttribute("href")).toBe("/out/flatex?src=fchpflb");
  });

  it("„Ich habe schon ein Depot“ führt zum Zweitdepot bei Smartbroker+", async () => {
    zeige("/check", "a");
    await tippe(/^Check starten/);
    await tippe(/Halal investieren/);
    await tippe(/Ich habe schon ein Depot/);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Dein Match: Smartbroker+");
    expect(screen.getByRole("link", { name: /Zweitdepot eröffnen\*/ })).toBeTruthy();
  });

  it("Beides: Konto zuerst, Depot als kleiner zweiter Schritt", async () => {
    zeige("/check?quelle=quiz", "a");
    await tippe(/^Check starten/);
    await tippe(/^Beides/);
    await tippe(/Erste Schritte/);
    await tippe(/Möglichst viele Halal-Anlagen/);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Dein Match: norisbank");
    expect(screen.getByText(/Schritt 2: dein Depot bei flatex/)).toBeTruthy();
  });

  it("aus einem Freebie (?ziel=…) beginnt der Check bei Frage 2", () => {
    zeige("/check?quelle=aktienliste&ziel=invest");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Wie viel Erfahrung hast du mit dem Investieren?");
  });
});
