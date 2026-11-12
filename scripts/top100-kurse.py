#!/usr/bin/env python3
"""Kurse der 100 Halal-Aktien im Freebie „Aktie“ (AF1, 12.11.2026): Abstand zum Jahreshoch und Woche.

Holt je Aktie die Tagesschlusskurse der letzten 12 Monate bei Yahoo Finance, rechnet sie mit Yahoo-Tageswechselkursen
in Euro um (wie die Halal-Datenbank und das Investment-OS) und schreibt `src/data/top100Kurse.ts`: je Ticker den
Abstand des letzten Schlusskurses zum höchsten Schlusskurs der 12 Monate, die Veränderung über sieben Kalendertage und
eine Kurslinie (jeder fünfte Handelstag). Ein laufender Handelstag zählt nicht, nur fertige Schlusskurse.
Warum Jahreshoch statt Woche: am 12.11.2026 lagen nur 50 von 100 in der Woche im Minus, aber 87 unter dem Jahreshoch
(Elias wollte die Wahrheit zeigen, Vault raw/2026-11-12-elias-af1-01-aktien-freebie-logos-wochenkurs-top15-cta.md).

Aufruf: python3 scripts/top100-kurse.py   (rund 3 Minuten, keine Kosten)
"""
import bisect
import datetime
import json
import pathlib
import time
import urllib.parse
import urllib.request

try:
    from zoneinfo import ZoneInfo
except ImportError:  # pragma: no cover
    ZoneInfo = None

WURZEL = pathlib.Path(__file__).resolve().parent.parent
ZIEL = WURZEL / "src" / "data" / "top100Kurse.ts"
UA = "Mozilla/5.0"  # feste Kennung wie kurse_abruf.py des OS; eine volle Browser-Kennung bekommt 429

# Ticker der Liste → Yahoo-Symbol (dieselben Symbole wie kurse-tag.json des Investment-OS, Stand 11.11.2026).
SYMBOLE = {"AAPL": "AAPL", "AVGO": "AVGO", "AMD": "AMD", "ASML": "ASML.AS", "ADBE": "ADBE", "SAP": "SAP.DE",
    "QCOM": "QCOM", "MU": "MU", "CRM": "CRM", "INTC": "INTC", "NVDA": "NVDA", "PANW": "PANW", "ADSK": "ADSK",
    "GRMN": "GRMN", "IFX": "IFX.DE", "AMAT": "AMAT", "LRCX": "LRCX", "6762": "6762.T", "MRVL": "MRVL",
    "SNPS": "SNPS", "PG": "PG", "MNST": "MNST", "LOW": "LOW", "BBY": "BBY", "BEI": "BEI.DE", "HEN": "HEN3.DE",
    "CL": "CL", "OR": "OR.PA", "4901": "4901.T", "7751": "7751.T", "LULU": "LULU", "ESSITY B": "ESSITY-B.ST",
    "ADS": "ADS.DE", "7936": "7936.T", "HD": "HD", "EL": "EL.PA", "ZAL": "ZAL.DE", "KMB": "KMB", "4911": "4911.T",
    "CHD": "CHD", "JNJ": "JNJ", "LLY": "LLY", "NOVO B": "NOVO-B.CO", "AZN": "AZN.L", "NOVN": "NOVN.SW",
    "SAN": "SAN.PA", "ABT": "ABT", "MDT": "MDT", "MRK": "MRK", "ISRG": "ISRG", "BSX": "BSX", "GILD": "GILD",
    "VRTX": "VRTX", "SYK": "SYK", "DASH": "DASH", "BDX": "BDX", "HLN": "HLN.L", "IDXX": "IDXX", "ALV": "ALV",
    "ALC": "ALC.SW", "XOM": "XOM", "ITW": "ITW", "PH": "PH", "EMR": "EMR", "SU": "SU.PA", "MMM": "MMM",
    "LIN": "LIN", "AI": "AI.PA", "APH": "APH", "BHP": "BHP", "CMI": "CMI", "MSI": "MSI", "FTNT": "FTNT",
    "VWS": "VWS.CO", "6367": "6367.T", "STMPA": "STMPA.PA", "CSCO": "CSCO", "6702": "6702.T", "6701": "6701.T",
    "KNEBV": "KNEBV.HE", "TEAM": "TEAM", "5108": "5108.T", "WAT": "WAT", "ECL": "ECL", "XEL": "XEL",
    "PSON": "PSON.L", "WSM": "WSM", "ANET": "ANET", "PWR": "PWR", "6586": "6586.T", "CRWD": "CRWD",
    "QIA": "QIA.DE", "MCK": "MCK", "BIIB": "BIIB", "RMD": "RMD", "RBLX": "RBLX", "CROX": "CROX", "TSLA": "TSLA",
    "MONC": "MONC.MI", "NKE": "NKE"}


def hole(url):
    letzter = None
    for i in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=25) as r:
                return json.loads(r.read().decode())
        except Exception as e:  # Netz, 429, kaputtes JSON
            letzter = e
            time.sleep(5 * (i + 1))
    raise RuntimeError(f"Abruf gescheitert: {url} ({letzter})")


