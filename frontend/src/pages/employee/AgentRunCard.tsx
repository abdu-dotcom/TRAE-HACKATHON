import { Clipboard, ClipboardCheck, RefreshCcw, Sparkles, Timer } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type AgentRunStep = {
  stepIndex: number;
  title: string;
  status: string;
  startedAt: string | null;
  finishedAt: string | null;
  summary: string | null;
};

export type AgentRunSnapshot = {
  agentRunId: number;
  checkInId: number;
  status: string;
  toolChoice: string | null;
  difficulty: string | null;
  estimatedMinutesSaved: number;
  whyThisTool: string | null;
  promptTemplate: string | null;
  steps: AgentRunStep[];
  draftOutput: string | null;
  finalOutput: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

function stepBadge(status: string) {
  const base =
    "rounded-full px-2.5 py-1 text-[11px] font-extrabold ring-1 ring-inset";
  if (status === "running") {
    return cn(base, "bg-emerald-500/15 text-emerald-100 ring-emerald-400/20");
  }
  if (status === "done") {
    return cn(base, "bg-white/10 text-white/75 ring-white/10");
  }
  if (status === "failed") {
    return cn(base, "bg-rose-500/15 text-rose-100 ring-rose-400/20");
  }
  return cn(base, "bg-white/5 text-white/55 ring-white/10");
}

export default function AgentRunCard({
  checkInId,
  run,
  connectionLabel,
  copied,
  canRun,
  canFinalize,
  editableOutput,
  onChangeOutput,
  onRun,
  onCopyPrompt,
  onFinalize,
  onRegenerate,
  onGoFeedback,
}: {
  checkInId: number | null;
  run: AgentRunSnapshot | null;
  connectionLabel: string | null;
  copied: boolean;
  canRun: boolean;
  canFinalize: boolean;
  editableOutput: string;
  onChangeOutput: (v: string) => void;
  onRun: () => void;
  onCopyPrompt: () => void;
  onFinalize: () => void;
  onRegenerate: () => void;
  onGoFeedback: () => void;
}) {
  const isRunning = run?.status === "queued" || run?.status === "running";
  const toolName = run?.toolChoice ?? "—";

  return (
    <Card>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Agent run</div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-extrabold text-emerald-950">
              {toolName}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-white/10">
              <Timer className="h-3.5 w-3.5 text-emerald-300" />
              Est. {run?.estimatedMinutesSaved ?? 0} min saved
            </div>
            {connectionLabel ? (
              <div className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/60 ring-1 ring-white/10">
                {connectionLabel}
              </div>
            ) : null}
          </div>
          {run?.whyThisTool ? (
            <p className="mt-3 text-sm text-white/70">{run.whyThisTool}</p>
          ) : checkInId ? (
            <p className="mt-3 text-sm text-white/60">
              Check-in saved (#{checkInId}). Jalankan agent untuk mulai generate draft.
            </p>
          ) : (
            <p className="mt-3 text-sm text-white/60">
              Submit check-in dulu untuk mulai.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <Button onClick={onRun} disabled={!canRun}>
            <Sparkles className="h-4 w-4" />
            {isRunning ? "Running…" : "Run agent"}
          </Button>
          <Button variant="secondary" onClick={onCopyPrompt} disabled={!run?.promptTemplate}>
            {copied ? (
              <ClipboardCheck className="h-4 w-4 text-emerald-200" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
            {copied ? "Copied" : "Copy prompt"}
          </Button>
          <Button variant="ghost" onClick={onGoFeedback} disabled={!checkInId && !run}>
            End-of-day feedback
          </Button>
          <Button variant="ghost" onClick={onRegenerate} disabled={!run?.agentRunId}>
            <RefreshCcw className="h-4 w-4" />
            Regenerate
          </Button>
        </div>
      </div>

      {run?.promptTemplate ? (
        <div className="mt-5 rounded-2xl bg-zinc-950/35 p-4 ring-1 ring-white/10">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="text-xs font-semibold text-white/60">Prompt template</div>
            <div className="text-xs font-semibold text-white/45">
              Paste into {toolName}
            </div>
          </div>
          <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-white/85">
            {run.promptTemplate}
          </pre>
        </div>
      ) : null}

      {run?.steps?.length ? (
        <div className="mt-5 grid gap-2">
          {run.steps.map((s) => (
            <div
              key={`${s.stepIndex}-${s.title}`}
              className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
            >
              <div className="text-sm font-semibold text-white/80">
                {s.stepIndex + 1}. {s.title}
              </div>
              <div className={stepBadge(s.status)}>{s.status}</div>
            </div>
          ))}
        </div>
      ) : null}

      {run?.draftOutput || run?.finalOutput ? (
        <div className="mt-5 space-y-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Output</div>
              <div className="mt-1 text-xs font-semibold text-white/55">
                Edit dulu, lalu finalize untuk simpan hasil final.
              </div>
            </div>
            <Button onClick={onFinalize} disabled={!canFinalize}>
              Finalize
            </Button>
          </div>
          <textarea
            value={editableOutput}
            onChange={(e) => onChangeOutput(e.target.value)}
            rows={10}
            className="w-full resize-y rounded-2xl bg-zinc-950/35 px-4 py-3 text-sm text-white/85 placeholder:text-white/35 ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
          />
        </div>
      ) : null}
    </Card>
  );
}
