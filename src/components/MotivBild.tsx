import { motive, type MotivName } from "@/components/motive";

/**
 * Motivbild oben in einer Karte. Das quadratische Motiv wird mittig auf 16:9
 * angeschnitten, nie verzerrt. Keine eigene Umrandung, die Flaeche kommt aus dem Motiv.
 */
const MotivBild = ({ name, className }: { name: MotivName; className?: string }) => {
  const Motiv = motive[name];
  return (
    <div className={`relative aspect-[16/9] w-full overflow-hidden ${className ?? ""}`}>
      <div className="absolute left-0 top-1/2 aspect-square w-full -translate-y-1/2">
        <Motiv />
      </div>
    </div>
  );
};

export default MotivBild;
