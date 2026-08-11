import { cn } from "@/lib/utils";

/** Textlogo der Marke: immer klein geschrieben, fett. */
export const Wordmark = ({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) => (
  <span
    className={cn(
      "font-bold lowercase tracking-tight select-none",
      inverted ? "text-white" : "text-foreground",
      className,
    )}
  >
    finanzmuslim
  </span>
);
