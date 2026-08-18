#!/usr/bin/env python3
"""
Holt Kursdaten und Renditen fuer die Halal-Anlagen ueber Yahoo Finance.
Bevorzugt Notierungen in EUR, damit die Renditen fuer deutsche Anleger stimmen.

Diese Fassung liegt im Repo, damit die naechtliche GitHub-Action sie ausfuehren
kann. Sie schreibt direkt nach src/data, ohne den frueheren Zwischenschritt
ueber ~/rebrand. Der Zielordner laesst sich ueber KURSE_ZIEL umbiegen.

Ergebnis:
  src/data/kurse.json   kompakte Fassung fuer die Website
  src/data/nisab.json   Metallpreise fuer den Zakat-Rechner
  <ziel>/kurse_roh.json ausfuehrliche Fassung, nur zum Nachsehen

Aufruf: python3 scripts/kurse_holen.py
"""
import json, os, tempfile, time, urllib.request, urllib.parse
from datetime import datetime, timezone
from pathlib import Path

UA = {"User-Agent": "Mozilla/5.0"}

# Zielordner der erzeugten Dateien. Standard ist src/data im selben Repo,
# damit die Action nach dem Lauf nur noch committen muss.
ZIEL = Path(os.environ.get("KURSE_ZIEL") or (Path(__file__).resolve().parent.parent / "src/data"))
# Die ausfuehrliche Fassung ist nur zum Nachsehen da und hat im Repo nichts
# verloren, sie waere 300 kB Rauschen in jedem Commit.
ZIEL_ROH = Path(tempfile.gettempdir())

ANLAGEN = [
    ("IE00B27YCN58", "iShares MSCI World Islamic"),
    ("IE00B27YCP72", "iShares MSCI Emerging Markets Islamic"),
    ("IE00B296QM64", "iShares MSCI USA Islamic"),
    ("IE000UOXRAM8", "Invesco Dow Jones Islamic Global Developed Markets"),
    ("IE000LFC57H7", "Invesco MSCI ACWI Islamic M-Series"),
    ("IE000X9FTI22", "HSBC MSCI World Islamic Screened"),
    ("IE000I5NV504", "HSBC MSCI USA Islamic Screened"),
    ("IE000AGFZM58", "HSBC MSCI Europe Islamic Screened"),
    ("IE0009BC6K22", "HSBC MSCI Emerging Markets Islamic Screened Capped"),
    ("IE00BMYMHS24", "HANetf Saturna Al-Kawthar Global Focused Equity"),
    ("IE000929U2U9", "iShares USD Sukuk UCITS ETF"),
    ("LU3123443510", "Xtrackers II Salam USD Global Aggregate Sukuk"),
    ("LU1150255971", "BNP Paribas Islamic Fund Hilal Income Classic C"),
    ("IE00B579F325", "Invesco Physical Gold ETC"),
    ("XS3384723154", "Invesco Physical Gold II"),
    ("JE00B1VS3770", "WisdomTree Physical Gold"),
    ("JE00BN2CJ301", "WisdomTree Core Physical Gold"),
    ("JE00B588CD74", "WisdomTree Physical Swiss Gold"),
    ("IE00B43VDT70", "Invesco Physical Silver"),
    ("JE00B1VS3333", "WisdomTree Physical Silver"),
    ("JE00BQRFDY49", "WisdomTree Core Physical Silver"),
    ("IE00B4ZJ4634", "Comgest Growth Europe S EUR Acc"),
    ("LU2458330086", "Franklin Shariah Technology Fund A (acc) USD"),
]

KRYPTO = [("BTC-EUR", "Bitcoin"), ("ETH-EUR", "Ether"),
          ("XRP-EUR", "XRP"), ("LINK-EUR", "Chainlink")]

# Reihenfolge nach Datenqualitaet, nicht nach Waehrung: alles wird ohnehin in
# Euro umgerechnet. London ist Hauptmarkt fuer die ETCs und hat die laengste
# Historie, deutsche Regionalboersen haben oft Luecken.
BOERSEN_RANG = {"LSE": 0, "IOB": 1, "AMS": 2, "PAR": 2, "MIL": 2, "EBS": 3,
                "GER": 4, "FRA": 5, "STU": 6, "MUN": 6, "BER": 7, "HAM": 7}

