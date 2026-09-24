import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { anmeldeDaten, emailGueltig, freitagsbriefAnmelden } from "@/lib/anmeldung";

/**
 * Anmeldefeld für den Freitagsbrief. Eine Logik für den Newsletter-Kasten und die
 * Startseite, nur die Gestaltung unterscheidet sich (`variante`).
 * Versand und Felder: `src/lib/anmeldung.ts`.
 */

const stil = {
  kasten: {
    form: "mt-8 flex flex-col gap-3 sm:flex-row",
    feld: "h-14 rounded-lg border border-border bg-background px-4 text-[16px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:h-11 sm:flex-1 sm:text-[15px]",
    knopf:
      "inline-flex h-14 items-center justify-center rounded-lg bg-primary px-6 text-[16px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60 sm:h-11 sm:text-[15px]",
    text: "mt-4 text-center text-[13px] leading-relaxed text-muted-foreground",
    ergebnis: "mt-8 text-left",
  },
  startseite: {
    form: "mt-5 flex max-w-[560px] flex-col gap-3 sm:flex-row",
    feld: "h-14 rounded-lg border border-border bg-background px-4 text-[17px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:h-12 sm:flex-1 sm:text-[16px]",
    knopf: "btn-primary h-14 disabled:opacity-60 sm:h-12",
    text: "mt-4 max-w-[560px] text-[13px] leading-relaxed text-muted-foreground",
    ergebnis: "mt-5 max-w-[560px]",
  },
} as const;

type Props = {
  /** Eindeutige Kennung je Seite, für Label und Feld. */
  id: string;
  variante: keyof typeof stil;
};

const FreitagsbriefFormular = ({ id, variante }: Props) => {
  const { pathname } = useLocation();
  const [email, setEmail] = useState("");
  const [firma, setFirma] = useState("");
  const [zustand, setZustand] = useState<"offen" | "sendet" | "fertig">("offen");
  const [hinweis, setHinweis] = useState<string | null>(null);
  const s = stil[variante];

  const absenden = async (e: React.FormEvent) => {
    e.preventDefault();
    if (zustand === "sendet") return;
    if (!emailGueltig(email)) {
      setHinweis("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    setHinweis(null);
    setZustand("sendet");
    try {
      await freitagsbriefAnmelden(
        anmeldeDaten({ email, pfad: pathname, lang: document.documentElement.lang, firma }),
      );
      setZustand("fertig");
    } catch {
      setZustand("offen");
      setHinweis("Das hat gerade nicht geklappt. Versuch es gleich noch einmal oder schreib an elias@finanzmuslim.com.");
    }
  };

  if (zustand === "fertig") {
    return (
      <div role="status" className={`${s.ergebnis} rounded-lg border border-border bg-card p-5`}>
        <p className="flex items-center gap-2 text-[16px] font-semibold text-foreground">
          <MailCheck className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          Fast geschafft
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Bestätige deine Anmeldung über den Link in der E-Mail an {email.trim()}. Keine Mail da? Schau auch im
          Spam-Ordner nach.
        </p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={absenden} noValidate className={s.form}>
        <label htmlFor={id} className="sr-only">
          E-Mail-Adresse
        </label>
        <input
          id={id}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="deine@email.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={hinweis ? true : undefined}
          aria-describedby={hinweis ? `${id}-hinweis` : undefined}
          className={s.feld}
        />
        <input
          type="text"
          name="firma"
          value={firma}
          onChange={(e) => setFirma(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <button type="submit" disabled={zustand === "sendet"} className={s.knopf}>
          {zustand === "sendet" ? "Wird gesendet …" : "Kostenlos anmelden"}
        </button>
      </form>
      {hinweis && (
        <p id={`${id}-hinweis`} role="alert" className="mt-2 text-[14px] text-destructive">
          {hinweis}
        </p>
      )}
      <p className={s.text}>
        Du bekommst jeden Freitag meinen Freitagsbrief mit Tipps und Empfehlungen. Abmelden geht mit einem Klick.
        Hinweise zur Erfolgsmessung und zum Widerruf:{" "}
        <Link to="/datenschutz" className="text-primary underline underline-offset-2">
          Datenschutz
        </Link>
      </p>
    </>
  );
};

export default FreitagsbriefFormular;
