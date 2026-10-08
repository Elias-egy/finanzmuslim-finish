import Seo from "@/components/Seo";
import VorlagenSeite from "@/components/VorlagenSeite";
import GesperrteZeile from "@/components/vorlagen/GesperrteZeile";
import Schnittkante from "@/components/optin/Schnittkante";
import {
  AboLegende,
  AUTO_CTAS,
  AUTO_EINLEITUNG,
  AUTO_QUELLEN,
  AUTO_RECHTSHINWEIS,
  WarumNicht,
  WasAboAndersMacht,
} from "@/components/vorlagen/autoAboTeile";
import { vorlageBySlug } from "@/data/vorlagen";
import { optinFreebie } from "@/data/optin";
import { ANZAHL_ANBIETER, kante, titelVon } from "@/data/autoAboCheckAusschnitt";

/**
 * Offene Seite des Auto-Abo-Checks: warum Kredit und Leasing meist rausfallen, was ein Abo anders
 * macht, die Anbieter nur mit Namen (Plan Opt-in-Strecke P3). Diese Datei importiert bewusst nicht
 * `autoAboCheck.ts`, sonst stünden Urteile und Klauseln im JavaScript dieser Seite. Die volle Fassung
 * ist `AutoAboCheckVoll.tsx`.
 */
const v = vorlageBySlug("auto-abo-check")!;
const freebie = optinFreebie("auto-abo-check")!;

/** So viele Namen stehen lesbar an der Schranke, darunter läuft die Liste verschwommen aus. */
const AN_DER_KANTE = 4;

const AutoAboCheck = () => (
  <>
    <Seo
      title="Auto-Abo statt Leasing: welcher Anbieter halal passt | finanzmuslim"
      description="Prüfe Auto-Abos als Alternative zu Autokredit und Leasing: FINN, SIXT+ und Hersteller-Abos. Zu jedem Anbieter das Urteil und der Wortlaut aus den eigenen AGB."
      path="/vorlagen/auto-abo-check"
      brotkrumen={[{ name: "Vorlagen", path: "/vorlagen" }, { name: "Auto-Abo-Check", path: "/vorlagen/auto-abo-check" }]}
    />
    <VorlagenSeite
      kicker={v.kicker}
      motiv={v.motiv}
      titel={v.titel}
      einleitung={AUTO_EINLEITUNG}
      pdfPfad={v.pdfPfad}
      slug={v.slug}
      gesperrt={freebie}
      quellen={AUTO_QUELLEN}
      rechtshinweis={AUTO_RECHTSHINWEIS}
      ctas={AUTO_CTAS}
    >
      <WarumNicht />
      <WasAboAndersMacht />
      <AboLegende />

      <Schnittkante
        freebie={freebie}
        weitere={`Alle ${ANZAHL_ANBIETER} Anbieter mit Urteil, Wortlaut und Rechenbeispiel`}
        kopf={
          <>
            <h2 className="text-2xl font-bold text-foreground">{freebie.frage}</h2>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Sieh, welche Anbieter geprüft sind. Urteil, Klauseln und Preise gibt es gegen deine E-Mail.
            </p>
          </>
        }
      >
        {kante.slice(0, AN_DER_KANTE).map((a) => (
          <GesperrteZeile key={a.id} name={titelVon(a)} unterzeile={a.unter} verborgen="Urteil und Klauseln nach der Anmeldung" />
        ))}
      </Schnittkante>
    </VorlagenSeite>
  </>
);

export default AutoAboCheck;
