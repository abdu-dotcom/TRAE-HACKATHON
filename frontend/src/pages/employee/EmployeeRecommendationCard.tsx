import { Clipboard, ClipboardCheck, Timer } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { AiRecommendation } from "@/store/useAppStore";

export default function EmployeeRecommendationCard({
  recommendation,
  copied,
  onCopy,
  onGoFeedback,
}: {
  recommendation: AiRecommendation;
  copied: boolean;
  onCopy: () => void;
  onGoFeedback: () => void;
}) {
  return (
    <Card>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Today’s recommendation</div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-extrabold text-emerald-950">
              {recommendation.toolName}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-white/10">
              <Timer className="h-3.5 w-3.5 text-emerald-300" />
              Est. {recommendation.estimatedMinutesSaved} min saved
            </div>
          </div>
          <p className="mt-3 text-sm text-white/70">{recommendation.whyThisTool}</p>
        </div>

        <div className="flex items-center gap-2 md:justify-end">
          <Button variant="secondary" onClick={onCopy}>
            {copied ? (
              <ClipboardCheck className="h-4 w-4 text-emerald-200" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
            {copied ? "Copied" : "Copy prompt"}
          </Button>
          <Button variant="ghost" onClick={onGoFeedback}>
            End-of-day feedback
          </Button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-zinc-950/35 p-4 ring-1 ring-white/10">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="text-xs font-semibold text-white/60">Prompt template</div>
          <div className="text-xs font-semibold text-white/45">
            Paste into {recommendation.toolName}
          </div>
        </div>
        <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-white/85">
          {recommendation.promptTemplate}
        </pre>
      </div>
    </Card>
  );
}

