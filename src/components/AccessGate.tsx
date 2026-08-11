import { FormEvent, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Instagram, Lock } from "lucide-react";
import logoMark from "@/assets/logo-mark.png";

// ============================================================================
// EARLY-ACCESS-GATE (Pre-Launch, Elias 16.7.)
// Besucher ohne Freischaltung sehen die Vorschaltseite. Impressum + Datenschutz
// bleiben IMMER frei erreichbar (liegen in App.tsx außerhalb des Gates).
//
// Freischaltung: ?zugang=CODE (ManyChat-Link, bleibt auf der Zielseite) oder
// Code-Eingabe unten (leitet nach Erfolg auf die Startseite). localStorage.
//
// PLATZ-ZÄHLER: Es gibt noch KEIN Backend — eingelöste Codes werden nirgends
// gezählt. Deshalb manuell gepflegte Konstanten (ehrlich, solange Elias sie
// beim Vergeben von Zugängen nachzieht). V2 (vereinbart): Supabase-Tabelle
// `redemptions` → Zähler = TOTAL - count(*), dann automatisch echt.
//
// ZUM OFFIZIELLEN LAUNCH (Phase C): Route-Wrapper in App.tsx entfernen.
// ============================================================================

const ACCESS_CODES = ["rizq"];
const STORAGE_KEY = "amanah_early_access";
const UNLOCK_COUNTED_KEY = "amanah_unlock_counted";

// Live-Zähler ist echt (Tabelle founder_unlocks). Total wird von Elias gepflegt.
const FOUNDER_SPOTS_TOTAL = 100;

export const hasEarlyAccess = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

const persistAccess = () => {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* Safari-Privatmodus o. ä. — Freischaltung gilt dann nur für die Sitzung */
  }
};

const isValidCode = (code: string) => ACCESS_CODES.includes(code.trim().toLowerCase());

const gateContents = ["Halal Investment Guide", "Finanz-Tools & Rechner", "Gründervorteile & Begleitung"];

