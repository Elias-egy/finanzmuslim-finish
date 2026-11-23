import type { Land } from "@/lib/land";

/**
 * Flaggen als kleine Vektorgrafik. Emoji-Flaggen zeigt Windows nicht (dort stehen nur die Buchstaben DE, AT, CH), die
 * Länderwahl muss aber überall gleich aussehen. Maße 20 × 14, runde Ecken, feine Kante gegen weiße Flächen.
 */
export const Flagge = ({ land, className = "" }: { land: Land; className?: string }) => (
  <svg
    viewBox="0 0 20 14"
    width="20"
    height="14"
    aria-hidden="true"
    focusable="false"
    className={`shrink-0 rounded-[2px] ${className}`}
    style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.12)" }}
  >
    {land === "de" && (
      <>
        <rect width="20" height="4.67" y="0" fill="#000000" />
        <rect width="20" height="4.67" y="4.67" fill="#DD0000" />
        <rect width="20" height="4.66" y="9.34" fill="#FFCE00" />
      </>
    )}
    {land === "at" && (
      <>
        <rect width="20" height="4.67" y="0" fill="#ED2939" />
        <rect width="20" height="4.67" y="4.67" fill="#FFFFFF" />
        <rect width="20" height="4.66" y="9.34" fill="#ED2939" />
      </>
    )}
    {land === "ch" && (
      <>
        <rect width="20" height="14" fill="#DA291C" />
        <rect x="8.4" y="2.6" width="3.2" height="8.8" fill="#FFFFFF" />
        <rect x="5.6" y="5.4" width="8.8" height="3.2" fill="#FFFFFF" />
      </>
    )}
  </svg>
);
