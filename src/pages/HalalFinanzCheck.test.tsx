import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HalalFinanzCheck from "@/pages/HalalFinanzCheck";

/**
 * Halal-Finanz-Check RN7 und RN8: zuerst die Verkaufsseite, dann die Fragen als Chat auf derselben Route, zwei Arten (?art=konto, ?art=depot). Fassung per Speicher gesetzt
 * (src/lib/abTest.ts, Schlüssel fm_ab_check-depotfrage), damit der Durchlauf bestimmt ist.
 */
const Ort = () => <output data-testid="ort">{useLocation().pathname + useLocation().search}</output>;

const zeige = (adresse: string, fassung: "a" | "b" = "a") => {
  window.localStorage.setItem("fm_ab_check-depotfrage", fassung);
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[adresse]}>
        <HalalFinanzCheck />
        <Ort />
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

const tippeText = async (text: string | RegExp) => {
  fireEvent.click(screen.getByText(text).closest("button")!);
  await act(async () => {
    vi.advanceTimersByTime(300);
  });
};
const titel = () => screen.getByRole("heading", { level: 1 }).textContent;

describe("Verkaufsseite", () => {
  it("zeigt bei jeder Quelle zuerst die Verkaufsseite, nicht die erste Frage", () => {
    for (const quelle of ["aktienliste", "halal-anlagen", "boykottliste", "homepage"]) {
      const { unmount } = zeige(`/check?quelle=${quelle}`);
      expect(titel()).toBe("Welches Konto oder Depot passt wirklich zu dir?");
      expect(screen.queryByText("Was willst du als Erstes halal machen?")).toBeNull();
      expect(screen.getAllByRole("button", { name: /Match finden|Erste Frage starten/ }).length).toBeGreaterThanOrEqual(3);
      unmount();
    }
  });

  it("die Hero-Zeile nennt „89 Angebote selbst getestet“ mit drei Bank-Logos daneben, nie „eröffnet“", () => {
    const { container } = zeige("/check?quelle=homepage");
    const zeile = container.querySelector(".hc-beweis")!;
    expect(zeile.querySelector(".hc-eyebrow")!.textContent).toBe("89 Angebote selbst getestet");
    expect([...zeile.querySelectorAll("img")].map((i) => i.getAttribute("src"))).toEqual([
      "/logos/ing.de.svg",
      "/logos/dkb.de.svg",
      "/logos/commerzbank.de.svg",
    ]);
    expect(container.textContent).not.toMatch(/selbst eröffnet/);
    expect(container.textContent).not.toContain("35 Depots");
    expect(container.querySelector(".hc-haken-zeile")!.textContent).toBe("Nur 2 bis 3 FragenUnter 2 MinutenKostenlosMit Werbehinweis");
  });

  it("Reihenfolge der Verkaufsseite: Hero, Community, Schritte, Tabelle, Schluss, Werbehinweis", () => {
    const { container } = zeige("/check?quelle=aktienliste");
    const text = container.textContent ?? "";
    const reihe = [
      "89 Angebote selbst getestet",
      "Aus der Community",
      "So entsteht deine Empfehlung",
      "Warum nicht einfach das erstbeste",
      "kurze Fragen, dann weißt du, was zu dir passt",
      "Werbehinweis & Transparenz",
    ].map((t) => text.indexOf(t));
    expect(reihe.every((i) => i >= 0)).toBe(true);
    expect([...reihe].sort((a, b) => a - b)).toEqual(reihe);
  });

  it("die Tabelle hat nur Häkchen, Kreuze und die 89 in unserer Spalte, keine Wertung über andere", () => {
    const { container } = zeige("/check?quelle=aktienliste");
    const tab = container.querySelector(".hc-tab")!;
    expect(tab.querySelectorAll("thead th")).toHaveLength(4);
    expect(tab.querySelectorAll("tbody tr")).toHaveLength(3);
    expect(tab.querySelector("tbody tr td.hc-tab-wir")!.textContent).toBe("89");
    expect([...tab.querySelectorAll("tbody tr:first-child td")].map((t) => t.textContent)).toEqual(["89", "–", "–"]);
    expect(tab.textContent).not.toMatch(/keine|teils|Min\.|Stunden/);
  });

  it("Stimmen-Platzhalter stehen nur im Entwicklungsmodus an der Stelle (Test läuft im Entwicklungsmodus)", () => {
    const { container } = zeige("/check?quelle=aktienliste");
    expect(container.querySelectorAll("[data-stimme-platzhalter]")).toHaveLength(2);
    expect(container.textContent).toContain("Hier kommt deine echte Stimme 1");
  });

  it("mit ?art= trägt die Verkaufsseite das eine Thema", () => {
    const k = zeige("/check?art=konto");
    expect(titel()).toBe("Welches Bankkonto passt wirklich zu dir?");
    k.unmount();
    zeige("/check?art=depot");
    expect(titel()).toBe("Welches Depot passt wirklich zu dir?");
  });

  it("der zweite Knopf führt je Art in den Vergleich", () => {
    const alt = (adresse: string) => {
      const r = zeige(adresse);
      const pfad = [...r.container.querySelectorAll("a.hc-btn--rand")].map((a) => `${a.textContent}|${a.getAttribute("href")}`);
      r.unmount();
      return pfad;
    };
    expect(alt("/check?art=konto")).toEqual(["Erst Bankkonten vergleichen|/vergleich/girokonto"]);
    expect(alt("/check?art=depot")).toEqual(["Erst Depots vergleichen|/vergleich/depot"]);
    expect(alt("/check")).toEqual(["Erst Depots vergleichen|/vergleich/depot"]);
  });
});

