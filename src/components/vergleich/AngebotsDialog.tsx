import { AnbieterLogo } from "@/components/AnbieterLogo";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AngebotsKnopf, BonusSchild, QuellenListe, ZinsSatz } from "./VergleichsBausteine";
import type { VergleichsSpalte, VergleichsZeile } from "./vergleichTypen";

/**
 * Das aufgeklappte Angebot am Laptop: ein Klick auf die Kopfzeile der Tabelle öffnet es.
 * Hier steht, was im Hauptvergleich nichts zu suchen hat (Elias, 07.10.2026): die Vorteile
 * eines kostenpflichtigen Tarifs und der Satz zur Zins-Ampel etwas größer, die Quellen der Werte
 * klein darunter. Auf dem Handy steht der Tarif oben in der Karte, der Rest hinter „Produktdetails“.
 */
export const AngebotsDialog = ({
  spalte,
  zeilen,
  schliessen,
}: {
  spalte: VergleichsSpalte | null;
  zeilen: VergleichsZeile[];
  schliessen: () => void;
}) => (
  <Dialog open={spalte !== null} onOpenChange={(o) => !o && schliessen()}>
    <DialogContent className="max-w-lg gap-5">
      {spalte && (
        <>
          <DialogHeader className="flex-row items-center gap-3 space-y-0 pr-6 text-left">
            <AnbieterLogo name={spalte.anbieter} domain={spalte.domain} gross />
            <div className="min-w-0">
              <DialogTitle className="text-[18px] font-normal leading-snug tracking-normal text-foreground">
                <span className="font-bold">{spalte.anbieter}</span> {spalte.produkt}
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-[13px]">
                {spalte.etikett && !spalte.abgeraten ? spalte.etikett.text : "Produktdetails"}
              </DialogDescription>
            </div>
          </DialogHeader>
          {spalte.tarif && (
            <p className="text-[15px] leading-[23px] text-foreground">
              <span className="mr-2 rounded-full bg-violet/10 px-2 py-0.5 text-[12px] font-semibold text-violet">
                {spalte.tarif.marke}
              </span>
              {spalte.tarif.satz}
            </p>
          )}
          <ZinsSatz spalte={spalte} zeilen={zeilen} />
          {spalte.link && (
            <div>
              <AngebotsKnopf link={spalte.link} breit />
              <BonusSchild anbieterId={spalte.id} />
            </div>
          )}
          <QuellenListe spalte={spalte} zeilen={zeilen} />
        </>
      )}
    </DialogContent>
  </Dialog>
);

export default AngebotsDialog;
