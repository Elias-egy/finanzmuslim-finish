import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import Seo from "@/components/Seo";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { brokerVergleich, HALAL_KRITERIEN, type Broker, type CheckStatus } from "@/data/brokerVergleich";
import eliasPortrait from "@/assets/founder-portrait.png";

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
    titel: "Zinsen auf dem Verrechnungskonto",
    text: "Zahlt das Verrechnungskonto Zinsen, und lässt sich das abschalten?",
  },
  {
    titel: "Wertpapierkredit und Dispo",
    text: "Wird ein Wertpapierkredit oder Dispo automatisch eingeräumt?",
  },
  {
    titel: "Hebelprodukte und CFDs",
    text: "Bietet der Broker Hebelprodukte und CFDs an?",
  },
  {
    titel: "Sharia-konforme ETFs",
    text: "Sind sharia-konforme ETFs handelbar und besparbar?",
  },
];

const faq = [
  {
    frage: "Was ist ein Depot?",
    antwort:
      "Ein Depot ist ein Konto für Wertpapiere. Aktien, ETFs oder Anleihen, die du kaufst, werden dort für dich verwahrt. Zum Depot gehört meist ein Verrechnungskonto, über das Käufe und Verkäufe abgewickelt werden.",
  },
  {
    frage: "Woran erkenne ich, ob ein Broker für Muslime geeignet ist?",
    antwort:
      "Entscheidend ist, ob auf dem Verrechnungskonto Zinsen anfallen und ob sich das abschalten lässt, ob automatisch ein Wertpapierkredit oder Dispo eingeräumt wird, ob der Broker dich zu Hebelprodukten und CFDs drängt und ob du sharia-konforme ETFs kaufen und besparen kannst. Wir prüfen genau diese vier Punkte.",
  },
  {
    frage: "Was mache ich mit Zinsen, die trotzdem anfallen?",
    antwort:
      "Nach verbreiteter Auffassung werden Zinserträge nicht behalten, sondern gespendet, ohne dafür eine Belohnung zu erwarten. Wichtig ist, die Beträge sauber getrennt zu erfassen. Die konkrete Handhabung besprichst du am besten mit einem Gelehrten deines Vertrauens.",
  },
  {
    frage: "Kann ich mehrere Depots haben?",
    antwort:
      "Ja. Du kannst bei mehreren Anbietern gleichzeitig ein Depot führen, etwa um Sparpläne und Einzelkäufe zu trennen. Ein Depotwechsel oder Übertrag ist ebenfalls möglich; die Wertpapiere bleiben dabei deine.",
  },
];

