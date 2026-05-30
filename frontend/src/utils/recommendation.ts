import type { AiRecommendation, DepartmentRole, MorningCheckIn } from "@/store/useAppStore";

type Input = MorningCheckIn & { role?: DepartmentRole };

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function hasAny(haystack: string, needles: string[]) {
  return needles.some((n) => haystack.includes(n));
}

export function buildRecommendation(input: Input): AiRecommendation {
  const workingOn = normalize(input.workingOn);
  const timeSink = normalize(input.timeSink);
  const toolsTried = normalize(input.toolsTried);
  const combined = [workingOn, timeSink, toolsTried].filter(Boolean).join(" | ");

  const role = input.role;

  const recommendation = (() => {
    if (hasAny(combined, ["slide", "deck", "presentation", "pitch", "keynote"])) {
      return {
        toolName: "Gamma",
        whyThisTool:
          "Turns a rough outline into a clean deck fast, with strong structure and visuals—ideal when formatting and flow slow you down.",
        estimatedMinutesSaved: 55,
        promptTemplate:
          `You are my presentation editor.\n\n` +
          `Context:\n- What I’m working on: ${input.workingOn}\n- The slow part: ${input.timeSink}\n\n` +
          `Task:\nCreate a slide-by-slide outline for a ${role ? role + " " : ""}presentation. For each slide, include:\n` +
          `1) Title\n2) 3–5 bullets (clear, non-fluffy)\n3) A suggested visual (chart, screenshot, icon, diagram)\n4) Speaker notes (2–3 sentences)\n\n` +
          `Constraints:\n- Keep it executive-ready and concise\n- Use a confident, modern tone\n- End with a 1-slide summary + next steps`,
      };
    }

    if (
      hasAny(combined, [
        "copy",
        "landing",
        "headline",
        "ad",
        "campaign",
        "blog",
        "newsletter",
        "seo",
        "email",
        "sequence",
        "drip",
      ])
    ) {
      return {
        toolName: "Jasper",
        whyThisTool:
          "Built for marketing content: it’s fast at producing variants, aligning tone, and iterating on hooks without losing brand consistency.",
        estimatedMinutesSaved: 45,
        promptTemplate:
          `Act as a senior ${role ?? "marketing"} copywriter.\n\n` +
          `Brief:\n- What I’m working on: ${input.workingOn}\n- The slow part: ${input.timeSink}\n- Tools I tried: ${input.toolsTried}\n\n` +
          `Deliver:\n1) 8 headline options (mix of direct + curiosity)\n2) 3 opening hooks (2 sentences each)\n3) One full draft (250–350 words)\n4) 5 CTA options\n\n` +
          `Rules:\n- Avoid buzzwords\n- Use specific benefits and concrete language\n- Match a crisp, modern brand voice`,
      };
    }

    if (hasAny(combined, ["cold email", "outreach", "prospect", "pipeline", "follow up", "follow-up", "sales"])) {
      return {
        toolName: "Lavender",
        whyThisTool:
          "Optimized for sales emails: it tightens structure, improves clarity, and boosts reply rates with proven patterns.",
        estimatedMinutesSaved: 35,
        promptTemplate:
          `You are my sales email coach.\n\n` +
          `Context:\n- What I’m working on: ${input.workingOn}\n- The slow part: ${input.timeSink}\n\n` +
          `Write 3 cold email versions (<= 90 words) with:\n` +
          `- Subject line\n- Personal opener\n- One clear value sentence\n- A single CTA question\n\n` +
          `Also provide a 2-line follow-up for each version.\n` +
          `Tone: confident, human, not “AI-ish”.`,
      };
    }

    if (hasAny(combined, ["spreadsheet", "excel", "sheet", "forecast", "budget", "finance", "variance", "p&l"])) {
      return {
        toolName: "Rows AI",
        whyThisTool:
          "Great for turning messy spreadsheet work into clean insights quickly—especially for summaries, variance explanations, and chart-ready outputs.",
        estimatedMinutesSaved: 50,
        promptTemplate:
          `You are my ${role ?? "finance"} analyst.\n\n` +
          `Context:\n- What I’m working on: ${input.workingOn}\n- The slow part: ${input.timeSink}\n\n` +
          `Task:\n1) List the exact calculations/metrics I should compute\n2) Propose a clean table layout (columns + definitions)\n3) Provide a short executive summary template (5 bullets)\n4) Suggest 2 charts and what each proves\n\n` +
          `If assumptions are needed, list them explicitly.`,
      };
    }

    if (hasAny(combined, ["bug", "refactor", "typescript", "react", "api", "test", "code", "feature"])) {
      return {
        toolName: "Cursor",
        whyThisTool:
          "Designed for coding workflows: faster navigation, refactors, and patch-style edits—especially when the slow part is understanding or restructuring code.",
        estimatedMinutesSaved: 60,
        promptTemplate:
          `You are my senior engineer pair.\n\n` +
          `Context:\n- What I’m working on: ${input.workingOn}\n- The slow part: ${input.timeSink}\n- Tools I tried: ${input.toolsTried}\n\n` +
          `Do:\n1) Restate the goal in one sentence\n2) Identify likely root causes / unknowns\n3) Propose a minimal patch plan (steps)\n4) Provide the actual code changes as a diff-style patch\n\n` +
          `Constraints:\n- Prefer small, readable changes\n- Include edge cases and quick test steps`,
      };
    }

    return {
      toolName: "Perplexity",
      whyThisTool:
        "Best when the slow part is “figuring it out”: it’s strong at grounded research, quick summaries, and turning messy context into an actionable plan.",
      estimatedMinutesSaved: 30,
      promptTemplate:
        `You are my work coach.\n\n` +
        `Context:\n- What I’m working on: ${input.workingOn}\n- The slow part: ${input.timeSink}\n- AI tools I tried: ${input.toolsTried}\n\n` +
        `Help me by:\n1) Asking 3 clarifying questions (only if essential)\n2) Proposing a 6-step plan\n3) Drafting the first deliverable I should produce today\n4) Listing what “done” looks like`,
    };
  })();

  const boosted = role === "Marketing" && recommendation.toolName === "Jasper"
    ? { ...recommendation, estimatedMinutesSaved: recommendation.estimatedMinutesSaved + 10 }
    : recommendation;

  return boosted;
}
