import { describe, expect, it } from "vitest";
import { fragen } from "@/data/vergleichAssistent";
import { VORHABEN } from "@/lib/optin";
import { vorhabenAntworten, vorhabenFrage } from "./OptinKarte";

describe("dritte Frage der Opt-in-Karte", () => {
  const erste = fragen[0];

  it("ist wortgleich die erste Frage des Vergleichs-Assistenten", () => {
    expect(vorhabenFrage).toBe(erste.titel);
    expect(vorhabenAntworten.map((a) => ({ id: a.key, bild: a.bild, titel: a.titel }))).toEqual(
      erste.antworten.map((a) => ({ id: a.id, bild: a.bild, titel: a.titel })),
    );
  });

  it("kennt dieselben Werte, die Make im Nachtrag prüft", () => {
    expect(vorhabenAntworten.map((a) => a.key)).toEqual(VORHABEN);
  });
});
