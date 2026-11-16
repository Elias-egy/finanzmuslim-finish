import type { CSSProperties, ReactNode } from "react";
import {
  ArrowLeft,
  Banknote,
  BriefcaseBusiness,
  Building2,
  ChartPie,
  Coins,
  CreditCard,
  Gem,
  ListChecks,
  MessageSquare,
  PiggyBank,
  Sprout,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { DEPOTS_GETESTET, KONTEN_GETESTET, type Frage } from "@/data/halalFinanzCheck";

/**
 * Eine Frage als Chat (RN8, RN9), für beide Arten. Aufbau und Maße 1:1 wie die Handyansicht von Elias' Perspective-Funnel
 * 6afa2cd179f7bfa91bb900d0, Seite „Ziel“ (Elias RN8-06: „Es muss 1:1 gleich sein vom Design“), Werte aus dem Original-HTML:
 * Fenster höchstens 34rem, mittig im Bildschirm; Kopf mit Foto 44 px, Name 16 px halbfett, Zeile 14 px, Fortschritt als
 * Striche 14 × 5 px; Blasen 16 px normal, Zeile 1,45, Innenabstand 12/17 px, Rundung 18 px, Grau 9 %, die erste ohne Foto
 * eingerückt, die zweite mit Foto 28 px und Schwänzchen; Antworten rechtsbündig, Rand 1 px Blau 45 %, 16 px mittelfett,
 * Höhe 44 px, Rundung 18 px, Abstand 10 px; unten Linie und „Zurück“ 14 px. Bewegung wie dort (halalFinanzCheck.css, data-d).
 */
const ICONS: Record<string, LucideIcon> = {
  "ziel:konto": Wallet,
  "ziel:invest": TrendingUp,
  "ziel:unsicher": MessageSquare,
  "zahlung:karte": CreditCard,
  "zahlung:karte-bar": Banknote,
  "zahlung:bar": Building2,
  "hatDepot:ja": BriefcaseBusiness,
  "hatDepot:nein": Sprout,
  "praef:halal": ListChecks,
  "praef:kosten": Coins,
  "anlage:etf": ChartPie,
  "anlage:aktien": TrendingUp,
  "anlage:gold": Gem,
  "betrag:unter50": PiggyBank,
  "betrag:50bis200": Banknote,
  "betrag:ueber200": Gem,
};

export const CheckKopf = ({ nummer, gesamt }: { nummer: number; gesamt: number }) => (
  <header className="hc-chat-kopf" data-d="ein">
    <div className="hc-chat-wer">
      <img src="/elias-el-gendy.webp" alt="" width={44} height={44} />
      <div>
        <b>Elias</b>
        <span>
          Hat {DEPOTS_GETESTET} Depots und {KONTEN_GETESTET} Konten getestet
        </span>
      </div>
    </div>
    <ol className="hc-striche" aria-label={`Frage ${nummer} von ${gesamt}`}>
      {Array.from({ length: gesamt }, (_, i) => (
        <li key={i} data-an={i < nummer ? "" : undefined} />
      ))}
    </ol>
  </header>
);

const verzug = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

type Props = {
  frage: Frage;
  nummer: number;
  gesamt: number;
  gewaehlt: string | null;
  onWaehle: (wert: string) => void;
  onZurueck: () => void;
  /** Eigener Antwortbereich statt der Knöpfe (die Suchleiste bei „Bei welcher Bank bist du heute?“). */
  antwort?: ReactNode;
  /** Erste Blase statt frage.warum (nach „Noch unsicher“). */
  warum?: string;
};

/** Das Schwänzchen an der letzten Blase, Pfad und Lage aus dem Original. */
const Schwanz = () => (
  <svg aria-hidden viewBox="-18 -20 24 21" className="hc-schwanz">
    <path d="M-18-20H0C0-9 1.5-3.5 6 0 2 .6-2-.5-4.5-2-7.5-.4-12 0-18 0z" />
  </svg>
);

const CheckChat = ({ frage, nummer, gesamt, gewaehlt, onWaehle, onZurueck, antwort, warum }: Props) => (
  <section className="hc-chat" key={frage.id} aria-live="polite">
    <div className="hc-fenster">
      <CheckKopf nummer={nummer} gesamt={gesamt} />
      <div className="hc-faden">
        <div className="hc-reihe" data-d="blase" style={verzug(0.2)}>
          <span className="hc-reihe-platz" />
          <div className="hc-reihe-spalte">
            <p className="hc-sprech">{warum ?? frage.warum}</p>
          </div>
        </div>
        <div className="hc-reihe hc-reihe--zwei" data-d="blase" style={verzug(0.75)}>
          <img src="/elias-el-gendy.webp" alt="" width={28} height={28} />
          <div className="hc-reihe-spalte">
            <div className="hc-sprech">
              <h1>{frage.titel}</h1>
              <Schwanz />
            </div>
          </div>
        </div>
      </div>
      <div className="hc-antwort">
        {antwort ? (
          <div data-d="antwort" style={verzug(1.25)}>
            {antwort}
          </div>
        ) : (
          <ul className="hc-wahlen">
            {frage.optionen.map((o, i) => {
              const Icon = ICONS[`${frage.id}:${o.wert}`];
              return (
                <li key={o.wert} data-d="antwort" style={verzug(1.25 + Math.min(i, 4) * 0.08)}>
                  <button type="button" className="hc-wahl" onClick={() => onWaehle(o.wert)} data-gewaehlt={gewaehlt === o.wert ? "" : undefined}>
                    {Icon && <Icon aria-hidden />}
                    <span>{o.titel}</span>
                    {o.etikett && <span className="hc-wahl-etikett">{o.etikett}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <div className="hc-chat-fuss">
          <button type="button" onClick={onZurueck} className="hc-zurueck">
            <ArrowLeft aria-hidden />
            Zurück
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default CheckChat;
