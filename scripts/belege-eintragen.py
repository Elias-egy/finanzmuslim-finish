#!/usr/bin/env python3
"""Traegt recherchierte Belege in src/data/vergleichKorrekturenDaten.ts ein.

    python3 scripts/belege-eintragen.py belege.tsv [--trocken]

Die TSV hat die Spalten: id, feld, urteil, url, zitat, stand.
Urteil "kein Beleg" wird uebersprungen. Ein Feld, das schon einen Eintrag hat,
wird nie ueberschrieben: lieber nichts tun als eine geprueste Aussage ersetzen.

Warum ueberhaupt ein Skript: Die Datei ist handgepflegt und wird von bauen.py nie
angefasst. Beim Eintragen von Hand passieren zwei Fehler immer wieder, naemlich ein
Beleg ohne passenden Wert und ein Anfuehrungszeichen, das die Datei zerschiesst.
Beides faengt dieses Skript ab. Geprueft wird danach trotzdem mit `npx vitest run`,
weil erst der Test die Anbieterdomain gegen die Beleg-URL haelt.
"""
import csv, re, sys
from pathlib import Path

DATEI = Path(__file__).resolve().parent.parent / "src" / "data" / "vergleichKorrekturenDaten.ts"
BEREICH = {  # Feld -> (WERTE-Konstante, QUELLEN-Konstante) je nach Datei, in der die ID steht
    "depot": ("DEPOT_WERTE", "DEPOT_QUELLEN"),
    "giro": ("GIRO_WERTE", "GIRO_QUELLEN"),
    "krypto": ("KRYPTO_WERTE", "KRYPTO_QUELLEN"),
}
QUELLDATEI = {
    "depot": "brokerVergleich.ts",
    "giro": "girokontoVergleich.ts",
    "krypto": "kryptoVergleich.ts",
}


def bereich_von(pid: str) -> str | None:
    for bereich, datei in QUELLDATEI.items():
        t = (DATEI.parent / datei).read_text(encoding="utf-8")
        if f'"id": "{pid}"' in t:
            return bereich
    return None


def ts_text(s: str) -> str:
    """Fuer ein TypeScript-Stringliteral in doppelten Anfuehrungszeichen."""
    return s.replace("\\", "\\\\").replace('"', "'").replace("\n", " ").strip()


def hat_eintrag(inhalt: str, konstante: str, pid: str, feld: str) -> bool:
    m = re.search(rf'export const {konstante}[^=]*= \{{(.*?)\n\}};', inhalt, re.S)
    if not m:
        return False
    block = m.group(1)
    z = re.search(rf'"{re.escape(pid)}": \{{(.*?)\}},?\n', block, re.S)
    return bool(z and feld in z.group(1))


def einfuegen(inhalt: str, konstante: str, zeile: str) -> str:
    m = re.search(rf'(export const {konstante}[^=]*= \{{\n)', inhalt)
    if not m:
        raise SystemExit(f"Konstante {konstante} nicht gefunden")
    return inhalt[: m.end(1)] + zeile + inhalt[m.end(1) :]


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    trocken = "--trocken" in sys.argv
    if not args:
        raise SystemExit("Aufruf: belege-eintragen.py <datei.tsv> [--trocken]")
    inhalt = DATEI.read_text(encoding="utf-8")
    neu = uebersprungen = 0
    for pfad in args:
        with open(pfad, encoding="utf-8") as f:
            for r in csv.DictReader(f, delimiter="\t"):
                pid, feld = r["id"].strip(), r["feld"].strip()
                urteil = r["urteil"].strip()
                if urteil not in {"gut", "teils", "schlecht"}:
                    print(f"  uebersprungen (kein Urteil): {pid} {feld} -> {urteil}")
                    uebersprungen += 1
                    continue
                if not r.get("url", "").strip() or not r.get("zitat", "").strip():
                    print(f"  uebersprungen (Beleg unvollstaendig): {pid} {feld}")
                    uebersprungen += 1
                    continue
                bereich = bereich_von(pid)
                if not bereich:
                    print(f"  uebersprungen (ID unbekannt): {pid}")
                    uebersprungen += 1
                    continue
                w_konst, q_konst = BEREICH[bereich]
                if hat_eintrag(inhalt, w_konst, pid, feld):
                    print(f"  uebersprungen (schon gepflegt): {pid} {feld}")
                    uebersprungen += 1
                    continue
                inhalt = einfuegen(inhalt, w_konst, f'  "{pid}": {{ {feld}: "{urteil}" }},\n')
                quelle = (
                    f'  "{pid}": {{ {feld}: {{ url: "{ts_text(r["url"])}", '
                    f'stand: "{ts_text(r.get("stand", ""))}", hinweis: "{ts_text(r["zitat"])}" }} }},\n'
                )
                inhalt = einfuegen(inhalt, q_konst, quelle)
                print(f"  eingetragen: {pid} {feld} = {urteil}")
                neu += 1
    if trocken:
        print(f"\nProbelauf: {neu} neu, {uebersprungen} uebersprungen. Nichts geschrieben.")
        return
    DATEI.write_text(inhalt, encoding="utf-8")
    print(f"\n{neu} eingetragen, {uebersprungen} uebersprungen. Jetzt `npx vitest run` laufen lassen.")


if __name__ == "__main__":
    main()
