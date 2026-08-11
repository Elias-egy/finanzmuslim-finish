import GuideStage from "@/components/GuideStage";

/**
 * TEMPORÄRE Dev-Vorschau für die Guide-Bühne (Phase 2).
 * Simuliert Hero (dunkel, davor) und Folgesektion (hell, danach),
 * um Übergänge und Scroll-Choreografie isoliert zu prüfen.
 *
 * ?p=0.5  friert den Scroll-Progress für Screenshot-Tests ein
 * ?bare=1 blendet die Platzhalter aus (Bühne beginnt bei Scroll 0)
 *
 * Wird bei der Integration in Index.tsx wieder entfernt.
 */
const DevGuideStage = () => {
  const params = new URLSearchParams(window.location.search);
  const frozenP = params.get("p");
  const bare = params.get("bare") === "1";

  return (
    <div className="min-h-screen bg-background">
      {frozenP !== null && (
        <style>{`section[aria-label="Halal Investment Guide"] { --p: ${parseFloat(frozenP) || 0} !important; }`}</style>
      )}
      {!bare && (
        <div className="h-[85vh] bg-[#0d241c] flex items-center justify-center">
          <p className="text-white/40 text-sm tracking-widest uppercase">[ Hero-Platzhalter – scroll ↓ ]</p>
        </div>
      )}
      <GuideStage />
      <div className="h-[70vh] bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm tracking-widest uppercase">[ Folgesektion – hell ]</p>
      </div>
    </div>
  );
};

export default DevGuideStage;
