import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import {
  createAgentRun,
  createCheckIn,
  finalizeAgentRun,
  getAgentRun,
  regenerateAgentRun,
} from "@/api/flowai";
import EmployeeCheckInCard from "@/pages/employee/EmployeeCheckInCard";
import EmployeeWhatYouGetCard from "@/pages/employee/EmployeeWhatYouGetCard";
import AgentRunCard, {
  type AgentRunSnapshot,
} from "@/pages/employee/AgentRunCard";
import EmployeeFeedbackCard from "@/pages/employee/EmployeeFeedbackCard";

type Step = "checkin" | "agent" | "feedback";

function todayISO() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10);
}

const LS_LAST_CHECKIN_ID = "flowai:lastCheckInId";
const LS_LAST_AGENT_RUN_ID = "flowai:lastAgentRunId";

export default function Employee() {
  const employee = useAppStore((s) => s.employee);
  const setFeedback = useAppStore((s) => s.setFeedback);
  const markActiveToday = useAppStore((s) => s.markActiveToday);
  const recordTimeSaved = useAppStore((s) => s.recordTimeSaved);

  const [step, setStep] = useState<Step>("checkin");
  const [workingOn, setWorkingOn] = useState("");
  const [timeSink, setTimeSink] = useState("");
  const [toolsTried, setToolsTried] = useState("");
  const [checkInId, setCheckInId] = useState<number | null>(null);
  const [run, setRun] = useState<AgentRunSnapshot | null>(null);
  const [connectionLabel, setConnectionLabel] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [helped, setHelped] = useState<boolean>(true);
  const [minutesSaved, setMinutesSaved] = useState<number>(35);
  const [saved, setSaved] = useState(false);
  const [agentBusy, setAgentBusy] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editableOutput, setEditableOutput] = useState("");
  const [outputDirty, setOutputDirty] = useState(false);

  const feedbackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedRunId = Number(localStorage.getItem(LS_LAST_AGENT_RUN_ID) ?? "");
    const storedCheckInId = Number(localStorage.getItem(LS_LAST_CHECKIN_ID) ?? "");
    if (Number.isFinite(storedCheckInId) && storedCheckInId > 0) {
      setCheckInId(storedCheckInId);
    }
    if (!Number.isFinite(storedRunId) || storedRunId <= 0) return;

    setAgentBusy(true);
    setAgentError(null);
    getAgentRun(storedRunId)
      .then((data) => {
        setRun(data);
        setCheckInId(data.checkInId);
        setStep("agent");
      })
      .catch((e) => setAgentError(e instanceof Error ? e.message : String(e)))
      .finally(() => setAgentBusy(false));
  }, []);

  useEffect(() => {
    if (!run) return;
    if (outputDirty) return;
    setEditableOutput(run.finalOutput ?? run.draftOutput ?? "");
  }, [run, outputDirty]);

  useEffect(() => {
    if (!run?.agentRunId) return;
    if (run.status !== "queued" && run.status !== "running") {
      setConnectionLabel(null);
      return;
    }

    setConnectionLabel("Connecting…");
    const es = new EventSource(`/api/agent-runs/${run.agentRunId}/stream`);
    es.onopen = () => setConnectionLabel("Live");
    es.addEventListener("agent", (ev) => {
      const payload = (ev as MessageEvent).data;
      try {
        const next = JSON.parse(payload) as AgentRunSnapshot;
        setRun(next);
      } catch {
      }
    });
    es.onerror = () => {
      setConnectionLabel("Disconnected");
      es.close();
    };
    return () => {
      es.close();
    };
  }, [run?.agentRunId, run?.status]);

  const onSubmitCheckIn = async () => {
    const nextErrors: Record<string, string> = {};
    if (!workingOn.trim()) nextErrors.workingOn = "Required";
    if (!timeSink.trim()) nextErrors.timeSink = "Required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setAgentBusy(true);
    setAgentError(null);
    try {
      const res = await createCheckIn({
        role: employee.role,
        workingOn: workingOn.trim(),
        timeSink: timeSink.trim(),
        toolsTried: toolsTried.trim(),
      });
      setCheckInId(res.id);
      localStorage.setItem(LS_LAST_CHECKIN_ID, String(res.id));
      markActiveToday(employee.id, true);
      setSaved(false);
      setStep("agent");
    } catch (e) {
      setAgentError(e instanceof Error ? e.message : String(e));
    } finally {
      setAgentBusy(false);
    }
  };

  const onCopyPrompt = async () => {
    if (!run?.promptTemplate) return;
    try {
      await navigator.clipboard.writeText(run.promptTemplate);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const onRunAgent = async () => {
    if (!checkInId) return;
    if (run?.status === "queued" || run?.status === "running") return;

    setAgentBusy(true);
    setAgentError(null);
    try {
      const created = await createAgentRun({ checkInId, toolChoice: null });
      localStorage.setItem(LS_LAST_AGENT_RUN_ID, String(created.id));
      const next = await getAgentRun(created.id);
      setRun(next);
      setOutputDirty(false);
      setStep("agent");
    } catch (e) {
      setAgentError(e instanceof Error ? e.message : String(e));
    } finally {
      setAgentBusy(false);
    }
  };

  const onFinalize = async () => {
    if (!run?.agentRunId) return;
    const normalized = editableOutput.trim();
    if (!normalized) {
      setAgentError("Output tidak boleh kosong.");
      return;
    }

    setAgentBusy(true);
    setAgentError(null);
    try {
      await finalizeAgentRun(run.agentRunId, { finalOutput: normalized });
      const next = await getAgentRun(run.agentRunId);
      setRun(next);
      setOutputDirty(false);
    } catch (e) {
      setAgentError(e instanceof Error ? e.message : String(e));
    } finally {
      setAgentBusy(false);
    }
  };

  const onRegenerate = async () => {
    if (!run?.agentRunId) return;
    setAgentBusy(true);
    setAgentError(null);
    try {
      const created = await regenerateAgentRun(run.agentRunId, { toolChoice: null });
      localStorage.setItem(LS_LAST_AGENT_RUN_ID, String(created.id));
      const next = await getAgentRun(created.id);
      setRun(next);
      setOutputDirty(false);
      setEditableOutput("");
    } catch (e) {
      setAgentError(e instanceof Error ? e.message : String(e));
    } finally {
      setAgentBusy(false);
    }
  };

  const onSaveFeedback = () => {
    const normalizedMinutes = helped ? minutesSaved : 0;
    setFeedback({ helped, minutesSaved: normalizedMinutes });
    recordTimeSaved(employee.id, normalizedMinutes);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1400);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-white/10">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            Daily AI Coaching
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Good morning, {employee.name.split(" ")[0]}.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/65">
            Answer three quick questions and get a concrete AI tool + a copy-ready prompt for today’s work.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-white/6 px-4 py-3 ring-1 ring-white/10">
            <div className="text-xs font-semibold text-white/60">Today</div>
            <div className="mt-1 text-sm font-semibold text-white">{todayISO()}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <EmployeeCheckInCard
          roleLabel={employee.role}
          workingOn={workingOn}
          timeSink={timeSink}
          toolsTried={toolsTried}
          onWorkingOn={setWorkingOn}
          onTimeSink={setTimeSink}
          onToolsTried={setToolsTried}
          errors={errors}
          onSubmit={onSubmitCheckIn}
          showEdit={Boolean(checkInId || run)}
          onEdit={() => {
            localStorage.removeItem(LS_LAST_CHECKIN_ID);
            localStorage.removeItem(LS_LAST_AGENT_RUN_ID);
            setCheckInId(null);
            setRun(null);
            setEditableOutput("");
            setOutputDirty(false);
            setAgentError(null);
            setStep("checkin");
            setSaved(false);
          }}
        />

        <div className="lg:col-span-3">
          {step === "checkin" ? <EmployeeWhatYouGetCard /> : null}

          {step !== "checkin" ? (
            <div className="space-y-5">
              {agentError ? (
                <div className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100 ring-1 ring-rose-400/15">
                  {agentError}
                </div>
              ) : null}

              <AgentRunCard
                checkInId={checkInId}
                run={run}
                connectionLabel={agentBusy ? "Working…" : connectionLabel}
                copied={copied}
                canRun={
                  Boolean(checkInId) &&
                  !agentBusy &&
                  run?.status !== "queued" &&
                  run?.status !== "running"
                }
                onCopyPrompt={onCopyPrompt}
                onRun={onRunAgent}
                onRegenerate={onRegenerate}
                editableOutput={editableOutput}
                canFinalize={Boolean(run?.draftOutput || run?.finalOutput) && !agentBusy}
                onChangeOutput={(v) => {
                  setEditableOutput(v);
                  setOutputDirty(true);
                }}
                onFinalize={onFinalize}
                onGoFeedback={() => {
                  setStep("feedback");
                  requestAnimationFrame(() =>
                    feedbackRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    }),
                  );
                }}
              />
              <EmployeeFeedbackCard
                innerRef={feedbackRef}
                helped={helped}
                onHelped={setHelped}
                minutesSaved={minutesSaved}
                onMinutesSaved={setMinutesSaved}
                saved={saved}
                onSave={onSaveFeedback}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