const BrokerKarte = ({ broker }: { broker: Broker }) => {
  const [offen, setOffen] = useState(false);
  const k = broker.konditionen;
  const felder: Array<[string, string | null]> = [
    ["Depotgebühr", k.depotgebuehr],
    ["Kosten pro Order", k.orderkosten],
    ["Sparplan-Kosten", k.sparplanKosten],
    ["Zinsen auf Guthaben", k.zinsenGuthaben],
    ["Wertpapierkredit", k.wertpapierkredit],
    ["Hebelprodukte", k.hebelprodukte],
    ["Islamic ETFs besparbar", k.islamicEtfsBesparbar],
  ];

  return (
    <li className="rounded-lg border border-border bg-background p-4 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border text-[11px] text-muted-foreground">
              Logo
            </span>
            <span className="truncate text-[16px] font-bold text-foreground">{broker.name}</span>
          </div>

          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {HALAL_KRITERIEN.map((kriterium) => {
              const check = broker.halal[kriterium.key];
              return (
                <li key={kriterium.key} className="flex items-center gap-2 text-[13px]">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClass[check.status]}`} aria-hidden />
                  <span className="text-foreground">{kriterium.label}</span>
                  <span className="text-muted-foreground">
                    {check.status === "unbekannt" ? UNGEPRUEFT : check.note ?? ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="md:shrink-0">
          {broker.link ? (
            <Link
              to={broker.link}
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover md:w-auto"
            >
              Zum Angebot*
            </Link>
          ) : (
            <div className="md:text-right">
              <button
                type="button"
                disabled
                className="inline-flex min-h-[44px] w-full cursor-not-allowed items-center justify-center rounded-lg border border-border bg-secondary px-6 text-[15px] font-semibold text-muted-foreground md:w-auto"
              >
                Zum Angebot*
              </button>
              <p className="mt-1 text-[12px] text-muted-foreground">noch keine Partnerschaft</p>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOffen((v) => !v)}
        aria-expanded={offen}
        className="mt-3 inline-flex min-h-[44px] items-center gap-1 text-[14px] font-medium text-primary"
      >
        Alle Konditionen anzeigen
        <ChevronDown className={`h-4 w-4 transition-transform ${offen ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {offen && (
        <dl className="mt-2 grid gap-x-8 gap-y-2 border-t border-border pt-4 sm:grid-cols-2">
          {felder.map(([label, wert]) => (
            <div key={label} className="flex flex-wrap justify-between gap-2 text-[14px]">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="text-right">
                <Wert value={wert} />
              </dd>
            </div>
          ))}
        </dl>
      )}
    </li>
  );
};

const VergleichDepot = () => {
  const [ohneZins, setOhneZins] = useState(false);
  const [ohneHebel, setOhneHebel] = useState(false);
  const [nurSparplan, setNurSparplan] = useState(false);

  const gefiltert = brokerVergleich.filter((b) => {
    if (ohneZins && b.halal.keinGuthabenzins.status !== "gut") return false;
    if (ohneHebel && b.halal.keineHebelprodukte.status !== "gut") return false;
    if (nurSparplan && b.sparplanMoeglich !== true) return false;
    return true;
  });

  const filter = [
    { label: "Nur Anbieter ohne Guthabenzins", value: ohneZins, set: setOhneZins },
    { label: "Nur Anbieter ohne Hebelprodukte", value: ohneHebel, set: setOhneHebel },
    { label: "Sparplan möglich", value: nurSparplan, set: setNurSparplan },
  ];

  return (
    <main className="bg-background">
      <Seo
        title="Depot-Vergleich für Muslime | finanzmuslim"
        description="Welcher Broker passt, wenn du islamkonform investieren willst. Wir prüfen Verrechnungskonto, Kredit, Hebelprodukte und sharia-konforme ETFs."
        path="/vergleich/depot"
      />

      <div className="container py-10 md:py-14">
        {/* Brotkrumen */}
        <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Start
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <span>Vergleiche</span>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <span className="text-foreground">Depot-Vergleich</span>
        </nav>

        {/* Titel */}
        <header className="mt-6 max-w-3xl">
          <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">
            Depot-Vergleich für Muslime
          </h1>
          <p className="mt-2 text-[17px] text-muted-foreground">
            Welcher Broker passt, wenn du islamkonform investieren willst
          </p>
          <p className="mt-6 text-[16px] leading-relaxed text-foreground/90">
            Ein Depot ist die Grundlage, um in Aktien und ETFs zu investieren. Ohne Depot geht beim
            Vermögensaufbau nichts. Für Muslime kommt es dabei auf Punkte an, die in normalen
            Vergleichen schlicht fehlen: Zinsen auf dem Verrechnungskonto, automatisch eingeräumte
            Kredite, Hebelprodukte und die Frage, ob sharia-konforme ETFs überhaupt besparbar sind.
            Genau diese Punkte prüfen wir hier.
          </p>
        </header>

        {/* Vertrauensleiste */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <p className="text-[20px] font-bold text-foreground">31</p>
            <p className="text-[14px] text-muted-foreground">geprüfte Anbieter</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-[20px] font-bold text-foreground">4</p>
            <p className="text-[14px] text-muted-foreground">Halal-Kriterien</p>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border p-4">
            <img
              src={eliasPortrait}
              alt="Elias El-Gendy"
              className="h-11 w-11 shrink-0 rounded-full object-cover"
              loading="lazy"
            />
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-foreground">Elias El-Gendy</p>
              <p className="text-[13px] text-muted-foreground">Zuletzt geprüft: noch offen</p>
            </div>
          </div>
        </div>

        {/* Erklaerkasten */}
        <section className="mt-10 rounded-lg bg-secondary p-6 md:p-8">
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

        {/* Filterleiste */}
        <section className="mt-10 rounded-lg border border-border p-4 md:p-5" aria-label="Filter">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-6">
              {filter.map((f) => (
                <label key={f.label} className="flex min-h-[44px] cursor-pointer items-center gap-3 text-[15px] text-foreground">
                  <Switch checked={f.value} onCheckedChange={f.set} />
                  <span>{f.label}</span>
                </label>
              ))}
            </div>
            <p className="text-[14px] text-muted-foreground md:shrink-0">
              {gefiltert.length} von {brokerVergleich.length} Anbietern
            </p>
          </div>
        </section>

        {/* Tabelle */}
        <ul className="mt-6 space-y-4">
          {gefiltert.map((broker) => (
            <BrokerKarte key={broker.id} broker={broker} />
          ))}
        </ul>

        {gefiltert.length === 0 && (
          <p className="mt-6 rounded-lg border border-border p-6 text-[15px] text-muted-foreground">
            Zu dieser Auswahl liegen noch keine geprüften Anbieter vor.
          </p>
        )}

        <p className="mt-6 text-[13px] text-muted-foreground">
          * Mit Stern markierte Links sind Werbe- oder Affiliate-Links. Wenn du darüber ein Produkt
          abschließt, erhalte ich eine Provision. Für dich entstehen dadurch keine Mehrkosten.
        </p>

        {/* FAQ */}
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
          Diese Seite ist keine Anlageberatung und keine Anlageempfehlung. Investitionen in
          Wertpapiere sind mit Risiken verbunden, bis hin zum Totalverlust.
        </p>
      </div>
    </main>
  );
};

export default VergleichDepot;
