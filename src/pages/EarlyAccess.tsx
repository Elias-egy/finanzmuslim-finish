import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

import {
  ArrowLeft,
  ArrowRight,
  BookLock,
  ChevronLeft,
  ChevronRight,
  Download,
  LockOpen,
  Mail,
  MessageCircle,
  PenLine,
  Play,
  Star,
  X,
} from "lucide-react";
import logoMark from "@/assets/logo-mark.png";
import { supabase } from "@/integrations/supabase/client";
import { FounderVideo } from "@/components/FounderVideo";

// ============================================================================
// GRÜNDERZUGANG (/early) — Vorteile als Snap-Karussell statt vertikaler Blöcke
// (Elias 17.7.). Dramaturgie: Ankommen → „Entdecke deine Vorteile" (3 Slides:
// Support / Quiz-Einstieg / Guide-Ausblick) → Quiz als Vollbild-Flow →
// Kapitel 0 als Belohnung → finaler CTA Depot.
//
// KARUSSELL-MECHANIK (bewusst so): KEIN freies Swipen — immer genau ein Slide
// pro Geste. Snap-Threshold 45% der Breite, darunter schnappt es zurück.
// Achsen-Lock: erst ab 10px wird entschieden, ob die Geste horizontal (Slide-
// Wechsel) oder vertikal (Lesen/Scrollen) ist — kein Konflikt auf Mobil.
// Shine-Effekt läuft EINMAL bei Aktivierung/Hover, nie im Loop (index.css).
//
// PERSISTENZ-STATUS: Mockup. Quiz-Antworten landen NUR in localStorage
// (amanah_founder_quiz_answers) — keine Datenbank, keine Übermittlung.
// V2 (vereinbart 17.7.): Supabase über Lovable — Antworten + Support-Slots
// echt zählen. Die localStorage-Struktur ist dafür vorbereitet.
//
// KAPITEL 0: Übergangslösung on-page. Geplant (Elias 17.7.): PDF-Download
// statt offenem Inhalt — kommt zusammen mit der Guide-Überarbeitung.
//
// KNAPPHEIT: Slot-Zahlen sind manuell gepflegte Konstanten (stabil über
// Reloads, kein Zufall). Ehrlich, solange Elias sie wöchentlich nachzieht.
//
// TODO (Elias): Begrüßungsvideo (30–60 Sek) → EARLY_VIDEO_YOUTUBE_ID.
// HINWEIS: Quiz-Fragen v1 = Provisorium (Elias noch nicht 100% überzeugt).
// ============================================================================

const EARLY_VIDEO_YOUTUBE_ID: string | null = null;

const SUPPORT_MAIL =
  "mailto:elias@amanah-invest.de?subject=Gr%C3%BCnderzugang%20%E2%80%93%20meine%20Situation&body=Assalamu%20alaikum%20Elias%2C%0A%0Akurz%20zu%20meiner%20Situation%3A%0A%0A";

// Manuell pflegen (wöchentlich), bis Supabase dran ist:
const SUPPORT_SLOTS_WEEK_TOTAL = 10;
const SUPPORT_SLOTS_WEEK_TAKEN = 2;

const QUIZ_DONE_KEY = "amanah_founder_quiz_done";
const QUIZ_ANSWERS_KEY = "amanah_founder_quiz_answers";

// Gedeckte „Diagramm"-Akzente nur fürs Quiz (kontrolliert, keine Signalfarben)
const QUIZ_ACCENTS = ["#b3593f", "#2f6f6a", "#5f7d54", "#b98a2f", "#7d5f86"];

type QuizQuestion = { id: string; label: string; q: string; options: string[] };

const QUIZ: QuizQuestion[] = [
  {
    id: "benefit",
    label: "Dein wichtigster Vorteil",
    q: "Was ist für dich der wichtigste Vorteil am Gründerbereich?",
    options: [
      "Persönlicher Support: dir direkt Fragen stellen können",
      "Früher Zugang zu neuen Infos und Inhalten",
      "Schneller ins Investieren kommen, mit klarer Anleitung",
      "Mitentscheiden, was als Nächstes gebaut wird",
    ],
  },
  {
    id: "objection",
    label: "Was dich aufgehalten hat",
    q: "Was hat dich bisher am meisten aufgehalten?",
    options: [
      "Ich habe keine echten halal Alternativen gefunden",
      "Zu viele widersprüchliche Meinungen, wem glauben?",
      "Die Angst, unwissentlich etwas Falsches zu tun",
      "Ich wusste nicht, wo ich anfangen soll",
      "Ehrlich: Ich bin noch skeptisch, ob halal investieren wirklich geht",
    ],
  },
  {
    id: "content",
    label: "Dein Content",
    q: "Welcher Content bringt dir persönlich am meisten?",
    options: [
      "Klare Urteile: Was ist haram, was ist halal",
      "Schritt-für-Schritt-Anleitungen (Depot, Sparplan)",
      "Rizq & Islam: der spirituelle Blick auf Geld",
      "Produkt-Checks: ETFs, Gold, Krypto im Halal-Check",
    ],
  },
  {
    id: "stage",
    label: "Wo du stehst",
    q: "Wo stehst du gerade beim Investieren?",
    options: [
      "Noch gar nicht, ich will sauber starten",
      "Angefangen, aber unsicher, ob alles halal ist",
      "Ich investiere schon halal, will aber tiefer rein",
      "Hatte investiert und aus Zweifeln aufgehört",
    ],
  },
];

// Mitgestaltungs-Umfrage: zwei Fragen, keine Punkte, kein Ergebnis-Screen.
type MitQuestion = { q: string; options: string[] };
const MIT_SURVEY: MitQuestion[] = [
  {
    q: "Worüber soll sich der nächste Wissensblock drehen?",
    options: [
      "Hauskauf als Muslim",
      "Versicherungen aus islamischer Sicht",
      "Auto als Muslim: Leasing, Miete und Co.",
      "Darf ich als Muslim eine Kreditkarte verwenden?",
    ],
  },
  {
    q: "Welches Tool würde dir am meisten helfen?",
    options: [
      "Zakat-Rechner",
      "Aktienbereinigungs-Rechner",
      "Budget-Planer (Einnahmen und Ausgaben im Blick)",
    ],
  },
];

