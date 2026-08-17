import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Seo from "@/components/Seo";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import {
  VergleichsBrotkrumen,
  VergleichsLeiste,
  EmpfehlungsPlatz,
} from "@/components/vergleich/VergleichsRahmen";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  girokontoVergleich,
  GIRO_KRITERIEN,
  GIRO_KONDITIONEN,
  type Girokonto,
  type CheckStatus,
} from "@/data/girokontoVergleich";

const UNGEPRUEFT = "noch nicht geprüft";

const dotClass: Record<CheckStatus, string> = {
  unbekannt: "bg-muted-foreground/40",
  gut: "bg-success",
  teils: "bg-warning",
  schlecht: "bg-destructive",
};

const Wert = ({ value }: { value: string | null }) =>
  value ? (
    <span className="text-foreground">{value}</span>
  ) : (
    <span className="text-muted-foreground">{UNGEPRUEFT}</span>
  );

const kriterienBoxen = [
  {
    titel: "Zinsen auf dem Guthaben",
    text: "Zahlt die Bank Zinsen auf das Guthaben, und lässt sich das abschalten?",
  },
  {
    titel: "Dispokredit",
    text: "Wird ein Dispo automatisch eingeräumt, oder nur auf Antrag?",
  },
  {
    titel: "Karte ohne Kreditrahmen",
    text: "Ist die Karte eine echte Debitkarte, oder hängt ein Kreditrahmen daran?",
  },
  {
    titel: "Zinsprodukte im Konto",
    text: "Ist ein Tagesgeld oder Sparbereich mit Zins fest mit dem Konto verbunden?",
  },
];

const faq = [
  {
    frage: "Was ist an einem normalen Girokonto problematisch?",
    antwort:
      "Zwei Dinge. Erstens zahlen manche Banken Zinsen auf das Guthaben, und Zinsen sind Riba. Zweitens räumen viele Banken beim Öffnen des Kontos automatisch einen Dispokredit ein, der ebenfalls verzinst ist. Beides lässt sich bei vielen Banken abschalten oder auf null setzen, es steht nur selten im Vergleich.",
  },
  {
    frage: "Reicht es, den Dispo nicht zu nutzen?",
    antwort:
      "Darüber sind Gelehrte unterschiedlicher Auffassung. Die vorsichtige Linie ist, den Dispo auf null setzen zu lassen, damit gar kein Zinsvertrag besteht. Wer dazu eine verbindliche Antwort braucht, fragt einen Gelehrten seines Vertrauens.",
  },
  {
    frage: "Was mache ich mit Zinsen, die trotzdem anfallen?",
    antwort:
      "Nach verbreiteter Auffassung werden Zinserträge nicht behalten, sondern gespendet, ohne dafür eine Belohnung zu erwarten. Wichtig ist, die Beträge sauber getrennt zu erfassen.",
  },
  {
    frage: "Warum steht bei fast allen Anbietern noch nichts?",
    antwort:
      "Weil wir nichts eintragen, was wir nicht selbst beim Anbieter nachgelesen haben. Die Anbieterliste steht, jede Kondition wird einzeln geprüft und mit Datum eingetragen. Bis dahin steht dort wörtlich, dass es noch nicht geprüft ist.",
  },
];

