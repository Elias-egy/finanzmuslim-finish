import Seo from "@/components/Seo";
import VorlagenSeite from "@/components/VorlagenSeite";
import { vorlageBySlug } from "@/data/vorlagen";

const v = vorlageBySlug("halal-anlagen")!;

type Anlage = { name: string; pruefstelle: string; isin?: string };
type Kategorie = { titel: string; anlagen: Anlage[] };

const kategorien: Kategorie[] = [
  {
    titel: "Aktien-ETFs und Fonds",
    anlagen: [
      { name: "iShares MSCI World Islamic", pruefstelle: "MSCI-Islamic-Index-Screening, AAOIFI-orientiert", isin: "IE00B27YCN58" },
      { name: "iShares MSCI Emerging Markets Islamic", pruefstelle: "MSCI-Islamic-Index-Screening", isin: "IE00B27YCP72" },
      { name: "iShares MSCI USA Islamic", pruefstelle: "MSCI-Islamic-Index-Screening", isin: "IE00B296QM64" },
      {
        name: "Invesco Dow Jones Islamic Global Developed Markets",
        pruefstelle: "Dow-Jones-Islamic-Market-Methodik, S&P Dow Jones Shariah-Board",
        isin: "IE000UOXRAM8",
      },
      { name: "Invesco MSCI ACWI Islamic M-Series", pruefstelle: "MSCI-Islamic-M-Series-Index-Screening", isin: "IE000LFC57H7" },
      {
        name: "Saturna Al-Kawthar Global Focused Equity",
        pruefstelle: "Aktiv gemanagt, zertifiziert: Amanie Advisors, SSB mit jährlichem Audit",
        isin: "IE00BMYMHS24",
      },
      {
        name: "Comgest Growth Europe S, Shariah-Strategie",
        pruefstelle: "S&P-Shariah-Methodik, Vergleichsindex S&P Europe 350 Shariah",
        isin: "IE00B4ZJ4634",
      },
      {
        name: "Franklin Shariah Technology Fund",
        pruefstelle: "Zertifiziert: Franklin-Templeton-Shariah-Supervisory-Board",
        isin: "ISIN noch nicht geprüft",
      },
    ],
  },
  {
    titel: "Sukuk, die islamische Alternative zu Anleihen",
    anlagen: [
      { name: "iShares USD Sukuk UCITS ETF", pruefstelle: "Investiert in Sukuk, reale Vermögenswerte statt Zinsen", isin: "IE000929U2U9" },
      {
        name: "Xtrackers II Salam USD Global Aggregate Sukuk",
        pruefstelle: "Index-Screening nach Shariah-Methodik von IdealRatings",
        isin: "LU3123443510",
      },
      {
        name: "BNP Paribas Islamic Fund Hilal Income Classic C",
        pruefstelle: "Islamische SICAV mit eigenem Shariah-Komitee, Zusammensetzung im Fondsprospekt",
        isin: "LU1150255971",
      },
    ],
  },
  {
    titel: "Gold, physisch hinterlegt",
    anlagen: [
      { name: "Invesco Physical Gold ETC", pruefstelle: "Zertifiziert: Amanie Advisors, jährliches Shariah-Zertifikat", isin: "IE00B579F325" },
      { name: "Invesco Physical Gold II", pruefstelle: "Zertifiziert: Amanie Advisors, jährliches Shariah-Zertifikat", isin: "XS3384723154" },
      { name: "WisdomTree Physical Gold", pruefstelle: "Zertifiziert: Al-Qalam Shariah Panel, jährlich, AAOIFI Standard No. 1", isin: "JE00B1VS3770" },
      { name: "WisdomTree Core Physical Gold", pruefstelle: "Zertifiziert: Al-Qalam Shariah Panel, jährlich, AAOIFI Standard No. 1", isin: "JE00BN2CJ301" },
      { name: "WisdomTree Physical Swiss Gold", pruefstelle: "Zertifiziert: Al-Qalam Shariah Panel, jährlich, AAOIFI Standard No. 1", isin: "JE00B588CD74" },
    ],
  },
  {
    titel: "Silber, physisch hinterlegt",
    anlagen: [
      { name: "Invesco Physical Silver", pruefstelle: "Zertifiziert: Amanie Advisors, jährliches Shariah-Zertifikat", isin: "IE00B43VDT70" },
      { name: "WisdomTree Physical Silver", pruefstelle: "Zertifiziert: Al-Qalam Shariah Panel, jährlich, AAOIFI Standard No. 1", isin: "JE00B1VS3333" },
      { name: "WisdomTree Core Physical Silver", pruefstelle: "Zertifiziert: Al-Qalam Shariah Panel, jährlich, AAOIFI Standard No. 1", isin: "JE00BQRFDY49" },
    ],
  },
  {
    titel: "Krypto, nur als kleine Beimischung",
    anlagen: [
      { name: "Bitcoin", pruefstelle: "Shariah-Gutachten: Shariyah Review Bureau, 2022, lizenziert von der Central Bank of Bahrain" },
      { name: "Ether, Ethereum", pruefstelle: "Shariah White Paper: Amanie Advisors und Ethereum Foundation, 2019, Dr. Mohd Daud Bakar" },
    ],
  },
];

