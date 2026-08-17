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

/** Anfangsbuchstaben als Logoersatz. Ein leeres Kaestchen mit dem Wort "Logo"
 *  sieht aus wie ein Fehler, Initialen in Markenblau sehen nach Absicht aus. */
const initialen = (name: string) =>
  name
    .split(/[\s-]+/)
    .filter((w) => /[A-Za-zÄÖÜäöü]/.test(w[0] ?? ""))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const BrokerKarte = ({ broker, rang }: { broker: Broker; rang: number }) => {
  const [offen, setOffen] = useState(false);
  const k = broker.konditionen;

  /** Die vier Zahlen, die man beim Vergleichen zuerst sucht. */
  const raster: Array<[string, string | null]> = [
    ["Depotgebühr", k.depotgebuehr],
    ["Kosten pro Order", k.orderkosten],
    ["Sparplan-Kosten", k.sparplanKosten],
    ["Zinsen auf Guthaben", k.zinsenGuthaben],
  ];
  const weitere: Array<[string, string | null]> = [
    ["Wertpapierkredit", k.wertpapierkredit],
    ["Hebelprodukte", k.hebelprodukte],
    ["Islamic ETFs besparbar", k.islamicEtfsBesparbar],
  ];
  const hatDaten = raster.some(([, w]) => w) || weitere.some(([, w]) => w);
  const geprueft = HALAL_KRITERIEN.filter((kr) => broker.halal[kr.key].status === "gut");
  const geprueftIrgendwas = HALAL_KRITERIEN.some(
    (kr) => broker.halal[kr.key].status !== "unbekannt",
  );

  const kopf = (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-[13px] font-bold text-muted-foreground">
        {rang}
      </span>
      <span className="flex h-10 min-w-[40px] shrink-0 items-center justify-center rounded-lg bg-hero px-2 text-[13px] font-bold text-primary">
        {initialen(broker.name)}
      </span>
      <span className="min-w-0 flex-1 truncate text-[16px] font-bold text-foreground md:text-[17px]">
        {broker.name}
      </span>
      {/* Etikett erst ab zwei erfuellten Kriterien. Bei einem stuende dasselbe
          zweimal da, oben als Etikett und unten in der Ampelzeile. */}
      {geprueft.length > 1 && (
        <span className="shrink-0 rounded-full bg-success/10 px-3 py-1 text-[12px] font-semibold text-success">
          {geprueft.length} von {HALAL_KRITERIEN.length} erfüllt
        </span>
      )}
    </div>
  );

  /* Anbieter ohne jede gepruefte Angabe bekommen eine kurze Zeile. Vier Mal
     "noch nicht geprueft" untereinander ist keine Information, sondern
     500 Pixel Fuellmaterial je Anbieter. Der Anbieter bleibt sichtbar. */
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

      {/* Die vier Halal-Kriterien. Handy zweispaltig, sonst reisst es die Karte auf. */}
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:gap-x-4">
        {HALAL_KRITERIEN.map((kriterium) => {
          const check = broker.halal[kriterium.key];
          return (
            <li key={kriterium.key} className="flex items-center gap-2 text-[13px]">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClass[check.status]}`}
                aria-hidden
              />
              <span className="text-foreground">{kriterium.label}</span>
              <span className="text-muted-foreground">
                {check.status === "unbekannt" ? UNGEPRUEFT : check.note ?? ""}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Knopf, auf dem Handy ueber die volle Breite */}
      {broker.link ? (
        <Link
          to={broker.link}
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

      {/* Datenraster. Nur zeigen, wo es etwas zu zeigen gibt. Vier Felder mit
          "noch nicht geprueft" sind keine Information, sondern Fuellmaterial. */}
      {hatDaten ? (
        <dl className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {raster.map(([label, wert]) => (
            <div key={label} className="rounded-lg border border-border p-3 text-center">
              <dt className="text-[12px] leading-tight text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-[15px] font-semibold">
                <Wert value={wert} />
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
          {[...raster, ...weitere].map(([label, wert]) => (
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
        brotkrumen={[{ name: "Vergleiche", path: "/vergleiche" }, { name: "Depot-Vergleich", path: "/vergleich/depot" }]}
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
          <p className="mt-5 text-[17px] leading-[26px] text-foreground/90">
            Ein Depot verwahrt deine Aktien und ETFs. Ohne Depot geht beim Vermögensaufbau nichts.
          </p>
          <p className="mt-3 text-[17px] leading-[26px] text-foreground/90">
            Für Muslime entscheiden vier Punkte, die in normalen Vergleichen fehlen: Zinsen auf dem
            Verrechnungskonto, eingeräumte Kredite und Hebelprodukte. Dazu die Frage, ob
            sharia-konforme ETFs besparbar sind.
          </p>
        </header>

        {/* Vertrauensleiste. Handy: die beiden Zahlen nebeneinander, Elias darunter. */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-lg border border-border p-4">
            <p className="text-[20px] font-bold text-foreground">{brokerVergleich.length}</p>
            <p className="text-[14px] text-muted-foreground">Anbieter im Vergleich</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-[20px] font-bold text-foreground">{HALAL_KRITERIEN.length}</p>
            <p className="text-[14px] text-muted-foreground">Halal-Kriterien</p>
          </div>
          <div className="col-span-2 flex items-center gap-3 rounded-lg border border-border p-4 sm:col-span-1">
            <img
              src={eliasPortrait}
              alt="Elias El-Gendy"
              className="h-11 w-11 shrink-0 rounded-full object-cover"
              loading="lazy"
            />
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-foreground">Elias El-Gendy</p>
              <p className="text-[13px] text-muted-foreground">prüft diesen Vergleich</p>
            </div>
          </div>
        </div>

        {/* Erklaerkasten */}
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
          {gefiltert.map((broker, i) => (
            <BrokerKarte key={broker.id} broker={broker} rang={i + 1} />
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
