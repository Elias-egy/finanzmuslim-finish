import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  BriefcaseBusiness,
  Building2,
  Check,
  Coins,
  Footprints,
  Gem,
  Layers,
  ListChecks,
  PiggyBank,
  Smartphone,
  Sprout,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Seo from "@/components/Seo";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import CheckVerkaufsseite from "@/components/CheckVerkaufsseite";
import { ereignis } from "@/lib/messung";
import { abFassung } from "@/lib/abTest";
import { followerGesamt } from "@/data/beweise";
import {
  AB_TEST,
  ETIKETT,
  FRAGEN,
  UNTERZEILE,
  WERBEHINWEIS,
  antwortZeilen,
  ergebnisAus,
  fragenGesamt,
  naechsteFrage,
  outLink,
  quelleAus,
  type Antworten,
  type FrageId,
} from "@/data/halalFinanzCheck";
import "@/styles/halalFinanzCheck.css";

/**
 * Halal-Finanz-Check, RN7 (15.11.2026), 1:1 nach Elias' Perspective-Funnel (Vault hermes/renovierungskampagne/perspective/
 * eins-zu-eins/index.html). Wer /check öffnet, sieht zuerst die Verkaufsseite (CheckVerkaufsseite), der Knopf „Check starten“
 * führt auf derselben Route zur ersten Frage (?schritt=fragen, damit „Zurück“ im Browser zur Verkaufsseite führt). Kommt die
 * Person aus einem Freebie schon mit der ersten Antwort (?ziel=…, CheckEinstieg.tsx), hat sie diese Seite dort gesehen und der
 * Check beginnt bei Frage 2. Nach dem Tipp springt die Seite zur nächsten Frage. Am Ende genau eine Empfehlung mit einem Knopf
 * direkt zum Anbieter über /out (Elias RN3-07: „Ohne eine Zwischenbrücke“). Keine Mail im Ablauf. 50:50-Test RN7: Fassung b hat
 * auf dem Depot-Weg eine Frage mehr (halalFinanzCheck.ts), die Fassung steht in der Kennung am Knopf. Logik und Texte: src/data/halalFinanzCheck.ts.
 */
const ICONS: Record<string, LucideIcon> = {
  "ziel:konto": Wallet,
  "ziel:invest": TrendingUp,
  "ziel:beides": Layers,
  "erfahrung:keine": Sprout,
  "erfahrung:erste": Footprints,
  "erfahrung:depot": BriefcaseBusiness,
  "praef:halal": ListChecks,
  "praef:kosten": Coins,
  "betrag:unter50": PiggyBank,
  "betrag:50bis200": Banknote,
  "betrag:ueber200": Gem,
  "filiale:nein": Smartphone,
  "filiale:ja": Building2,
};

