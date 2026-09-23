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


def konstanten_block(inhalt: str, konstante: str) -> tuple[int, int]:
    m = re.search(rf'export const {konstante}[^=]*= \{{\n', inhalt)
    if not m:
        raise SystemExit(f"Konstante {konstante} nicht gefunden")
    return m.end(), inhalt.index("\n};", m.end())


def eintrag_von(inhalt: str, konstante: str, pid: str):
    """Findet den Eintrag einer ID und liefert (start, ende, rumpf).

    Die Klammern werden gezaehlt, nicht per Muster gesucht. Ein Eintrag kann
    ueber viele Zeilen gehen und innen weitere Objekte enthalten; ein
    nicht-gieriges Muster endet dann an der falschen Klammer und schreibt den
    neuen Beleg mitten in einen bestehenden hinein. Genau das ist am 23.09.2026
    passiert und hat die Datei zerlegt.

    Ein Eintrag kann auch eine Kurzform sein, etwa `"x": kryptoOptIn,`. Dann
    ist rumpf der Bezeichner ohne Klammern.
    """
    von, bis = konstanten_block(inhalt, konstante)
    block = inhalt[von:bis]
    m = re.search(rf'^  "{re.escape(pid)}": ', block, re.M)
    if not m:
        return None
    start = von + m.start()
    pos = von + m.end()
    if inhalt[pos] != "{":
        ende_zeile = inhalt.index("\n", pos)
        return start, ende_zeile, inhalt[pos:ende_zeile].rstrip().rstrip(",")
    tiefe, i, in_text = 0, pos, False
    while i < bis + 3:
        c = inhalt[i]
        if in_text:
            if c == "\\":
                i += 2
                continue
            if c == '"':
                in_text = False
        elif c == '"':
            in_text = True
        elif c == "{":
            tiefe += 1
        elif c == "}":
            tiefe -= 1
            if tiefe == 0:
                ende = i + 1
                if inhalt[ende : ende + 1] == ",":
                    ende += 1  # Komma gehoert zum Eintrag, sonst steht es nachher doppelt.
                return start, ende, inhalt[pos : i + 1]
        i += 1
    raise SystemExit(f"Eintrag {pid} in {konstante} nicht sauber geschlossen")


def hat_feld(rumpf: str, feld: str) -> bool:
    """Nur Felder der obersten Ebene zaehlen, nicht Treffer in Belegtexten."""
    tiefe, i, in_text, oberste = 0, 0, False, []
    while i < len(rumpf):
        c = rumpf[i]
        if in_text:
            if c == "\\":
                i += 2
                continue
            if c == '"':
                in_text = False
        elif c == '"':
            in_text = True
        elif c == "{":
            tiefe += 1
        elif c == "}":
            tiefe -= 1
        elif tiefe == 1 and c not in " \n,":
            m = re.match(r"[A-Za-z_][\w]*\s*:", rumpf[i:])
            if m:
                oberste.append(m.group(0).split(":")[0].strip())
                i += m.end()
                continue
        i += 1
    return feld in oberste


def mit_feld(rumpf: str, text: str) -> str:
    """Haengt ein Feld an einen Objekt-Rumpf, vor der schliessenden Klammer."""
    kern = rumpf[1:-1].rstrip().rstrip(",")
    mehrzeilig = "\n" in kern
    trenner = ",\n    " if mehrzeilig else ", "
    schluss = ",\n  }" if mehrzeilig else " }"
    return "{" + kern + trenner + text + schluss


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
                quell_text = (
                    f'{feld}: {{ url: "{ts_text(r["url"])}", stand: "{ts_text(r.get("stand", ""))}", '
                    f'hinweis: "{ts_text(r["zitat"])}" }}'
                )

                # 1. Wert setzen
                treffer = eintrag_von(inhalt, w_konst, pid)
                if treffer is None:
                    inhalt = einfuegen(inhalt, w_konst, f'  "{pid}": {{ {feld}: "{urteil}" }},\n')
                else:
                    start, ende, rumpf = treffer
                    if not rumpf.startswith("{"):
                        # Kurzform wie kryptoOptIn: setzt beide Ampeln auf gut.
                        if urteil == "gut":
                            pass  # Wert stimmt schon, es fehlt nur der Beleg.
                        else:
                            ausgeschrieben = '{ zinsfreiAbStart: "gut", zinsfreiesModell: "gut" }'
                            rumpf_neu = re.sub(rf'{re.escape(feld)}: "gut"', f'{feld}: "{urteil}"', ausgeschrieben)
                            inhalt = inhalt[:start] + f'  "{pid}": {rumpf_neu},' + inhalt[ende:]
                    elif hat_feld(rumpf, feld):
                        print(f"  uebersprungen (Wert schon gepflegt): {pid} {feld}")
                        uebersprungen += 1
                        continue
                    else:
                        rumpf_neu = mit_feld(rumpf, f'{feld}: "{urteil}"')
                        inhalt = inhalt[:start] + f'  "{pid}": {rumpf_neu},' + inhalt[ende:]

                # 2. Beleg setzen
                treffer_q = eintrag_von(inhalt, q_konst, pid)
                if treffer_q is None:
                    inhalt = einfuegen(inhalt, q_konst, f'  "{pid}": {{ {quell_text} }},\n')
                else:
                    start, ende, rumpf = treffer_q
                    if hat_feld(rumpf, feld):
                        print(f"  uebersprungen (Beleg schon vorhanden): {pid} {feld}")
                        uebersprungen += 1
                        continue
                    rumpf_neu = mit_feld(rumpf, quell_text)
                    inhalt = inhalt[:start] + f'  "{pid}": {rumpf_neu},' + inhalt[ende:]

                print(f"  eingetragen: {pid} {feld} = {urteil}")
                neu += 1
    if trocken:
        print(f"\nProbelauf: {neu} neu, {uebersprungen} uebersprungen. Nichts geschrieben.")
        return
    DATEI.write_text(inhalt, encoding="utf-8")
    print(f"\n{neu} eingetragen, {uebersprungen} uebersprungen. Jetzt `npx vitest run` laufen lassen.")


if __name__ == "__main__":
    main()
