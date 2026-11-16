import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Seo from "@/components/Seo";
import CheckVerkaufsseite from "@/components/CheckVerkaufsseite";
import CheckChat from "@/components/CheckChat";
import BankSuche, { DepotSuche } from "@/components/BankSuche";
import CheckErgebnis from "@/components/CheckErgebnis";
import CheckLaden, { LADEN_VORHANG_MS } from "@/components/CheckLaden";
import { ereignis } from "@/lib/messung";
import { abFassung } from "@/lib/abTest";
import {
  AB_TEST,
  FRAGEN,
  artAus,
  artVon,
  ergebnisAus,
  ladenTexte,
  ersteAntwortAus,
  fragenGesamt,
  frageFuer,
  naechsteFrage,
  UNSICHER_SATZ,
  quelleAus,
  type Antworten,
  type Art,
  type FrageId,
} from "@/data/halalFinanzCheck";
import type { BankWahl } from "@/data/bankSuche";
import type { DepotWahl } from "@/data/depotSuche";
import "@/styles/halalFinanzCheck.css";

/**
 * Halal-Finanz-Check, RN8 (15.11.2026): zwei Arten auf einem Gerüst, gesteuert über die Adresse.
 *  /check?art=konto   Bankkonto-Check: Wie bezahlst du, Bank von heute (Suchleiste), Ergebnis „Von der <Bank> zur norisbank“
 *  /check?art=depot   Depot-Check (RN10-07): Hast du schon ein Depot (bei Ja: Wo?), Was ist dir wichtiger, Worin willst du investieren
 *                     (Fassung b: Monatsbetrag), Ergebnis mit Passung in Prozent
 *  /check             überall dieselbe erste Frage „Was suchst du gerade?“; nur das grüne Etikett wandert je Quelle (hinweisJeQuelle)
 * Wer direkt kommt (Startseite, Instagram), sieht zuerst die Verkaufsseite (CheckVerkaufsseite), „Check starten“ führt auf derselben
 * Route zur ersten Frage (?schritt=fragen). Wer aus einem Freebie kommt (CheckEinstieg.tsx: ?quelle=…&start=2&a1=konto|invest|unsicher),
 * sieht keine Verkaufsseite, die Antwort auf „Was suchst du gerade?“ ist schon da und der Chat geht bei Frage 2 weiter. Alte Adressen mit ?ziel=konto|invest|beides
 * laufen weiter (Konto und Beides in den Bankkonto-Weg, Investieren in den Depot-Weg).
 * Die Bank von heute bleibt im Zustand der Seite: nie in der Adresse, nie im /out-Link, in der Messung nur die Gruppe.
 * 50:50-Test check-depotfrage (?ab=a|b) auf dem Depot-Weg bleibt, die Fassung steht am Ende der Kennung am Knopf.
 * Logik und Texte: src/data/halalFinanzCheck.ts, Bank-Suche: src/data/bankSuche.ts.
 */
const ZIEL_ZU_ART: Record<string, Art> = { konto: "konto", beides: "konto", invest: "depot" };

const anfang = (params: URLSearchParams): { antworten: Antworten; verlauf: FrageId[]; gestartet: boolean } => {
  const art = artAus(params.get("art"));
  const start = params.get("start") === "2";
  if (start) {
    // Aus einem Freebie (RN10-07): ?a1= ist die Antwort auf „Was suchst du gerade?“ (alte Adressen mit Zahlung oder Erfahrung laufen weiter).
    const a = ersteAntwortAus(art, params.get("a1"));
    const verlauf = (["ziel", "zahlung", "hatDepot"] as FrageId[]).filter((id) => a[id] !== undefined);
    return { antworten: a, verlauf, gestartet: true };
  }
  const legacy = ZIEL_ZU_ART[params.get("ziel") ?? ""];
  if (legacy) return { antworten: { art: legacy }, verlauf: [], gestartet: true };
  // Direkter Einstieg (auch mit ?art=): zuerst „Was suchst du gerade?“ wie im Original (Elias RN8-06); ?art= wählt nur die Verkaufsseite.
  return { antworten: {}, verlauf: [], gestartet: params.get("schritt") === "fragen" };
};