# Fernost-Notierungen ausschliessen. Sie laufen in anderen Zeitzonen, die
# Monatsstichtage passen nicht zur Wechselkursreihe und erzeugen Ausreisser.
GESPERRTE_ENDUNGEN = (".T", ".HK", ".SS", ".SZ", ".KS", ".TW", ".AX")

# Wo die Suche ueber die ISIN nur eine unbrauchbare Notierung findet, steht das
# Symbol hier fest. Zwei Faelle: klassische Fonds ohne Boersenhistorie, fuer die
# nur das Morningstar-Symbol (0P...) Daten liefert, und ETFs, deren Hauptmarkt
# die Suche gar nicht ausgibt.
SYMBOL_FEST = {
    "LU1150255971": "0P00016N1Z",   # BNP Paribas Islamic Hilal Income
    "IE00B4ZJ4634": "0P0000U50G.F",  # Comgest Growth Europe S
    # Die Suche findet nur FLX1.MU, Muenchen, mit einem einzigen Kurspunkt.
    # 0P0001OPAJ ist dieselbe Anteilsklasse A (acc) USD, Reihe ab Auflage 2022.
    "LU2458330086": "0P0001OPAJ",   # Franklin Shariah Technology A (acc) USD
    # Die Suche findet nur die duenne deutsche Notierung, 26 Tage. London ist
    # der Hauptmarkt und hat die Reihe ab Auflage im November 2025.
    "LU3123443510": "XASB.L",       # Xtrackers II Salam USD Global Aggregate Sukuk
}


def monat(t):
    """Monat eines Yahoo-Monatsstempels als '2026-08'.

    Yahoo setzt den Stempel auf den Monatsersten in der Ortszeit der Boerse.
    London im Sommer ist UTC+1, der Stempel liegt dann in UTC noch im
    Vormonat. Ohne Korrektur bekommt man doppelte Maerz- und fehlende
    Oktoberwerte. Zwei Tage Vorlauf schieben den Stempel sicher in den
    richtigen Monat, ohne je in den naechsten zu rutschen."""
    return datetime.fromtimestamp(t + 172800, timezone.utc).strftime("%Y-%m")


def hole(url, versuche=3):
    """Yahoo drosselt bei laengeren Laeufen und antwortet dann mit einem Fehler.
    Ohne Wiederholung faellt ein Fonds still aus der Liste und die Seite zeigt
    ploetzlich keine Rendite mehr. Am 17.08. ist genau das dem iShares MSCI USA
    Islamic passiert, obwohl die Notierung einwandfrei war."""
    letzter = None
    for i in range(versuche):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=20) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            # 404 heisst, das Symbol gibt es nicht. Wiederholen bringt nichts.
            if e.code == 404:
                raise
            letzter = e
        except Exception as e:
            letzter = e
        time.sleep(2 * (i + 1))
    raise letzter


def symbole_finden(isin):
    """Alle Notierungen, sortiert nach Boersenrang. Gibt eine Liste zurueck,
    damit weitergesucht werden kann, wenn eine Notierung keine Historie hat."""
    url = ("https://query2.finance.yahoo.com/v1/finance/search?q="
           + urllib.parse.quote(isin) + "&quotesCount=15&newsCount=0")
    try:
        d = hole(url)
    except Exception:
        return []
    kandidaten = []
    for q in d.get("quotes", []):
        sym = q.get("symbol")
        if not sym or sym.endswith(GESPERRTE_ENDUNGEN):
            continue
        rang = BOERSEN_RANG.get(q.get("exchange", ""), 8)
        kandidaten.append((rang, sym))
    kandidaten.sort()
    return [s for _, s in kandidaten]