const AccessGate = () => {
  const navigate = useNavigate();

  const [unlocked, setUnlocked] = useState<boolean>(() => hasEarlyAccess());
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState(false);
  const [unlocksCount, setUnlocksCount] = useState<number | null>(null);

  // Zähler live aus Supabase (Fallback: 0 belegt = alle Plätze frei zeigen).
  useEffect(() => {
    let cancelled = false;
    supabase
      .rpc("count_founder_unlocks")
      .then(({ data, error: rpcError }) => {
        if (cancelled) return;
        if (rpcError || typeof data !== "number") {
          setUnlocksCount(0);
          return;
        }
        setUnlocksCount(data);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const spotsFree = Math.max(FOUNDER_SPOTS_TOTAL - (unlocksCount ?? 0), 0);

  // Jeder Browser zählt einmal: bei erfolgreicher Freischaltung wird genau eine
  // Zeile in founder_unlocks eingefügt und danach lokal geflaggt.
  const recordUnlockOnce = (source: string) => {
    try {
      if (localStorage.getItem(UNLOCK_COUNTED_KEY) === "1") return;
    } catch {
      /* privater Modus — dann zählt der Browser evtl. mehrfach, ok */
    }
    void supabase
      .from("founder_unlocks")
      .insert({ source })
      .then(({ error: insErr }) => {
        if (insErr) {
          console.warn("founder_unlocks insert failed", insErr.message);
          return;
        }
        try {
          localStorage.setItem(UNLOCK_COUNTED_KEY, "1");
        } catch {
          /* ignore */
        }
      });
  };



  const submitCode = (e: FormEvent) => {
    e.preventDefault();
    if (isValidCode(codeInput)) {
      persistAccess();
      recordUnlockOnce("code");
      setUnlocked(true);
      navigate("/early");
    } else {
      setError(true);
    }
  };

  if (unlocked) return <Outlet />;

  return (
    <div className="relative min-h-screen bg-[#0f281f] text-white flex flex-col overflow-hidden">
      {/* Ruhiger Marken-Hintergrund: Verlauf + warmes Licht, kein Foto */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_110%,#1a3d2e_0%,transparent_60%)]" />
        <div
          className="absolute -top-48 -left-48 h-[620px] w-[620px] rounded-full opacity-[0.12]"
          style={{ background: "radial-gradient(circle, hsl(43 70% 60%) 0%, transparent 65%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "repeating-linear-gradient(115deg, hsl(43 60% 70%) 0 1px, transparent 1px 90px)" }}
        />
      </div>

      <main className="relative flex-1 flex items-center justify-center px-6 sm:px-10 py-16">
        <div className="w-full max-w-[560px] mx-auto flex flex-col items-center text-center">
          <img
            src={logoMark}
            alt="Amanah Investment"
            className="h-9 md:h-10 w-auto brightness-0 invert opacity-95 select-none"
            draggable={false}
          />

          {/* EINE Kernaussage — kein Erklärabsatz */}
          <h1 className="headline text-white mt-10 text-[36px] sm:text-[46px] leading-[1.05]">
            Bald ist es <span className="text-gold">so weit.</span>
          </h1>

          {/* Herzstück: der Code-Block */}
          <form
            onSubmit={submitCode}
            className="mt-10 w-full rounded-[1.5rem] bg-white/[0.06] backdrop-blur-sm border border-gold/25 p-7 md:p-10 shadow-[0_40px_100px_-45px_rgba(0,0,0,0.9)]"
          >
            {/* Platz-Zähler mit ruhigem Live-Puls (Gold, nie rot) */}
            <div className="flex items-center justify-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-60 animate-ping [animation-duration:2.4s]" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
              </span>
              <span className="text-[13px] font-semibold text-white/85 tabular-nums">
                Noch {spotsFree} von {FOUNDER_SPOTS_TOTAL} Gründerplätzen frei
              </span>
            </div>

            <h2 className="headline text-white text-[24px] md:text-[28px] leading-tight mt-5">
              Du hast einen Zugangscode?
            </h2>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <input
                id="access-code"
                type="text"
                autoComplete="off"
                value={codeInput}
                onChange={(e) => {
                  setCodeInput(e.target.value);
                  setError(false);
                }}
                placeholder="Code eingeben"
                className="flex-1 min-w-0 rounded-full bg-white/[0.08] border border-white/20 px-6 py-3.5 text-[16px] text-white text-center sm:text-left placeholder:text-white/35 outline-none focus:border-gold/70 transition-colors"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-gold text-[hsl(158_42%_12%)] px-7 py-3.5 text-[15px] font-bold hover:bg-white transition-colors shadow-[0_14px_40px_-12px_rgba(232,175,60,0.55)]"
              >
                Öffnen
              </button>
            </div>
            {error && (
              <p className="mt-3 text-[13px] text-white/55">
                Dieser Code ist nicht gültig — den aktuellen bekommst du über Instagram.
              </p>
            )}
          </form>

          {/* Sekundär: noch keinen Code? */}
          <div className="mt-6 flex items-start justify-center gap-3 text-[13.5px] text-white/55 leading-relaxed max-w-md">
            <Instagram className="h-4 w-4 mt-0.5 text-gold/80 shrink-0" />
            <p className="text-left">
              Du hast noch keinen Code? Schreib mir <span className="font-semibold text-white/85">GRÜNDER</span> auf{" "}
              <a
                href="https://www.instagram.com/amanahinvest.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white/85 underline underline-offset-4 decoration-gold/50 hover:text-gold transition-colors"
              >
                Instagram
              </a>
              .
            </p>
          </div>

          {/* Ganz unten, klein: die drei gesperrten Vorteile */}
          <ul className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-7">
            {gateContents.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[12.5px] text-white/45">
                <Lock className="h-3 w-3 text-gold/70 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer className="relative py-6 text-center">
        <div className="flex justify-center gap-6 text-[12px] text-white/45">
          <Link to="/impressum" className="hover:text-white/75 transition-colors">
            Impressum
          </Link>
          <Link to="/datenschutz" className="hover:text-white/75 transition-colors">
            Datenschutz
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default AccessGate;