describe("Chat", () => {
  it("erste Frage wie im Original: Kopf mit Elias und „Hat 35 Depots und 54 Konten getestet“, Salam-Blase, „Was suchst du gerade?“, drei Antworten, Zurück", async () => {
    const { container } = zeige("/check?art=konto&schritt=fragen");
    expect(container.querySelector(".hc-chat-kopf")?.textContent).toContain("Elias");
    expect(container.querySelector(".hc-chat-kopf")?.textContent).toContain("Hat 35 Depots und 54 Konten getestet");
    expect(container.querySelector(".hc-chat-kopf img")?.getAttribute("src")).toBe("/elias-el-gendy.webp");
    expect(container.querySelectorAll(".hc-striche li")).toHaveLength(3);
    const blasen = container.querySelectorAll(".hc-chat .hc-sprech");
    expect(blasen).toHaveLength(2);
    expect(blasen[0].textContent).toBe(
      "Salam! Ich habe 35 Depots und 54 Girokonten selbst getestet, um Muslimen zu helfen, und will dir nur das zeigen, was wirklich zu dir passt.",
    );
    expect(titel()).toBe("Was suchst du gerade?");
    expect([...container.querySelectorAll(".hc-wahlen .hc-wahl")].map((b) => b.textContent)).toEqual([
      "Neues Bankkontoam beliebtesten",
      "Depot zum Investieren",
      "Noch unsicher",
    ]);
    expect(screen.getByRole("button", { name: /Zurück/ })).toBeTruthy();
    await tippeText("Neues Bankkonto");
    expect(titel()).toBe("Wie bezahlst du meistens?");
    expect(container.querySelectorAll(".hc-wahlen .hc-wahl")).toHaveLength(3);
  });

  it("„Noch unsicher“ führt in den Bankkonto-Weg mit einem Satz dazu", async () => {
    const { container } = zeige("/check?schritt=fragen");
    await tippeText("Noch unsicher");
    expect(titel()).toBe("Wie bezahlst du meistens?");
    expect(container.querySelector(".hc-chat .hc-sprech")?.textContent).toBe("Kein Problem. Dann fang mit dem Konto an, das ist der leichteste Schritt.");
  });

  it("„Match finden“ öffnet auf derselben Route die erste Frage mit „am beliebtesten“ genau einmal", async () => {
    zeige("/check?quelle=aktienliste");
    await tippe(/^Match finden/);
    expect(titel()).toBe("Was suchst du gerade?");
    expect(screen.getAllByText("am beliebtesten").length).toBe(1);
  });
});