const HalalFinanzCheck = () => {
  const [params, setParams] = useSearchParams();
  const quelle = quelleAus(params.get("quelle"));
  // Zuteilung einmal je Besucher, ?ab=a oder ?ab=b erzwingt eine Fassung (src/lib/abTest.ts).
  const [fassung] = useState(() => abFassung(AB_TEST));
  // Aus einem Freebie kommt die erste Antwort schon mit (?ziel=…, CheckEinstieg.tsx): dann beginnt der Check bei Frage 2.
  const zielAusFreebie = params.get("ziel");
  const vorab: Antworten =
    zielAusFreebie === "konto" || zielAusFreebie === "invest" || zielAusFreebie === "beides" ? { ziel: zielAusFreebie } : {};
  const [antworten, setAntworten] = useState<Antworten>(vorab);
  const [verlauf, setVerlauf] = useState<FrageId[]>(vorab.ziel ? ["ziel"] : []);
  const [gewaehlt, setGewaehlt] = useState<string | null>(null);
  const oben = useRef<HTMLDivElement>(null);

  const gestartet = params.get("schritt") === "fragen" || Boolean(vorab.ziel);
  const frageId = naechsteFrage(antworten, fassung);
  const ergebnis = useMemo(() => ergebnisAus(antworten, quelle, fassung), [antworten, quelle, fassung]);
  const nummer = verlauf.length + 1;
  const gesamt = fragenGesamt(antworten, fassung);

  useEffect(() => {
    ereignis("check_start", { quelle, ziel: zielAusFreebie ?? "", fassung });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quelle]);

  useEffect(() => {
    if (!ergebnis) return;
    ereignis("quiz_ergebnis", { check: true, quelle, fassung, ergebnis: ergebnis.art, anbieter: ergebnis.anbieter.out });
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
  }, [gestartet]);

  const starte = (stelle: string) => {
    ereignis("check_klick", { quelle, stelle, fassung });
    const neu = new URLSearchParams(params);
    neu.set("schritt", "fragen");
    setParams(neu);
  };

  const waehle = (id: FrageId, wert: string) => {
    if (gewaehlt) return;
    setGewaehlt(wert);
    ereignis("quiz_frage", { check: true, quelle, fassung, frage: id, antwort: wert, nummer });
    window.setTimeout(() => {
      setAntworten((a) => ({ ...a, [id]: wert }));
      setVerlauf((v) => [...v, id]);
      setGewaehlt(null);
    }, 260);
  };

  const zurueck = () => {
    const letzte = verlauf[verlauf.length - 1];
    if (!letzte) {
      // Erste Frage: zurück zur Verkaufsseite.
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

  return (
    <div ref={oben} className="hc">
      <Seo
        title="Halal-Finanz-Check: Konto, Depot oder beides? | finanzmuslim"
        description="Beantworte 3 kurze Fragen und sieh, womit du halal startest: zinsfreies Girokonto, Halal-Depot oder beides."
        path="/check"
        noindex
      />

      {!gestartet && <CheckVerkaufsseite onStart={starte} />}

      {gestartet && frageId && (
        <section className="hc-frage" key={frageId} aria-live="polite">
          <ol className="hc-striche" aria-label={`Frage ${nummer} von ${gesamt}`}>
            {Array.from({ length: gesamt }, (_, i) => (
              <li key={i} data-an={i < nummer ? "" : undefined} />
            ))}
          </ol>
          <h1 className="hc-frage-titel">{FRAGEN[frageId].titel}</h1>
          {frageId === "ziel" && <p className="hc-frage-unter">{UNTERZEILE}</p>}
          <ul className="hc-optionen">
            {FRAGEN[frageId].optionen.map((o) => {
              const Icon = ICONS[`${frageId}:${o.wert}`];
              return (
                <li key={o.wert}>
                  <button
                    type="button"
                    onClick={() => waehle(frageId, o.wert)}
                    className={`hc-opt${o.etikett ? " hc-opt--gruen" : ""}`}
                    data-gewaehlt={gewaehlt === o.wert ? "" : undefined}
                  >
                    {Icon && <Icon className="hc-opt-icon" aria-hidden />}
                    {o.etikett && <span className="hc-tag">{o.etikett}</span>}
                    <span className="hc-opt-titel">{o.titel}</span>
                    {o.unter && <span className="hc-opt-unter">{o.unter}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
          <button type="button" onClick={zurueck} className="hc-zurueck">
            <ArrowLeft aria-hidden />
            Zurück
          </button>
        </section>
      )}

      {gestartet && ergebnis && (
        <section className="hc-frage" aria-live="polite">
          <h1 className="hc-ergebnis-h1">Dein Match: {ergebnis.anbieter.name}</h1>
          <p className="hc-antw-kopf">Deine Antworten</p>
          <ul className="hc-antw">
            {antwortZeilen(antworten).map((z) => (
              <li key={z}>
                <Check aria-hidden />
                {z}
              </li>
            ))}
          </ul>

          <div className="hc-nr1">
            <div className="hc-nr1-kopf">
              <span className="hc-nr1-zahl" aria-hidden>1</span>
              <p className="hc-nr1-label">Passt am besten</p>
            </div>
            <div className="hc-nr1-logo">
              <AnbieterLogo name={ergebnis.anbieter.name} domain={ergebnis.anbieter.domain} gross />
            </div>
            <p className="hc-nr1-name">
              {ergebnis.anbieter.name}
              <small>{ergebnis.anbieter.produkt}</small>
            </p>
            <p className="hc-nr1-warum">{ergebnis.warum}</p>
            <ul className="hc-gruende">
              {ergebnis.vorteile.map((v) => (
                <li key={v}>
                  <Check aria-hidden />
                  {v}
                </li>
              ))}
            </ul>
            {ergebnis.pflicht && <p className="hc-pflicht">{ergebnis.pflicht}</p>}
            {/* Knopf direkt zum Anbieter über /out (Partnerlinks nur dort), Werbehinweis als Sternchen. */}
            <a href={outLink(quelle, ergebnis.anbieter, fassung)} className="hc-btn">
              {ergebnis.knopf}*
              <ArrowRight className="hc-pfeil" aria-hidden />
            </a>
          </div>

          {ergebnis.danach &&
            (ergebnis.danach.konto ? (
              <a href={ergebnis.danach.link} className="hc-kasten hc-kasten--gruen">
                <span className="hc-kasten-text">
                  <span className="hc-tag">{ETIKETT}</span>
                  Und dein Konto? {ergebnis.danach.satz}*
                </span>
                <AnbieterLogo name={ergebnis.danach.anbieter.name} domain={ergebnis.danach.anbieter.domain} klein />
                <ArrowRight aria-hidden />
              </a>
            ) : (
              <a href={ergebnis.danach.link} className="hc-kasten">
                <span className="hc-kasten-text">{ergebnis.danach.satz}*</span>
                <AnbieterLogo name={ergebnis.danach.anbieter.name} domain={ergebnis.danach.anbieter.domain} klein />
                <ArrowRight aria-hidden />
              </a>
            ))}

          {ergebnis.alternative && (
            <p className="hc-alt">
              Lieber die Alternative?
              <a href={ergebnis.alternative.link}>{ergebnis.alternative.anbieter.name}*</a>
            </p>
          )}

          {/* Echte Zahl bei der Empfehlung (Perspective-Frage 4, Elias RN6: „Followerzahl“, src/data/beweise.ts). */}
          <figure className="hc-folger">
            <img src="/elias-el-gendy.webp" alt="Elias El-Gendy" width={44} height={44} />
            <figcaption>Über {followerGesamt} folgen mir auf Instagram und TikTok</figcaption>
          </figure>

          <p className="hc-werbung">{WERBEHINWEIS}</p>
          <button type="button" onClick={neu} className="hc-neu">
            Check neu starten
          </button>
        </section>
      )}
    </div>
  );
};

export default HalalFinanzCheck;
