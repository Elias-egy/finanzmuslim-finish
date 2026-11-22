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

  it("die Hero-Zeile nennt „89 Angebote selbst getestet“, darunter 35 Depots und 54 Girokonten mit runden Bank-Logos (RN14-02), nie „eröffnet“, kein großes Foto von Elias im Kopf, 26.000 statt drei Haken", () => {
    const { container } = zeige("/check?quelle=homepage");
    const zeile = container.querySelector(".hc-beweis")!;
    expect(zeile.querySelector(".hc-eyebrow")!.textContent).toBe("89 Angebote selbst getestet");
    // RN15: die Logo-Leiste neben 89 fällt weg, die Logos stehen rund in der Zeile darunter (statt Bildern anderer Leute).
    expect(zeile.querySelectorAll("img")).toHaveLength(0);
    expect(container.textContent).not.toMatch(/selbst eröffnet/);
    const leute = container.querySelector(".hc-leute-zeile")!;
    expect(leute.textContent).toBe("35 Depots und 54 Girokonten selbst getestet");
    expect([...leute.querySelectorAll(".hc-rund-bank")].map((i) => i.getAttribute("aria-label"))).toEqual(["ING", "Commerzbank", "Deutsche Bank", "DKB"]);
    // Kein Foto von Elias im Kopf (RN10-05); sein Bild steht nur in „Aus der Community“ (Elias RN15-00) und klein im Chat-Ausschnitt von Schritt 01.
    const hero = container.querySelector(".hc-hero")!;
    expect([...hero.querySelectorAll("img")].map((i) => i.getAttribute("src") ?? "").filter((s) => /elias|pult|einrichtung-flatex-poster/i.test(s))).toEqual([]);
    expect(container.querySelector(".hc-haken-zeile")!.textContent).toBe("Über 26.000 Menschen informieren sich bei Finanzmuslim");
    expect(container.textContent).not.toMatch(/Nur wenige Fragen|Unter 2 Minuten/);
  });

  it("So entsteht deine Empfehlung: fünf Schritte mit Szenen aus der echten Oberfläche statt Stockfotos, zuletzt das Erfolgserlebnis (RN14-02)", () => {
    const { container } = zeige("/check?art=konto");
    const schritte = [...container.querySelectorAll(".hc-schritte .hc-zeile")];
    expect(schritte.map((z) => z.querySelector(".hc-zeile-titel")!.textContent)).toEqual([
      "Kurze Fragen",
      "Abgleich mit meinen Testdaten",
      "Dein Match mit Begründung",
      "Eröffnen, wenn es passt",
      "Halal gestartet",
    ]);
    expect(container.querySelectorAll(".hc-schritte .hc-zeile-bild > img")).toHaveLength(0);
    expect(schritte.map((z) => z.querySelector(".hc-sz")!.className.replace("hc-sz hc-sz--", ""))).toEqual(["chat", "raster", "analyse", "oeffnen", "erfolg"]);
    expect(schritte[0].textContent).toContain("Was suchst du gerade?");
    expect(schritte[4].textContent).toContain("Herzlichen Glückwunsch");
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

  it("die Tabelle wie im Original: 89, Häkchen und Kreuze, Zeitaufwand und Kosten, ohne „Werbelinks gekennzeichnet“", () => {
    const { container } = zeige("/check?quelle=aktienliste");
    const tab = container.querySelector(".hc-tab")!;
    expect(tab.querySelectorAll("thead th")).toHaveLength(4);
    expect(tab.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(tab.querySelector("tbody tr td.hc-tab-wir")!.textContent).toBe("89");
    expect([...tab.querySelectorAll("tbody tr:first-child td")].map((t) => t.textContent)).toEqual(["89", "–", "–"]);
    expect([...tab.querySelectorAll("tbody tr:nth-child(4) td")].map((t) => t.textContent)).toEqual(["2 Min.", "20 Min.", "Stunden"]);
    expect([...tab.querySelectorAll("tbody tr:nth-child(5) td")].map((t) => t.textContent)).toEqual(["0 €", "0 €", "0 €"]);
    expect(tab.textContent).not.toMatch(/Werbelinks|teils/);
  });

  it("drei Stimmen auf der Testseite (RN16-32), daneben Elias' Originalfoto mit Mikrofon im Ausschnitt von vorher und ohne Zeile (RN16-02) statt des Platzhalters", () => {
    const { container } = zeige("/check?quelle=aktienliste");
    // RN16-32: die drei stärksten (Matin, Reuf, Skeptisch); seit RN18-02 alle drei bestätigt, keine Platzhalter, keine Sterne.
    expect([...container.querySelectorAll(".hc-community-stimmen [data-stimme]")].map((f) => f.getAttribute("data-stimme"))).toEqual(["matin", "reuf", "skeptisch"]);
    expect(container.querySelectorAll("[data-stimme-platzhalter]")).toHaveLength(0);
    expect(container.querySelectorAll(".hc-community-stimmen .hc-sterne")).toHaveLength(0);
    expect(container.querySelector("[data-foto-platzhalter]")).toBeNull();
    const foto = container.querySelector(".hc-community-foto img")!;
    expect(foto.getAttribute("src")).toBe("/bilder/check/vortrag-mikrofon.webp");
    expect(foto.getAttribute("alt")).toContain("Mikrofon");
    expect(foto.getAttribute("width")).toBe("360");
    expect(container.querySelector(".hc-community-foto figcaption")).toBeNull();
    // RN16 (Elias RN15-03 „Über 26.000 Menschen, da kommen diese 3 Bilder hin“): lokal die drei Beispielbilder an der Zeile.
    expect(container.querySelectorAll(".hc-vertrauen .hc-leute-bilder img")).toHaveLength(3);
  });

  it("mit ?art= trägt die Verkaufsseite das eine Thema", () => {
    const k = zeige("/check?art=konto");
    expect(titel()).toBe("Welches Bankkonto passt wirklich zu dir?");
    k.unmount();
    zeige("/check?art=depot");
    expect(titel()).toBe("Welches Depot passt wirklich zu dir?");
  });

  it("oben nur ein Knopf „Match finden“ (RN16, Elias RN15-03: Unterschied zu „Erst Bankkonten vergleichen“ unklar), er startet den Check, kein Link aus dem Ablauf", () => {
    const { container } = zeige("/check?art=konto");
    expect([...container.querySelectorAll("main a")]).toHaveLength(0);
    expect(screen.queryByRole("button", { name: /vergleichen/ })).toBeNull();
    fireEvent.click(container.querySelector(".hc-knoepfe button")!);
    expect(screen.getByTestId("ort").textContent).toContain("schritt=fragen");
    expect(titel()).toBe("Was suchst du gerade?");
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

  it("„Match finden“ öffnet auf derselben Route die erste Frage: Bankkonto immer grün „am beliebtesten“, aus der Aktien-Liste dazu orange „passt zu deiner Liste“ (RN16-08)", async () => {
    const a = zeige("/check?quelle=aktienliste");
    await tippe(/^Match finden/);
    expect(titel()).toBe("Was suchst du gerade?");
    expect(screen.getAllByText("passt zu deiner Liste").length).toBe(1);
    expect(screen.getAllByText("am beliebtesten").length).toBe(1);
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
    // Schnellwahl (Elias RN9-01: „scrollbar“): 28 Banken (RN16-05) in einem Scroll-Rahmen, „Noch kein Konto“ steht fest darunter, außerhalb der Liste.
    const rahmen = container.querySelector(".hc-schnell-rahmen") as HTMLElement;
    expect(rahmen).toBeTruthy();
    expect(within(rahmen).getAllByRole("button")).toHaveLength(28);
    expect(rahmen.querySelector(".hc-schnell")).toBeTruthy();
    expect(within(rahmen).queryByRole("button", { name: "Noch kein Konto" })).toBeNull();
    const keine = container.querySelector(".hc-schnell-keine") as HTMLElement;
    expect(keine.textContent).toBe("Noch kein Konto");
    expect(rahmen.contains(keine)).toBe(false);
    expect(rahmen.compareDocumentPosition(keine) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await tippeText("Sparkasse");
    expect(titel()).toBe("Dein Match: ein kostenloses Girokonto bei norisbank");
    // Die heutige Bank steht links neben der norisbank (der Titel „Sparkasse und norisbank im Vergleich“ ist in halalFinanzCheck.test.ts geprüft; KontoAnsicht zeigt ihn nicht).
    expect(container.querySelector(".hc-gg")?.textContent).toMatch(/^Sparkasse.*norisbank/);
    // Zwei Links zum Anbieter sind gewollt (Elias RN15-01): der Knopf in der Karte und der Aufruf ganz unten, beide zur norisbank.
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getByRole("link", { name: /Konto eröffnen\*/ }).getAttribute("href")).toBe("/out/norisbank?src=fcbonoa");
    expect(screen.getByRole("link", { name: /Bei norisbank eröffnen\*/ }).getAttribute("href")).toBe("/out/norisbank?src=fcbonoa");
    expect(container.textContent).toContain("steht in deinem Kontoauszug");
    // RN20-14: Stimmen (Bilal E. spricht vom Depot) zählen nicht als Depot-Aufruf.
    const ohneStimmen = container.cloneNode(true) as HTMLElement;
    ohneStimmen.querySelectorAll("[data-stimme]").forEach((e) => e.remove());
    expect(ohneStimmen.textContent).not.toMatch(/Depot|flatex|Alternative|Freitagsbrief/);
    // Seit RN13 (Elias RN12-01) auch beim Konto der Ring mit gerechneter Passung.
    expect(container.querySelector(".hc-erg-ring")?.getAttribute("aria-label")).toMatch(/^Passt zu \d+ Prozent zu dir$/);
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
    expect(container.querySelector(".hc-gg")?.textContent).toMatch(/^Volksbank.*norisbank/);
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
    expect(container.querySelector(".hc-gg")).toBeNull();
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
  it("Fassung a: Hast du schon ein Depot (Nein), „Was ist dir wichtiger?“, „Worin willst du investieren?“, Ergebnis mit Passung als Ring, Knopf und „Passt auch gut“ mit dem anderen Depot", async () => {
    const { container } = zeige("/check?art=depot&schritt=fragen", "a");
    await tippeText("Depot zum Investieren");
    expect(titel()).toBe("Hast du schon ein Depot?");
    expect([...container.querySelectorAll(".hc-wahlen .hc-wahl")].map((b) => b.textContent)).toEqual(["Ja", "Nein, noch nicht"]);
    // Keine Erfahrungsfrage mehr (Elias RN10-07: keine unnötigen Fragen).
    expect(container.textContent).not.toMatch(/Erfahrung|Erste Schritte/);
    await tippeText("Nein, noch nicht");
    // Elias 22.11. (L6-Gold): erst die Anlage, dann was wichtiger ist.
    expect(titel()).toBe("Worin willst du investieren?");
    expect([...container.querySelectorAll(".hc-wahlen .hc-wahl")].map((b) => b.textContent)).toEqual(["ETFs", "Einzelne Aktien", "Gold und Silber", "Weiß noch nicht"]);
    expect(container.textContent).not.toMatch(/Wechsel|Welche dieser drei Eigenschaften/);
    await tippeText("Einzelne Aktien");
    expect(titel()).toBe("Was ist dir wichtiger?");
    await tippeText("Möglichst niedrige Kosten");
    expect(titel()).toBe("Dein Match: ein günstiges Halal-Depot bei Smartbroker+");
    expect(container.querySelector(".hc-erg-ring")?.getAttribute("aria-label")).toMatch(/^Passt zu \d+ Prozent zu dir$/);
    expect(container.textContent).toContain("Übereinstimmung mit deinen Antworten");
    // Karte, „Passt auch gut“ und der offene Aufruf unten (Elias RN15-01): drei Links.
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.getByRole("link", { name: /Depot eröffnen\*/ }).getAttribute("href")).toBe("/out/smartbroker?src=fchpsba");
    expect(screen.getByRole("link", { name: /Bei Smartbroker\+ eröffnen\*/ }).getAttribute("href")).toBe("/out/smartbroker?src=fchpsba");
    expect(container.querySelector(".hc-erg-match-satz")!.textContent).toBe("Du hast noch kein Depot. Du willst einzelne Aktien kaufen und legst Wert auf niedrige Kosten.");
    // „Passt auch gut“ (Elias RN11-03): flatex mit eigener gerechneter Übereinstimmung, eigener Knopf mit Kennung Zusatz z, Pflichtsatz.
    const auch = container.querySelector(".hc-auch")!;
    expect(auch.querySelector(".hc-auch-h")!.textContent).toBe("Passt auch gut");
    expect(auch.querySelector(".hc-auch-fit")!.textContent).toMatch(/^\d+% Übereinstimmung$/);
    expect(auch.textContent).toContain("flatex");
    expect(auch.textContent).toContain("Kreditrahmen ab");
    expect(screen.getByRole("link", { name: /Depot ansehen\*/ }).getAttribute("href")).toBe("/out/flatex?src=fchpflza");
    expect(container.textContent).not.toMatch(/Alternative|Girokonto|norisbank|Zweitdepot/);
    // Ohne heutiges Depot kein Vergleich der beiden; seit RN15 ohne Antwort-Pillen und ohne Satz im Kopf (Elias RN14-02 „Das kann weg“).
    expect(container.textContent).not.toMatch(/im Vergleich/);
    expect(container.querySelector(".hc-erg-antw")).toBeNull();
    expect(container.querySelector(".hc-erg-satz")).toBeNull();
  });

  it("Fassung b: nach „Worin willst du investieren?“ kommt der Monatsbetrag, das Depot bleibt", async () => {
    zeige("/check?art=depot&schritt=fragen", "b");
    await tippeText("Depot zum Investieren");
    await tippeText("Nein, noch nicht");
    expect(titel()).toBe("Worin willst du investieren?");
    await tippeText("Gold und Silber");
    expect(titel()).toBe("Was ist dir bei Gold wichtig?");
    await tippeText("Mehrere Edelmetalle");
    expect(titel()).toBe("Wie viel möchtest du im Monat anlegen?");
    await tippeText("50 bis 200 €");
    expect(titel()).toBe("Dein Match: ein günstiges Halal-Depot bei Smartbroker+");
    // Die Anlage steht seit RN15 nicht mehr als Pille, aber in den Vorteilen vorn.
    expect(document.querySelector(".hc-erg-haken")!.textContent).toMatch(/Gold und Silber/);
    expect(screen.getByRole("link", { name: /Depot eröffnen\*/ }).getAttribute("href")).toBe("/out/smartbroker?src=fchpsbb");
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
    expect(titel()).toBe("Worin willst du investieren?");
    await tippeText("ETFs");
    expect(titel()).toBe("Was ist dir wichtiger?");
    await tippeText("Möglichst viele Halal-Anlagen");
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
    await tippeText("Einzelne Aktien");
    await tippeText("Möglichst niedrige Kosten");
    expect(titel()).toBe("Dein Match: ein günstiges Halal-Depot bei Smartbroker+");
    expect(container.textContent).toContain("Dein Depot und Smartbroker+ im Vergleich");
    expect(container.textContent).toContain("Phantasiedepot");
    const vs = container.querySelector(".hc-gg") as HTMLElement;
    expect(vs.textContent).toContain("–");
  });

  it("ist das heutige Depot schon das Match: „Dein Depot bei flatex passt schon“, kein Vergleich", async () => {
    const { container } = zeige("/check?art=depot&schritt=fragen", "a");
    await tippeText("Depot zum Investieren");
    await tippeText("Ja");
    await tippeText("flatex");
    await tippeText("ETFs");
    await tippeText("Möglichst viele Halal-Anlagen");
    expect(titel()).toBe("Dein Depot bei flatex passt schon");
    expect(container.textContent).not.toMatch(/im Vergleich/);
  });

  it("Gold: Royal Mint (zertifiziert, auslieferbar) steht als erster Vorteil, nur mit Beleg aus den Daten", async () => {
    const { container } = zeige("/check?art=depot&schritt=fragen", "a");
    await tippeText("Depot zum Investieren");
    await tippeText("Nein, noch nicht");
    await tippeText("Gold und Silber");
    await tippeText("Mehrere Edelmetalle");
    expect(container.textContent).toContain("Royal Mint Gold-ETC hier kaufbar, zertifiziert und auslieferbar");
  });

  it("Zurück geht Frage für Frage bis zur ersten, die Antworten verschwinden mit", async () => {
    zeige("/check?schritt=fragen", "a");
    await tippeText("Depot zum Investieren");
    await tippeText("Nein, noch nicht");
    expect(titel()).toBe("Worin willst du investieren?");
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
    expect(titel()).toBe("Worin willst du investieren?");
    d.unmount();
    zeige("/check?art=depot&quelle=aktienliste&start=2&a1=depot");
    expect(titel()).toBe("Wo hast du dein Depot?");
  });

  it("überall dieselbe erste Frage: Bankkonto grün „am beliebtesten“, bei Aktien-Liste und Halal-Anlagen dazu Depot orange „passt zu deiner Liste“", () => {
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
      expect(etiketten(`/check?quelle=${q}&schritt=fragen`), q).toEqual(["Neues Bankkontoam beliebtesten", "Depot zum Investierenpasst zu deiner Liste", "Noch unsicher"]);
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

describe("Ladescreen und Endbildschirm (RN11)", () => {
  const kontoWeg = async (adresse: string) => {
    const r = zeige(adresse);
    await tippeText("Neues Bankkonto");
    await tippeText("Fast nur mit Karte");
    await tippeText("Sparkasse");
    return r;
  };

  it("vor dem Ergebnis der Ladescreen „Passender Ersatz für Sparkasse wird gesucht“, das Ergebnis liegt inert darunter, nach 6 s ist der Ladescreen weg (RN16: 1,3-mal schneller)", async () => {
    const { container } = await kontoWeg("/check?art=konto&schritt=fragen");
    const laden = container.querySelector(".hc-laden")!;
    expect(laden.textContent).toContain("Passender Ersatz für Sparkasse wird gesucht");
    expect(laden.textContent).toContain("von 54 Girokonten verglichen");
    expect(container.querySelector("[inert]")).toBeTruthy();
    // Vorher Ende bei 7,07 s; seit RN16 (Elias RN15-03 „so 1,3 ungefähr von der Geschwindigkeit“) 7070 / 1,3 = 5,44 s, Vorhang 0,54 s.
    await act(async () => {
      vi.advanceTimersByTime(5300);
    });
    expect(container.querySelector(".hc-laden--zu")).toBeNull();
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    expect(container.querySelector(".hc-laden--zu")).toBeTruthy();
    await act(async () => {
      vi.advanceTimersByTime(600);
    });
    expect(container.querySelector(".hc-laden")).toBeNull();
    expect(container.querySelector("[inert]")).toBeNull();
    expect(container.querySelector(".hc-erg--bereit")).toBeTruthy();
  });

  it("Depot-Ladescreen nennt die gewählte Anlage und zählt bis 35 Depots", async () => {
    const { container } = zeige("/check?art=depot&schritt=fragen", "a");
    await tippeText("Depot zum Investieren");
    await tippeText("Nein, noch nicht");
    await tippeText("Gold und Silber");
    await tippeText("Mehrere Edelmetalle");
    const laden = container.querySelector(".hc-laden")!;
    expect(laden.textContent).toContain("Dein passendes Halal-Depot wird gesucht");
    expect(laden.textContent).toContain("Gold und Silber je Depot prüfen");
    expect(laden.textContent).toContain("von 35 Depots verglichen");
  });

  it("Ergebnis (nur Fassung A, Elias RN15-01): Ring, Sätze unter „Dein Match“, Karte mit Logo, Liste Sparkasse gegen norisbank, 26.000, zwei Konto-Stimmen, Überzug, offener Aufruf, zwei Links", async () => {
    const { container } = await kontoWeg("/check?art=konto&schritt=fragen");
    expect(container.querySelector("[data-ergebnis='a']")).toBeTruthy();
    expect(container.querySelector(".hc-erg-ring")).toBeTruthy();
    // Unter der Überschrift ein, zwei Sätze aus den eigenen Antworten, normale Textfarbe, keine Pillen.
    const satz = container.querySelector(".hc-erg-kopf-text .hc-erg-match-satz")!;
    expect(satz.textContent).toBe("Du hast dein Konto bei der Sparkasse und zahlst fast nur mit Karte. Du suchst ein Konto, das günstig und flexibel ist.");
    expect(container.querySelector("h1")!.nextElementSibling).toBe(satz);
    expect(container.querySelector(".hc-erg-antw")).toBeNull();
    expect(container.textContent).toContain("Sparkasse und norisbank im Vergleich");
    // Vergleich: die norisbank liegt vorn, immer drei Zeilen.
    const gg = container.querySelector(".hc-gg")!;
    expect(gg.querySelectorAll(".hc-gg-label")).toHaveLength(3);
    // Community: 26.000, zwei Stimmen der Art Konto, beide bestätigt (RN18-02, RN18-08).
    expect(container.textContent).toContain("Über 26.000 Menschen informieren sich bei Finanzmuslim");
    expect(container.textContent).not.toMatch(/folgen mir/);
    const stimmen = container.querySelectorAll(".hc-erg-community [data-stimme]");
    expect([...stimmen].map((st) => st.getAttribute("data-stimme"))).toEqual(["matin", "bilal"]);
    // Danach die frühere B-Karte und der offene Aufruf, in dieser Reihenfolge.
    const ueberzug = container.querySelector(".hc-erg-ueberzug")!;
    expect(ueberzug.textContent).toContain("Alles wird für dich rübergezogen");
    expect(ueberzug.textContent).toContain("Wechsel in 10 Minuten");
    expect(ueberzug.querySelector(".hc-wb-ja")).toBeTruthy();
    expect(ueberzug.querySelector("img")!.getAttribute("src")).toBe("/bilder/check/norisbank-kontowechsel.webp");
    const auf = container.querySelector(".hc-erg-eroeffnen")!;
    expect(auf.querySelector("h2")!.textContent).toBe("Jetzt bei norisbank eröffnen");
    expect(auf.querySelector(".hc-wb-platte--noris")).toBeTruthy();
    expect(auf.querySelector(".hc-wb-werbung")!.textContent).toBe("Werbung");
    const community = container.querySelector(".hc-erg-community")!;
    expect(community.compareDocumentPosition(ueberzug) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(ueberzug.compareDocumentPosition(auf) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // Zwei Links zum Anbieter: der in der Karte und der unten. „Check neu starten“ ist nur ein kleiner Text ganz am Ende.
    const links = container.querySelectorAll("a[href^='/out/']");
    expect(links).toHaveLength(2);
    expect(links[1].closest(".hc-erg-eroeffnen")).toBe(auf);
    expect(links[1].textContent).toContain("Bei norisbank eröffnen*");
    const neu = [...container.querySelectorAll("button.hc-neu")];
    expect(neu).toHaveLength(1);
    expect(neu[0].textContent).toBe("Check neu starten");
    expect(neu[0].classList.contains("hc-neu--klein")).toBe(true);
    expect(auf.compareDocumentPosition(neu[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("die Wischkarten (Fassung B) und ?ergebnis=b gibt es nicht mehr: dieselbe Seite wie ohne", async () => {
    const { container } = await kontoWeg("/check?art=konto&schritt=fragen&ergebnis=b");
    expect(container.querySelector("[data-ergebnis='a']")).toBeTruthy();
    expect(container.querySelector("[data-ergebnis='b']")).toBeNull();
    expect(container.querySelector(".hc-wisch")).toBeNull();
    expect(container.querySelector(".hc-wk")).toBeNull();
  });

  it("ohne Bank von heute: kein Überzug, aber Sätze, Stimmen und der offene Aufruf unten", async () => {
    const r = zeige("/check?art=konto&schritt=fragen");
    await tippeText("Neues Bankkonto");
    await tippeText("Fast nur mit Karte");
    await tippeText("Noch kein Konto");
    expect(r.container.querySelector(".hc-erg-match-satz")!.textContent).toBe("Du hast noch kein Konto und zahlst fast nur mit Karte. Du suchst ein Konto, das günstig und flexibel ist.");
    expect(r.container.querySelector(".hc-erg-ueberzug")).toBeNull();
    expect(r.container.querySelector(".hc-erg-eroeffnen h2")!.textContent).toBe("Jetzt bei norisbank eröffnen");
    expect(r.container.querySelectorAll("a[href^='/out/']")).toHaveLength(2);
  });
});
