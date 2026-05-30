import type { ReactNode } from "react";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function StatTile({
  label,
  value,
  subtext,
  icon,
  right,
  className,
}: {
  label: string;
  value: string;
  subtext?: string;
  icon?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {icon ? (
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/6 ring-1 ring-white/10">
              <div className="text-emerald-300">{icon}</div>
            </div>
          ) : null}
          <div>
            <div className="text-xs font-semibold text-white/55">{label}</div>
            <div className="mt-2 font-display text-3xl font-semibold tracking-tight text-white">
              {value}
            </div>
            {subtext ? (
              <div className="mt-1 text-xs font-semibold text-white/45">
                {subtext}
              </div>
            ) : null}
          </div>
        </div>
        {right ? <div className="min-w-0">{right}</div> : null}
      </div>
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-emerald-500/10 blur-2xl" />
    </Card>
  );
}