describe("Bankkonto-Check", () => {
  it("Weg: Wie bezahlst du, Bank suchen, Ergebnis „Von der Sparkasse zur norisbank“ mit einem Knopf", async () => {
    const { container } = zeige("/check?art=konto&quelle=boykottliste&schritt=fragen");
    await tippeText("Neues Bankkonto");
    await tippeText("Fast nur mit Karte");
    expect(titel()).toBe("Bei welcher Bank bist du heute?");
    // Schnellwahl: acht Banken und „Noch kein Konto“.
    const schnell = container.querySelector(".hc-schnell")!;
    expect(within(schnell as HTMLElement).getAllByRole("button")).toHaveLength(9);
    await tippeText("Sparkasse");
    expect(titel()).toBe("Von der Sparkasse zur norisbank");
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: /Konto eröffnen\*/ }).getAttribute("href")).toBe("/out/norisbank?src=fcbonoa");
    expect(container.textContent).toContain("steht in deinem Kontoauszug");
    expect(container.textContent).not.toMatch(/Depot|flatex|Alternative|Freitagsbrief|%/);
  });

  it("Tippen filtert sofort: „v“ zeigt als ersten Vorschlag Volksbank, Enter nimmt ihn", async () => {
    const { container } = zeige("/check?art=konto&schritt=fragen");
    await tippeText("Neues Bankkonto");
    await tippeText("Fast nur mit Karte");
    const feld = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(feld, { target: { value: "v" } });
    expect(container.querySelector(".hc-vorschlaege button")?.textContent).toBe("Volksbank");
    fireEvent.keyDown(feld, { key: "Enter" });
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(titel()).toBe("Von der Volksbank zur norisbank");
  });

  it("Phantasiebank wird nie „nicht gefunden“: „übernehmen“ ist der Vorschlag, das Ergebnis läuft weiter", async () => {
    const { container } = zeige("/check?art=konto&schritt=fragen");
    await tippeText("Neues Bankkonto");
    await tippeText("Karte und ab und zu Bargeld");
    const feld = screen.getByRole("textbox");
    fireEvent.change(feld, { target: { value: "Phantasiebank" } });
    expect(container.textContent).not.toMatch(/nicht gefunden|Keine Bank/i);
    expect(container.querySelector(".hc-vorschlaege button")?.textContent).toBe("„Phantasiebank“ übernehmen");
    fireEvent.keyDown(feld, { key: "Enter" });
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(titel()).toBe("Von deiner Bank zur norisbank");
    expect(container.textContent).toContain("Phantasiebank");
    expect(screen.getByRole("link", { name: /Konto eröffnen\*/ }).getAttribute("href")).not.toMatch(/phantasie/i);
  });

  it("nur „Viel Bargeld“ führt zur BBBank", async () => {
    zeige("/check?art=konto&schritt=fragen");
    await tippeText("Neues Bankkonto");
    await tippeText("Viel Bargeld, ich will in eine Filiale");
    await tippeText("Volksbank");
    expect(titel()).toBe("Von der Volksbank zur BBBank");
    expect(screen.getByRole("link", { name: /Konto eröffnen\*/ }).getAttribute("href")).toBe("/out/bbbank-bettersmart?src=fchpbba");
  });

  it("„Noch kein Konto“ zeigt „Dein Bankkonto: norisbank“ mit einer Spalte", async () => {
    const { container } = zeige("/check?art=konto&schritt=fragen");
    await tippeText("Neues Bankkonto");
    await tippeText("Fast nur mit Karte");
    await tippeText("Noch kein Konto");
    expect(titel()).toBe("Dein Bankkonto: norisbank");
    expect(container.querySelector(".hc-vs--eins")).toBeTruthy();
  });

  it("norisbank als heutige Bank: freundlicher Satz ohne Knopf", async () => {
    const { container } = zeige("/check?art=konto&schritt=fragen");
    await tippeText("Neues Bankkonto");
    await tippeText("Fast nur mit Karte");
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "norisbank" } });
    fireEvent.click(container.querySelector(".hc-vorschlaege button")!);
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(titel()).toBe("Du hast schon ein Konto ohne Zinsen auf dein Guthaben");
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("der Bankname kommt nie in die Adresse", async () => {
    zeige("/check?art=konto&schritt=fragen");
    await tippeText("Neues Bankkonto");
    await tippeText("Fast nur mit Karte");
    await tippeText("Sparkasse");
    expect(titel()).toBe("Von der Sparkasse zur norisbank");
    expect(screen.getByTestId("ort").textContent).not.toMatch(/sparkasse|bank/i);
  });
});

