import { useMemo, useState, type KeyboardEvent } from "react";
import { Search } from "lucide-react";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import { KEINE_BANK, schnellwahl, suche, wahlVon, type BankWahl } from "@/data/bankSuche";
import { depotSchnellwahl, depotSuche, depotWahlVon, type DepotWahl } from "@/data/depotSuche";

/**
 * Suchleiste im Chat (RN8): „Bei welcher Bank bist du heute?“ und seit RN10 „Wo hast du dein Depot?“ (Elias RN9-03: „so eine
 * Auswahl, wie wir da haben“). Schnellwahl mit Logo in einem scrollbaren Bereich, so hoch, dass die fünfte Reihe unten
 * angeschnitten hervorschaut (Elias RN9-01: „dass man auch checkt, ah, okay, ich kann scrollen“); „Noch kein Konto“ steht fest
 * darunter. Tippen filtert sofort. „Keine Bank gefunden“ gibt es nie: Was nichts trifft, steht als „„<Eingabe>“ übernehmen“ in
 * der Liste, Enter nimmt den ersten Vorschlag, Pfeiltasten wechseln.
 */
type Wahl = { id: string; name: string; domain?: string; kind: string };

type Props<W extends Wahl> = {
  schnell: { id: string; name: string; domain?: string; wahl: W }[];
  vorschlaegeFuer: (text: string) => { wahl: W }[];
  onWahl: (w: W) => void;
  keine?: W;
  platzhalter: string;
  label: string;
};

function AnbieterSuche<W extends Wahl>({ schnell, vorschlaegeFuer, onWahl, keine, platzhalter, label }: Props<W>) {
  const [text, setText] = useState("");
  const [aktiv, setAktiv] = useState(0);
  const vorschlaege = useMemo(() => vorschlaegeFuer(text), [text, vorschlaegeFuer]);

  const taste = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!vorschlaege.length) return;
    if (e.key === "Enter") {
      e.preventDefault();
      onWahl(vorschlaege[Math.min(aktiv, vorschlaege.length - 1)].wahl);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setAktiv((a) => Math.min(a + 1, vorschlaege.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setAktiv((a) => Math.max(a - 1, 0));
    }
  };

  return (
    <div className="hc-suche">
      <div className="hc-suche-feld">
        <Search aria-hidden />
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setAktiv(0);
          }}
          onKeyDown={taste}
          placeholder={platzhalter}
          aria-label={label}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          maxLength={60}
        />
      </div>

      {vorschlaege.length === 0 ? (
        <>
          <div className="hc-schnell-rahmen">
            <ul className="hc-schnell">
              {schnell.map((b) => (
                <li key={b.id}>
                  <button type="button" onClick={() => onWahl(b.wahl)}>
                    <AnbieterLogo name={b.name} domain={b.domain} klein />
                    <span>{b.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {keine && (
            <button type="button" className="hc-schnell-keine" onClick={() => onWahl(keine)}>
              {keine.name}
            </button>
          )}
        </>
      ) : (
        <ul className="hc-vorschlaege">
          {vorschlaege.map((v, i) => (
            <li key={`${v.wahl.id}-${i}`}>
              <button
                type="button"
                className={v.wahl.kind === "frei" ? "hc-uebernehmen" : undefined}
                data-erster={i === aktiv ? "" : undefined}
                onClick={() => onWahl(v.wahl)}
                onMouseEnter={() => setAktiv(i)}
              >
                {v.wahl.kind === "frei" ? null : <AnbieterLogo name={v.wahl.name} domain={v.wahl.domain} klein />}
                <span>{v.wahl.kind === "frei" ? `„${v.wahl.name}“ übernehmen` : v.wahl.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const BANK_SCHNELL = schnellwahl().map((b) => ({ id: b.id, name: b.name, domain: b.domain, wahl: wahlVon(b) }));
const DEPOT_SCHNELL = depotSchnellwahl().map((d) => ({ id: d.id, name: d.name, domain: d.domain, wahl: depotWahlVon(d) }));

const BankSuche = ({ onWahl }: { onWahl: (w: BankWahl) => void }) => (
  <AnbieterSuche<BankWahl>
    schnell={BANK_SCHNELL}
    vorschlaegeFuer={suche}
    onWahl={onWahl}
    keine={KEINE_BANK}
    platzhalter="Bank suchen, zum Beispiel Sparkasse"
    label="Bei welcher Bank bist du heute?"
  />
);

export const DepotSuche = ({ onWahl }: { onWahl: (w: DepotWahl) => void }) => (
  <AnbieterSuche<DepotWahl>
    schnell={DEPOT_SCHNELL}
    vorschlaegeFuer={depotSuche}
    onWahl={onWahl}
    platzhalter="Depot suchen, zum Beispiel Trade Republic"
    label="Wo hast du dein Depot?"
  />
);

export default BankSuche;
