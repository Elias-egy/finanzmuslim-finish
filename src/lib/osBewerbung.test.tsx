import { readFileSync } from "node:fs";
import path from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { OsAnfrage } from "@/components/OsAnfrage";
import { ANDERES_DEPOT, DEPOT_AUSWAHL, NUR_GIROKONTO, TEXT, pruefeBewerbung, type Bewerbung } from "./osBewerbung";

/**
 * Bewerbung statt Screenshot (RN4-01): Depot-Unterseiten (OsAnfrage.tsx) und Verkaufsseite (public/investment-os/index.html,
 * ohne Build) fragen dasselbe, mit denselben Texten und derselben Prüfung. Layout misst jsdom nicht; geprüft wird über
 * das CSS, dass die neuen Felder nicht quer laufen (Breite 100 %, keine feste Breite über 358 px, Schrift ab 16 px).
 */

const HTML = readFileSync(path.resolve(__dirname, "../../public/investment-os/index.html"), "utf8");
const voll: Bewerbung = {
  depot: "flatex",
  anderesDepot: "",
  anlagen: "iShares MSCI World Islamic",
  girokonto: "",
  vorname: "Amina",
  email: "amina@beispiel.de",
  einwilligung: true,
};

const seite = () => {
  const doc = new DOMParser().parseFromString(HTML, "text/html");
  return doc;
};

/** Baut den Zugang der Verkaufsseite in das jsdom-Dokument und führt nur das Bewerbungs-Skript aus. */
const verkaufsseiteZugang = () => {
  const doc = seite();
  document.body.innerHTML = doc.getElementById("zugang")!.outerHTML;
  const skript = [...doc.querySelectorAll("script:not([type])")].map((s) => s.textContent ?? "").join("\n");
  const start = skript.indexOf("/* Bewerbung (RN4-01)");
  const ende = skript.indexOf("})();", start) + 5;
  expect(start).toBeGreaterThan(-1);
  new Function(skript.slice(start, ende))();
};

describe("Bewerbung: gemeinsame Regeln", () => {
  it("nennt flatex zuerst, dann Smartbroker+, und jedes Depot einmal", () => {
    expect(DEPOT_AUSWAHL.slice(0, 2)).toEqual(["flatex", "Smartbroker+"]);
    expect(new Set(DEPOT_AUSWAHL).size).toBe(DEPOT_AUSWAHL.length);
  });

  it("prüft Depot, Anlagen, Vorname, Mail und Häkchen; Girokonto allein reicht mit Bank", () => {
    expect(pruefeBewerbung(voll)).toBeNull();
    expect(pruefeBewerbung({ ...voll, depot: "" })).toMatch(/Halal-Depot/);
    expect(pruefeBewerbung({ ...voll, anlagen: " " })).toMatch(/Anlagen/);
    expect(pruefeBewerbung({ ...voll, vorname: "" })).toMatch(/Vornamen/);
    expect(pruefeBewerbung({ ...voll, email: "amina@" })).toMatch(/E-Mail/);
    expect(pruefeBewerbung({ ...voll, einwilligung: false })).toMatch(/Häkchen/);
    expect(pruefeBewerbung({ ...voll, depot: NUR_GIROKONTO, anlagen: "" })).toMatch(/Girokonto/);
    expect(pruefeBewerbung({ ...voll, depot: NUR_GIROKONTO, anlagen: "", girokonto: "Meine Bank" })).toBeNull();
    expect(pruefeBewerbung({ ...voll, depot: ANDERES_DEPOT })).toBeNull();
  });

  it("fragt nie nach Screenshot, Betrag oder Kontonummer und hat keinen Gedankenstrich", () => {
    const alle = Object.values(TEXT).join(" ");
    expect(alle).not.toMatch(/Screenshot hochladen|Kontonummer|IBAN|Betrag eingeben/);
    expect(alle).not.toMatch(/ [–—] /);
  });
});

describe("Bewerbung auf den Depot-Unterseiten (OsAnfrage)", () => {
  const zeige = () =>
    render(
      <MemoryRouter>
        <OsAnfrage anbieter="flatex" />
      </MemoryRouter>,
    );

  it("hat kein Bild-Feld mehr und zeigt die Auswahl mit flatex zuerst", () => {
    const { container } = zeige();
    expect(container.querySelector('input[type="file"]')).toBeNull();
    const optionen = [...container.querySelectorAll("select option")].map((o) => o.textContent);
    expect(optionen.slice(0, 3)).toEqual([TEXT.depotLeer, "flatex", "Smartbroker+"]);
    expect(optionen.slice(-2)).toEqual([TEXT.anderesDepot, TEXT.nurGirokonto]);
  });

  it("zeigt den Danke-Schirm erst, wenn alles ausgefüllt ist", () => {
    const { container } = zeige();
    fireEvent.click(screen.getByRole("button", { name: TEXT.senden }));
    expect(screen.getByRole("alert").textContent).toMatch(/Halal-Depot/);
    fireEvent.change(container.querySelector("select")!, { target: { value: "flatex" } });
    fireEvent.change(container.querySelector('input[name="anlagen"]')!, { target: { value: "iShares MSCI World Islamic" } });
    fireEvent.change(container.querySelector('input[name="vorname"]')!, { target: { value: "Amina" } });
    fireEvent.change(container.querySelector('input[name="email"]')!, { target: { value: "amina@beispiel.de" } });
    fireEvent.click(container.querySelector('input[type="checkbox"]')!);
    fireEvent.click(screen.getByRole("button", { name: TEXT.senden }));
    expect(screen.getByRole("dialog").textContent).toContain(TEXT.dankeTitel);
    expect(screen.getByRole("dialog").textContent).toContain(TEXT.dankeText);
  });

  it("blendet die Anlagen aus, wenn nur ein zinsfreies Girokonto da ist", () => {
    const { container } = zeige();
    fireEvent.change(container.querySelector("select")!, { target: { value: NUR_GIROKONTO } });
    expect(container.querySelector('input[name="anlagen"]')).toBeNull();
  });
});

