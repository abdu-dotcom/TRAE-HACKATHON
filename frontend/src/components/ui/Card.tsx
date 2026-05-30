import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  tone?: "surface" | "glass";
};

export default React.forwardRef<HTMLDivElement, Props>(function Card(
  { className, tone = "glass", ...props },
  ref,
) {
  const tones: Record<NonNullable<Props["tone"]>, string> = {
    glass:
      "bg-white/7 ring-1 ring-white/10 shadow-[0_30px_70px_-50px_rgba(0,0,0,0.65)] backdrop-blur-xl",
    surface: "bg-zinc-950/40 ring-1 ring-white/10",
  };

  return (
    <div
      ref={ref}
      className={cn("rounded-2xl p-5 md:p-6", tones[tone], className)}
      {...props}
    />
  );
});
