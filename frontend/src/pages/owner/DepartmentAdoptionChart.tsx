import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function DepartmentAdoptionChart({
  data,
}: {
  data: Array<{
    department: string;
    active: number;
    total: number;
  }>;
}) {
  const maxTotal = Math.max(1, ...data.map((d) => d.total));

  return (
    <Card>
      <div className="text-sm font-semibold text-white">AI adoption by department</div>
      <div className="mt-1 text-xs text-white/55">
        Active today per department (active / total).
      </div>

      <div className="mt-5 space-y-3">
        {data.map((d) => {
          const pct = d.total ? Math.round((d.active / d.total) * 100) : 0;
          const width = Math.max(10, Math.round((d.total / maxTotal) * 100));
          return (
            <div key={d.department} className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-white/85">
                  {d.department}
                </div>
                <div className="text-xs font-semibold text-white/55">
                  {d.active}/{d.total} · {pct}%
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10">
                <div
                  className={cn(
                    "h-2 rounded-full transition-[width] duration-700 ease-out",
                    pct >= 70
                      ? "bg-emerald-400"
                      : pct >= 40
                        ? "bg-emerald-400/70"
                        : "bg-white/25",
                  )}
                  style={{ width: `${Math.round((pct / 100) * width)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