// Kapitel 0 — Inhalte (Textstand: AI_HANDOFF/INBOX/2026-07-17_VERTRAGSKOMPASS_TEXTENTWURF.md)
// HINWEIS (19.7.): Diese acht Situationen werden NICHT mehr on-page gerendert,
// sondern liegen als PDF-Download (public/vertragskompass-kapitel0.pdf) vor.
// Das Array bleibt als kanonische Textquelle für die PDF-Erzeugung erhalten.
const kompassSituationen = [
  {
    title: "Mietvertrag, Leasing & Auto-Abo",
    absaetze: [
      "Bei einer Wohnung ist es leicht zu verstehen: Du zahlst eine feste Miete für die Nutzung. Strom, Wasser oder Schäden durch deine Nutzung zahlst du selbst. Die grundlegende Verantwortung für das Eigentum bleibt beim Vermieter.",
      "Beim klassischen Autoleasing sieht es anders aus: Neben der Leasingrate musst du meist selbst Versicherung, Wartung und weitere Risiken des Fahrzeugs tragen. Du zahlst also nicht nur für die Nutzung, sondern übernimmst Pflichten des Eigentümers. Deshalb ist klassisches Leasing aus der hier zugrunde gelegten islamischen Bewertung nicht erlaubt.",
      "Ein Auto-Abo kann näher an einer echten Miete liegen: Du zahlst eine monatliche Gesamtrate; Versicherung, Steuer und Wartung sind häufig bereits enthalten und werden nicht als eigene Verträge oder einzelne Zahlungen auf dich übertragen. Das macht ein Auto-Abo nicht automatisch halal, aber zu einer prüfenswerten Alternative.",
    ],
    frage: "Zahle ich eine Gesamtrate für die Nutzung, oder zusätzlich Versicherung, Wartung und andere Pflichten des Eigentümers?",
  },
  {
    title: "Autofinanzierung & 0-Prozent-Finanzierung",
    absaetze: [
      "Stehen in deinem Autovertrag du, der Händler und eine Bank, handelt es sich meist nicht um einen einfachen Ratenkauf. Auch „0 % Zinsen für dich“ reicht nicht: Zahlt der Händler wegen deiner Finanzierung Geld oder Zinsen an die Bank, bleibt die Bank Teil des Geschäfts. Zusätzliche Bearbeitungs-, Abschluss- oder Finanzierungskosten können außerdem ein versteckter Preis für die spätere Zahlung sein.",
      "Eine echte Ratenzahlung direkt an den Verkäufer ist etwas anderes: Ein fester Kaufpreis wird von Anfang an vereinbart und anschließend in festen Raten bezahlt, ohne Bank, nachträgliche Zinsen oder Verzugszinsen. Nach unserem aktuellen Kenntnisstand gibt es in Deutschland noch keine allgemein anerkannte halal-zertifizierte Autofinanzierung. Die praktisch klarste Lösung bleibt deshalb häufig: länger sparen und einen bezahlbaren Gebrauchtwagen direkt kaufen.",
    ],
    frage: "Kaufe ich direkt beim Verkäufer in festen Raten, oder steckt eine Bank, ein Finanzierungsaufschlag oder eine Zinsklausel im Vertrag?",
  },
  {
    title: "Kreditkarte, Debitkarte & „Später zahlen“",
    absaetze: [
      "Eine Kreditkarte ist nicht erst dann problematisch, wenn du wirklich Zinsen zahlst. Steht im Vertrag, dass bei Teilzahlung oder ausbleibender Rückzahlung Zinsen entstehen können, unterschreibst du bereits einen Vertrag mit Zinsklausel, selbst wenn du immer pünktlich zahlen möchtest.",
      "Nutze stattdessen eine Debitkarte: Der Betrag wird direkt von deinem Girokonto abgebucht und du verwendest nur dein vorhandenes Guthaben. Prüfe bei Klarna, PayPal „Später bezahlen“ und ähnlichen Diensten ebenfalls, ob bei Ratenzahlung oder Verzug Zinsen entstehen können.",
    ],
    frage: "Ist es wirklich eine Debitkarte ohne Kreditrahmen, und enthält keine Zahlungsoption eine Zinsklausel?",
  },
  {
    title: "Girokonto, Dispo & Tagesgeld",
    absaetze: [
      "Ein verzinstes Tagesgeldkonto zahlt dir garantierte Zinsen auf dein Guthaben. Genau deshalb solltest du einen solchen Vertrag nicht abschließen. Verwende für deinen Alltag stattdessen ein unverzinstes Girokonto.",
      "Doch auch beim Girokonto musst du den Dispo prüfen, also den vollständigen Dispositionskredit. Ist er aktiviert, kann eine Zahlung trotz fehlendem Guthaben ausgeführt werden. Dein Konto rutscht ins Minus und die Bank verlangt Zinsen auf den geliehenen Betrag. Lass Dispo und geduldete Überziehung vollständig sperren, damit Zahlungen unter null Euro abgelehnt werden.",
    ],
    frage: "Sind Dispo und geduldete Überziehung beide gesperrt, sodass mein Konto niemals ins Minus gehen kann?",
  },
  {
    title: "Kranken-, Kfz- & freiwillige Versicherungen",
    absaetze: [
      "Bei einer konventionellen Versicherung zahlst du Beiträge, weißt aber nicht, ob und wie viel die Versicherung später leistet. Diese große Unsicherheit heißt Gharar und macht konventionelle Versicherungen nach der hier zugrunde gelegten Mehrheitsmeinung grundsätzlich nicht erlaubt.",
      "Entscheidend ist deshalb der konkrete Grund: Die Krankenversicherung ist gesetzlich vorgeschrieben. Die Kfz-Haftpflicht brauchst du zwingend, wenn du ein Auto zulassen und fahren möchtest. Eine Berufshaftpflicht kann Voraussetzung sein, um einen bestimmten Beruf auszuüben. Solche Fälle werden anders bewertet als freiwillige Versicherungen wie Vollkasko, Teilkasko, Hausrat oder Rechtsschutz, die du allein für zusätzlichen Schutz abschließt.",
      "Bei einer echten Notwendigkeit, zum Beispiel wenn ein großes finanzielles Risiko deine Familie oder dein Unternehmen existenziell bedroht, ist die Antwort nicht immer schwarz oder weiß. Dann muss der konkrete Fall fachkundig geprüft werden.",
    ],
    frage: "Ist die Versicherung gesetzlich Pflicht, zwingende Voraussetzung für ein notwendiges Ziel, oder nur freiwilliger Zusatzschutz?",
  },
  {
    title: "Altersvorsorge",
    absaetze: [
      "Klassische private Rentenversicherungen, Riester- oder Rürup-Verträge arbeiten häufig mit Garantien und verzinsten Anlagen. Doch auch eine fondsgebundene Rentenversicherung wird nicht halal, nur weil du innerhalb des Vertrags halal ausgewählte ETFs besparst. Bleibt eine garantierte Rentenoption, garantierte Auszahlung oder andere Zinskomponente Bestandteil des Vertrags, ist bereits die Unterschrift problematisch.",
      "Nach unserem aktuellen Kenntnisstand gibt es in Deutschland noch kein allgemein anerkanntes halal-zertifiziertes Altersvorsorgeprodukt dieser Art. Prüfe deshalb nicht nur den Fondsnamen, sondern den gesamten Vertrag. Ein freier ETF-Sparplan außerhalb einer Rentenversicherung ist davon zu unterscheiden: Er enthält nicht automatisch eine garantierte Rentenoption, muss aber selbst halal aufgebaut sein.",
    ],
    frage: "Enthält mein Altersvorsorgevertrag irgendeine Garantie, Rentenoption oder verzinste Anlage?",
  },
  {
    title: "Bausparvertrag & Baufinanzierung",
    absaetze: [
      "Beim klassischen Bausparvertrag bekommst du zuerst Guthabenzinsen und zahlst später Darlehenszinsen. Bei einer normalen Baufinanzierung leiht dir die Bank Geld und verlangt für die Laufzeit Zinsen. Beide Modelle sind deshalb keine halal Lösung.",
      "Auch Anbieter mit Begriffen wie „islamische“ oder „halale Baufinanzierung“ sind nicht automatisch zweifelsfrei. Nach unserem aktuellen Kenntnisstand gibt es in Deutschland noch keine allgemein anerkannte halal-zertifizierte Baufinanzierung; mehrere beworbene Modelle werden von deutschen Gelehrten kritisch beurteilt. Verlass dich deshalb nie nur auf das Halal-Label des Anbieters.",
      "Bleib geduldig und standhaft. Je mehr Muslime echte Alternativen ohne Zinsen und problematische Vertragskonstruktionen verlangen, desto eher können seriöse Lösungen entstehen.",
    ],
    frage: "Ist dieses konkrete Modell unabhängig geprüft und anerkannt, oder nennt nur der Anbieter sein eigenes Produkt halal?",
  },
  {
    title: "Vermögenswirksame Leistungen",
    absaetze: [
      "Ein Zuschuss deines Arbeitgebers ist grundsätzlich nicht das Problem. Entscheidend ist die Bedingung: Vermögenswirksame Leistungen bekommst du nicht immer frei ausgezahlt, sondern häufig nur, wenn das Geld in einen vorgegebenen Vertrag fließt, etwa einen Bausparvertrag oder ein Altersvorsorgeprodukt.",
      "Wie die vorherigen Beispiele zeigen, können genau diese Verträge Zinsen, Garantien oder andere problematische Bestandteile enthalten. Geld zu bekommen ist nicht haram. Geld aber nur unter der Voraussetzung anzunehmen, dass du es in einen nicht erlaubten Vertrag einzahlst, macht diese konkrete Leistung für dich nicht nutzbar.",
      "Uns ist derzeit kein allgemein verfügbares Angebot bekannt, bei dem vermögenswirksame Leistungen direkt in einen halal aufgebauten ETF-Sparplan fließen. Falls dein Arbeitgeber oder Anbieter eine solche Möglichkeit anbietet, prüfe den gesamten Vertrag und das konkrete Investment fachkundig. Gibt es nur Bausparen, Rentenversicherung oder andere der oben genannten Vertragsarten, solltest du diese Leistung nicht nutzen.",
    ],
    frage: "Bekomme ich den Arbeitgeberzuschuss frei, oder nur unter der Bedingung, einen problematischen Spar-, Bauspar- oder Altersvorsorgevertrag abzuschließen?",
  },
];