def kurse(symbol, spanne="6y", takt="1mo"):
    # Sechs Jahre statt fuenf: fuer eine echte Fuenfjahresrendite braucht es
    # 61 Monatspunkte, nicht 60. Angezeigt werden trotzdem nur 60.
    url = (f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
           f"?range={spanne}&interval={takt}")
    try:
        d = hole(url)
        r = d["chart"]["result"][0]
    except Exception:
        return None
    ts = r.get("timestamp") or []
    close = r["indicators"]["quote"][0].get("close") or []
    punkte = [(t, c) for t, c in zip(ts, close) if c is not None]
    if len(punkte) < 3:
        return None
    return {
        "symbol": symbol,
        "waehrung": r["meta"].get("currency"),
        "kurs": r["meta"].get("regularMarketPrice"),
        "punkte": punkte,
    }


# ---- Waehrungsumrechnung -------------------------------------------------
# Renditen in Fremdwaehrung sind fuer deutsche Anleger irrefuehrend, weil der
# Wechselkurs mitlaeuft. Deshalb wird jede Kursreihe in Euro umgerechnet.
_FX_CACHE = {}


def fx_reihe(waehrung):
    """Monatliche Kurse 'wie viel Euro ist eine Einheit dieser Waehrung wert'."""
    if waehrung in ("EUR", None):
        return None
    if waehrung in _FX_CACHE:
        return _FX_CACHE[waehrung]
    basis = "GBP" if waehrung == "GBp" else waehrung
    k = kurse(f"{basis}EUR=X")
    reihe = {}
    if k:
        for t, c in k["punkte"]:
            reihe[monat(t)] = c / 100 if waehrung == "GBp" else c
    _FX_CACHE[waehrung] = reihe or None
    time.sleep(0.4)
    return _FX_CACHE[waehrung]


def in_euro(punkte, waehrung):
    """Rechnet die Kursreihe in Euro um. Gibt (Punkte, umgerechnet_ja_nein)."""
    if waehrung in ("EUR", None):
        return punkte, False
    reihe = fx_reihe(waehrung)
    if not reihe:
        return punkte, False

    def naechster(monat):
        """Fehlt fuer einen Monat ein Wechselkurs, wird der zeitlich naechste
        genommen. Sonst reisst ein Loch in die Kursreihe, und eine Grafik mit
        Datumsachse zeigt eine Luecke, die es in Wirklichkeit nicht gibt."""
        if monat in reihe:
            return reihe[monat]
        if not reihe:
            return None
        return reihe[min(reihe, key=lambda m: abs(
            (int(m[:4]) * 12 + int(m[5:])) - (int(monat[:4]) * 12 + int(monat[5:]))))]

    raus = []
    for t, c in punkte:
        kurs = naechster(monat(t))
        if kurs:
            raus.append((t, c * kurs))
    return (raus, True) if len(raus) >= 3 else (punkte, False)


FEINUNZE_GRAMM = 31.1034768

# Zakat-Grenzen, die klassischen Werte. 85 Gramm Gold entsprechen 20 Dinar,
# 595 Gramm Silber entsprechen 200 Dirham.
NISAB_GOLD_GRAMM = 85
NISAB_SILBER_GRAMM = 595


def tageskurs(symbol):
    """Aktueller Kurs eines Symbols, ohne Historie."""
    url = (f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
           "?range=5d&interval=1d")
    try:
        return hole(url)["chart"]["result"][0]["meta"].get("regularMarketPrice")
    except Exception:
        return None


def metallpreise():
    """Gold- und Silberpreis je Gramm in Euro, dazu die beiden Nisab-Grenzen.

    Fuer den Zakat-Rechner. Der Rechner ruft selbst nichts ab, er liest nur
    diese Datei. So haengt die Seite an keiner fremden Schnittstelle, und der
    Stand ist trotzdem gepflegt.

    Quelle sind die Terminkurse GC=F und SI=F, weil Yahoo die Spotsymbole
    XAUEUR=X und XAGEUR=X nicht ausliefert. Der Unterschied zum Spotpreis liegt
    im Bereich von ein bis zwei Prozent. Das steht auch so im Feld hinweis,
    damit niemand die Zahl fuer taggenau haelt."""
    usd_eur = tageskurs("USDEUR=X")
    gold_usd = tageskurs("GC=F")
    silber_usd = tageskurs("SI=F")
    if not (usd_eur and gold_usd and silber_usd):
        return None
    gold_g = gold_usd * usd_eur / FEINUNZE_GRAMM
    silber_g = silber_usd * usd_eur / FEINUNZE_GRAMM
    return {
        "stand": datetime.now(timezone.utc).strftime("%d.%m.%Y"),
        "quelle": "Yahoo Finance, Terminkurse GC=F und SI=F, in Euro umgerechnet",
        "hinweis": ("Terminkurs, nicht Spotpreis. Abweichung meist ein bis zwei "
                    "Prozent. Fuer eine taggenaue Berechnung den Preis des "
                    "eigenen Stichtags verwenden."),
        "goldPreisJeGramm": round(gold_g, 2),
        "silberPreisJeGramm": round(silber_g, 3),
        "nisabGoldEuro": round(NISAB_GOLD_GRAMM * gold_g),
        "nisabSilberEuro": round(NISAB_SILBER_GRAMM * silber_g),
        "nisabGoldGramm": NISAB_GOLD_GRAMM,
        "nisabSilberGramm": NISAB_SILBER_GRAMM,
    }


