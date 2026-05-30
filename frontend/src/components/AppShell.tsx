import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

function TopNavLink({
  to,
  label,
}: {
  to: string;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "rounded-xl px-3 py-2 text-sm font-semibold transition",
          isActive
            ? "bg-white/12 text-white ring-1 ring-white/15"
            : "text-white/70 hover:bg-white/10 hover:text-white",
        )
      }
    >
      {label}
    </NavLink>
  );
}

export default function AppShell() {
  const location = useLocation();
  const activeRole = useAppStore((s) => s.activeRole);
  const employee = useAppStore((s) => s.employee);
  const owner = useAppStore((s) => s.owner);

  return (
    <div className="min-h-dvh bg-flow">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.35),transparent_45%),radial-gradient(circle_at_70%_0%,rgba(255,255,255,0.10),transparent_40%),radial-gradient(circle_at_70%_75%,rgba(16,185,129,0.18),transparent_45%)]" />

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500 text-emerald-950 shadow-[0_20px_40px_-20px_rgba(16,185,129,0.9)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold text-white">
              FlowAI
            </div>
            <div className="text-xs text-white/60">
              {activeRole === "owner" ? (
                <>
                  Owner
                  <span className="mx-2 text-white/25">•</span>
                  {owner.companyName} ({owner.teamSize} people)
                </>
              ) : (
                <>
                  AI Work Coach
                  <span className="mx-2 text-white/25">•</span>
                  {employee.name} ({employee.role})
                </>
              )}
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-1 rounded-2xl bg-white/5 p-1 ring-1 ring-white/10">
          <TopNavLink to="/" label="Setup" />
          <TopNavLink to="/employee" label="Employee" />
          <TopNavLink to="/owner" label="Owner" />
        </nav>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-4 pb-10 md:px-6">
        <div key={location.pathname} className="animate-page-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
