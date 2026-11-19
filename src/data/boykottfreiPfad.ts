/**
 * Adressen des Freebies „Halal und boykottfrei“ (RN20, 19.11.2026), bewusst ohne Import: App.tsx und routen.ts lesen nur diese
 * Zeilen, die Listendaten (`boykottfreieAktien.ts`) laden erst die Seiten selbst.
 * Voll-Pfad nach dem Muster der anderen Freebies (/vorlagen/<slug>/voll-<4 Zeichen>), nicht in der Sitemap, noindex.
 */
export const BF_SLUG = "boykottfreie-aktien";
export const BF_SCHLUESSEL = "voll-5bk2";
export const BF_TEASER_PFAD = `/vorlagen/${BF_SLUG}`;
export const BF_VOLL_PFAD = `${BF_TEASER_PFAD}/${BF_SCHLUESSEL}`;
