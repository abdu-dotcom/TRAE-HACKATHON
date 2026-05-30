import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export default React.forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "primary", ...props },
  ref,
) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition duration-200 active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-50";

  const variants: Record<Variant, string> = {
    primary:
      "bg-emerald-500 text-emerald-950 shadow-[0_10px_30px_-14px_rgba(16,185,129,0.9)] hover:bg-emerald-400",
    secondary:
      "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15",
    ghost:
      "bg-transparent text-white/80 hover:bg-white/10 hover:text-white",
  };

  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
});
