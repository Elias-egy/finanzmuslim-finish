/**
 * Reservierter Platz fuer eine spaetere Anzeige.
 *
 * Hier kommt spaeter ein deutlich als "Anzeige" gekennzeichneter Werbeplatz hin.
 * Solange nichts gebucht ist, stellt die Komponente bewusst nichts dar — kein
 * Rahmen, kein Platzhalter, keine Hoehe, damit das Layout nicht springt.
 */
const AdSlot = ({ id }: { id?: string }) => <div data-ad-slot={id ?? "default"} aria-hidden />;

export default AdSlot;
