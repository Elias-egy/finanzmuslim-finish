import { girokontoVergleich, GIRO_FINANZ_MAX } from "@/data/girokontoVergleich";
import { brokerVergleich, DEPOT_FINANZ_MAX } from "@/data/brokerVergleich";
import { kryptoVergleich, KRYPTO_FINANZ_MAX } from "@/data/kryptoVergleich";
import { rangfolge, sterne } from "@/lib/rangfolge";

const sets = { depot: [brokerVergleich, DEPOT_FINANZ_MAX], girokonto: [girokontoVergleich, GIRO_FINANZ_MAX], krypto: [kryptoVergleich, KRYPTO_FINANZ_MAX] } as const;
const kat = (process.argv[2] ?? "girokonto") as keyof typeof sets;
const n = Number(process.argv[3] ?? 15);
const [liste, max] = sets[kat];
const r = rangfolge(liste as never, kat, { finanzMax: max as never });
for (const b of r.gerankt.slice(0, n)) {
  const a = b.anbieter;
  console.log(`${String(b.platz).padStart(2)} ${(a.name + " " + a.produkt).padEnd(40)} note ${b.note.toFixed(2)} (${sterne(b.note)}★) halal ${b.halal.toFixed(2)} kosten ${b.kosten?.toFixed(2)} link ${a.link ? "ja" : "-"} dispo ${a.werte.keinDispoAbStart} karte ${a.werte.karteOhneKredit} tor ${a.werte.zinsfreiAbStart}${b.uneingeschraenkt ? "" : " [nie Nr.1]"}`);
}
console.log(`gerankt ${r.gerankt.length}, offen ${r.nichtBewertet.length}, abgeraten ${r.abgeraten.length}`);
