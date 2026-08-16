import Seo from "@/components/Seo";
import VorlagenSeite from "@/components/VorlagenSeite";
import { vorlageBySlug } from "@/data/vorlagen";

const v = vorlageBySlug("vertrags-ampel")!;

type Farbe = "gruen" | "gelb" | "rot";

/** Ampelfarben ausschließlich fuer Bewertungen. */
const bewertung: Record<Farbe, { wort: string; punkt: string; pille: string }> = {
  gruen: {
    wort: "Grün",
    punkt: "bg-[hsl(var(--success))]",
    pille: "border-[hsl(var(--success)/0.35)] bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))]",
  },
  gelb: {
    wort: "Gelb",
    punkt: "bg-[hsl(var(--warning))]",
    pille: "border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.14)] text-[hsl(38_92%_32%)]",
  },
  rot: {
    wort: "Rot",
    punkt: "bg-[hsl(var(--destructive))]",
    pille: "border-[hsl(var(--destructive)/0.35)] bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))]",
  },
};

const legende: { farbe: Farbe; text: string }[] = [
  { farbe: "gruen", text: "Zulässig, solange die Bedingung daneben erfüllt bleibt." },
  {
    farbe: "gelb",
    text: "Grundsätzlich problematisch, aber es gibt anerkannte Ausnahmen. Mit einem Gelehrten klären.",
  },
  { farbe: "rot", text: "Der Zins oder die Spekulation steckt im Vertrag selbst. Keine Bedingung rettet ihn." },
];

const zeilen: { vertrag: string; unter: string; farbe: Farbe; woran: string }[] = [
  {
    vertrag: "Aktiendepot",
    unter: "Wertpapierdepot beim Broker",
    farbe: "gruen",
    woran:
      "Solange nur Anlagen drin liegen, die halal sind, und auf dem Verrechnungskonto keine Zinsen gutgeschrieben werden. Zinsangebot beim Anbieter abschalten.",
  },
  {
    vertrag: "Krypto-Wallet",
    unter: "Eigene Wallet oder Börsenkonto",
    farbe: "gruen",
    woran:
      "Solange die Coins selbst halal sind, du sie wirklich besitzt und weder Hebel noch Lending mit garantiertem Ertrag nutzt.",
  },
  {
    vertrag: "Girokonto ohne Zinsen",
    unter: "Inklusive Debit- und Girocard",
    farbe: "gruen",
    woran:
      "Reine Aufbewahrung und Zahlungsverkehr. Kein Guthabenzins, kein eingeräumter Dispo. Karten ohne Kreditrahmen sind unproblematisch.",
  },
  {
    vertrag: "Versicherungen",
    unter: "Konventionell, Sach und Haftpflicht",
    farbe: "gelb",
    woran:
      "Freiwillig abgeschlossen grundsätzlich problematisch, wegen Gharar und der verzinsten Kapitalanlage dahinter. Anerkannte Ausnahmen: gesetzliche Pflicht wie Kfz-Haftpflicht oder eine Berufshaftpflicht, ohne die du den Beruf nicht ausüben darfst, sowie echte Not. Mit einem Gelehrten klären.",
  },
  {
    vertrag: "Kreditkarte",
    unter: "Echte Kreditkarte mit Rahmen",
    farbe: "gelb",
    woran:
      "Der Vertrag enthält eine Zinsklausel, deshalb eher unzulässig. Nur bei echter Notwendigkeit, etwa Mietwagen oder Kaution im Ausland, und nur wenn du den Betrag immer sofort vollständig ausgleichst. Teilzahlung und Revolving fallen raus.",
  },
  {
    vertrag: "Ratenzahlung",
    unter: "Finanzierung im Laden oder online",
    farbe: "gelb",
    woran:
      "Hängt an den Bedingungen. Zahlst du in Raten genau den Barpreis, ohne Aufschlag, Gebühr oder Zins, ist das für viele Gelehrte in Ordnung. Jeder Cent Aufpreis gegenüber der Sofortzahlung ist Riba.",
  },
  {
    vertrag: "Leasing und Autoabo",
    unter: "Fahrzeug oder Gerät",
    farbe: "gelb",
    woran:
      "Miete gegen Gebühr ist zulässig. Problematisch wird es bei Kaufverpflichtung am Ende, aufgeschlagenem Zinsanteil oder wenn dir das Risiko am Fahrzeug aufgebürdet wird, obwohl es dir nicht gehört. Vertrag zeigen lassen.",
  },
  {
    vertrag: "Ratenkredit und Dispo",
    unter: "Konsumkredit, Überziehung",
    farbe: "rot",
    woran:
      "Du zahlst mehr zurück, als du bekommen hast, allein für die Zeit. Das ist Riba im Kern, unabhängig von der Höhe des Zinssatzes.",
  },
  {
    vertrag: "Tagesgeld, Festgeld, Sparbuch",
    unter: "Verzinste Einlagen",
    farbe: "rot",
    woran:
      "Garantierter Ertrag ohne echtes Risiko. Ein Konto ohne Zinsen zur reinen Aufbewahrung bleibt davon unberührt.",
  },
  {
    vertrag: "Bausparvertrag",
    unter: "Ansparen plus Darlehen",
    farbe: "rot",
    woran: "Beide Hälften sind verzinst, das Guthaben und das spätere Darlehen. Der Vertrag ist auf Zins gebaut.",
  },
  {
    vertrag: "Klassische Lebens- und Rentenversicherung",
    unter: "Mit Garantiezins",
    farbe: "rot",
    woran:
      "Verzinste Kapitalanlage plus Unsicherheit über Leistung und Gegenleistung. Ein Depot mit Auszahlplan bildet dieselbe Funktion ohne Zinsvertrag ab.",
  },
  {
    vertrag: "CFDs, Hebelprodukte, Optionsscheine",
    unter: "Derivate",
    farbe: "rot",
    woran:
      "Du besitzt nichts, du wettest auf eine Richtung, oft mit geliehenem Geld. Gharar und Maysir zugleich.",
  },
];

