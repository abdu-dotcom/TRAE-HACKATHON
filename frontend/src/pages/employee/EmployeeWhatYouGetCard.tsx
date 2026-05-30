import { Timer } from "lucide-react";
import Card from "@/components/ui/Card";

export default function EmployeeWhatYouGetCard() {
  return (
    <Card className="h-full">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/6 ring-1 ring-white/10">
          <Timer className="h-5 w-5 text-white/70" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">What you’ll get</div>
          <div className="mt-1 text-xs text-white/55">
            One tool, one prompt, and an estimate of time saved.
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {[
          { t: "Specific tool", d: "Not generic—picked for the task pattern." },
          { t: "Prompt template", d: "Ready to paste and run immediately." },
          { t: "Time saved", d: "A realistic estimate to track ROI." },
        ].map((x) => (
          <div
            key={x.t}
            className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
          >
            <div className="text-xs font-semibold text-white/70">{x.t}</div>
            <div className="mt-2 text-sm text-white/80">{x.d}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-emerald-500/10 p-4 ring-1 ring-emerald-400/15">
        <div className="text-xs font-semibold text-emerald-200">Pro tip</div>
        <div className="mt-1 text-sm text-white/75">
          Include constraints (tone, length, format) in your answers. The prompt becomes dramatically better.
        </div>
      </div>
    </Card>
  );
}

