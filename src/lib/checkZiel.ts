/**
 * RN6 (15.11.2026, Elias: „Check ersetzt Quiz“, Vault raw/2026-11-15-elias-rn6-01-entscheidungen-check-phase1.md Nr. 1):
 * Jeder Weg ins alte Quiz /vergleich/start führt in den Halal-Finanz-Check, Kennung quelle=quiz. Was die Person im
 * Freebie schon als Vorhaben angekreuzt hat (anlegen, konto), wird zur ersten Antwort, der Check beginnt dann bei Frage 2.
 */
export const CHECK_STATT_QUIZ = "/check?quelle=quiz";

export const checkZielAusVorhaben = (vorhaben: string | null | undefined): string => {
  const liste = (vorhaben ?? "").split(",");
  const konto = liste.includes("konto");
  const anlegen = liste.includes("anlegen");
  const ziel = konto && anlegen ? "beides" : konto ? "konto" : anlegen ? "invest" : "";
  return ziel ? `${CHECK_STATT_QUIZ}&ziel=${ziel}` : CHECK_STATT_QUIZ;
};
