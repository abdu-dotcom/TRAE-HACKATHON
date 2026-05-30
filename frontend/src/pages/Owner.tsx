import { useMemo } from "react";
import { BarChart3, Sparkles, Timer } from "lucide-react";
import ProgressBar from "@/components/ui/ProgressBar";
import StatTile from "@/components/ui/StatTile";
import { useAppStore } from "@/store/useAppStore";
import DepartmentAdoptionChart from "@/pages/owner/DepartmentAdoptionChart";
import TeamMemberList from "@/pages/owner/TeamMemberList";

export default function Owner() {
  const members = useAppStore((s) => s.teamMembers);

  const adoption = useMemo(() => {
    const total = members.length || 1;
    const active = members.filter((m) => m.activeToday).length;
    const pct = Math.round((active / total) * 100);
    return { total, active, pct };
  }, [members]);

  const weeklyHoursSaved = useMemo(() => {
    const totalMinutes = members.reduce((acc, m) => acc + m.weeklyMinutesSaved, 0);
    return Math.round((totalMinutes / 60) * 10) / 10;
  }, [members]);

  const byDepartment = useMemo(() => {
    const map = new Map<string, { department: string; active: number; total: number }>();
    for (const m of members) {
      const key = m.department;
      const current = map.get(key) ?? { department: key, active: 0, total: 0 };
      map.set(key, {
        department: key,
        total: current.total + 1,
        active: current.active + (m.activeToday ? 1 : 0),
      });
    }
    return [...map.values()].sort((a, b) => a.department.localeCompare(b.department));
  }, [members]);

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-white/10">
          <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
          Owner Dashboard
        </div>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Team AI adoption, at a glance.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/65">
          Live demo metrics from local state. Employee check-in and feedback updates the numbers instantly.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <StatTile
          label="Team AI Adoption Rate"
          value={`${adoption.pct}%`}
          subtext={`${adoption.active} active today · ${adoption.total} total`}
          icon={<BarChart3 className="h-5 w-5" />}
          right={
            <div className="w-44 md:w-52">
              <ProgressBar value={adoption.pct} />
            </div>
          }
        />
        <StatTile
          label="Total Time Saved This Week"
          value={`${weeklyHoursSaved}h`}
          subtext="Estimated from daily feedback"
          icon={<Timer className="h-5 w-5" />}
          right={
            <div className="rounded-2xl bg-white/6 px-3 py-2 text-xs font-semibold text-white/60 ring-1 ring-white/10">
              Minutes: {members.reduce((acc, m) => acc + m.weeklyMinutesSaved, 0)}
            </div>
          }
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TeamMemberList members={members} />
        </div>
        <div className="lg:col-span-2">
          <DepartmentAdoptionChart data={byDepartment} />
        </div>
      </div>
    </div>
  );
}