const KontoKarte = ({ konto, rang }: { konto: Girokonto; rang: number }) => {
  const [offen, setOffen] = useState(false);
  const k = konto.konditionen;

  /** Die vier Zahlen, nach denen bei einem Girokonto zuerst gesucht wird. */
  const raster = GIRO_KONDITIONEN.slice(0, 4);
  const hatDaten = GIRO_KONDITIONEN.some(({ key }) => k[key]);
  const geprueft = GIRO_KRITERIEN.filter((kr) => konto.halal[kr.key].status === "gut");
  const geprueftIrgendwas = GIRO_KRITERIEN.some(
    (kr) => konto.halal[kr.key].status !== "unbekannt",
  );

  const kopf = (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-[13px] font-bold text-muted-foreground">
        {rang}
      </span>
      <AnbieterLogo name={konto.name} domain={konto.domain} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[16px] font-bold text-foreground md:text-[17px]">
          {konto.name}
        </span>
        <span className="block truncate text-[13px] text-muted-foreground">{konto.produkt}</span>
      </span>
      {geprueft.length > 1 && (
        <span className="shrink-0 rounded-full bg-success/10 px-3 py-1 text-[12px] font-semibold text-success">
          {geprueft.length} von {GIRO_KRITERIEN.length} erfüllt
        </span>
      )}
    </div>
  );

  /* Anbieter ohne jede gepruefte Angabe bekommen eine kurze Zeile, genau wie
     im Depot-Vergleich. Sieben Mal "noch nicht geprueft" untereinander ist
     keine Information, sondern Fuellmaterial. */
  if (!hatDaten && !geprueftIrgendwas) {
    return (
      <li className="card-surface px-4 py-3">
        {kopf}
        <p className="mt-2 pl-[70px] text-[13px] text-muted-foreground">{UNGEPRUEFT}</p>
      </li>
    );
  }

  return (
    <li className="card-surface p-4 md:p-5">
      {kopf}

      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:gap-x-4">
        {GIRO_KRITERIEN.map((kriterium) => {
          const check = konto.halal[kriterium.key];
          return (
            <li key={kriterium.key} className="flex items-center gap-2 text-[13px]">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClass[check.status]}`}
                aria-hidden
              />
              <span className="text-foreground">{kriterium.label}</span>
              <span className="text-muted-foreground">
                {check.status === "unbekannt" ? UNGEPRUEFT : (check.note ?? "")}
              </span>
            </li>
          );
        })}
      </ul>

      {konto.link ? (
        <Link
          to={konto.link}
          className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-primary px-6 text-[16px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover md:w-auto md:px-10"
        >
          Zum Angebot*
        </Link>
      ) : (
        <div className="mt-4">
          <button
            type="button"
            disabled
            className="inline-flex min-h-[48px] w-full cursor-not-allowed items-center justify-center rounded-lg border border-border bg-muted px-6 text-[16px] font-semibold text-muted-foreground md:w-auto md:px-10"
          >
            Zum Angebot
          </button>
          <p className="mt-1 text-[12px] text-muted-foreground">noch keine Partnerschaft</p>
        </div>
      )}

      {hatDaten ? (
        <dl className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {raster.map(({ key, label }) => (
            <div key={key} className="rounded-lg border border-border p-3 text-center">
              <dt className="text-[12px] leading-tight text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-[15px] font-semibold">
                <Wert value={k[key]} />
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-4 border-t border-border pt-4 text-[13px] text-muted-foreground">
          Konditionen für diesen Anbieter sind noch nicht geprüft.
        </p>
      )}

      <button
        type="button"
        onClick={() => setOffen((v) => !v)}
        aria-expanded={offen}
        className="mt-3 inline-flex min-h-[44px] items-center gap-1 text-[14px] font-medium text-primary"
      >
        Produktdetails
        <ChevronDown
          className={`h-4 w-4 transition-transform ${offen ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {offen && (
        <dl className="mt-2 grid gap-x-8 gap-y-2 border-t border-border pt-4 sm:grid-cols-2">
          {GIRO_KONDITIONEN.map(({ key, label }) => (
            <div key={key} className="flex flex-wrap justify-between gap-2 text-[14px]">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="text-right">
                <Wert value={k[key]} />
              </dd>
            </div>
          ))}
          {konto.stand && (
            <div className="flex flex-wrap justify-between gap-2 text-[14px]">
              <dt className="text-muted-foreground">Geprüft am</dt>
              <dd className="text-right text-foreground">{konto.stand}</dd>
            </div>
          )}
        </dl>
      )}
    </li>
  );
};

const VergleichGirokonto = () => {
  const [ohneZins, setOhneZins] = useState(false);
  const [ohneDispo, setOhneDispo] = useState(false);
  const [nurDebit, setNurDebit] = useState(false);

  const gefiltert = girokontoVergleich.filter((g) => {
    if (ohneZins && g.halal.keinGuthabenzins.status !== "gut") return false;
    if (ohneDispo && g.halal.keinDispo.status !== "gut") return false;
    if (nurDebit && g.halal.karteOhneKreditrahmen.status !== "gut") return false;
    return true;
  });

  const filter = [
    { label: "Nur Banken ohne Guthabenzins", value: ohneZins, set: setOhneZins },
    { label: "Nur Banken ohne Dispo", value: ohneDispo, set: setOhneDispo },
    { label: "Karte ohne Kreditrahmen", value: nurDebit, set: setNurDebit },
  ];

  const geprueftAnzahl = girokontoVergleich.filter((g) =>
    GIRO_KRITERIEN.some((kr) => g.halal[kr.key].status !== "unbekannt"),
  ).length;

  return (
    <main className="bg-background">
      <Seo
        title="Girokonto-Vergleich für Muslime | finanzmuslim"
        description="Welches Girokonto passt, wenn du keine Zinsen willst. Wir prüfen Guthabenzins, Dispo, Karte ohne Kreditrahmen und Zinsprodukte im Konto."
        path="/vergleich/girokonto"
        brotkrumen={[
          { name: "Vergleiche", path: "/vergleiche" },
          { name: "Girokonto-Vergleich", path: "/vergleich/girokonto" },
        ]}
      />

      <div className="container py-10 md:py-14">
        <VergleichsBrotkrumen titel="Girokonto-Vergleich" />

        <header className="mt-6 max-w-3xl">
          <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">
            Girokonto-Vergleich für Muslime
          </h1>
          <p className="mt-2 text-[17px] text-muted-foreground">
            Welches Konto passt, wenn du keine Zinsen willst
          </p>
          <p className="mt-5 text-[17px] leading-[26px] text-foreground/90">
            Ein Girokonto ist das Konto, über das dein Gehalt kommt und deine Miete geht. Fast jeder
            hat eins, kaum jemand prüft es.
          </p>
          <p className="mt-3 text-[17px] leading-[26px] text-foreground/90">
            Für Muslime entscheiden vier Punkte, die in normalen Vergleichen fehlen: Zinsen auf dem
            Guthaben, der eingeräumte Dispo und ein Kreditrahmen an der Karte. Dazu die Frage, ob ein
            Zinsprodukt fest am Konto hängt.
          </p>
        </header>

        <VergleichsLeiste
          kennzahlen={[
            { zahl: girokontoVergleich.length, text: "Banken im Vergleich" },
            { zahl: GIRO_KRITERIEN.length, text: "Halal-Kriterien" },
            { zahl: geprueftAnzahl, text: "davon geprüft" },
          ]}
          stand="17.08.2026"
          standHinweis="Anbieterliste angelegt, Konditionen noch nicht geprüft"
        />

        <EmpfehlungsPlatz
          etikett="Bestes Girokonto"
          begruendung="Hier steht eine Empfehlung, sobald die vier Kriterien bei den Banken geprüft sind. Vorher wäre jede Nummer eins geraten."
        />

        <section className="card-surface mt-10 p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground">Worauf wir bei Halal achten</h2>
          <ul className="mt-4 space-y-4">
            {kriterienBoxen.map((punkt) => (
              <li key={punkt.titel}>
                <p className="text-[15px] font-semibold text-foreground">{punkt.titel}</p>
                <p className="text-[15px] text-muted-foreground">{punkt.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-lg border border-border p-4 md:p-5" aria-label="Filter">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-6">
              {filter.map((f) => (
                <label
                  key={f.label}
                  className="flex min-h-[44px] cursor-pointer items-center gap-3 text-[15px] text-foreground"
                >
                  <Switch checked={f.value} onCheckedChange={f.set} />
                  <span>{f.label}</span>
                </label>
              ))}
            </div>
            <p className="text-[14px] text-muted-foreground md:shrink-0">
              {gefiltert.length} von {girokontoVergleich.length} Banken
            </p>
          </div>
        </section>

        <ul className="mt-6 space-y-4">
          {gefiltert.map((konto, i) => (
            <KontoKarte key={konto.id} konto={konto} rang={i + 1} />
          ))}
        </ul>

        {gefiltert.length === 0 && (
          <p className="mt-6 rounded-lg border border-border p-6 text-[15px] text-muted-foreground">
            Zu dieser Auswahl liegen noch keine geprüften Banken vor.
          </p>
        )}

        <p className="mt-6 text-[13px] text-muted-foreground">
          * Mit Stern markierte Links sind Werbe- oder Affiliate-Links. Wenn du darüber ein Produkt
          abschließt, erhalte ich eine Provision. Für dich entstehen dadurch keine Mehrkosten.
        </p>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground">Häufige Fragen</h2>
          <Accordion type="single" collapsible className="mt-4">
            {faq.map((item) => (
              <AccordionItem key={item.frage} value={item.frage}>
                <AccordionTrigger className="text-left text-[16px] font-semibold">
                  {item.frage}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                  {item.antwort}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <p className="mt-12 text-[13px] leading-relaxed text-muted-foreground">
          Diese Seite ist keine Anlageberatung und keine Empfehlung für eine bestimmte Bank. Über die
          Zulässigkeit eines Vertrags entscheidest du selbst, im Zweifel mit einem Gelehrten.
        </p>
      </div>
    </main>
  );
};

export default VergleichGirokonto;
