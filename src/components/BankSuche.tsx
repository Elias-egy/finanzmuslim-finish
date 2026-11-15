import { useMemo, useState, type KeyboardEvent } from "react";
import { Search } from "lucide-react";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import { KEINE_BANK, schnellwahl, suche, type BankWahl } from "@/data/bankSuche";

/**
 * Suchleiste im Chat für „Bei welcher Bank bist du heute?“ (RN8). Schnellwahl mit Logo für die acht häufigsten Banken und
 * „Noch kein Konto“; Tippen filtert sofort (src/data/bankSuche.ts). „Keine Bank gefunden“ gibt es nie: Was nichts trifft,
 * steht als „„<Eingabe>“ übernehmen“ in der Liste, Enter nimmt den ersten Vorschlag, Pfeiltasten wechseln.
 */
const BankSuche = ({ onWahl }: { onWahl: (w: BankWahl) => void }) => {
  const [text, setText] = useState("");
  const [aktiv, setAktiv] = useState(0);
  const vorschlaege = useMemo(() => suche(text), [text]);
  const schnell = useMemo(() => schnellwahl(), []);

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
          placeholder="Bank suchen, zum Beispiel Sparkasse"
          aria-label="Bei welcher Bank bist du heute?"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          maxLength={60}
        />
      </div>

      {vorschlaege.length === 0 ? (
        <ul className="hc-schnell">
          {schnell.map((b) => (
            <li key={b.id}>
              <button type="button" onClick={() => onWahl({ id: b.id, name: b.name, dativ: b.dativ, gruppe: b.gruppe, kind: "bank", domain: b.domain })}>
                <AnbieterLogo name={b.name} domain={b.domain} klein />
                <span>{b.name}</span>
              </button>
            </li>
          ))}
          <li className="hc-schnell-keine">
            <button type="button" className="hc-schnell-keine" onClick={() => onWahl(KEINE_BANK)}>
              Noch kein Konto
            </button>
          </li>
        </ul>
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
};

export default BankSuche;
