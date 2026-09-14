import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { monetarisierung } from "@/config/monetarisierung";
import { ANLAGEN_KAUFBAR } from "@/data/anlagenKaufbar";
import KaufbarListe from "@/components/anlage/KaufbarListe";

/**
 * "Wo ist diese Anlage handelbar?" — Desktop als Dialog, Handy als Schublade
 * von unten. Beides über die vorhandenen barrierearmen Bausteine.
 *
 * Solange keine geprüfte Broker-Zuordnung vorliegt, zeigt der Inhalt genau
 * das und nichts anderes. Erfundene Broker wären hier besonders teuer: der
 * Nutzer würde bei einem Anbieter suchen, der die Anlage gar nicht führt.
 */

const Inhalt = ({ anlageName, isin }: { anlageName: string; isin?: string }) => {
  const kaufbar = isin ? ANLAGEN_KAUFBAR[isin] : undefined;
  if (kaufbar) {
    return (
      <div className="space-y-4 px-1 pb-2">
        <KaufbarListe kaufbar={kaufbar} />
        <p className="text-[13px] text-muted-foreground">
          finanzmuslim führt keine Order aus. Der Kauf läuft immer über deinen Broker.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-4 px-1 pb-2">
      <div className="rounded-xl bg-accent px-4 py-4">
        <p className="text-[15px] font-bold text-foreground">Noch keine geprüfte Zuordnung</p>
        <p className="mt-1 text-[14px] leading-[21px] text-muted-foreground">
          Wir tragen gerade zusammen, welcher Broker {anlageName} führt und ob ein Sparplan möglich
          ist. Erst wenn das belegt ist, steht es hier.
        </p>
      </div>
      {isin && (
        <p className="text-[13px] text-muted-foreground">
          Bis dahin hilft die ISIN {isin}: Damit findest du die Anlage in der Suche deines Brokers.
        </p>
      )}
      <p className="text-[13px] text-muted-foreground">
        finanzmuslim führt keine Order aus. Der Kauf läuft immer über deinen Broker.
      </p>
    </div>
  );
};

const BrokerAuswahl = ({
  offen,
  schliessen,
  anlageName,
  isin,
}: {
  offen: boolean;
  schliessen: () => void;
  anlageName: string;
  isin?: string;
}) => {
  const [handy, setHandy] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const setzen = () => setHandy(mq.matches);
    setzen();
    mq.addEventListener("change", setzen);
    return () => mq.removeEventListener("change", setzen);
  }, []);

  const titel = "Wo ist diese Anlage handelbar?";
  const unter =
    monetarisierung.status === "live"
      ? "Nur geprüfte Anbieter, mit Datum der letzten Prüfung."
      : "Die Liste wird gerade aufgebaut.";

  if (handy) {
    return (
      <Drawer open={offen} onOpenChange={(o) => !o && schliessen()}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{titel}</DrawerTitle>
            <DrawerDescription>{unter}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <Inhalt anlageName={anlageName} isin={isin} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={offen} onOpenChange={(o) => !o && schliessen()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{titel}</DialogTitle>
          <DialogDescription>{unter}</DialogDescription>
        </DialogHeader>
        <Inhalt anlageName={anlageName} isin={isin} />
      </DialogContent>
    </Dialog>
  );
};

export default BrokerAuswahl;