const fragen = [
  {
    titel: "Muss ich das wirklich?",
    text: "Schreibt es ein Gesetz vor, oder ist es eine Bequemlichkeit? Pflicht und Wunsch werden unterschiedlich bewertet.",
  },
  {
    titel: "Zahle ich einen Aufpreis?",
    text: "Vergleiche den Gesamtpreis mit dem Barpreis. Jede Differenz für die Zeit ist der Punkt, an dem es kippt.",
  },
  {
    titel: "Gibt es eine Alternative, die grün ist?",
    text: "Sparen und bar zahlen, eine Debitkarte statt Kreditkarte, ein Depot statt Rentenversicherung. In den meisten Fällen gibt es einen Weg ohne Zinsvertrag. Er dauert nur länger.",
  },
];

const Pille = ({ farbe }: { farbe: Farbe }) => {
  const b = bewertung[farbe];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[13px] font-bold ${b.pille}`}
    >
      <span className={`h-2 w-2 rounded-full ${b.punkt}`} aria-hidden />
      {b.wort}
    </span>
  );
};

const VertragsAmpel = () => (
  <>
    <Seo
      title="Vertrags-Ampel: grün, gelb, rot | finanzmuslim"
      description="Zwölf Verträge aus dem Alltag mit klarer Bewertung und der Bedingung dahinter: Depot, Kreditkarte, Versicherung, Ratenzahlung, Leasing und mehr."
      path="/vorlagen/vertrags-ampel"
    />
    <VorlagenSeite
      kicker={v.kicker}
      motiv={v.motiv}
      titel={v.titel}
      einleitung="Depot, Kreditkarte, Versicherung, Ratenzahlung, Leasing. Zwölf Verträge, die fast jeder hat oder angeboten bekommt, jeweils mit einer klaren Farbe und der Bedingung dahinter."
      pdfPfad={v.pdfPfad}
      quellen="Zinsverbot: Quran 2:275 und 2:279, deutsche Übersetzung nach Bubenheim/Elyas. Glücksspiel und Spekulation: Quran 5:90. Screening von Anlagen: AAOIFI, Shariah Standard No. 21, Financial Paper, Shares and Bonds. Versicherung, Kreditkarte, Ratenkauf: Die hier wiedergegebene Einordnung folgt der Mehrheitsposition zeitgenössischer Fiqh-Gremien, insbesondere der OIC Islamic Fiqh Academy und AAOIFI. Die genauen Beschlussnummern sind noch nicht geprüft und werden nachgetragen."
      rechtshinweis="Diese Seite gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Sie ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechts-, Steuer- oder Anlageberatung. In Zweifelsfällen, besonders bei allem, was gelb markiert ist, wende dich an einen Gelehrten, dem du vertraust, und lege ihm deinen konkreten Vertrag vor. Innerhalb der Rechtsschulen gibt es zu einzelnen Punkten abweichende Auffassungen."
      ctas={[
        {
          titel: "Ein Konto ohne Zinsfalle",
          text: "Welches Girokonto ohne Guthabenzins und ohne aufgedrängten Dispo auskommt, und welche Karte ohne Kreditrahmen funktioniert.",
          buttonLabel: "Zu den Vergleichen",
          to: "/vergleiche",
        },
        {
          titel: "Das Depot als Ersatz für die Rentenversicherung",
          text: "Welcher Anbieter halale Anlagen führt und was er kostet. Dieselbe Funktion, ohne Zinsvertrag.",
          buttonLabel: "Depot-Vergleich",
          to: "/vergleich/depot",
        },
      ]}
    >
      <section>
        <div className="grid gap-4 md:grid-cols-3">
          {legende.map((l) => (
            <div key={l.farbe} className="card-surface p-5">
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${bewertung[l.farbe].punkt}`} aria-hidden />
                <span className="text-[17px] font-bold text-foreground">{bewertung[l.farbe].wort}</span>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{l.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-hero p-6 md:p-8">
        <h2 className="text-xl font-bold text-foreground">Warum es überhaupt Gelb gibt</h2>
        <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">
          Vieles ist nicht per se erlaubt oder verboten, sondern hängt an der Bedingung. Eine Versicherung, die du
          freiwillig abschließt, ist etwas anderes als eine, die der Gesetzgeber vorschreibt. Gelb heißt: prüfen,
          nicht raten.
        </p>
      </section>

      {/* Tabelle ab md, darunter gestapelte Karten ohne horizontales Scrollen. */}
      <section>
        <table className="hidden w-full border-collapse text-left md:table">
          <thead>
            <tr className="border-b border-border">
              <th className="w-[28%] py-3 pr-4 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
                Vertrag
              </th>
              <th className="w-[14%] py-3 pr-4 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
                Bewertung
              </th>
              <th className="py-3 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
                Woran es hängt
              </th>
            </tr>
          </thead>
          <tbody>
            {zeilen.map((z) => (
              <tr key={z.vertrag} className="border-b border-border align-top">
                <td className="py-4 pr-4">
                  <span className="block text-[16px] font-bold text-foreground">{z.vertrag}</span>
                  <span className="mt-1 block text-[13px] text-muted-foreground">{z.unter}</span>
                </td>
                <td className="py-4 pr-4">
                  <Pille farbe={z.farbe} />
                </td>
                <td className="py-4 text-[15px] leading-relaxed text-foreground/90">{z.woran}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-3 md:hidden">
          {zeilen.map((z) => (
            <div key={z.vertrag} className="card-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="block text-[16px] font-bold text-foreground">{z.vertrag}</span>
                  <span className="mt-1 block text-[13px] text-muted-foreground">{z.unter}</span>
                </div>
                <Pille farbe={z.farbe} />
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">{z.woran}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground">Wenn die Ampel gelb zeigt, drei Fragen</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {fragen.map((f) => (
            <div key={f.titel} className="card-surface p-5">
              <h3 className="text-[17px] font-bold text-foreground">{f.titel}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </VorlagenSeite>
  </>
);

export default VertragsAmpel;