def entdoppeln(punkte):
    """Je Monat nur einen Punkt, den zuletzt gemeldeten.

    Yahoo haengt fuer den laufenden Monat einen zweiten Punkt an. Ohne diese
    Bereinigung erscheint August zweimal, und weil die Renditen ueber Positionen
    zaehlen, waere die Einjahresrendite in Wahrheit nur elf Monate lang."""
    nach_monat = {}
    for t, c in punkte:
        nach_monat[monat(t)] = (t, c)
    return [nach_monat[m] for m in sorted(nach_monat)]


def rendite(punkte, monate):
    """Prozentuale Veraenderung ueber die letzten n Monate."""
    if len(punkte) <= monate:
        return None
    jetzt = punkte[-1][1]
    frueher = punkte[-1 - monate][1]
    if not frueher:
        return None
    return round((jetzt - frueher) / frueher * 100, 1)


def sparkline(punkte, n=60):
    """Letzte n Monatswerte, auf 0 bis 100 normiert, fuer die Mini-Grafik."""
    werte = [p[1] for p in punkte][-n:]
    lo, hi = min(werte), max(werte)
    spanne = hi - lo or 1
    return [round((w - lo) / spanne * 100, 1) for w in werte]


def reihe_wochen(punkte):
    """Woechentliche Schlusskurse als [Datum, Kurs], Datum als '2026-08-10'.

    Warum zusaetzlich zur Monatsreihe: 60 Monatspunkte ergeben eine Treppe,
    keinen Kursverlauf. Mit rund 260 Wochenpunkten sieht die Grafik aus wie
    bei den grossen Portalen, und die Zeitraeume 1M und 3M haben ueberhaupt
    erst genug Punkte, um etwas zu zeigen."""
    gesehen = {}
    for t, c in punkte:
        tag = datetime.fromtimestamp(t + 43200, timezone.utc).strftime("%Y-%m-%d")
        gesehen[tag] = round(c, 2)
    return [[tag, gesehen[tag]] for tag in sorted(gesehen)]


def reihe_tage(punkte):
    """Tagesschlusskurse als [Datum, Kurs], gleiches Format wie reihe_wochen.

    Warum zusaetzlich: In der Ein-Monats-Ansicht hat die Wochenreihe nur vier
    Punkte, das ist ein Streckenzug und kein Kursverlauf. Mit Tageskursen hat
    1M rund 22 Punkte und 3M rund 65. Geholt wird nur ein Jahr, laengere
    Zeitraeume laufen weiter ueber die Wochenreihe."""
    gesehen = {}
    for t, c in punkte:
        tag = datetime.fromtimestamp(t + 43200, timezone.utc).strftime("%Y-%m-%d")
        gesehen[tag] = round(c, 2)
    return [[tag, gesehen[tag]] for tag in sorted(gesehen)]


def reihe_mit_datum(punkte, n=60):
    """Letzte n Monatswerte als [Monat, echter Kurs]. Der Monat ist ein
    Zeitstempel wie '2026-08', der Kurs die tatsaechliche Notierung in der
    Waehrung, in der auch die Renditen ausgewiesen werden.

    Ohne echte Werte kann kein Tooltip eine Zahl zeigen, deshalb wird hier
    nicht normiert. Die Normierung fuer die Achse macht die Grafik selbst."""
    raus = []
    for t, c in punkte[-n:]:
        raus.append([monat(t), round(c, 2)])
    return raus


