import Seo from "@/components/Seo";
import VorlagenSeite from "@/components/VorlagenSeite";
import { vorlageBySlug } from "@/data/vorlagen";

const v = vorlageBySlug("aktien-check")!;

const vorgehen = [
  "Geschäftsfeld ansehen. Womit verdient die Firma ihr Geld? Ein Blick auf die Branche sortiert die meisten Fälle sofort aus.",
  "Die drei Grenzwerte prüfen. Haram-Umsatz, Schulden, zinsbasierte Mittel.",
  "Werkzeug gegenprüfen. Musaffa oder Zoya rechnen es dir aus.",
  "Erträge reinigen und wiedervorlegen. Einmal geprüft ist nicht für immer geprüft.",
];

const grenzwerte = [
  {
    frage: "Womit verdient die Firma ihr Geld?",
    text: "Umsatz aus Alkohol, Tabak, Glücksspiel, Zinsgeschäft, Waffen oder Pornografie darf einen kleinen Rest nicht überschreiten. Ist das Kerngeschäft selbst haram, endet die Prüfung hier, ganz ohne Zahlen.",
    wert: "≤ 5 %",
    label: "Haram-Umsatz",
  },
  {
    frage: "Wie stark ist sie verschuldet?",
    text: "Gemeint sind ausdrücklich verzinsliche Schulden. Eine Firma, die überwiegend auf Zinskrediten läuft, wird über den Umweg deiner Beteiligung zu einem Zinsgeschäft.",
    wert: "≤ 30 %",
    label: "Schuldenquote",
  },
  {
    frage: "Wie viel liegt zinsbringend herum?",
    text: "Zinstragende Wertpapiere und verzinste Guthaben in der Bilanz. Auch eine saubere Firma kann durch ihre Geldanlage durchfallen.",
    wert: "≤ 30 %",
    label: "Zinsbasierte Mittel",
  },
];

const fehler = [
  {
    titel: "Vom Markennamen auf halal schließen",
    text: "Ein Technologiekonzern klingt unverdächtig und fällt trotzdem regelmäßig über die Schuldenquote. Der Name sagt nichts.",
  },
  {
    titel: "Einmal prüfen und nie wieder",
    text: "Schulden und Zinsmittel ändern sich mit jedem Quartalsbericht. Einmal im Jahr nachsehen ist das Minimum, bei Einzelaktien besser häufiger.",
  },
  {
    titel: "Die Reinigung überspringen",
    text: "Sie ist der kleinste Rechenschritt von allen und entscheidet trotzdem darüber, ob der Gewinn am Ende sauber ist.",
  },
];