const unterschriftFragen = [
  { lead: "Miete oder Leasing", text: "Zahle ich nur eine Gesamtrate für die Nutzung, oder zusätzlich Versicherung, Wartung und Eigentümerpflichten?" },
  { lead: "Auto oder Ratenkauf", text: "Steckt eine Bank, ein Finanzierungsaufschlag oder eine Zinsklausel im Vertrag?" },
  { lead: "Kreditkarte", text: "Kann mich der Vertrag irgendwann zu Zinsen verpflichten, selbst wenn ich immer pünktlich zahlen will?" },
  { lead: "Girokonto", text: "Sind Dispo und geduldete Überziehung vollständig gesperrt?" },
  { lead: "Versicherung", text: "Ist sie Pflicht, Voraussetzung für etwas Notwendiges oder nur freiwilliger Zusatzschutz?" },
  { lead: "Altersvorsorge", text: "Enthält sie Garantien, Rentenoptionen oder verzinste Anlagen?" },
  { lead: "Halal-Label", text: "Hat eine unabhängige fachkundige Stelle genau diesen Vertrag geprüft, oder wirbt nur der Anbieter damit?" },
  { lead: "Arbeitgeberzuschuss", text: "Bekomme ich ihn frei, oder nur, wenn ich damit einen problematischen Vertrag bespare?" },
];

const SLIDE_COUNT = 3;

