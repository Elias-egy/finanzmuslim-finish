import type { Dua } from "@/data/duas";

/** Ein Bittgebet mit Arabisch, Umschrift, Übersetzung und Fundstelle. Enthält keine Daten. */
const DuaKarte = ({ d }: { d: Dua }) => (
  <article className="card-surface p-5 md:p-6">
    <div className="flex flex-wrap items-baseline justify-between gap-3">
      <span className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">{d.nr}</span>
      <span className="text-[12px] text-muted-foreground">{d.when}</span>
    </div>
    <p
      dir="rtl"
      lang="ar"
      style={{ fontFamily: '"Geeza Pro","Al Bayan",Tahoma,serif' }}
      className={`mt-3 text-right leading-loose text-foreground ${d.kurz ? "text-[22px]" : "text-[24px]"}`}
    >
      {d.ar}
    </p>
    <p className="mt-3 text-[14px] italic leading-relaxed text-muted-foreground">{d.tr}</p>
    <p className="mt-2 text-[15px] leading-relaxed text-foreground/90">{d.de}</p>
    <p className="mt-3 border-t border-border pt-2 text-[12px] leading-relaxed text-muted-foreground">{d.quelle}</p>
  </article>
);

export default DuaKarte;
