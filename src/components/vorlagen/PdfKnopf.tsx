import { Download } from "lucide-react";
import { FREEBIE_PDFS, type FreebiePdfWort } from "@/data/freebiePdfs";

type Props = { wort: FreebiePdfWort; className?: string };

/**
 * „Als PDF speichern“ im Kopf jedes Freebies (Vault `memory/guides-nur-pdf-freebies-seite-plus-pdf.md`). Im PDF selbst
 * steht an dieser Stelle nur die Adresse der Seite, der Knopf fällt weg (`.kein-druck`, `src/index.css`).
 */
const PdfKnopf = ({ wort, className = "" }: Props) => {
  const pdf = FREEBIE_PDFS[wort];
  return (
    <>
      <a
        href={pdf.datei}
        download={pdf.name}
        className={`kein-druck inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-primary px-4 text-[15px] font-bold text-primary-foreground hover:bg-primary/90 ${className}`}
      >
        <Download className="h-4 w-4 shrink-0" aria-hidden />
        Als PDF speichern
      </a>
      <p className={`nur-druck text-[13px] font-semibold text-muted-foreground ${className}`}>finanzmuslim.com</p>
    </>
  );
};

export default PdfKnopf;
