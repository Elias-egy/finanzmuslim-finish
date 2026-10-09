import Seo from "@/components/Seo";
import VorlagenSeite from "@/components/VorlagenSeite";
import GesperrteZeile from "@/components/vorlagen/GesperrteZeile";
import Schnittkante from "@/components/optin/Schnittkante";
import {
  AMPEL_CTAS,
  AMPEL_EINLEITUNG,
  AMPEL_QUELLEN,
  AMPEL_RECHTSHINWEIS,
  AmpelKarte,
  Legende,
  WarumGelb,
} from "@/components/vorlagen/ampelTeile";
import { vorlageBySlug } from "@/data/vorlagen";
import { optinFreebie } from "@/data/optin";
import { kante, offen } from "@/data/vertragsAmpelAusschnitt";

/**
 * Offene Seite des Halal Vertrags-Checks (früher Vertrags-Ampel): alle Namen, zwei Farben, der Rest gegen E-Mail (Elias,
 * 27.09.2026, Vault raw 2026-09-26-doomscroll-web/09). Diese Datei importiert bewusst nicht
 * `vertragsAmpel.ts`, sonst stünden alle Farben im JavaScript dieser Seite. Die volle Fassung
 * ist `VertragsAmpelVoll.tsx`.
 */
const v = vorlageBySlug("vertrags-ampel")!;
const freebie = optinFreebie("vertrags-ampel")!;

/** So viele Namen stehen lesbar an der Schranke, darunter läuft die Liste verschwommen aus. */
const AN_DER_KANTE = 3;

const VertragsAmpel = () => (
  <>
    <Seo
      title="Welche Verträge sind halal? Der Halal Vertrags-Check für 12 Verträge | finanzmuslim"
      description="Welche Verträge halal sind und welche nicht: zwölf Verträge aus dem Alltag mit klarer Farbe und der Bedingung dahinter. Kreditkarte, Versicherung, Ratenzahlung, Leasing, Depot und mehr."
      path="/vorlagen/vertrags-ampel"
      brotkrumen={[{ name: "Vorlagen", path: "/vorlagen" }, { name: "Halal Vertrags-Check", path: "/vorlagen/vertrags-ampel" }]}
    />
    <VorlagenSeite
      kicker={v.kicker}
      motiv={v.motiv}
      titel={v.titel}
      einleitung={AMPEL_EINLEITUNG}
      pdfPfad={v.pdfPfad}
      slug={v.slug}
      gesperrt={freebie}
      quellen={AMPEL_QUELLEN}
      rechtshinweis={AMPEL_RECHTSHINWEIS}
      ctas={AMPEL_CTAS}
    >
      <Legende />
      <WarumGelb />

      <section>
        <h2 className="text-2xl font-bold text-foreground">Zwei Verträge, zwei Farben</h2>
        <p className="mt-2 text-[15px] text-muted-foreground">Sieh zwei Verträge mit Farbe und Bedingung. Die übrigen zehn gibt es gegen deine E-Mail.</p>
        <div className="mt-4 space-y-3">
          {offen.map((z) => (
            <AmpelKarte key={z.vertrag} z={z} />
          ))}
        </div>
      </section>

      <Schnittkante freebie={freebie} weitere="Alle zwölf Verträge mit Farbe, Bedingung und drei Fragen">
        {kante.slice(0, AN_DER_KANTE).map((z) => (
          <GesperrteZeile key={z.vertrag} name={z.vertrag} unterzeile={z.unter} verborgen="Farbe und Bedingung nach der Anmeldung" />
        ))}
      </Schnittkante>
    </VorlagenSeite>
  </>
);

export default VertragsAmpel;