def verarbeite(isin, name):
    kandidaten = symbole_finden(isin)
    if isin in SYMBOL_FEST:
        kandidaten = [SYMBOL_FEST[isin]] + kandidaten
    if not kandidaten:
        return {"isin": isin, "name": name, "status": "kein Symbol gefunden"}
    k = None
    for sym in kandidaten:
        k = kurse(sym)
        if k:
            break
        time.sleep(0.3)
    if not k:
        return {"isin": isin, "name": name, "symbol": kandidaten[0],
                "status": "keine Kursdaten"}
    sym = k["symbol"]
    p_roh = k["punkte"]
    p, umgerechnet = in_euro(p_roh, k["waehrung"])
    p = entdoppeln(p)

    # Zweiter Lauf, gleiche Notierung, nur feiner getaktet. Schlaegt er fehl,
    # bleibt die Monatsreihe die Grundlage, die Seite laeuft trotzdem.
    woche = []
    time.sleep(0.4)
    kw = kurse(sym, spanne="5y", takt="1wk")
    if kw:
        pw, _ = in_euro(kw["punkte"], kw["waehrung"])
        woche = reihe_wochen(pw)

    # Dritter Lauf, ein Jahr im Tagestakt. Nur fuer 1M, 3M und 1J.
    tage = []
    time.sleep(0.4)
    kt = kurse(sym, spanne="1y", takt="1d")
    if kt:
        pt, _ = in_euro(kt["punkte"], kt["waehrung"])
        tage = reihe_tage(pt)

    return {
        "isin": isin,
        "name": name,
        "symbol": sym,
        "notierungswaehrung": k["waehrung"],
        "rendite_waehrung": "EUR" if (umgerechnet or k["waehrung"] == "EUR")
                            else k["waehrung"],
        "in_euro_umgerechnet": umgerechnet,
        # Tageskurs, so wie die Boerse ihn notiert, also moeglicherweise in
        # Fremdwaehrung. Nie ohne das Feld notierungswaehrung anzeigen.
        "kurs_notierung": round(k["kurs"], 2) if k["kurs"] else None,
        "kurs": round(k["kurs"], 2) if k["kurs"] else None,
        "rendite1m": rendite(p, 1),
        "rendite6m": rendite(p, 6),
        "rendite1j": rendite(p, 12),
        "rendite5j": rendite(p, 60),
        "verlauf": sparkline(p),
        "reihe": reihe_mit_datum(p),
        "reihe_w": woche,
        "reihe_t": tage,
        "punkte": len(p),
        "punkte_w": len(woche),
        "punkte_t": len(tage),
        "status": "ok",
    }