const HalalAnlagen = () => (
  <>
    <Seo
      title="21 halal Anlagen mit ISIN und Prüfstelle | finanzmuslim"
      description="Aktien-ETFs, Sukuk, Gold, Silber und Krypto, jeweils mit ISIN und der Stelle, die sie als shariah-konform geprüft oder zertifiziert hat."
      path="/vorlagen/halal-anlagen"
      brotkrumen={[{ name: "Vorlagen", path: "/vorlagen" }, { name: "Halal-Anlagen als PDF", path: "/vorlagen/halal-anlagen" }]}
    />
    <VorlagenSeite
      kicker={v.kicker}
      motiv={v.motiv}
      titel={v.titel}
      einleitung="Aktien-ETFs, Sukuk, Gold, Silber und Krypto, jeweils mit ISIN und der Stelle, die sie als shariah-konform geprüft oder zertifiziert hat. Zum Nachlesen statt Nachfragen."
      pdfPfad={v.pdfPfad}
      slug={v.slug}
      quellen="Screening-Kriterien: AAOIFI, Shariah Standard No. 21, Financial Paper, Shares and Bonds. Gold und Silber: AAOIFI Standard No. 1, jeweils bestätigt durch das Zertifikat des genannten Panels. Bitcoin: Shariyah Review Bureau, 2022. Ether: Amanie Advisors und Ethereum Foundation, 2019. Verfügbarkeit und Zertifizierungen: Stand Juli 2026, werden jährlich erneuert, vor dem Kauf selbst prüfen."
      rechtshinweis="Die auf dieser Seite genannten Anlagen sind auch dann, wenn einzelne Emittenten oder Finanzinstrumente genannt werden, nicht als Anlageberatung zu verstehen und stellen weder direkt noch indirekt eine Empfehlung oder Aufforderung zum Kaufen, Halten oder Verkaufen eines Finanzinstruments dar. Dieser Inhalt dient ausschließlich zu Bildungszwecken. Alle Investitionsentscheidungen triffst du eigenverantwortlich. Vergangene Renditen sind keine Garantie für zukünftige Ergebnisse."
      ctas={[
        {
          titel: "Nicht jeder Broker führt diese Anlagen",
          text: "Viele deutsche Anbieter haben weder Islamic-ETFs noch Sukuk oder physisch hinterlegtes Gold im Angebot. Wer was führt, steht im Vergleich.",
          buttonLabel: "Depot-Vergleich",
          to: "/vergleich/depot",
        },
        {
          titel: "Aktien selbst prüfen, in 60 Sekunden",
          text: "Der Spickzettel zeigt dir die drei Grenzwerte, nach denen jeder Screener entscheidet.",
          buttonLabel: "Zum Spickzettel",
          to: "/vorlagen/aktien-check",
        },
      ]}
    >
      <section className="rounded-2xl bg-hero p-6 md:p-8">
        <h2 className="text-xl font-bold text-foreground">Was diese Liste nicht ist</h2>
        <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">
          Keine Empfehlung und keine Anlageberatung. Eine Übersicht dessen, was es gibt und wer es geprüft hat. Du
          entscheidest, was zu dir passt.
        </p>
      </section>

      {kategorien.map((k) => (
        <section key={k.titel}>
          <h2 className="text-2xl font-bold text-foreground">{k.titel}</h2>
          <ul className="mt-4 space-y-3">
            {k.anlagen.map((a) => (
              <li
                key={a.name}
                className="card-surface flex flex-col gap-2 p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
              >
                <span className="min-w-0">
                  <span className="block text-[16px] font-bold text-foreground">{a.name}</span>
                  <span className="mt-1 block text-[13px] text-muted-foreground">{a.pruefstelle}</span>
                </span>
                {a.isin ? (
                  <span className="shrink-0 text-[14px] text-muted-foreground sm:text-right sm:text-foreground [font-variant-numeric:tabular-nums]">
                    {a.isin}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="rounded-2xl bg-hero p-6 md:p-8">
        <h2 className="text-xl font-bold text-foreground">Meine Einordnung</h2>
        <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">
          Beim Gold sind Invesco und WisdomTree offiziell shariah-zertifiziert. Die Amanie-Zertifizierung von Invesco
          ordne ich persönlich stärker ein als das Al-Qalam-Panel von WisdomTree. Lies beide Zertifikate und
          entscheide selbst. Bewusst nicht in der Liste: währungsgesicherte Varianten, Hedged, denn die Absicherung
          läuft über Terminkontrakte.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground">Und was ist mit Einzelaktien?</h2>
        <p className="mt-3 text-[16px] leading-relaxed text-foreground/90">
          Einzelaktien stehen bewusst nicht in dieser Liste. Sie müssen einzeln geprüft werden und danach regelmäßig
          erneut, denn niemand garantiert, dass ein Unternehmen dauerhaft halal bleibt.
        </p>
      </section>
    </VorlagenSeite>
  </>
);

export default HalalAnlagen;
