export type CreateCheckInRequest = {
  role: string;
  workingOn: string;
  timeSink: string;
  toolsTried?: string;
};

export type CreateCheckInResponse = {
  id: number;
};

export type CreateAgentRunRequest = {
  checkInId: number;
  toolChoice?: string | null;
};

export type CreateAgentRunResponse = {
  id: number;
};

export type FinalizeAgentRunRequest = {
  finalOutput: string;
};

export type RegenerateAgentRunRequest = {
  toolChoice?: string | null;
};

export type AgentRunStep = {
  stepIndex: number;
  title: string;
  status: string;
  startedAt: string | null;
  finishedAt: string | null;
  summary: string | null;
};

export type AgentRunResponse = {
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

async function parseErrorMessage(res: Response) {
  try {
    const json = (await res.json()) as { message?: string };
    if (json?.message) return json.message;
  } catch {
  }
  return `${res.status} ${res.statusText}`.trim();
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const message = await parseErrorMessage(res);
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export function createCheckIn(payload: CreateCheckInRequest) {
  return api<CreateCheckInResponse>("/api/checkins", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createAgentRun(payload: CreateAgentRunRequest) {
  return api<CreateAgentRunResponse>("/api/agent-runs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAgentRun(agentRunId: number) {
  return api<AgentRunResponse>(`/api/agent-runs/${agentRunId}`, {
    method: "GET",
  });
}

export function finalizeAgentRun(agentRunId: number, payload: FinalizeAgentRunRequest) {
  return api<void>(`/api/agent-runs/${agentRunId}/finalize`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function regenerateAgentRun(agentRunId: number, payload: RegenerateAgentRunRequest) {
  return api<CreateAgentRunResponse>(`/api/agent-runs/${agentRunId}/regenerate`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

