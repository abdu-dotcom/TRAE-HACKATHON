import { useMemo, useState } from "react";
import { Building2, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import {
  useAppStore,
  type DepartmentRole,
  type UserRole,
} from "@/store/useAppStore";

export default function Home() {
  const navigate = useNavigate();
  const activeRole = useAppStore((s) => s.activeRole);
  const employee = useAppStore((s) => s.employee);
  const owner = useAppStore((s) => s.owner);
  const setActiveRole = useAppStore((s) => s.setActiveRole);
  const setEmployeeProfile = useAppStore((s) => s.setEmployeeProfile);
  const setOwnerProfile = useAppStore((s) => s.setOwnerProfile);

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    activeRole ?? null,
  );

  const [employeeName, setEmployeeName] = useState(
    activeRole === "employee" ? employee.name : "",
  );
  const [employeeRole, setEmployeeRole] = useState<DepartmentRole>(employee.role);

  const [companyName, setCompanyName] = useState(
    activeRole === "owner" ? owner.companyName : "",
  );
  const [teamSize, setTeamSize] = useState<string>(
    activeRole === "owner" ? String(owner.teamSize) : "8",
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const roleOptions = useMemo<DepartmentRole[]>(
    () => ["Marketing", "Sales", "Finance", "Developer", "Operations", "HR"],
    [],
  );

  const onContinue = () => {
    if (!selectedRole) return;

    if (selectedRole === "employee") {
      const nextErrors: Record<string, string> = {};
      if (!employeeName.trim()) nextErrors.employeeName = "Wajib";
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) return;

      setActiveRole("employee");
      setEmployeeProfile({
        name: employeeName.trim(),
        role: employeeRole,
      });
      navigate("/employee");
      return;
    }

    const nextErrors: Record<string, string> = {};
    if (!companyName.trim()) nextErrors.companyName = "Wajib";
    const parsed = Number(teamSize);
    if (!Number.isFinite(parsed) || parsed <= 0) nextErrors.teamSize = "Isi angka > 0";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setActiveRole("owner");
    setOwnerProfile({
      companyName: companyName.trim(),
      teamSize: parsed,
    });
    navigate("/owner");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <Card className="rounded-3xl p-6 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/15">
            Landing + Setup
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Mulai di FlowAI
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/70">
            Pilih peran kamu, isi setup singkat, lalu lanjut ke flow yang sesuai.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setSelectedRole("employee");
                setErrors({});
              }}
              className={cn(
                "rounded-2xl bg-zinc-950/35 p-4 text-left ring-1 transition",
                selectedRole === "employee"
                  ? "ring-emerald-400/40"
                  : "ring-white/10 hover:bg-white/7",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">
                    I am an Employee
                  </div>
                  <div className="mt-2 text-sm text-white/70">
                    Dapat rekomendasi tool + prompt harian untuk pekerjaanmu.
                  </div>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/6 ring-1 ring-white/10">
                  <UserRound className="h-5 w-5 text-emerald-300" />
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole("owner");
                setErrors({});
              }}
              className={cn(
                "rounded-2xl bg-zinc-950/35 p-4 text-left ring-1 transition",
                selectedRole === "owner"
                  ? "ring-emerald-400/40"
                  : "ring-white/10 hover:bg-white/7",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">
                    I am an Owner
                  </div>
                  <div className="mt-2 text-sm text-white/70">
                    Lihat dashboard adopsi AI dan total time saved tim.
                  </div>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/6 ring-1 ring-white/10">
                  <Building2 className="h-5 w-5 text-emerald-300" />
                </div>
              </div>
            </button>
          </div>

          <div
            className={cn(
              "mt-6 overflow-hidden transition-all duration-500",
              selectedRole ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
            )}
          >
            {selectedRole === "employee" ? (
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-sm font-semibold text-white">
                  Employee setup
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs font-semibold text-white/60">
                        Nama
                      </div>
                      {errors.employeeName ? (
                        <div className="text-xs font-semibold text-rose-200/90">
                          {errors.employeeName}
                        </div>
                      ) : null}
                    </div>
                    <input
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      placeholder="Misal: Dimas Putra"
                      className={cn(
                        "w-full rounded-2xl bg-zinc-950/35 px-4 py-3 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/70",
                        errors.employeeName
                          ? "ring-rose-300/40 focus:ring-rose-300/60"
                          : "",
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-white/60">
                      Role
                    </div>
                    <select
                      value={employeeRole}
                      onChange={(e) =>
                        setEmployeeRole(e.target.value as DepartmentRole)
                      }
                      className="w-full rounded-2xl bg-zinc-950/35 px-4 py-3 text-sm text-white ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
                    >
                      {roleOptions.map((r) => (
                        <option key={r} value={r} className="bg-zinc-950">
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : null}

            {selectedRole === "owner" ? (
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-sm font-semibold text-white">
                  Owner setup
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs font-semibold text-white/60">
                        Nama company
                      </div>
                      {errors.companyName ? (
                        <div className="text-xs font-semibold text-rose-200/90">
                          {errors.companyName}
                        </div>
                      ) : null}
                    </div>
                    <input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Misal: PT Contoh Sukses"
                      className={cn(
                        "w-full rounded-2xl bg-zinc-950/35 px-4 py-3 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/70",
                        errors.companyName
                          ? "ring-rose-300/40 focus:ring-rose-300/60"
                          : "",
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs font-semibold text-white/60">
                        Jumlah anggota tim
                      </div>
                      {errors.teamSize ? (
                        <div className="text-xs font-semibold text-rose-200/90">
                          {errors.teamSize}
                        </div>
                      ) : null}
                    </div>
                    <input
                      inputMode="numeric"
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      placeholder="Misal: 8"
                      className={cn(
                        "w-full rounded-2xl bg-zinc-950/35 px-4 py-3 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/70",
                        errors.teamSize
                          ? "ring-rose-300/40 focus:ring-rose-300/60"
                          : "",
                      )}
                    />
                    <div className="text-xs font-semibold text-white/45">
                      Dashboard tetap pakai 8 demo members untuk presentasi.
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs font-semibold text-white/50">
                {selectedRole === "employee"
                  ? "Lanjut ke Daily AI Coaching."
                  : selectedRole === "owner"
                    ? "Lanjut ke Owner Dashboard."
                    : ""}
              </div>
              <Button onClick={onContinue} disabled={!selectedRole}>
                Continue
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="rounded-3xl bg-emerald-500/10 p-6 ring-1 ring-emerald-400/15 md:p-8">
          <div className="text-sm font-semibold text-white">Demo notes</div>
          <div className="mt-2 text-sm text-white/70">
            Onboarding ini cuma mengubah state lokal (tanpa backend). Setelah setup, header dan dashboard akan ikut
            menyesuaikan.
          </div>
          <div className="mt-5 space-y-2 text-xs font-semibold text-white/55">
            <div>• Employee: nama + role mengganti profil utama.</div>
            <div>• Owner: company + team size disimpan sebagai konteks.</div>
            <div>• Team dashboard tetap terlihat “hidup” dengan 8 demo members.</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