const AktienCheck = () => (
  <>
    <Seo
      title="Ist diese Aktie halal? Der Spickzettel | finanzmuslim"
      description="Drei Grenzwerte entscheiden: Haram-Umsatz, Schuldenquote und zinsbasierte Mittel. So ordnest du jede Aktie in unter einer Minute ein."
      path="/vorlagen/aktien-check"
      brotkrumen={[{ name: "Vorlagen", path: "/vorlagen" }, { name: "Ist diese Aktie halal?", path: "/vorlagen/aktien-check" }]}
    />
    <VorlagenSeite
      kicker={v.kicker}
      motiv={v.motiv}
      titel={v.titel}
      einleitung="Drei Zahlen entscheiden. Wer sie kennt, kann jede Aktie in unter einer Minute einordnen, ohne Bilanz lesen zu können."
      pdfPfad={v.pdfPfad}
      quellen="Screening-Kriterien: AAOIFI, Shariah Standard No. 21, Financial Paper, Shares and Bonds. Haram-Umsatz höchstens 5 Prozent, Schuldenquote höchstens 30 Prozent, zinsbasierte liquide Mittel höchstens 30 Prozent. Zinsverbot: Quran 2:275 und 2:279, deutsche Übersetzung nach Bubenheim/Elyas. Werkzeuge: Musaffa und Zoya, Angaben der Anbieter, Stand August 2026. Islamicly und Finispia sind noch nicht geprüft. Zwischen den Rechtsschulen und einzelnen Gremien gibt es abweichende Auffassungen zu Grenzwerten und Nennern."
      rechtshinweis="Diese Seite dient ausschließlich zu Bildungszwecken, ist keine Fatwa und stellt keine personalisierte Anlageberatung dar. Genannte Unternehmen und Anbieter sind Beispiele, keine Empfehlung zum Kauf, Halten oder Verkauf. Zu den genannten Werkzeugen bestehen derzeit keine Partnerschaften."
      ctas={[
        {
          titel: "Du willst dir das ganz sparen?",
          text: "Ein geprüfter Halal-ETF nimmt dir die Prüfung dauerhaft ab. Welche es gibt und wer sie zertifiziert hat, steht in der Liste.",
          buttonLabel: "Zur Liste",
          to: "/vorlagen/halal-anlagen",
        },
        {
          titel: "Bei welchem Broker kannst du Einzelaktien überhaupt sauber halten?",
          text: "Entscheidend sind Wertpapierleihe, Verrechnungskonto und ob du die Zinsgutschrift abschalten kannst.",
          buttonLabel: "Depot-Vergleich",
          to: "/vergleich/depot",
        },
      ]}
    >
      <section>
        <h2 className="text-2xl font-bold text-foreground">So gehst du vor</h2>
        <ol className="mt-4 space-y-3">
          {vorgehen.map((p, i) => (
            <li key={p} className="card-surface flex gap-4 p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[15px] font-bold text-foreground">
                {i + 1}
              </span>
              <span className="text-[16px] leading-relaxed text-foreground/90">{p}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground">Die drei Grenzwerte</h2>
        <p className="mt-3 text-[16px] leading-relaxed text-foreground/90">
          So prüft der AAOIFI-Standard, an dem sich fast alle Screener orientieren. Reißt die Firma eine dieser
          Grenzen, fällt sie durch.
        </p>
        <div className="mt-4 space-y-3">
          {grenzwerte.map((g, i) => (
            <div key={g.label} className="card-surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[15px] font-bold text-foreground">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-bold text-foreground">{g.frage}</span>
                <span className="mt-2 block text-[15px] leading-relaxed text-muted-foreground">{g.text}</span>
              </span>
              <span className="shrink-0 sm:w-40 sm:text-right">
                <span className="block text-[26px] font-bold text-foreground">{g.wert}</span>
                <span className="mt-1 block text-[13px] text-muted-foreground">{g.label}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-hero p-6 md:p-8">
        <h2 className="text-xl font-bold text-foreground">Warum zwei Apps sich widersprechen</h2>
        <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">
          Die Prozentgrenze ist das eine, der Nenner das andere. Manche Standards rechnen gegen die
          Marktkapitalisierung, andere gegen die Bilanzsumme. Bei einer schwankenden Aktie kann dieselbe Firma damit
          heute durchfallen und nächsten Monat bestehen. Wenn zwei Werkzeuge sich widersprechen, liegt es fast immer
          daran, nicht an einem Fehler.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground">Wer rechnet das für dich?</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card-surface p-6">
            <h3 className="text-[17px] font-bold text-foreground">Musaffa</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              Screener für Einzelaktien mit Angabe, an welchem Kriterium eine Aktie scheitert. Zeigt auch den Anteil,
              den du reinigen musst.
            </p>
            <p className="mt-4 text-[13px] text-muted-foreground">musaffa.com, Basisfunktionen kostenlos</p>
          </div>
          <div className="card-surface p-6">
            <h3 className="text-[17px] font-bold text-foreground">Zoya</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              AAOIFI-basierter Screener unter Aufsicht von Shariah Advisors. Schnelle Einzelabfrage,
              Depot-Durchleuchtung in der Bezahlversion.
            </p>
            <p className="mt-4 text-[13px] text-muted-foreground">zoya.finance, Basisversion kostenlos</p>
          </div>
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
          Weitere Anbieter am Markt: Islamicly und Finispia. Beide sind von mir noch nicht geprüft und stehen deshalb
          ohne Einordnung hier.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground">Der Schritt, den fast alle vergessen</h2>
        <div className="card-surface mt-4 p-6">
          <h3 className="text-[17px] font-bold text-foreground">Erträge reinigen</h3>
          <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">
            Selbst eine bestandene Aktie hat oft einen kleinen unerlaubten Ertragsanteil, etwa Zinserträge aus der
            Firmenkasse. Diesen Anteil rechnest du aus deiner Dividende heraus und spendest ihn, ohne dafür Belohnung
            zu erwarten. Musaffa und Zoya weisen den Prozentsatz aus. Der Rest deines Gewinns bleibt damit sauber.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground">Drei Fehler, die ich immer wieder sehe</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {fehler.map((f, i) => (
            <div key={f.titel} className="card-surface p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[15px] font-bold text-foreground">
                {i + 1}
              </span>
              <h3 className="mt-3 text-[17px] font-bold text-foreground">{f.titel}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </VorlagenSeite>
  </>
);

export default AktienCheck;
