import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { captureSrc } from "@/lib/attribution";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import InvestmentStart from "./pages/InvestmentStart.tsx";
import HalalGuide from "./pages/HalalGuide.tsx";
import Impressum from "./pages/Impressum.tsx";
import Datenschutz from "./pages/Datenschutz.tsx";
import NotFound from "./pages/NotFound.tsx";
import DevGuideStage from "./pages/DevGuideStage.tsx";
import AccessGate from "./components/AccessGate.tsx";

// Lazy: haelt recharts (Renditerechner) aus dem Homepage-Bundle heraus.
const Tools = lazy(() => import("./pages/Tools.tsx"));
const Renditerechner = lazy(() => import("./pages/Renditerechner.tsx"));
const Zakatrechner = lazy(() => import("./pages/Zakatrechner.tsx"));
const WieIchGeldVerdiene = lazy(() => import("./pages/WieIchGeldVerdiene.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const EarlyAccess = lazy(() => import("./pages/EarlyAccess.tsx"));

const queryClient = new QueryClient();

const routeFallback = <div className="min-h-screen bg-background" aria-hidden />;

// F3: captured ?src auf jeder Route (nicht nur InvestmentStart), damit die
// Attributionskette Bio/DM -> Guide -> Investmentstart nicht reißt.
const SrcCapture = () => {
  const { search } = useLocation();
  useEffect(() => {
    captureSrc();
  }, [search]);
  return null;
};

// Bei jedem Routenwechsel oben starten — außer wenn ein Anker (#…) angesprungen wird.
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SrcCapture />
        <ScrollToTop />
        <Suspense fallback={routeFallback}>
          <Routes>
            {/* Öffentlich zugängliche Seiten (Launch: 23.7.26) */}
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/" element={<Index />} />
            <Route path="/dein-investmentstart" element={<InvestmentStart />} />
            <Route path="/dein-investment-start" element={<InvestmentStart />} key="is-alias" />
            <Route path="/halal-guide" element={<HalalGuide />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/renditerechner" element={<Renditerechner />} />
            <Route path="/zakat-rechner" element={<Zakatrechner />} />
            <Route path="/wie-ich-geld-verdiene" element={<WieIchGeldVerdiene />} />
            <Route path="/blog" element={<Blog />} />
            {/* Nur die Gründervorteile bleiben mit Code geschützt */}
            <Route element={<AccessGate />}>
              <Route path="/early" element={<EarlyAccess />} />
            </Route>
            {/* TEMP (Phase 2): isolierte Vorschau der Guide-Bühne — vor Live-Gang entfernen */}
            <Route path="/dev-guide-stage" element={<DevGuideStage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
