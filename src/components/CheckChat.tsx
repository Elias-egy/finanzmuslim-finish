import type { CSSProperties, ReactNode } from "react";
import {
  ArrowLeft,
  Banknote,
  BriefcaseBusiness,
  Building2,
  Coins,
  CreditCard,
  Footprints,
  Gem,
  Layers,
  ListChecks,
  PiggyBank,
  Sprout,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { ANGEBOTE_GETESTET, type Frage } from "@/data/halalFinanzCheck";

/**
 * Eine Frage als Chat (RN8), für beide Arten: oben Kopf mit Elias' Foto, Name, „89 Angebote selbst getestet“ und rechts der
 * Fortschritt als kurze Striche. Dann zwei graue Sprechblasen links (ein Satz, warum er fragt, dann die Frage) und die
 * Antworten als runde blaue Rand-Knöpfe rechtsbündig untereinander (Vorbild: Perspective-Funnel, Bild 02-frage-chat.png).
 * Die Blasen kommen nacheinander weich von 14 und 6 px unten (Learnings 36 bis 40), ohne Bewegung bei „weniger Bewegung“
 * (CSS: halalFinanzCheck.css, data-d). Ein Tipp springt weiter, unten „← Zurück“.
 */
const ICONS: Record<string, LucideIcon> = {
  "ziel:konto": Wallet,
  "ziel:invest": TrendingUp,
  "ziel:beides": Layers,
  "zahlung:karte": CreditCard,
  "zahlung:karte-bar": Banknote,
  "zahlung:bar": Building2,
  "erfahrung:keine": Sprout,
  "erfahrung:erste": Footprints,
  "erfahrung:depot": BriefcaseBusiness,
  "praef:halal": ListChecks,
  "praef:kosten": Coins,
  "betrag:unter50": PiggyBank,
  "betrag:50bis200": Banknote,
  "betrag:ueber200": Gem,
};

export const CheckKopf = ({ nummer, gesamt }: { nummer: number; gesamt: number }) => (
  <header className="hc-chat-kopf">
    <img src="/elias-el-gendy.webp" alt="" width={44} height={44} />
    <div className="hc-chat-wer">
      <b>Elias</b>
      <span>{ANGEBOTE_GETESTET} Angebote selbst getestet</span>
    </div>
    <ol className="hc-striche" aria-label={`Frage ${nummer} von ${gesamt}`}>
      {Array.from({ length: gesamt }, (_, i) => (
        <li key={i} data-an={i < nummer ? "" : undefined} />
      ))}
    </ol>
  </header>
);

const verzug = (ms: number, dy = 14): CSSProperties => ({ ["--d" as string]: `${ms}ms`, ["--dy" as string]: `${dy}px` });

type Props = {
  frage: Frage;
  nummer: number;
  gesamt: number;
  gewaehlt: string | null;
  onWaehle: (wert: string) => void;
  onZurueck: () => void;
  /** Eigener Antwortbereich statt der Knöpfe (die Suchleiste bei „Bei welcher Bank bist du heute?“). */
  antwort?: ReactNode;
};

const CheckChat = ({ frage, nummer, gesamt, gewaehlt, onWaehle, onZurueck, antwort }: Props) => (
  <section className="hc-chat" key={frage.id} aria-live="polite">
    <CheckKopf nummer={nummer} gesamt={gesamt} />
    <div className="hc-blasen">
      <p className="hc-sprech" data-d style={verzug(0)}>
        {frage.warum}
      </p>
      <div className="hc-sprech-reihe" data-d style={verzug(380, 6)}>
        <img src="/elias-el-gendy.webp" alt="" width={28} height={28} />
        <div className="hc-sprech">
          <h1>{frage.titel}</h1>
        </div>
      </div>
    </div>
    {antwort ? (
      <div data-d style={verzug(760, 6)}>
        {antwort}
      </div>
    ) : (
      <ul className="hc-wahlen">
        {frage.optionen.map((o, i) => {
          const Icon = ICONS[`${frage.id}:${o.wert}`];
          return (
            <li key={o.wert} data-d style={verzug(760 + i * 90, 6)}>
              <button type="button" className="hc-wahl" onClick={() => onWaehle(o.wert)} data-gewaehlt={gewaehlt === o.wert ? "" : undefined}>
                {Icon && <Icon aria-hidden />}
                <span className="hc-wahl-text">
                  <span>{o.titel}</span>
                  {o.unter && <small>{o.unter}</small>}
                </span>
                {o.etikett && <span className="hc-tag">{o.etikett}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    )}
    <button type="button" onClick={onZurueck} className="hc-zurueck">
      <ArrowLeft aria-hidden />
      Zurück
    </button>
  </section>
);

export default CheckChat;
