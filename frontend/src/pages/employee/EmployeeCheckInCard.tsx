import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Field from "@/pages/employee/Field";
import { Wand2 } from "lucide-react";

export default function EmployeeCheckInCard({
  roleLabel,
  workingOn,
  timeSink,
  toolsTried,
  onWorkingOn,
  onTimeSink,
  onToolsTried,
  errors,
  onSubmit,
  showEdit,
  onEdit,
}: {
  roleLabel: string;
  workingOn: string;
  timeSink: string;
  toolsTried: string;
  onWorkingOn: (v: string) => void;
  onTimeSink: (v: string) => void;
  onToolsTried: (v: string) => void;
  errors: Record<string, string>;
  onSubmit: () => void;
  showEdit: boolean;
  onEdit: () => void;
}) {
  return (
    <Card className="lg:col-span-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">Morning check-in</div>
          <div className="mt-1 text-xs text-white/55">
            Keep it specific. You’ll get a better prompt.
          </div>
        </div>
        <div className="rounded-2xl bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/15">
          {roleLabel}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <Field
          label="1) What are you working on today?"
          hint="Example: “Write Q3 product launch email sequence”"
          value={workingOn}
          onChange={onWorkingOn}
          placeholder="Describe the deliverable and audience…"
          error={errors.workingOn}
        />
        <Field
          label="2) Which part usually takes the most time?"
          hint="Example: “Getting the structure right and writing the first draft”"
          value={timeSink}
          onChange={onTimeSink}
          placeholder="Call out the slow part…"
          error={errors.timeSink}
        />
        <Field
          label="3) What AI tools have you tried for this?"
          hint="Optional, but helpful (e.g., “Claude, Grammarly, Notion AI”)"
          value={toolsTried}
          onChange={onToolsTried}
          placeholder="List tools (if any)…"
        />
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <Button onClick={onSubmit}>
          <Wand2 className="h-4 w-4" />
          Get my recommendation
        </Button>
        {showEdit ? (
          <Button variant="ghost" onClick={onEdit}>
            Edit check-in
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
