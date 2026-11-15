/**
 * Schalter Phase 1 / Phase 2 (RN5, 15.11.2026; Elias RN3-07: „zwei Parallel-Localhost. Einer, der Phase 1 zeigt
 * und einmal Phase 2 … aber Phase 1 ist das, was released wird“).
 *
 * Phase 1 = Renovierung plus Halal-Finanz-Check, ohne Halal-Investment-OS (kein violetter Streifen, kein OS-Block,
 * keine OS-Knöpfe, keine OS-Bewerbung, /investment-os/ und /os-entwurf liefern 404).
 * Phase 2 = alles mit OS.
 *
 * Standard ist 1: Ein vergessener Schalter beim Release zeigt nie das OS. Phase 2 nur mit VITE_PHASE=2
 * (Localhost 5350). Localhost 5351 läuft mit VITE_PHASE=1.
 */
export const PHASE: 1 | 2 = import.meta.env.VITE_PHASE === "2" ? 2 : 1;
export const MIT_OS = PHASE === 2;
