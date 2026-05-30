import type { Ref } from "react";
import { Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function EmployeeFeedbackCard({
  innerRef,
  helped,
  onHelped,
  minutesSaved,
  onMinutesSaved,
  saved,
  onSave,
}: {
  innerRef?: Ref<HTMLDivElement>;
  helped: boolean;
  onHelped: (v: boolean) => void;
  minutesSaved: number;
  onMinutesSaved: (v: number) => void;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <Card ref={innerRef}>
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/6 ring-1 ring-white/10">
          <Sparkles className="h-5 w-5 text-emerald-300" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">End of day</div>
          <div className="mt-1 text-xs text-white/55">
            Track impact. This powers the owner dashboard metrics.
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <div className="text-sm font-semibold text-white">Did this help?</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onHelped(true)}
              className={cn(
                "flex-1 rounded-xl px-3 py-2 text-sm font-semibold ring-1 transition",
                helped
                  ? "bg-emerald-500 text-emerald-950 ring-emerald-400/30"
                  : "bg-white/5 text-white/75 ring-white/10 hover:bg-white/10",
              )}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => onHelped(false)}
              className={cn(
                "flex-1 rounded-xl px-3 py-2 text-sm font-semibold ring-1 transition",
                !helped
                  ? "bg-emerald-500 text-emerald-950 ring-emerald-400/30"
                  : "bg-white/5 text-white/75 ring-white/10 hover:bg-white/10",
              )}
            >
              No
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-white">
              How much time did you save?
            </div>
            <div className="text-sm font-extrabold text-emerald-200">
              {minutesSaved} min
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={120}
            step={5}
            value={minutesSaved}
            onChange={(e) => onMinutesSaved(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-emerald-400"
          />
          <div className="flex items-center justify-between text-xs font-semibold text-white/40">
            <span>0</span>
            <span>60</span>
            <span>120</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div
          className={cn(
            "text-xs font-semibold",
            saved ? "text-emerald-200" : "text-white/45",
          )}
        >
          {saved ? "Saved. Nice work." : "You can update this anytime today."}
        </div>
        <Button onClick={onSave}>
          <Sparkles className="h-4 w-4" />
          Save feedback
        </Button>
      </div>
    </Card>
  );
}
