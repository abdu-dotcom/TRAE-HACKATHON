import { create } from "zustand";

export type DepartmentRole =
  | "Marketing"
  | "Sales"
  | "Finance"
  | "Developer"
  | "Operations"
  | "HR";

export type EmployeeProfile = {
  id: string;
  name: string;
  role: DepartmentRole;
};

export type UserRole = "employee" | "owner";

export type OwnerProfile = {
  companyName: string;
  teamSize: number;
};

export type MorningCheckIn = {
  dateISO: string;
  workingOn: string;
  timeSink: string;
  toolsTried: string;
};

export type AiRecommendation = {
  toolName: string;
  whyThisTool: string;
  promptTemplate: string;
  estimatedMinutesSaved: number;
};

export type EndOfDayFeedback = {
  helped: boolean;
  minutesSaved: number;
};

export type DailyEntry = {
  checkIn: MorningCheckIn;
  recommendation: AiRecommendation;
  feedback?: EndOfDayFeedback;
};

export type TeamMember = {
  id: string;
  name: string;
  role: DepartmentRole;
  department: DepartmentRole;
  activeToday: boolean;
  minutesSavedToday: number;
  weeklyMinutesSaved: number;
};

type AppState = {
  activeRole: UserRole | null;
  employee: EmployeeProfile;
  owner: OwnerProfile;
  dailyEntry?: DailyEntry;
  teamMembers: TeamMember[];
  setActiveRole: (role: UserRole) => void;
  setEmployeeProfile: (profile: Pick<EmployeeProfile, "name" | "role">) => void;
  setOwnerProfile: (profile: OwnerProfile) => void;
  setDailyEntry: (entry: DailyEntry) => void;
  setFeedback: (feedback: EndOfDayFeedback) => void;
  markActiveToday: (employeeId: string, active: boolean) => void;
  recordTimeSaved: (employeeId: string, minutesSaved: number) => void;
};

export const useAppStore = create<AppState>((set) => ({
  activeRole: null,
  employee: {
    id: "emp_ava",
    name: "Ava Chen",
    role: "Marketing",
  },
  owner: {
    companyName: "FlowAI Demo Co.",
    teamSize: 8,
  },
  dailyEntry: undefined,
  teamMembers: [
    {
      id: "emp_ava",
      name: "Ava Chen",
      role: "Marketing",
      department: "Marketing",
      activeToday: true,
      minutesSavedToday: 35,
      weeklyMinutesSaved: 190,
    },
    {
      id: "emp_noah",
      name: "Noah Patel",
      role: "Sales",
      department: "Sales",
      activeToday: false,
      minutesSavedToday: 0,
      weeklyMinutesSaved: 85,
    },
    {
      id: "emp_maya",
      name: "Maya Rodriguez",
      role: "Finance",
      department: "Finance",
      activeToday: true,
      minutesSavedToday: 25,
      weeklyMinutesSaved: 140,
    },
    {
      id: "emp_liam",
      name: "Liam Nguyen",
      role: "Developer",
      department: "Developer",
      activeToday: true,
      minutesSavedToday: 70,
      weeklyMinutesSaved: 260,
    },
    {
      id: "emp_sophia",
      name: "Sophia Kim",
      role: "Operations",
      department: "Operations",
      activeToday: false,
      minutesSavedToday: 0,
      weeklyMinutesSaved: 60,
    },
    {
      id: "emp_ethan",
      name: "Ethan Brooks",
      role: "HR",
      department: "HR",
      activeToday: true,
      minutesSavedToday: 20,
      weeklyMinutesSaved: 110,
    },
    {
      id: "emp_amara",
      name: "Amara Singh",
      role: "Marketing",
      department: "Marketing",
      activeToday: true,
      minutesSavedToday: 15,
      weeklyMinutesSaved: 95,
    },
    {
      id: "emp_jordan",
      name: "Jordan Lee",
      role: "Developer",
      department: "Developer",
      activeToday: false,
      minutesSavedToday: 0,
      weeklyMinutesSaved: 130,
    },
  ],
  setActiveRole: (role) => set({ activeRole: role }),
  setEmployeeProfile: (profile) =>
    set((s) => ({
      employee: { ...s.employee, ...profile },
      teamMembers: s.teamMembers.map((m) =>
        m.id === s.employee.id
          ? {
              ...m,
              name: profile.name,
              role: profile.role,
              department: profile.role,
            }
          : m,
      ),
    })),
  setOwnerProfile: (profile) => set({ owner: profile }),
  setDailyEntry: (entry) => set({ dailyEntry: entry }),
  setFeedback: (feedback) =>
    set((s) => (s.dailyEntry ? { dailyEntry: { ...s.dailyEntry, feedback } } : s)),
  markActiveToday: (employeeId, active) =>
    set((s) => ({
      teamMembers: s.teamMembers.map((m) =>
        m.id === employeeId ? { ...m, activeToday: active } : m,
      ),
    })),
  recordTimeSaved: (employeeId, minutesSaved) =>
    set((s) => ({
      teamMembers: s.teamMembers.map((m) => {
        if (m.id !== employeeId) return m;
        const nextMinutesSavedToday = minutesSaved;
        const baseline = Math.max(0, m.weeklyMinutesSaved - m.minutesSavedToday);
        return {
          ...m,
          minutesSavedToday: nextMinutesSavedToday,
          weeklyMinutesSaved: baseline + nextMinutesSavedToday,
        };
      }),
    })),
}));