describe("Bewerbung auf der Verkaufsseite", () => {
  it("hat dieselbe Auswahl, dieselben Texte und dasselbe Häkchen wie OsAnfrage", () => {
    const doc = seite();
    const optionen = [...doc.querySelectorAll("#bw-depot option")].map((o) => [o.getAttribute("value"), o.textContent]);
    expect(optionen).toEqual([
      ["", TEXT.depotLeer],
      ...DEPOT_AUSWAHL.map((n) => [n, n]),
      [ANDERES_DEPOT, TEXT.anderesDepot],
      [NUR_GIROKONTO, TEXT.nurGirokonto],
    ]);
    const form = doc.getElementById("bewerbung")!;
    const txt = (form.textContent ?? "").replace(/\s+/g, " ");
    for (const t of [TEXT.depotFrage, TEXT.anderesFrage, TEXT.anlagenFrage, TEXT.anlagenHinweis, TEXT.giroFrage, TEXT.vorname, TEXT.email, TEXT.senden])
      expect(txt).toContain(t);
    expect(txt).toContain(`${TEXT.hakenVor} ${TEXT.hakenLink} ${TEXT.hakenNach}`);
    expect(form.querySelector<HTMLInputElement>("#bw-anlagen")!.placeholder).toBe(TEXT.anlagenBeispiel);
    expect(form.querySelector<HTMLInputElement>("#bw-giro")!.placeholder).toBe(TEXT.giroBeispiel);
    expect(HTML).toContain(TEXT.dankeTitel);
    expect(HTML).toContain(TEXT.dankeText);
    for (const fall of [{ ...voll, depot: "" }, { ...voll, anlagen: "" }, { ...voll, depot: NUR_GIROKONTO, anlagen: "" }, { ...voll, vorname: "" }, { ...voll, email: "" }, { ...voll, einwilligung: false }])
      expect(HTML).toContain(pruefeBewerbung(fall)!);
  });

  it("hat keinen FERTIG-Mailweg und keinen Screenshot-Upload mehr", () => {
    const doc = seite();
    expect(doc.querySelectorAll("a[data-mail], a[href^='mailto:'], input[type='file']")).toHaveLength(0);
    expect(doc.getElementById("freischalten")).toBeNull();
  });

  it("nennt den Link nicht mehr als Bedingung für den Zugang (RN3-05)", () => {
    const doc = seite();
    const sichtbar = [...doc.querySelectorAll("#prozess .lead, #zugang, #fragen, .schluss, meta[name=description]")]
      .map((e) => e.getAttribute("content") ?? e.textContent ?? "")
      .join(" ");
    expect(sichtbar).not.toMatch(/wenn du dein Depot über meinen Link|Depot über meinen Link und erstes|Depot über meinen Link eröffnen, erstes/);
  });

  it("führt durch die Bewerbung bis zum Danke-Schirm", () => {
    verkaufsseiteZugang();
    const form = document.getElementById("bewerbung") as HTMLFormElement;
    fireEvent.submit(form);
    expect(document.getElementById("bw-hinweis")!.textContent).toMatch(/Halal-Depot/);
    const depot = document.getElementById("bw-depot") as HTMLSelectElement;
    fireEvent.change(depot, { target: { value: NUR_GIROKONTO } });
    expect(document.getElementById("bw-anlagen-feld")!.hidden).toBe(true);
    fireEvent.change(depot, { target: { value: ANDERES_DEPOT } });
    expect(document.getElementById("bw-anderes-feld")!.hidden).toBe(false);
    fireEvent.change(depot, { target: { value: "flatex" } });
    (document.getElementById("bw-anlagen") as HTMLInputElement).value = "iShares MSCI World Islamic";
    (document.getElementById("bw-vorname") as HTMLInputElement).value = "Amina";
    (document.getElementById("bw-mail") as HTMLInputElement).value = "amina@beispiel.de";
    fireEvent.submit(form);
    expect(document.getElementById("bw-hinweis")!.textContent).toMatch(/Häkchen/);
    (document.getElementById("bw-haken") as HTMLInputElement).checked = true;
    fireEvent.submit(form);
    expect(document.querySelector(".os-danke")!.textContent).toContain(TEXT.dankeTitel);
  });

  it("läuft bei 390 und 1440 px nicht quer: Felder 100 % breit, keine feste Breite über 358 px, Schrift ab 16 px", () => {
    const css = [...seite().querySelectorAll("style")].map((s) => s.textContent ?? "").join("\n");
    const regeln = css.match(/\.os-form[^{]*\{[^}]*\}|\.bewerbung-mock[^{]*\{[^}]*\}|\.mock-haken[^{]*\{[^}]*\}/g) ?? [];
    expect(regeln.length).toBeGreaterThan(5);
    for (const r of regeln) {
      for (const m of r.matchAll(/(?:^|[;{])\s*(?:min-)?width:\s*(\d+)px/g)) expect(Number(m[1])).toBeLessThanOrEqual(358);
    }
    const feld = regeln.find((r) => r.includes("input[type=text]"))!;
    expect(feld).toMatch(/width:100%/);
    expect(feld).toMatch(/max-width:100%/);
    expect(Number(/font:\s*\d+\s+(\d+)px/.exec(feld)![1])).toBeGreaterThanOrEqual(16);
    expect(regeln.find((r) => r.startsWith(".os-form{"))).toMatch(/min-width:0/);
  });
});
