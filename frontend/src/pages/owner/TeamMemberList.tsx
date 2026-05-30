import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { TeamMember } from "@/store/useAppStore";

function StatusPill({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        active
          ? "bg-emerald-500/15 text-emerald-200 ring-emerald-400/15"
          : "bg-white/6 text-white/60 ring-white/10",
      )}
    >
      {active ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <Circle className="h-3.5 w-3.5" />
      )}
      {active ? "Active" : "Inactive"}
    </div>
  );
}

export default function TeamMemberList({
  members,
}: {
  members: TeamMember[];
}) {
  return (
    <Card>
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Team members</div>
          <div className="mt-1 text-xs text-white/55">
            Live demo data (updates when the employee submits check-in/feedback).
          </div>
        </div>
        <div className="text-xs font-semibold text-white/45">
          Today’s time saved (min)
        </div>
      </div>

      <div className="mt-4 divide-y divide-white/10 overflow-hidden rounded-2xl ring-1 ring-white/10">
        {members.map((m) => (
          <div
            key={m.id}
            className="flex flex-col gap-3 bg-white/5 px-4 py-4 transition hover:bg-white/7 md:flex-row md:items-center md:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="truncate text-sm font-semibold text-white">
                  {m.name}
                </div>
                <StatusPill active={m.activeToday} />
              </div>
              <div className="mt-1 text-xs font-semibold text-white/50">
                {m.role}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 md:justify-end">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-white/60">
                <Clock3 className="h-3.5 w-3.5 text-emerald-300" />
                {m.minutesSavedToday} min
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

