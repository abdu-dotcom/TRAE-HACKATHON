import { cn } from "@/lib/utils";

export default function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">{label}</div>
          {hint ? <div className="mt-1 text-xs text-white/55">{hint}</div> : null}
        </div>
        {error ? (
          <div className="text-xs font-semibold text-rose-200/90">{error}</div>
        ) : null}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={cn(
          "w-full resize-none rounded-2xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/70",
          error ? "ring-rose-300/40 focus:ring-rose-300/60" : "",
        )}
      />
    </div>
  );
}