const HalalFinanzCheck = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const quelle = quelleAus(params.get("quelle"));
  const artAdresse = artAus(params.get("art"));
  // Zuteilung einmal je Besucher, ?ab=a oder ?ab=b erzwingt eine Fassung (src/lib/abTest.ts).
  const [fassung] = useState(() => abFassung(AB_TEST));
  const start = useRef(anfang(params));
  const [antworten, setAntworten] = useState<Antworten>(start.current.antworten);
  const [verlauf, setVerlauf] = useState<FrageId[]>(start.current.verlauf);
  const [gewaehlt, setGewaehlt] = useState<string | null>(null);
  const oben = useRef<HTMLDivElement>(null);

  const gestartet = params.get("schritt") === "fragen" || params.get("start") === "2" || Boolean(ZIEL_ZU_ART[params.get("ziel") ?? ""]);
  const frageId = naechsteFrage(antworten, fassung);
  const ergebnis = useMemo(() => ergebnisAus(antworten, quelle, fassung), [antworten, quelle, fassung]);
  const art = artVon(antworten);
  const nummer = verlauf.length + 1;
  const gesamt = fragenGesamt(antworten, fassung);
  // Ladescreen vor dem Ergebnis (Elias RN9-01, RN9-02): „an“ läuft, „zu“ zieht den Vorhang (700 ms), „aus“ ist weg.
  // Das Ergebnis liegt schon darunter (inert), damit es beim Vorhang da ist.
  const [laden, setLaden] = useState<"an" | "zu" | "aus">("aus");
  const hatErgebnis = gestartet && ergebnis !== null;
  useEffect(() => {
    setLaden(hatErgebnis ? "an" : "aus");
    if (hatErgebnis) window.scrollTo?.(0, 0);
  }, [hatErgebnis]);
  const ladenFertig = () => {
    setLaden("zu");
    window.setTimeout(() => setLaden("aus"), LADEN_VORHANG_MS);
  };

  useEffect(() => {
    ereignis("check_start", { quelle, art: artAdresse ?? "", fassung });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quelle]);

  useEffect(() => {
    if (!ergebnis) return;
    ereignis("quiz_ergebnis", {
      check: true,
      quelle,
      fassung,
      art: ergebnis.art === "konto" ? "konto" : "depot",
      ergebnis: ergebnis.art,
      anbieter: ergebnis.anbieter.out,
      // Nur die Gruppe der Bank von heute, nie der freie Text.
      ...(ergebnis.art === "konto" ? { bank_gruppe: antworten.bank?.gruppe ?? "" } : { passung: ergebnis.passung }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ergebnis, quelle, fassung]);

  // Beim Wechsel der Frage oder zur Verkaufsseite oben anfangen.
  useEffect(() => {
    if (gestartet) oben.current?.scrollIntoView({ block: "start" });
  }, [frageId, gestartet]);

  // Zurück bei der Verkaufsseite (Browser oder Knopf): die Antworten beginnen von vorn.
  useEffect(() => {
    if (gestartet) return;
    setAntworten({});
    setVerlauf([]);
    setGewaehlt(null);
  }, [gestartet, artAdresse]);

  const starte = (stelle: string) => {
    ereignis("check_klick", { quelle, stelle, fassung });
    const neu = new URLSearchParams(params);
    neu.set("schritt", "fragen");
    setParams(neu);
  };

  const weiter = (id: FrageId, wert: string, zusatz: Partial<Antworten>, messwert: string) => {
    if (gewaehlt) return;
    setGewaehlt(wert);
    ereignis("quiz_frage", { check: true, quelle, fassung, art: art ?? "", frage: id, antwort: messwert, nummer });
    window.setTimeout(() => {
      setAntworten((a) => ({ ...a, ...zusatz }));
      setVerlauf((v) => [...v, id]);
      setGewaehlt(null);
    }, 260);
  };

  const waehle = (id: FrageId, wert: string) => weiter(id, wert, { [id]: wert } as Partial<Antworten>, wert);

  /** Die Bank von heute: im Zustand, nie in der Adresse. Die Messung bekommt nur die Gruppe. */
  const waehleBank = (b: BankWahl) => weiter("bank", b.id, { bank: b }, b.gruppe);

  /** Das Depot von heute (RN10): im Zustand, nie in der Adresse; die Messung bekommt nur die Gruppe. */
  const waehleDepot = (d: DepotWahl) => weiter("depotHeute", d.id, { depotHeute: d }, d.gruppe);

  const zurueck = () => {
    const letzte = verlauf[verlauf.length - 1];
    if (!letzte) {
      // Erste Frage: aus einem Freebie zurück dorthin, sonst zur Verkaufsseite.
      if (params.get("start") === "2") {
        navigate(-1);
        return;
      }
      const neu = new URLSearchParams(params);
      neu.delete("schritt");
      neu.delete("ziel");
      setParams(neu);
      return;
    }
    setVerlauf((v) => v.slice(0, -1));
    setAntworten((a) => {
      const neu = { ...a };
      delete neu[letzte];
      return neu;
    });
  };

  const neu = () => {
    setAntworten({});
    setVerlauf([]);
  };

  const titel =
    artAdresse === "konto"
      ? "Bankkonto-Check: Welches Konto passt zu dir? | finanzmuslim"
      : artAdresse === "depot"
        ? "Depot-Check: Welches Halal-Depot passt zu dir? | finanzmuslim"
        : "Halal-Finanz-Check: Konto, Depot oder beides? | finanzmuslim";

  return (
    <div ref={oben} className="hc">
      <Seo
        title={titel}
        description="Beantworte kurze Fragen und sieh, womit du halal startest: zinsfreies Bankkonto oder Halal-Depot."
        path="/check"
        noindex
      />

      {!gestartet && <CheckVerkaufsseite onStart={starte} art={artAdresse} />}

      {gestartet && frageId && (
        <CheckChat
          key={frageId}
          frage={frageFuer(frageId, antworten, quelle)}
          nummer={nummer}
          gesamt={gesamt}
          gewaehlt={gewaehlt}
          onWaehle={(wert) => waehle(frageId, wert)}
          onZurueck={zurueck}
          antwort={
            frageId === "bank" ? (
              <BankSuche onWahl={waehleBank} />
            ) : frageId === "depotHeute" ? (
              <DepotSuche onWahl={waehleDepot} />
            ) : undefined
          }
          warum={frageId === "zahlung" && antworten.ziel === "unsicher" ? UNSICHER_SATZ : undefined}
        />
      )}

      {gestartet && ergebnis && (
        <div {...({ inert: laden === "an" ? "" : undefined } as Record<string, string | undefined>)}>
          <CheckErgebnis e={ergebnis} antworten={antworten} onNeu={neu} bereit={laden !== "an"} />
        </div>
      )}
      {gestartet && ergebnis && laden !== "aus" && (
        <CheckLaden text={ladenTexte(antworten)} onFertig={ladenFertig} zu={laden === "zu"} />
      )}
    </div>
  );
};

export default HalalFinanzCheck;