describe("Depot-Check", () => {
  it("Fassung a: Erfahrung, „Was ist dir wichtiger?“, Ergebnis mit Passung als Ring und genau einem Knopf", async () => {
    const { container } = zeige("/check?art=depot&schritt=fragen", "a");
    await tippeText("Depot zum Investieren");
    expect(titel()).toBe("Wie viel Erfahrung hast du mit dem Investieren?");
    await tippeText("Noch keine");
    expect(titel()).toBe("Was ist dir wichtiger?");
    await tippeText("Möglichst niedrige Kosten");
    expect(titel()).toBe("Dein Match: Smartbroker+");
    expect(container.querySelector(".hc-ring")?.getAttribute("aria-label")).toMatch(/^Passt zu \d+ Prozent zu dir$/);
    expect(container.textContent).toMatch(/Passt zu \d+\s%\szu dir/);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: /Depot eröffnen\*/ }).getAttribute("href")).toBe("/out/smartbroker?src=fchpsba");
    expect(container.textContent).not.toMatch(/Alternative|Girokonto|norisbank/);
  });

  it("Fassung b: nach „Was ist dir wichtiger?“ kommt der Monatsbetrag, das Depot bleibt", async () => {
    zeige("/check?art=depot&schritt=fragen", "b");
    await tippeText("Depot zum Investieren");
    await tippeText("Erste Schritte");
    await tippeText("Möglichst viele Halal-Anlagen");
    expect(titel()).toBe("Wie viel möchtest du im Monat anlegen?");
    await tippeText("50 bis 200 €");
    expect(titel()).toBe("Dein Match: flatex");
    expect(screen.getByText("50 bis 200 € im Monat")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Depot eröffnen\*/ }).getAttribute("href")).toBe("/out/flatex?src=fchpflb");
  });

  it("„Ich habe schon ein Depot“ führt zum Zweitdepot bei Smartbroker+", async () => {
    zeige("/check?art=depot&schritt=fragen", "a");
    await tippeText("Depot zum Investieren");
    await tippeText("Ich habe schon ein Depot");
    expect(titel()).toBe("Dein Match: Smartbroker+");
    expect(screen.getByRole("link", { name: /Zweitdepot eröffnen\*/ })).toBeTruthy();
  });
});

describe("Ohne art und aus dem Freebie", () => {
  it("ohne art: erste Frage, Neues Bankkonto und Noch unsicher führen in den Bankkonto-Weg, Depot in den Depot-Weg", async () => {
    const a = zeige("/check?schritt=fragen");
    await tippeText("Neues Bankkonto");
    expect(titel()).toBe("Wie bezahlst du meistens?");
    a.unmount();
    const b = zeige("/check?schritt=fragen");
    await tippeText("Depot zum Investieren");
    expect(titel()).toBe("Wie viel Erfahrung hast du mit dem Investieren?");
    b.unmount();
    zeige("/check?schritt=fragen");
    await tippeText("Noch unsicher");
    expect(titel()).toBe("Wie bezahlst du meistens?");
  });

  it("aus dem Freebie (start=2) keine Verkaufsseite, die erste Antwort ist da, der Chat geht bei Frage 2 weiter", () => {
    const k = zeige("/check?art=konto&quelle=boykottliste&start=2&a1=karte");
    expect(titel()).toBe("Bei welcher Bank bist du heute?");
    expect(screen.queryByText("So entsteht deine Empfehlung")).toBeNull();
    k.unmount();
    const d = zeige("/check?art=depot&quelle=aktienliste&start=2&a1=erste");
    expect(titel()).toBe("Was ist dir wichtiger?");
    d.unmount();
  });

  it("alte Adressen mit ?ziel= laufen weiter", () => {
    const k = zeige("/check?quelle=quiz&ziel=konto");
    expect(titel()).toBe("Wie bezahlst du meistens?");
    k.unmount();
    zeige("/check?quelle=aktienliste&ziel=invest");
    expect(titel()).toBe("Wie viel Erfahrung hast du mit dem Investieren?");
  });
});
