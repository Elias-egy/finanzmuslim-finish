import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";

/**
 * Alle Filter hinter einem Knopf. Vorher standen fünf Schalter nebeneinander
 * über der Liste und schoben die Anlagen unter die Bildkante. Auf dem Handy
 * öffnet sich eine Schublade von unten, auf dem Desktop ein Dialog.
 */

export type Reiter = "alle" | "aktien" | "sukuk" | "gold" | "silber" | "rohstoffe" | "krypto";
export type Sortierung = "name" | "kosten" | "groesse" | "renditeAb" | "renditeAuf";

export const reiter: { key: Reiter; label: string }[] = [
  { key: "alle", label: "Alle" },
  { key: "aktien", label: "Aktien" },
  { key: "sukuk", label: "Sukuk" },
  { key: "gold", label: "Gold" },
  { key: "silber", label: "Silber" },
  { key: "rohstoffe", label: "Platin" },
  { key: "krypto", label: "Krypto" },
];

const sortierungen: { key: Sortierung; label: string }[] = [
  { key: "name", label: "Name A bis Z" },
  { key: "kosten", label: "Kosten aufsteigend" },
  { key: "groesse", label: "Größe absteigend" },
  { key: "renditeAb", label: "Rendite absteigend" },
  { key: "renditeAuf", label: "Rendite aufsteigend" },
];

export type FilterStand = {
  kategorie: Reiter;
  nurAusschuettend: boolean;
  nurPassiv: boolean;
  sortierung: Sortierung;
};

export const filterStandard: FilterStand = {
  kategorie: "alle",
  nurAusschuettend: false,
  nurPassiv: false,
  sortierung: "name",
};

/** Wie viele Filter vom Standard abweichen. Steht als Zahl im Knopf. */
export const aktiveFilter = (f: FilterStand) =>
  (f.kategorie !== "alle" ? 1 : 0) + (f.nurAusschuettend ? 1 : 0) + (f.nurPassiv ? 1 : 0);

const Inhalt = ({
  stand,
  setzen,
}: {
  stand: FilterStand;
  setzen: (f: FilterStand) => void;
}) => (
  <div className="space-y-6 px-1 pb-2">
    <div>
      <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">Art</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {reiter.map((r) => (
          <button
            key={r.key}
            type="button"
            aria-pressed={stand.kategorie === r.key}
            onClick={() => setzen({ ...stand, kategorie: r.key })}
            className={`min-h-[44px] rounded-lg px-4 text-[15px] font-semibold transition-colors ${
              stand.kategorie === r.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-hero"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>

    <div>
      <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
        Eigenschaften
      </p>
      <div className="mt-3 space-y-3">
        <label className="flex min-h-[44px] items-center gap-3 text-[15px] text-foreground">
          <Switch
            checked={stand.nurAusschuettend}
            onCheckedChange={(v) => setzen({ ...stand, nurAusschuettend: v })}
          />
          nur ausschüttend
        </label>
        <label className="flex min-h-[44px] items-center gap-3 text-[15px] text-foreground">
          <Switch
            checked={stand.nurPassiv}
            onCheckedChange={(v) => setzen({ ...stand, nurPassiv: v })}
          />
          nur passiv
        </label>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        Beide Schalter blenden Gold, Silber und Krypto aus. Eine Münze schüttet nichts aus und hat
        keine Bauart.
      </p>
    </div>

    <div>
      <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
        Sortierung
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {sortierungen.map((s) => (
          <button
            key={s.key}
            type="button"
            aria-pressed={stand.sortierung === s.key}
            onClick={() => setzen({ ...stand, sortierung: s.key })}
            className={`min-h-[44px] rounded-lg px-4 text-[15px] font-semibold transition-colors ${
              stand.sortierung === s.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-hero"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>

    <button
      type="button"
      onClick={() => setzen(filterStandard)}
      className="min-h-[44px] text-[15px] font-semibold text-primary hover:underline"
    >
      Alles zurücksetzen
    </button>
  </div>
);

const AnlageFilter = ({
  stand,
  setzen,
}: {
  stand: FilterStand;
  setzen: (f: FilterStand) => void;
}) => {
  const [offen, setOffen] = useState(false);
  const [handy, setHandy] = useState(false);
  const anzahl = aktiveFilter(stand);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const setzenHandy = () => setHandy(mq.matches);
    setzenHandy();
    mq.addEventListener("change", setzenHandy);
    return () => mq.removeEventListener("change", setzenHandy);
  }, []);

  const knopf = (
    <button
      type="button"
      onClick={() => setOffen(true)}
      className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-border bg-background px-4 text-[15px] font-semibold text-foreground transition-colors hover:border-primary"
    >
      <SlidersHorizontal className="h-4 w-4" aria-hidden />
      Filter
      {anzahl > 0 && (
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-[13px] font-bold text-primary-foreground">
          {anzahl}
        </span>
      )}
    </button>
  );

  if (handy) {
    return (
      <>
        {knopf}
        <Drawer open={offen} onOpenChange={setOffen}>
          <DrawerContent className="px-4 pb-6">
            <DrawerHeader className="px-1 text-left">
              <DrawerTitle className="text-[18px]">Filter</DrawerTitle>
            </DrawerHeader>
            <Inhalt stand={stand} setzen={setzen} />
            <button
              type="button"
              onClick={() => setOffen(false)}
              className="btn-primary mt-6 w-full justify-center"
            >
              Anlagen zeigen
            </button>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      {knopf}
      <Dialog open={offen} onOpenChange={setOffen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[20px]">Filter</DialogTitle>
          </DialogHeader>
          <Inhalt stand={stand} setzen={setzen} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AnlageFilter;