if __name__ == "__main__":
    ergebnis = {
        "stand": datetime.now(timezone.utc).strftime("%d.%m.%Y"),
        "quelle": "Yahoo Finance",
        "anlagen": [],
        "krypto": [],
    }
    for isin, name in ANLAGEN:
        e = verarbeite(isin, name)
        ergebnis["anlagen"].append(e)
        mark = "ok  " if e["status"] == "ok" else "FEHL"
        waehr = e.get('rendite_waehrung', '-')
        print(f"{mark} {name[:44]:45} {e.get('symbol','-'):12} "
              f"{waehr:4} 1J {e.get('rendite1j')}")
        time.sleep(0.6)

    for sym, name in KRYPTO:
        k = kurse(sym)
        if k:
            p = entdoppeln(k["punkte"])
            time.sleep(0.4)
            kw = kurse(sym, spanne="5y", takt="1wk")
            time.sleep(0.4)
            kt = kurse(sym, spanne="1y", takt="1d")
            ergebnis["krypto"].append({
                "name": name, "symbol": sym, "waehrung": k["waehrung"],
                "kurs": round(k["kurs"], 2),
                "rendite1m": rendite(p, 1), "rendite6m": rendite(p, 6),
                "rendite1j": rendite(p, 12), "rendite5j": rendite(p, 60),
                "verlauf": sparkline(p), "reihe": reihe_mit_datum(p),
                "reihe_w": reihe_wochen(kw["punkte"]) if kw else [],
                "reihe_t": reihe_tage(kt["punkte"]) if kt else [],
                "status": "ok",
            })
            print(f"ok   {name:45} {sym:12} {k['waehrung']:4} "
                  f"1J {rendite(p,12)}")
        time.sleep(0.6)

    ziel = ZIEL_ROH / "kurse_roh.json"
    ziel.write_text(json.dumps(ergebnis, indent=1, ensure_ascii=False))

    # Kompakte Fassung fuer die Website. Nach ISIN geschluesselt, damit die
    # Anlagenseite ohne Suche zugreifen kann. "reihe" traegt Datum und echten
    # Kurs, "verlauf" bleibt fuer die alten Mini-Grafiken erhalten.
    def kompakt(e):
        # Der Kurs ist hier immer der letzte Punkt der Reihe, also in derselben
        # Waehrung wie die Reihe und wie die Renditen. Der Tageskurs aus
        # kurse.json steht in Fremdwaehrung und darf nie neben einem
        # Euro-Etikett stehen.
        r = e.get("reihe", [])
        return {
            "name": e["name"],
            "waehrung": e.get("rendite_waehrung"),
            "kurs": r[-1][1] if r else None,
            "r1m": e.get("rendite1m"), "r6m": e.get("rendite6m"),
            "r1j": e.get("rendite1j"), "r5j": e.get("rendite5j"),
            "verlauf": e.get("verlauf", []),
            "reihe": e.get("reihe", []),
            # Woechentlich, fuer die langen Zeitraeume der grossen Grafik.
            "reihe_w": e.get("reihe_w", []),
            # Taeglich, ein Jahr zurueck, fuer 1M, 3M und 1J.
            "reihe_t": e.get("reihe_t", []),
        }

    # Anlagen ohne Kursdaten bleiben mit Statusfeld in der Datei, genau wie
    # bisher. Die Anlagenseite erwartet den Eintrag und zeigt darauf
    # "noch keine Kursdaten" statt einer leeren Grafik.
    def eintrag(a):
        if a["status"] != "ok":
            return {"status": a["status"]}
        return kompakt(a)

    k_datei = {
        "stand": ergebnis["stand"],
        "quelle": "Yahoo Finance, Renditen in Euro umgerechnet",
        "hinweis": "reihe = [Monat, Kurs] in der Waehrung des Feldes waehrung",
        "anlagen": {a["isin"]: eintrag(a) for a in ergebnis["anlagen"]},
        # Schluessel ist der Name, nicht das Boersensymbol. Die Website greift
        # mit "Bitcoin" und "Ether" zu, ein Wechsel auf BTC-EUR wuerde die
        # Krypto-Anzeige stillschweigend leeren.
        "krypto": {k["name"]: kompakt(k) | {"waehrung": k["waehrung"]}
                   for k in ergebnis["krypto"]},
    }
    ziel_k = ZIEL / "kurse.json"
    ziel_k.write_text(json.dumps(k_datei, ensure_ascii=False))

    # Metallpreise fuer den Zakat-Rechner, eigene kleine Datei.
    m = metallpreise()
    if m:
        ziel_m = ZIEL / "nisab.json"
        ziel_m.write_text(json.dumps(m, indent=1, ensure_ascii=False))
        print(f"\nGold {m['goldPreisJeGramm']} EUR/g, "
              f"Silber {m['silberPreisJeGramm']} EUR/g")
        print(f"Nisab Gold {m['nisabGoldEuro']} EUR, "
              f"Silber {m['nisabSilberEuro']} EUR")
        print(f"Datei: {ziel_m}")
    else:
        print("\nMetallpreise konnten nicht geholt werden, nisab.json unveraendert.")

    ok = sum(1 for a in ergebnis["anlagen"] if a["status"] == "ok")
    print(f"\n{ok} von {len(ANLAGEN)} Anlagen mit Kursdaten.")
    print(f"Datei: {ziel}")
    print(f"Datei: {ziel_k}  ({ziel_k.stat().st_size // 1024} kB)")
