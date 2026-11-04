/**
 * Titelfläche einer Blogkarte wie frontal.so/blog (Elias SEO47: „die Bilder, da würde ich es eher wie bei Frontal
 * machen“, keine Motiv-Bildchen mehr): ruhige dunkelblaue Fläche mit feinem Punktraster, oben die Wortmarke,
 * unten das Thema groß in Serifen.
 */
const BlogKachel = ({ thema, className = "" }: { thema: string; className?: string }) => (
  <div
    aria-hidden
    className={`relative flex aspect-[16/9] w-full flex-col justify-between overflow-hidden bg-[#0B1B3F] p-4 text-white sm:p-5 ${className}`}
  >
    <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:14px_14px]" />
    <span className="relative text-[15px] font-bold tracking-tight">finanzmuslim</span>
    <span className="relative">
      <span className="font-titel block text-[30px] leading-none sm:text-[34px]">{thema}</span>
      <span className="mt-2 block font-mono text-[12px] uppercase tracking-[0.14em] text-[#9DBBFF]">finanzmuslim Blog</span>
    </span>
  </div>
);

export default BlogKachel;
