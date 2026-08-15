import type { ReactNode } from "react";

type Props = { children: ReactNode; unterschrift: string };

/** Illustration auf heller Flaeche, darunter die Bildunterschrift klein und grau. */
const BeitragIllu = ({ children, unterschrift }: Props) => (
  <figure className="mt-6">
    <div className="overflow-hidden rounded-2xl bg-hero p-5 md:p-6">
      <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-xl">{children}</div>
    </div>
    <figcaption className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{unterschrift}</figcaption>
  </figure>
);

export default BeitragIllu;