def tage(symbol, rng="1y"):
    """[(Datum, Schluss)] fertiger Handelstage in Ortszeit der Börse und die Währung."""
    d = hole("https://query1.finance.yahoo.com/v8/finance/chart/" + urllib.parse.quote(symbol)
             + f"?range={rng}&interval=1d")
    time.sleep(1.2)
    r = d["chart"]["result"][0]
    meta, tz = r["meta"], r["meta"].get("exchangeTimezoneName")
    zone = ZoneInfo(tz) if (ZoneInfo and tz) else datetime.timezone.utc
    reihe = {}
    for t, c in zip(r.get("timestamp") or [], r["indicators"]["quote"][0].get("close") or []):
        if c is not None:
            reihe[datetime.datetime.fromtimestamp(t, zone).strftime("%Y-%m-%d")] = c
    reihe = sorted(reihe.items())
    ende = ((meta.get("currentTradingPeriod") or {}).get("regular") or {}).get("end")
    heute = datetime.datetime.now(zone).strftime("%Y-%m-%d")
    if reihe and ende and time.time() < ende and reihe[-1][0] == heute:
        reihe = reihe[:-1]  # Börse läuft noch: kein Schlusskurs
    return reihe, meta.get("currency")


_FX = {}


def fx(waehrung):
    """Fremdwährung je 1 EUR als ([Datum], [Kurs])."""
    b = "GBP" if waehrung == "GBp" else waehrung
    if b not in _FX:
        r, _ = tage(f"EUR{b}=X")
        _FX[b] = ([x for x, _ in r], [y for _, y in r])
    return _FX[b]


def euro(reihe, waehrung):
    teiler = 100.0 if waehrung == "GBp" else 1.0
    if waehrung == "EUR":
        return list(reihe)
    f = fx(waehrung)
    out = []
    for d, v in reihe:
        i = max(bisect.bisect_right(f[0], d) - 1, 0)
        out.append((d, v / teiler / f[1][i]))
    return out


def main():
    werte, bis_max = {}, ""
    for ticker, symbol in SYMBOLE.items():
        reihe, waehr = tage(symbol)
        reihe = euro(reihe, waehr)
        if len(reihe) < 30:
            print("zu wenig Daten:", ticker)
            continue
        letzter, kurs = reihe[-1]
        grenze = (datetime.date.fromisoformat(letzter) - datetime.timedelta(days=7)).isoformat()
        start = max(i for i, (d, _) in enumerate(reihe) if d <= grenze)
        basis = reihe[start][1]
        hoch_d, hoch = max(reihe, key=lambda x: x[1])
        linie = [v for _, v in reihe][::-1][::5][::-1]
        werte[ticker] = {"hoch": round((kurs / hoch - 1) * 100, 1), "hochAm": hoch_d,
                         "woche": round((kurs / basis - 1) * 100, 1), "bis": letzter,
                         "kurs": round(kurs, 2), "linie": [round(v, 2) for v in linie],
                         "wocheLinie": [round(v, 2) for _, v in reihe[start:]]}
        bis_max = max(bis_max, letzter)
        print(f"{ticker:9} Hoch {werte[ticker]['hoch']:+6.1f} %  Woche {werte[ticker]['woche']:+6.1f} %  bis {letzter}")
    stand = datetime.date.fromisoformat(bis_max).strftime("%d.%m.%Y")
    kopf = (
        "/**\n * Kurse je Aktie im Freebie „Aktie“, erzeugt von `scripts/top100-kurse.py` (nicht von Hand ändern).\n"
        " * Quelle: Yahoo Finance, Tagesschlusskurse der letzten 12 Monate in Euro, umgerechnet mit Yahoo-Tageswechselkursen.\n"
        " * `hoch`: Abstand des letzten Schlusskurses (`bis`) zum höchsten Schlusskurs der 12 Monate (`hochAm`), in Prozent.\n"
        " * `woche`: Veränderung zum Schlusskurs sieben Kalendertage vor `bis`. `linie`: jeder fünfte Schlusskurs; `wocheLinie`: die Schlusskurse der 7 Tage.\n */\n"
    )
    ts = (kopf
          + "export type AktienKurs = { hoch: number; hochAm: string; woche: number; bis: string; kurs: number; linie: number[]; wocheLinie: number[] };\n\n"
          + f'export const KURS_STAND = "{stand}";\n\n'
          + "export const kurse: Record<string, AktienKurs> = "
          + json.dumps(werte, ensure_ascii=False, separators=(",", ":")) + ";\n")
    ZIEL.write_text(ts)
    unter = sum(1 for w in werte.values() if w["hoch"] < 0)
    minus = sum(1 for w in werte.values() if w["woche"] < 0)
    print(f"\n{len(werte)} Aktien, {unter} unter Jahreshoch, {minus} in der Woche im Minus, Stand {stand}")


if __name__ == "__main__":
    main()