const EarlyAccess = () => {
  const [quizStep, setQuizStep] = useState(-1); // -1 aus, 0..3 Fragen, 4 Feedback-Screen, 5 fertig
  const [mitStep, setMitStep] = useState(-1); // -1 aus, 0..1 Fragen, 2 Danke-Screen
  const [mitAnswers, setMitAnswers] = useState<Record<number, string>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [customOpen, setCustomOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackHover, setFeedbackHover] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(QUIZ_DONE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const chapterRef = useRef<HTMLDivElement>(null);

  // ---- Karussell (Transform + Touch-Drag: echtes Wischen, sauberes Einrasten) --
  // Jede Karte ist 86% breit, die aktive sitzt zentriert (7% Rand je Seite), die
  // Nachbarkarten lugen hervor. Beim Loslassen rastet immer genau eine Karte ein.
  const [active, setActive] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hinted, setHinted] = useState(false); // true, sobald der Nutzer selbst wischt
  const viewportRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, startY: 0, axis: null as "x" | "y" | null, width: 1, lastDx: 0 });
  const wasDragged = useRef(false);

  const goTo = (i: number) => setActive(Math.min(Math.max(i, 0), SLIDE_COUNT - 1));

  const onPointerDown = (e: ReactPointerEvent) => {
    setHinted(true);
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      axis: null,
      width: viewportRef.current?.offsetWidth ?? 1,
      lastDx: 0,
    };
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (e.pointerType === "mouse" && e.buttons === 0) return;
    const d = drag.current;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    // Achsen-Lock: vertikales Lesen/Scrollen darf keinen Kartenwechsel auslösen
    if (!d.axis) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 10) return;
      d.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (d.axis === "x") {
        setDragging(true);
        wasDragged.current = true;
        viewportRef.current?.setPointerCapture?.(e.pointerId);
      }
    }
    if (d.axis !== "x") return;
    // Am Rand nur gedämpft mitziehen (dort gibt es kein „weiter")
    const atEdge = (active === 0 && dx > 0) || (active === SLIDE_COUNT - 1 && dx < 0);
    d.lastDx = atEdge ? dx * 0.3 : dx;
    setDragX(d.lastDx);
  };

  // Beendet JEDE Wischgeste sauber und rastet auf genau einer Karte ein.
  // Wird von pointerup/-cancel/-leave UND lostpointercapture ausgelöst: Wenn der
  // Browser die Geste fürs vertikale Scrollen übernimmt (touch-action pan-y),
  // kommt KEIN pointerup, sondern lostpointercapture — sonst bliebe die Karte
  // zwischen zwei Slides eingefroren, bis man erneut wischt.
  const endDrag = () => {
    const d = drag.current;
    // Idempotent: nichts zu tun, wenn gar keine Geste offen ist (Doppel-Events)
    if (d.axis === null && !dragging && dragX === 0) return;
    // Schon eine leichte Wischbewegung (20% der Breite) wechselt die Karte
    if (d.axis === "x" && Math.abs(d.lastDx) > d.width * 0.2) {
      goTo(active + (d.lastDx < 0 ? 1 : -1));
    }
    d.axis = null;
    d.lastDx = 0;
    setDragX(0);
    setDragging(false);
  };

  const onCarouselKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") goTo(active + 1);
    if (e.key === "ArrowLeft") goTo(active - 1);
  };

  // Verhindert, dass nach einer Wischgeste noch ein Klick auf einen CTA durchschlägt
  const suppressClickAfterDrag = (e: ReactMouseEvent) => {
    if (wasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      wasDragged.current = false;
    }
  };

  // Einmaliger Wisch-Hinweis: die Karten kurz nach links anstupsen und zurück.
  // Beide Timer werden im Cleanup gelöscht — sonst könnte der Rücksetz-Timer
  // während einer echten Nutzer-Wischgeste feuern und dragX verstellen.
  useEffect(() => {
    if (hinted) return;
    let inner = 0;
    const outer = window.setTimeout(() => {
      setDragX((x) => (x === 0 ? -34 : x));
      inner = window.setTimeout(() => setDragX((x) => (x === -34 ? 0 : x)), 470);
    }, 1100);
    return () => {
      window.clearTimeout(outer);
      window.clearTimeout(inner);
    };
  }, [hinted]);

  // ---- Quiz (Vollbild-Flow) ------------------------------------------------
  const quizOpen = quizStep >= 0;
  const mitOpen = mitStep >= 0;

  useEffect(() => {
    document.body.style.overflow = quizOpen || mitOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [quizOpen, mitOpen]);

  const answerMit = (value: string) => {
    const step = mitStep;
    const nextAnswers = { ...mitAnswers, [step]: value };
    setMitAnswers(nextAnswers);
    if (step >= MIT_SURVEY.length - 1) {
      // Beide Antworten persistieren (Fire-and-Forget)
      MIT_SURVEY.forEach((entry, i) => {
        const answer = nextAnswers[i];
        if (!answer) return;
        void supabase
          .from("mitgestaltung_answers")
          .insert({ question: entry.q, answer })
          .then(({ error }) => {
            if (error) console.warn("mitgestaltung insert failed", error.message);
          });
      });
      setMitStep(MIT_SURVEY.length); // Danke-Screen
    } else {
      setMitStep(step + 1);
    }
  };

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const answerQuestion = (value: string) => {
    setAnswers((a) => ({ ...a, [QUIZ[quizStep].id]: value }));
    setCustomOpen(false);
    setCustomText("");
    setQuizStep((s) => s + 1);
  };

  const submitFeedback = () => {
    const text = feedbackText.trim();
    const rating = feedbackRating > 0 ? feedbackRating : null;
    // Nur speichern, wenn tatsächlich etwas eingegeben wurde
    if (rating !== null || text.length > 0) {
      void supabase
        .from("quiz_feedback")
        .insert({ rating, feedback: text || null })
        .then(({ error }) => {
          if (error) console.warn("quiz_feedback insert failed", error.message);
        });
    }
    unlockChapter();
  };

  const skipFeedback = () => {
    unlockChapter();
  };

  const unlockChapter = () => {
    try {
      localStorage.setItem(QUIZ_DONE_KEY, "1");
      localStorage.setItem(QUIZ_ANSWERS_KEY, JSON.stringify({ ...answers, ts: new Date().toISOString() }));
    } catch {
      /* Freischaltung gilt dann nur für diese Sitzung */
    }
    // Antworten aus den vier Multiple-Choice-Fragen weiterhin persistieren
    void supabase
      .from("quiz_answers")
      .insert({
        benefit: answers.benefit ?? null,
        objection: answers.objection ?? null,
        content: answers.content ?? null,
        stage: answers.stage ?? null,
        question: null,
      })
      .then(({ error }) => {
        if (error) console.warn("quiz_answers insert failed", error.message);
      });
    setUnlocked(true);
    setQuizStep(5);
  };

  const appendTag = (tag: string) => {
    setFeedbackText((prev) => {
      const trimmed = prev.trimEnd();
      if (!trimmed) return tag;
      const sep = /[.!?]$/.test(trimmed) ? " " : ". ";
      return `${trimmed}${sep}${tag}`;
    });
  };

  const closeQuizToChapter = () => {
    setQuizStep(-1);
    setTimeout(() => chapterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  };

  const scrollToChapter = () =>
    chapterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const slotsFree = Math.max(SUPPORT_SLOTS_WEEK_TOTAL - SUPPORT_SLOTS_WEEK_TAKEN, 0);
  const progress = quizStep < 0 ? 0 : Math.min((quizStep / (QUIZ.length + 1)) * 100, 100);

  // Shine nur auf der aktiven Karte, einmalig beim Aktivwerden (key erzwingt Remount)
  const shine = (i: number) =>
    i === active ? (
      <>
        <div key={`shine-${active}`} className="card-shine card-shine-enter" aria-hidden />
        <div className="card-shine card-shine-hover" aria-hidden />
      </>
    ) : null;

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Amanah Gründerzugang – Nur 100 Plätze frei"
        description="Sichere dir jetzt deinen Platz im Amanah Gründerzugang, bevor der reguläre Start beginnt."
        path="/early"
        noindex
      />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-nav/95 backdrop-blur-md border-b border-border/60">
        <div className="container flex items-center justify-between h-[64px] md:h-[68px]">
          <Link to="/" className="flex items-center" aria-label="Zur Startseite">
            <img src={logoMark} alt="Amanah Investment" className="h-7 md:h-8 w-auto object-contain select-none" draggable={false} />
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#143328] hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Startseite
          </Link>
        </div>
      </header>

      {/* S1 — Ankommen (kurz) */}
      <section className="relative overflow-hidden bg-[#143328] text-white">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 20%, hsl(40 70% 70%) 0, transparent 40%), radial-gradient(circle at 80% 80%, hsl(158 50% 60%) 0, transparent 45%)",
          }}
          aria-hidden
        />
        <div className="container relative pt-12 pb-12 md:pt-16 md:pb-14 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-gold">Gründerzugang</span>
          <h1 className="headline text-white mt-4 text-[34px] sm:text-[44px] md:text-[52px] leading-[1.05]">
            Du hast es <span className="text-gold">geschafft.</span>
          </h1>
          <p className="mt-4 text-[15px] md:text-[16.5px] text-white/70 leading-relaxed max-w-lg mx-auto">
            Du bist vor allen anderen drin. Was das bedeutet, erzähle ich dir am liebsten selbst:
          </p>
          <div className="mt-7 mx-auto w-full max-w-[560px]">
            <FounderVideo />
          </div>
        </div>
      </section>

      {/* S2 — Die Vorteile als Snap-Karussell */}
      <section className="bg-background py-16 md:py-24 overflow-hidden">
        <div className="container max-w-4xl">
          <div className="text-center">
            <span className="reveal text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-deep">
              Gründervorteile
            </span>
            <h2 className="reveal headline mt-4 text-[32px] sm:text-[40px] md:text-[48px] leading-[1.06]">
              Entdecke deine <span className="text-gold-deep">Vorteile.</span>
            </h2>
          </div>

          {/* Prominenter Fortschritt — fühlt sich an wie eine Belohnung, die näher rückt */}
          <div className="mt-9 md:mt-12 mb-6 flex flex-col items-center gap-2.5">
            <span className="text-[12px] font-bold uppercase tracking-[0.26em] text-gold-deep">
              Vorteil <span className="tabular-nums">{active + 1}</span> von {SLIDE_COUNT}
            </span>
            <div className="flex items-center gap-1.5" aria-hidden>
              {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i <= active ? "w-9 bg-gold shadow-[0_0_12px_rgba(232,175,60,0.6)]" : "w-4 bg-border"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Viewport: overflow-hidden; touch-action pan-y lässt vertikales Scrollen durch.
                Die Nachbarkarten lugen hervor, damit klar ist: da kommt noch mehr. */}
            <div
              ref={viewportRef}
              role="region"
              aria-roledescription="Karussell"
              aria-label="Gründervorteile"
              tabIndex={0}
              onKeyDown={onCarouselKey}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={endDrag}
              onLostPointerCapture={endDrag}
              onClickCapture={suppressClickAfterDrag}
              className="overflow-hidden rounded-[1.75rem] select-none cursor-grab active:cursor-grabbing outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
              style={{ touchAction: "pan-y" }}
            >
              <div
                className="flex items-stretch"
                style={{
                  transform: `translateX(calc(7% - ${active * 86}% + ${dragX}px))`,
                  transition: dragging ? "none" : "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* Slide 1 — Persönlicher Support (das Highlight) */}
                <div
                  className="shrink-0 w-[86%] px-1.5 transition-[opacity,transform] duration-500"
                  style={{ opacity: active === 0 ? 1 : 0.5, transform: `scale(${active === 0 ? 1 : 0.965})` }}
                >
                  <div className="founder-card group relative overflow-hidden h-full rounded-[1.75rem] bg-[#143328] text-white border border-gold/30 p-7 sm:p-10 md:p-14 text-center shadow-[0_45px_110px_-45px_rgba(20,51,40,0.85)]">
                    <div
                      className="absolute inset-0 opacity-[0.1] pointer-events-none"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 20% 15%, hsl(40 75% 68%) 0, transparent 42%), radial-gradient(circle at 85% 90%, hsl(158 50% 55%) 0, transparent 45%)",
                      }}
                      aria-hidden
                    />
                    {shine(0)}
                    <div className="relative">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
                        Das Gründer-Privileg
                      </span>
                      <h3 className="headline text-white mt-4 text-[30px] sm:text-[38px] md:text-[46px] leading-[1.05]">
                        Starte jetzt.
                        <br />
                        <span className="text-gold">Ich begleite dich.</span>
                      </h3>
                      <p className="mt-5 text-[15px] md:text-[16.5px] leading-[1.7] text-white/80 max-w-xl mx-auto">
                        Richte jetzt dein Depot ein und leg los. In der Gründerphase{" "}
                        <span className="font-semibold text-white">bin ich persönlich für dich da</span>{" "}
                        und gebe dir Hinweise, die zu deiner Situation passen.
                      </p>

                      {/* Echte Knappheit — manuell gepflegt, stabil, kein Zufall */}
                      <div className="mt-7 inline-flex flex-col items-center gap-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-60 animate-ping [animation-duration:2.4s]" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
                          </span>
                          <span className="text-[14px] font-semibold text-white/90 tabular-nums">
                            Diese Woche: noch {slotsFree}&nbsp;von {SUPPORT_SLOTS_WEEK_TOTAL}&nbsp;Support-Plätzen frei
                          </span>
                        </div>
                        <p className="text-[12.5px] text-white/55">
                          Ich kann nur wenige gleichzeitig begleiten. Deshalb sind die Plätze begrenzt.
                        </p>
                      </div>

                      {/* Haupt-CTA = Investmentstart (gold, oben). Mail ist die sekundäre Hilfe. */}
                      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                        <Link
                          to="/dein-investmentstart"
                          className="pill-btn w-full sm:w-auto bg-gold text-[hsl(158_42%_12%)] hover:bg-white text-[15px] font-bold shadow-[0_20px_50px_-15px_rgba(232,175,60,0.5)]"
                        >
                          Dein Investmentstart <ArrowRight className="h-4 w-4" />
                        </Link>
                        <a
                          href={SUPPORT_MAIL}
                          className="pill-btn w-full sm:w-auto bg-white/[0.08] border border-white/25 text-white hover:bg-white hover:text-[hsl(158_42%_15%)] text-[15px] font-bold"
                        >
                          <Mail className="h-4 w-4" /> Schreib mir deine Frage
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slide 2 — Quiz-Einstieg (nur Einstiegspunkt, Quiz läuft im Vollbild) */}
                <div
                  className="shrink-0 w-[86%] px-1.5 transition-[opacity,transform] duration-500"
                  style={{ opacity: active === 1 ? 1 : 0.5, transform: `scale(${active === 1 ? 1 : 0.965})` }}
                >
                  <div className="founder-card group relative overflow-hidden h-full rounded-[1.75rem] bg-card border border-border/70 p-7 sm:p-10 md:p-14 text-center shadow-[0_35px_90px_-45px_rgba(80,60,20,0.5)]">
                    <div
                      className="absolute inset-0 opacity-[0.55] pointer-events-none"
                      style={{ backgroundImage: "radial-gradient(circle at 75% 10%, hsl(40 75% 90%) 0, transparent 45%)" }}
                      aria-hidden
                    />
                    {shine(1)}
                    <div className="relative">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-deep">
                        Deine Belohnung
                      </span>
                      <h3 className="headline mt-4 text-[30px] sm:text-[38px] md:text-[44px] leading-[1.05]">
                        Das geheime Kapitel <span className="text-gold-deep">wartet.</span>
                      </h3>
                      <p className="mt-6 text-[15px] md:text-[16.5px] leading-[1.8] text-foreground/75 max-w-xl mx-auto">
                        Vier Fragen, 60 Sekunden. Deine Antworten zeigen mir, was ich als
                        Nächstes für dich aufbereiten soll. Dafür schalte ich dir{" "}
                        <span className="font-semibold text-foreground">Kapitel 0, den Vertragskompass</span>{" "}
                        frei. Dieses Kapitel steht in keinem Guide.
                      </p>

                      <div className="mt-7 mx-auto max-w-md rounded-[1.25rem] border border-gold/40 bg-background/70 p-5">
                        <div className="flex items-center justify-center gap-3 text-gold-deep">
                          {unlocked ? <LockOpen className="h-4.5 w-4.5" /> : <BookLock className="h-4.5 w-4.5" />}
                          <span className="text-[11.5px] font-bold uppercase tracking-[0.22em]">
                            Kapitel 0 · {unlocked ? "Freigeschaltet" : "Verschlossen"}
                          </span>
                        </div>
                        <p
                          className={`headline text-lg mt-2.5 select-none ${unlocked ? "" : "blur-[6px]"}`}
                          aria-hidden={!unlocked}
                        >
                          Der Vertragskompass: acht Situationen, die fast jeden betreffen
                        </p>
                      </div>

                      <div className="mt-8">
                        {unlocked ? (
                          <button
                            onClick={scrollToChapter}
                            className="pill-btn bg-gold-soft border border-gold/50 text-primary hover:bg-gold hover:text-[hsl(158_42%_12%)] text-[15px] font-bold"
                          >
                            <LockOpen className="h-4 w-4" /> Dein Kapitel ansehen
                          </button>
                        ) : (
                          <button
                            onClick={() => setQuizStep(0)}
                            className="pill-btn bg-gold text-[hsl(158_42%_12%)] hover:bg-gold-deep hover:text-white text-base font-bold shadow-[0_20px_50px_-15px_rgba(232,175,60,0.5)]"
                          >
                            Quiz starten, 60 Sekunden <ArrowRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slide 3 — Mitgestaltung (öffnet Kurz-Umfrage) */}
                <div
                  className="shrink-0 w-[86%] px-1.5 transition-[opacity,transform] duration-500"
                  style={{ opacity: active === 2 ? 1 : 0.5, transform: `scale(${active === 2 ? 1 : 0.965})` }}
                >
                  <button
                    type="button"
                    onClick={() => setMitStep(0)}
                    className="founder-card group relative overflow-hidden h-full w-full rounded-[1.75rem] bg-card border border-border/70 p-7 sm:p-10 md:p-14 text-center shadow-[0_35px_90px_-45px_rgba(80,60,20,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 transition-transform hover:-translate-y-0.5"
                  >
                    <div
                      className="absolute inset-0 opacity-[0.55] pointer-events-none"
                      style={{ backgroundImage: "radial-gradient(circle at 25% 90%, hsl(40 75% 90%) 0, transparent 45%)" }}
                      aria-hidden
                    />
                    {shine(2)}
                    <div className="relative">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-deep">
                        Deine Stimme
                      </span>
                      <h3 className="headline mt-4 text-[30px] sm:text-[38px] md:text-[44px] leading-[1.05]">
                        <span className="text-gold-deep">Mitgestaltung.</span>
                      </h3>
                      <p className="mt-6 text-[15px] md:text-[16.5px] leading-[1.8] text-foreground/75 max-w-xl mx-auto">
                        Gestalte Amanah von Anfang an mit. Als Pionier der ersten Stunde
                        hilfst du mir herauszufinden, was Muslime in Deutschland wirklich
                        brauchen.
                      </p>
                      <span className="pill-btn mt-8 bg-gold text-[hsl(158_42%_12%)] group-hover:bg-gold-deep group-hover:text-white text-[15px] font-bold shadow-[0_20px_50px_-15px_rgba(232,175,60,0.5)]">
                        Jetzt mitgestalten <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Pfeile seitlich (Desktop) */}
            <button
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Vorheriger Vorteil"
              className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-card border border-border shadow-[0_10px_30px_-10px_rgba(20,51,40,0.35)] text-foreground hover:border-gold/60 hover:text-gold-deep transition-all disabled:opacity-0 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => goTo(active + 1)}
              disabled={active === SLIDE_COUNT - 1}
              aria-label="Nächster Vorteil"
              className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-card border border-border shadow-[0_10px_30px_-10px_rgba(20,51,40,0.35)] text-foreground hover:border-gold/60 hover:text-gold-deep transition-all disabled:opacity-0 disabled:pointer-events-none"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation: Pfeile (mobil) + Dots + Position */}
          <div className="mt-7 flex items-center justify-center gap-5">
            <button
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Vorheriger Vorteil"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border text-foreground disabled:opacity-30 transition-opacity"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            <div className="flex items-center gap-2.5">
              {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Vorteil ${i + 1} anzeigen`}
                  aria-current={i === active}
                  className={`h-2 rounded-full transition-all duration-400 ${
                    i === active ? "w-7 bg-gold" : "w-2 bg-border hover:bg-gold/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => goTo(active + 1)}
              disabled={active === SLIDE_COUNT - 1}
              aria-label="Nächster Vorteil"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border text-foreground disabled:opacity-30 transition-opacity"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Einmaliger Wisch-Hinweis, verschwindet sobald der Nutzer wischt */}
          {!hinted && (
            <p className="md:hidden mt-4 text-center text-[12.5px] font-medium text-gold-deep/70 animate-pulse">
              Wische für deine weiteren Vorteile
            </p>
          )}
        </div>
      </section>

      {/* Quiz — eigener Vollbild-Flow, bewusst außerhalb der Slideshow */}
      {quizOpen && (
        <div className="fixed inset-0 z-[70] bg-background overflow-y-auto">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border/60">
            <div className="container max-w-2xl flex items-center gap-4 h-[60px]">
              {quizStep < 5 ? (
                <>
                  <div className="h-[3px] flex-1 rounded-full bg-border/70 overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-semibold text-muted-foreground tabular-nums shrink-0">
                    {Math.min(quizStep + 1, QUIZ.length + 1)} / {QUIZ.length + 1}
                  </span>
                </>
              ) : (
                <span className="text-[12px] font-bold uppercase tracking-[0.22em] text-gold-deep">Gründer-Quiz</span>
              )}
              <button
                onClick={() => setQuizStep(-1)}
                aria-label="Quiz schließen"
                className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-gold/50 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="container max-w-2xl py-10 md:py-16">
            {quizStep < QUIZ.length && (
              <div key={quizStep} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-deep">
                  {QUIZ[quizStep].label}
                </span>
                <h3 className="headline text-2xl md:text-3xl mt-3 leading-snug">{QUIZ[quizStep].q}</h3>
                <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {QUIZ[quizStep].options.map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => answerQuestion(opt)}
                      className="group flex items-center gap-3.5 rounded-2xl bg-card border border-border/70 px-5 py-4 text-left text-[15px] font-semibold text-foreground transition-all hover:border-gold/60 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-14px_rgba(20,51,40,0.3)]"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0 transition-transform group-hover:scale-125"
                        style={{ backgroundColor: QUIZ_ACCENTS[i % QUIZ_ACCENTS.length] }}
                        aria-hidden
                      />
                      {opt}
                    </button>
                  ))}
                  {!customOpen ? (
                    <button
                      onClick={() => setCustomOpen(true)}
                      className="flex items-center gap-3.5 rounded-2xl border border-dashed border-border px-5 py-4 text-left text-[15px] font-semibold text-muted-foreground transition-all hover:border-gold/60 hover:text-foreground"
                    >
                      <PenLine className="h-4 w-4 shrink-0 text-gold-deep" />
                      Eigene Antwort
                    </button>
                  ) : (
                    <div className="sm:col-span-2 rounded-2xl bg-card border border-gold/50 p-4">
                      <textarea
                        autoFocus
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="Deine Antwort …"
                        rows={2}
                        className="w-full resize-none bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/60 outline-none"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => customText.trim() && answerQuestion(customText.trim())}
                          disabled={!customText.trim()}
                          className="pill-btn bg-primary text-primary-foreground hover:bg-primary-glow text-[14px] font-bold px-5 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Weiter <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {quizStep === QUIZ.length && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-deep">
                  Zum Schluss
                </span>
                <h3 className="headline text-2xl md:text-3xl mt-3 leading-snug">
                  Was nimmst du bisher mit?
                </h3>
                <p className="mt-3 text-[14px] text-muted-foreground leading-relaxed">
                  Egal ob du gerade erst hier bist. Ein, zwei ehrliche Sätze helfen mir am meisten, und anderen, die noch zweifeln.
                </p>

                {/* Sterne-Bewertung */}
                <div className="mt-7">
                  <div className="text-[13px] font-semibold text-foreground">Wie ist dein erster Eindruck?</div>
                  <div
                    className="mt-3 flex items-center gap-2"
                    onMouseLeave={() => setFeedbackHover(0)}
                  >
                    {[1, 2, 3, 4, 5].map((n) => {
                      const active = (feedbackHover || feedbackRating) >= n;
                      return (
                        <button
                          key={n}
                          type="button"
                          aria-label={`${n} von 5 Sternen`}
                          onMouseEnter={() => setFeedbackHover(n)}
                          onFocus={() => setFeedbackHover(n)}
                          onBlur={() => setFeedbackHover(0)}
                          onClick={() => setFeedbackRating(n === feedbackRating ? 0 : n)}
                          className="p-1 transition-transform hover:scale-110 focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 transition-colors ${
                              active
                                ? "fill-gold text-gold drop-shadow-[0_0_12px_rgba(232,175,60,0.45)]"
                                : "text-muted-foreground/40"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick-Tags */}
                <div className="mt-7">
                  <div className="text-[12px] text-muted-foreground">
                    Tipp an, was passt, und schreib gern dazu warum.
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      "Endlich verständlich",
                      "Meine Fragen wurden beantwortet",
                      "Fühl mich sicherer beim Investieren",
                      "Genau das, was ich gesucht habe",
                      "Hat mir Klarheit gegeben",
                    ].map((tag) => {
                      const used = feedbackText.toLowerCase().includes(tag.toLowerCase());
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => appendTag(tag)}
                          className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
                            used
                              ? "bg-gold/10 border border-gold text-gold-deep"
                              : "bg-card border border-border/70 text-foreground/80 hover:border-gold/60 hover:text-foreground"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Textfeld */}
                <label className="mt-6 block text-[13px] font-semibold text-foreground">
                  Was hat dir hier am meisten geholfen? <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="z. B. Endlich verständlich erklärt, wie man als Muslim halal investiert. Meine Fragen wurden beantwortet und ich fühl mich sicherer loszulegen."
                  rows={4}
                  className="mt-2 w-full rounded-2xl bg-card border border-border/70 focus:border-gold/60 p-5 text-[15px] text-foreground placeholder:text-muted-foreground/50 outline-none resize-none transition-colors"
                />
                <p className="mt-3 text-[12px] text-muted-foreground/80 leading-relaxed">
                  Alles, was du hier schreibst, ist komplett anonym, ich sehe keinen Namen. Es kann aber öffentlich als Feedback verwendet oder geteilt werden.
                </p>

                <div className="mt-6 flex flex-col items-center gap-3">
                  <button
                    onClick={submitFeedback}
                    className="pill-btn bg-gold text-[hsl(158_42%_12%)] hover:bg-gold-deep hover:text-white text-[15px] font-bold w-full sm:w-auto"
                  >
                    Absenden & Kapitel freischalten <LockOpen className="h-4 w-4 ml-2" />
                  </button>
                  <button
                    onClick={skipFeedback}
                    className="text-[13px] text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                  >
                    Überspringen
                  </button>
                </div>
              </div>
            )}

            {/* Abschluss: Belohnung freigeschaltet. TODO (mit Guide-Überarbeitung):
                hier PDF-Download-Button statt Verweis auf den On-Page-Inhalt. */}
            {quizStep === 5 && (
              <div className="text-center py-10 animate-in fade-in zoom-in-95 duration-700">
                <span className="inline-flex items-center gap-2 rounded-full bg-gold-soft border border-gold/50 px-5 py-2 text-[12px] font-bold uppercase tracking-[0.2em] text-gold-deep shadow-[0_0_40px_-5px_rgba(232,175,60,0.4)]">
                  <LockOpen className="h-4 w-4" /> Deine Belohnung ist freigeschaltet
                </span>
                <h3 className="headline text-3xl md:text-4xl mt-6">Kapitel 0 gehört jetzt dir.</h3>
                <p className="mt-4 text-[15px] text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Danke. Deine Antworten fließen direkt in die Roadmap ein.
                </p>
                <button
                  onClick={closeQuizToChapter}
                  className="pill-btn mt-8 bg-gold text-[hsl(158_42%_12%)] hover:bg-gold-deep hover:text-white text-base font-bold shadow-[0_20px_50px_-15px_rgba(232,175,60,0.5)]"
                >
                  Zum Vertragskompass <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mitgestaltungs-Umfrage (2 Fragen, kein Ergebnis) */}
      {mitOpen && (
        <div className="fixed inset-0 z-[70] bg-background overflow-y-auto">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border/60">
            <div className="container max-w-2xl flex items-center gap-4 h-[60px]">
              {mitStep < MIT_SURVEY.length ? (
                <>
                  <div className="h-[3px] flex-1 rounded-full bg-border/70 overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${((mitStep + 1) / MIT_SURVEY.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-semibold text-muted-foreground tabular-nums shrink-0">
                    {mitStep + 1} / {MIT_SURVEY.length}
                  </span>
                </>
              ) : (
                <span className="text-[12px] font-bold uppercase tracking-[0.22em] text-gold-deep">
                  Mitgestaltung
                </span>
              )}
              <button
                onClick={() => setMitStep(-1)}
                aria-label="Umfrage schließen"
                className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-gold/50 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="container max-w-2xl py-10 md:py-16">
            {mitStep < MIT_SURVEY.length && (
              <div key={mitStep} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-deep">
                  Mitgestaltung
                </span>
                <h3 className="headline text-2xl md:text-3xl mt-3 leading-snug">
                  {MIT_SURVEY[mitStep].q}
                </h3>
                <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MIT_SURVEY[mitStep].options.map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => answerMit(opt)}
                      className="group flex items-center gap-3.5 rounded-2xl bg-card border border-border/70 px-5 py-4 text-left text-[15px] font-semibold text-foreground transition-all hover:border-gold/60 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-14px_rgba(20,51,40,0.3)]"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0 transition-transform group-hover:scale-125"
                        style={{ backgroundColor: QUIZ_ACCENTS[i % QUIZ_ACCENTS.length] }}
                        aria-hidden
                      />
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mitStep === MIT_SURVEY.length && (
              <div className="text-center py-10 animate-in fade-in zoom-in-95 duration-700">
                <span className="inline-flex items-center gap-2 rounded-full bg-gold-soft border border-gold/50 px-5 py-2 text-[12px] font-bold uppercase tracking-[0.2em] text-gold-deep shadow-[0_0_40px_-5px_rgba(232,175,60,0.4)]">
                  Danke für deine Mitgestaltung
                </span>
                <h3 className="headline text-3xl md:text-4xl mt-6">
                  Entdecke jetzt unser erstes Tool.
                </h3>
                <Link
                  to="/renditerechner"
                  className="pill-btn mt-8 bg-gold text-[hsl(158_42%_12%)] hover:bg-gold-deep hover:text-white text-base font-bold shadow-[0_20px_50px_-15px_rgba(232,175,60,0.5)]"
                >
                  Zum Renditerechner <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}


      {/* S4 — Kapitel 0 (Belohnung; Übergangslösung on-page bis zur PDF) */}
      {unlocked && (
        <section ref={chapterRef} className="bg-surface border-y border-border/60 py-16 md:py-24 scroll-mt-16">
          <div className="container max-w-3xl">
            <div className="mt-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-deep">
                Kapitel 0 · Nur für Gründer
              </span>
              <h2 className="headline text-3xl md:text-[42px] mt-3 leading-[1.1]">Der Vertragskompass</h2>
              <div className="mt-4 h-px w-16 bg-gold" aria-hidden />
              <p className="mt-6 text-muted-foreground leading-[1.8] text-[15.5px] md:text-[16.5px]">
                Im Guide geht es darum, wie du dein Vermögen halal aufbaust. Dieses
                Kapitel schützt die andere Seite: die Verträge, die du im Alltag
                unterschreibst. Acht Situationen, die fast jeden betreffen, und
                konkrete Fragen, mit denen du Warnzeichen schneller erkennst.
              </p>
            </div>

            {/* PDF-Download statt der acht Langtext-Blöcke (Elias 19.7.): Die
                vollständigen acht Situationen liegen als angenehm lesbares PDF vor;
                on-page bleibt darunter nur der kurze Fragen-Reminder. */}
            <div className="mt-10 rounded-[1.75rem] bg-card border border-border/70 p-7 md:p-9 text-center shadow-[0_20px_50px_-30px_rgba(80,60,20,0.3)]">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-soft/50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep">
                <BookLock className="h-3.5 w-3.5" /> Dein verstecktes Kapitel
              </span>
              <h3 className="headline text-2xl md:text-3xl mt-4">Alle acht Situationen als PDF</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed text-[15px] max-w-md mx-auto">
                Die acht Situationen mit allen Erklärungen haben wir dir gebündelt, angenehm
                lesbar auch auf dem Handy. Die Kurzfassung mit den Prüffragen findest du direkt
                darunter.
              </p>
              <a
                href="/vertragskompass-kapitel0.pdf"
                download
                className="pill-btn mt-6 bg-[#143328] text-white hover:bg-primary-glow text-base font-bold gap-2 shadow-[0_20px_50px_-18px_rgba(20,51,40,0.6)]"
              >
                <Download className="h-4 w-4" /> Verstecktes Kapitel als PDF laden
              </a>
            </div>

            <div className="mt-8 rounded-[1.75rem] bg-[#143328] text-white p-7 md:p-10">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                Zum Merken oder Screenshotten
              </span>
              <h3 className="headline text-white text-2xl md:text-3xl mt-3">8 Fragen vor jeder Unterschrift</h3>
              <ol className="mt-6 space-y-3.5">
                {unterschriftFragen.map((f, i) => (
                  <li key={i} className="flex gap-4 text-[14.5px] md:text-[15px] leading-relaxed text-white/85">
                    <span className="headline text-gold shrink-0 tabular-nums">{i + 1}.</span>
                    <span>
                      <span className="font-bold text-white">{f.lead}:</span> {f.text}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 rounded-2xl bg-gold-soft/60 border border-gold/40 p-6 md:p-7">
              <h4 className="headline text-base md:text-lg flex items-center gap-2">
                <MessageCircle className="h-4.5 w-4.5 text-gold-deep" /> Fachkundige Einschätzung
              </h4>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-foreground/80">
                Diese Beispiele geben dir eine Richtung, sind aber keine Fatwa für deinen
                einzelnen Vertrag. Ein Auto-Abo, eine Versicherung oder eine als halal
                beworbene Finanzierung kann je nach Anbieter anders aufgebaut sein. Bei
                hohen Summen, langen Laufzeiten, Notlagen oder Unsicherheit lass deshalb
                genau deinen Vertrag vor der Unterschrift von einer fachkundigen Person
                und einem vertrauenswürdigen Gelehrten prüfen.
              </p>
            </div>

            <p className="mt-10 text-[12px] leading-relaxed text-muted-foreground/80 text-center max-w-xl mx-auto">
              Dieses Kapitel dient ausschließlich der Bildung und ist keine Rechts-,
              Steuer- oder Anlageberatung und kein religiöses Gutachten. Prüfe Verträge
              im Zweifel mit fachkundiger Unterstützung.
            </p>
          </div>
        </section>
      )}

      {/* S5 — Finaler CTA */}
      <section className="relative overflow-hidden bg-[#143328] text-white py-20 md:py-28">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, hsl(40 70% 70%) 0, transparent 40%), radial-gradient(circle at 75% 85%, hsl(158 50% 60%) 0, transparent 45%)",
          }}
          aria-hidden
        />
        <div className="container relative max-w-2xl text-center">
          <h2 className="reveal headline text-white text-3xl md:text-[44px] leading-[1.06]">
            Deine Story endet nicht hier.
            <br />
            <span className="text-gold">Sie endet in deinem Depot.</span>
          </h2>
          <p className="reveal mt-5 text-white/75 leading-relaxed text-[15px] md:text-base max-w-lg mx-auto">
            10 Minuten, Schritt für Schritt im Video. Danach begleite ich dich mit deinem
            Gründer-Support persönlich weiter.
          </p>
          <div className="reveal mt-9">
            <Link
              to="/dein-investmentstart"
              className="pill-btn inline-flex bg-white text-[hsl(158_42%_15%)] hover:bg-gold text-base md:text-lg font-bold shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]"
            >
              Jetzt Depot eröffnen, ich führe dich durch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="reveal mt-5 text-[13px] text-white/50">
            Fragen vorab?{" "}
            <a href={SUPPORT_MAIL} className="underline underline-offset-2 decoration-gold/50 hover:text-gold transition-colors">
              Schreib mir. {slotsFree} Support-Plätze sind diese Woche frei.
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsl(220_20%_9%)] text-white/80 py-14">
        <div className="container flex flex-col items-center gap-4 text-center">
          <img src={logoMark} alt="Amanah Investment" className="h-10 w-auto brightness-0 invert opacity-90" />
          <div className="h-px w-16 bg-gold/60" />
          <p className="text-xs text-white/50 tracking-wide">© {new Date().getFullYear()} Amanah. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6 text-xs text-white/50">
            <Link to="/impressum" className="hover:text-white/80 transition-colors">
              Impressum
            </Link>
            <Link to="/datenschutz" className="hover:text-white/80 transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EarlyAccess;
