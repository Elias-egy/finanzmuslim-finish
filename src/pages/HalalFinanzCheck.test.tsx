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

  it("„Match finden“ öffnet auf derselben Route die erste Frage mit genau einem grünen Etikett: bei der Aktien-Liste „passt zu deiner Liste“, sonst „am beliebtesten“", async () => {
    const a = zeige("/check?quelle=aktienliste");
    await tippe(/^Match finden/);
    expect(titel()).toBe("Was suchst du gerade?");
    expect(screen.getAllByText("passt zu deiner Liste").length).toBe(1);
    expect(screen.queryByText("am beliebtesten")).toBeNull();
    a.unmount();
    zeige("/check?quelle=homepage");
    await tippe(/^Match finden/);
    expect(screen.getAllByText("am beliebtesten").length).toBe(1);
    expect(screen.queryByText("passt zu deiner Liste")).toBeNull();
  });
});

describe("Bankkonto-Check", () => {
  it("Weg: Wie bezahlst du, Bank suchen, Ergebnis „Dein Match: ein kostenloses Girokonto bei norisbank“ mit einem Knopf", async () => {
    const { container } = zeige("/check?art=konto&quelle=boykottliste&schritt=fragen");
    await tippeText("Neues Bankkonto");
    await tippeText("Fast nur mit Karte");
    expect(titel()).toBe("Bei welcher Bank bist du heute?");
    // Schnellwahl (Elias RN9-01: „scrollbar“): 16 Banken in einem Scroll-Rahmen, „Noch kein Konto“ steht fest darunter, außerhalb der Liste.
    const rahmen = container.querySelector(".hc-schnell-rahmen") as HTMLElement;
    expect(rahmen).toBeTruthy();
    expect(within(rahmen).getAllByRole("button")).toHaveLength(16);
    expect(rahmen.querySelector(".hc-schnell")).toBeTruthy();
    expect(within(rahmen).queryByRole("button", { name: "Noch kein Konto" })).toBeNull();
    const keine = container.querySelector(".hc-schnell-keine") as HTMLElement;
    expect(keine.textContent).toBe("Noch kein Konto");
    expect(rahmen.contains(keine)).toBe(false);
    expect(rahmen.compareDocumentPosition(keine) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await tippeText("Sparkasse");
    expect(titel()).toBe("Dein Match: ein kostenloses Girokonto bei norisbank");
    // Die heutige Bank steht links neben der norisbank (der Titel „Sparkasse und norisbank im Vergleich“ ist in halalFinanzCheck.test.ts geprüft; KontoAnsicht zeigt ihn nicht).
    expect(container.querySelector(".hc-vs")?.textContent).toMatch(/^Sparkasse.*norisbank/);
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
    expect(titel()).toBe("Dein Match: ein kostenloses Girokonto bei norisbank");
    expect(container.querySelector(".hc-vs")?.textContent).toMatch(/^Volksbank.*norisbank/);
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
    expect(titel()).toBe("Dein Match: ein kostenloses Girokonto bei norisbank");
    expect(container.textContent).toContain("Phantasiebank");
    expect(screen.getByRole("link", { name: /Konto eröffnen\*/ }).getAttribute("href")).not.toMatch(/phantasie/i);
  });

  it("nur „Viel Bargeld“ führt zur BBBank", async () => {
    zeige("/check?art=konto&schritt=fragen");
    await tippeText("Neues Bankkonto");
    await tippeText("Viel Bargeld, ich will in eine Filiale");
    await tippeText("Volksbank");
    expect(titel()).toBe("Dein Match: ein kostenloses Girokonto bei der BBBank");
    expect(screen.getByRole("link", { name: /Konto eröffnen\*/ }).getAttribute("href")).toBe("/out/bbbank-bettersmart?src=fchpbba");
  });

  it("„Noch kein Konto“ zeigt das Match ohne heutige Bank: eine Spalte, kein Vergleichstitel", async () => {
    const { container } = zeige("/check?art=konto&schritt=fragen");
    await tippeText("Neues Bankkonto");
    await tippeText("Fast nur mit Karte");
    await tippeText("Noch kein Konto");
    expect(titel()).toBe("Dein Match: ein kostenloses Girokonto bei norisbank");
    expect(container.querySelector(".hc-vs--eins")).toBeTruthy();
    expect(container.textContent).not.toMatch(/im Vergleich/);
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
    expect(titel()).toBe("Dein Match: ein kostenloses Girokonto bei norisbank");
    expect(screen.getByTestId("ort").textContent).not.toMatch(/sparkasse|bank/i);
  });
});

describe("Depot-Check", () => {
  it("Fassung a: Hast du schon ein Depot (Nein), „Was ist dir wichtiger?“, „Worin willst du investieren?“, Ergebnis mit Passung als Ring und genau einem Knopf", async () => {
    const { container } = zeige("/check?art=depot&schritt=fragen", "a");
    await tippeText("Depot zum Investieren");
    expect(titel()).toBe("Hast du schon ein Depot?");
    expect([...container.querySelectorAll(".hc-wahlen .hc-wahl")].map((b) => b.textContent)).toEqual(["Ja", "Nein, noch nicht"]);
    // Keine Erfahrungsfrage mehr (Elias RN10-07: keine unnötigen Fragen).
    expect(container.textContent).not.toMatch(/Erfahrung|Erste Schritte/);
    await tippeText("Nein, noch nicht");
    expect(titel()).toBe("Was ist dir wichtiger?");
    await tippeText("Möglichst niedrige Kosten");
    expect(titel()).toBe("Worin willst du investieren?");
    expect([...container.querySelectorAll(".hc-wahlen .hc-wahl")].map((b) => b.textContent)).toEqual(["ETFs", "Einzelne Aktien", "Gold und Silber"]);
    expect(container.textContent).not.toMatch(/Wechsel|Welche dieser drei Eigenschaften/);
    await tippeText("Einzelne Aktien");
    expect(titel()).toBe("Dein Match: ein günstiges Halal-Depot bei Smartbroker+");
    expect(container.querySelector(".hc-ring")?.getAttribute("aria-label")).toMatch(/^Passt zu \d+ Prozent zu dir$/);
    expect(container.textContent).toMatch(/Passt zu \d+\s%\szu dir/);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: /Depot eröffnen\*/ }).getAttribute("href")).toBe("/out/smartbroker?src=fchpsba");
    expect(container.textContent).not.toMatch(/Alternative|Girokonto|norisbank|Zweitdepot/);
    // Ohne heutiges Depot kein Vergleich der beiden; „Deine Antworten“ nennt die Wahl.
    expect(container.textContent).not.toMatch(/im Vergleich/);
    expect(container.textContent).toContain("Einzelne Aktien");
    expect(container.textContent).toContain("Noch kein Depot");
  });

  it("Fassung b: nach „Worin willst du investieren?“ kommt der Monatsbetrag, das Depot bleibt", async () => {
    zeige("/check?art=depot&schritt=fragen", "b");
    await tippeText("Depot zum Investieren");
    await tippeText("Nein, noch nicht");
    await tippeText("Möglichst viele Halal-Anlagen");
    expect(titel()).toBe("Worin willst du investieren?");
    await tippeText("Gold und Silber");
    expect(titel()).toBe("Wie viel möchtest du im Monat anlegen?");
    await tippeText("50 bis 200 €");
    expect(titel()).toBe("Dein Match: ein Halal-Depot bei flatex");
    expect(screen.getByText("50 bis 200 € im Monat")).toBeTruthy();
    expect(screen.getAllByText("Gold und Silber").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /Depot eröffnen\*/ }).getAttribute("href")).toBe("/out/flatex?src=fchpflb");
  });

  it("Ja fragt „Wo hast du dein Depot?“ (DepotSuche) und führt dann über „Was ist dir wichtiger?“ und „Worin willst du investieren?“ (Elias RN9-03, RN10-07)", async () => {
    const { container } = zeige("/check?art=depot&schritt=fragen", "a");
    await tippeText("Depot zum Investieren");
    await tippeText("Ja");
    expect(titel()).toBe("Wo hast du dein Depot?");
    const rahmen = container.querySelector(".hc-schnell-rahmen") as HTMLElement;
    expect(within(rahmen).getAllByRole("button")).toHaveLength(16);
    // Depot-Suche ohne „Noch kein Konto“.
    expect(container.querySelector(".hc-schnell-keine")).toBeNull();
    expect(screen.getByRole("textbox").getAttribute("aria-label")).toBe("Wo hast du dein Depot?");
    await tippeText("Trade Republic");
    expect(titel()).toBe("Was ist dir wichtiger?");
    await tippeText("Möglichst viele Halal-Anlagen");
    expect(titel()).toBe("Worin willst du investieren?");
    await tippeText("ETFs");
    // Kein Zweitdepot: das Match folgt „Was ist dir wichtiger?“, die gewählte Anlage steht in den Vorteilen vorn.
    expect(titel()).toBe("Dein Match: ein Halal-Depot bei flatex");
    expect(container.textContent).toContain("Trade Republic und flatex im Vergleich");
    expect(container.textContent).toContain("12 von 12 Halal-ETFs und Fonds aus meinem Vergleich");
    expect(container.textContent).not.toMatch(/Zweitdepot/);
    expect(screen.getByRole("link", { name: /Depot eröffnen\*/ }).getAttribute("href")).toBe("/out/flatex?src=fchpfla");
    expect(screen.getByTestId("ort").textContent).not.toMatch(/trade|republic/i);
  });

  it("Depot-Suche: unbekanntes Depot (Phantasiedepot) zeigt in den Spalten „–“ statt einer Zahl, freier Text läuft weiter", async () => {
    const { container } = zeige("/check?art=depot&schritt=fragen", "a");
    await tippeText("Depot zum Investieren");
    await tippeText("Ja");
    const feld = screen.getByRole("textbox");
    fireEvent.change(feld, { target: { value: "Phantasiedepot" } });
    expect(container.querySelector(".hc-vorschlaege button")?.textContent).toBe("„Phantasiedepot“ übernehmen");
    expect(container.textContent).not.toMatch(/nicht gefunden/i);
    fireEvent.keyDown(feld, { key: "Enter" });
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    await tippeText("Möglichst niedrige Kosten");
    await tippeText("Einzelne Aktien");
    expect(titel()).toBe("Dein Match: ein günstiges Halal-Depot bei Smartbroker+");
    expect(container.textContent).toContain("Dein Depot und Smartbroker+ im Vergleich");
    expect(container.textContent).toContain("Phantasiedepot");
    const vs = container.querySelector(".hc-vs") as HTMLElement;
    expect(vs.textContent).toContain("–");
  });

  it("ist das heutige Depot schon das Match: „Dein Depot bei flatex passt schon“, kein Vergleich", async () => {
    const { container } = zeige("/check?art=depot&schritt=fragen", "a");
    await tippeText("Depot zum Investieren");
    await tippeText("Ja");
    await tippeText("flatex");
    await tippeText("Möglichst viele Halal-Anlagen");
    await tippeText("ETFs");
    expect(titel()).toBe("Dein Depot bei flatex passt schon");
    expect(container.textContent).not.toMatch(/im Vergleich/);
  });

  it("Gold: Royal Mint (zertifiziert, auslieferbar) steht als erster Vorteil, nur mit Beleg aus den Daten", async () => {
    const { container } = zeige("/check?art=depot&schritt=fragen", "a");
    await tippeText("Depot zum Investieren");
    await tippeText("Nein, noch nicht");
    await tippeText("Möglichst viele Halal-Anlagen");
    await tippeText("Gold und Silber");
    expect(container.textContent).toContain("Royal Mint Gold-ETC hier kaufbar, zertifiziert und auslieferbar");
  });

  it("Zurück geht Frage für Frage bis zur ersten, die Antworten verschwinden mit", async () => {
    zeige("/check?schritt=fragen", "a");
    await tippeText("Depot zum Investieren");
    await tippeText("Nein, noch nicht");
    expect(titel()).toBe("Was ist dir wichtiger?");
    await tippe(/Zurück/);
    expect(titel()).toBe("Hast du schon ein Depot?");
    await tippe(/Zurück/);
    expect(titel()).toBe("Was suchst du gerade?");
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
    expect(titel()).toBe("Hast du schon ein Depot?");
    b.unmount();
    zeige("/check?schritt=fragen");
    await tippeText("Noch unsicher");
    expect(titel()).toBe("Wie bezahlst du meistens?");
  });

  it("aus dem Freebie (start=2) keine Verkaufsseite, die Antwort auf „Was suchst du gerade?“ ist da, der Chat geht bei Frage 2 weiter", () => {
    const k = zeige("/check?quelle=boykottliste&start=2&a1=konto");
    expect(titel()).toBe("Wie bezahlst du meistens?");
    expect(screen.queryByText("So entsteht deine Empfehlung")).toBeNull();
    k.unmount();
    const u = zeige("/check?quelle=boykottliste&start=2&a1=unsicher");
    expect(titel()).toBe("Wie bezahlst du meistens?");
    u.unmount();
    const d = zeige("/check?quelle=aktienliste&start=2&a1=invest");
    expect(titel()).toBe("Hast du schon ein Depot?");
    d.unmount();
    // Ungültige Antwort: der Chat beginnt bei der ersten Frage.
    const x = zeige("/check?quelle=aktienliste&start=2&a1=unsinn");
    expect(titel()).toBe("Was suchst du gerade?");
    x.unmount();
  });

  it("alte Freebie-Adressen laufen weiter: Zahlungsart gleich Bank-Frage, Erfahrung gleich „Hast du schon ein Depot?“ oder „Wo hast du dein Depot?“", () => {
    const k = zeige("/check?art=konto&quelle=boykottliste&start=2&a1=karte");
    expect(titel()).toBe("Bei welcher Bank bist du heute?");
    k.unmount();
    const d = zeige("/check?art=depot&quelle=aktienliste&start=2&a1=erste");
    expect(titel()).toBe("Was ist dir wichtiger?");
    d.unmount();
    zeige("/check?art=depot&quelle=aktienliste&start=2&a1=depot");
    expect(titel()).toBe("Wo hast du dein Depot?");
  });

  it("überall dieselbe erste Frage, nur das grüne Etikett wandert: Standard Bankkonto „am beliebtesten“, bei Aktien-Liste und Halal-Anlagen Depot „passt zu deiner Liste“", () => {
    const etiketten = (adresse: string) => {
      const r = zeige(adresse);
      const e = [...r.container.querySelectorAll(".hc-wahlen .hc-wahl")].map((b) => b.textContent);
      r.unmount();
      return e;
    };
    for (const q of ["homepage", "boykottliste", "kopf"]) {
      expect(etiketten(`/check?quelle=${q}&schritt=fragen`), q).toEqual(["Neues Bankkontoam beliebtesten", "Depot zum Investieren", "Noch unsicher"]);
    }
    for (const q of ["aktienliste", "halal-anlagen"]) {
      expect(etiketten(`/check?quelle=${q}&schritt=fragen`), q).toEqual(["Neues Bankkonto", "Depot zum Investierenpasst zu deiner Liste", "Noch unsicher"]);
    }
  });

  it("der Chat aus einem Freebie: „Zurück“ bei Frage 2 zeigt wieder „Was suchst du gerade?“ mit demselben Etikett", async () => {
    const { container } = zeige("/check?quelle=aktienliste&start=2&a1=invest");
    expect(titel()).toBe("Hast du schon ein Depot?");
    await tippe(/Zurück/);
    expect(titel()).toBe("Was suchst du gerade?");
    expect([...container.querySelectorAll(".hc-wahlen .hc-wahl")].map((b) => b.textContent)).toContain("Depot zum Investierenpasst zu deiner Liste");
  });

  it("alte Adressen mit ?ziel= laufen weiter", () => {
    const k = zeige("/check?quelle=quiz&ziel=konto");
    expect(titel()).toBe("Wie bezahlst du meistens?");
    k.unmount();
    zeige("/check?quelle=aktienliste&ziel=invest");
    expect(titel()).toBe("Hast du schon ein Depot?");
  });
});
