import { optionalEnv } from "./env";

export type DifyThinkingStep = {
  step: number;
  title: string;
  content: string;
  timestamp: string;
};

export type DifyStreamResponse = {
  answer: string;
  thinkingSteps: DifyThinkingStep[];
  conversationId?: string;
};

export async function difyQuery(args: {
  query: string;
  user: string;
  inputs?: Record<string, unknown>;
}): Promise<string | null> {
  const baseUrl = optionalEnv("DIFY_API_URL");
  const apiKey = optionalEnv("DIFY_API_KEY");
  if (!baseUrl || !apiKey) return null;

  const url = `${baseUrl.replace(/\/$/, "")}/v1/chat-messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      response_mode: "blocking",
      user: args.user,
      query: args.query,
      inputs: args.inputs ?? {},
    }),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || `Dify error (${res.status})`);

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    return text;
  }

  const answer: string | undefined = data?.answer;
  if (answer && answer.trim().length) return answer;

  const msg: string | undefined = data?.message;
  if (msg && msg.trim().length) return msg;

  return null;
}

// Streaming Dify query that returns thinking steps
export async function difyStreamQuery(args: {
  query: string;
  user: string;
  inputs?: Record<string, unknown>;
  onThinking?: (step: DifyThinkingStep) => void;
}): Promise<DifyStreamResponse | null> {
  const baseUrl = optionalEnv("DIFY_API_URL");
  const apiKey = optionalEnv("DIFY_API_KEY");
  if (!baseUrl || !apiKey) return null;

  const url = `${baseUrl.replace(/\/$/, "")}/v1/chat-messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      response_mode: "streaming",
      user: args.user,
      query: args.query,
      inputs: args.inputs ?? {},
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Dify error (${res.status})`);
  }

  const thinkingSteps: DifyThinkingStep[] = [];
  let answer = "";
  let conversationId: string | undefined;
  let stepCounter = 0;

  // Read the streaming response
  const reader = res.body?.getReader();
  if (!reader) return null;

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const jsonStr = line.slice(6);
        if (jsonStr === "[DONE]") continue;

        try {
          const data = JSON.parse(jsonStr);
          
          // Capture agent thinking events
          if (data.event === "agent_thought" || data.event === "node_started") {
            stepCounter++;
            const step: DifyThinkingStep = {
              step: stepCounter,
              title: data.thought || data.node_type || `Step ${stepCounter}`,
              content: data.observation || data.message || "",
              timestamp: new Date().toISOString(),
            };
            thinkingSteps.push(step);
            args.onThinking?.(step);
          }
          
          // Capture workflow steps
          if (data.event === "workflow_started") {
            stepCounter++;
            const step: DifyThinkingStep = {
              step: stepCounter,
              title: "Workflow Started",
              content: data.workflow_run_id || "",
              timestamp: new Date().toISOString(),
            };
            thinkingSteps.push(step);
            args.onThinking?.(step);
          }

          // Capture tool calls
          if (data.event === "tool_call") {
            stepCounter++;
            const step: DifyThinkingStep = {
              step: stepCounter,
              title: `Calling: ${data.tool || "tool"}`,
              content: JSON.stringify(data.tool_input || {}, null, 2),
              timestamp: new Date().toISOString(),
            };
            thinkingSteps.push(step);
            args.onThinking?.(step);
          }

          // Capture the final answer
          if (data.event === "message" || data.event === "agent_message") {
            answer += data.answer || data.message || "";
          }

          // Capture conversation ID
          if (data.conversation_id) {
            conversationId = data.conversation_id;
          }
        } catch {
          // Ignore parse errors for malformed chunks
        }
      }
    }
  }

  return {
    answer: answer.trim(),
    thinkingSteps,
    conversationId,
  };
}

// ── Dify Workflow API (/v1/workflows/run) ──

export type DifyWorkflowResponse = {
  workflowRunId: string;
  taskId: string;
  status: "running" | "succeeded" | "failed" | "stopped";
  outputs: Record<string, unknown>;
  error?: string;
  elapsedTime?: number;
  totalTokens?: number;
  totalSteps?: number;
};

export async function difyWorkflowRun(args: {
  inputs: Record<string, unknown>;
  user: string;
  files?: Array<{ type: string; transfer_method: string; upload_file_id: string }>;
  apiKeyEnv?: string;
}): Promise<DifyWorkflowResponse | null> {
  const baseUrl = optionalEnv("DIFY_API_URL");
  const apiKey = optionalEnv(args.apiKeyEnv || "DIFY_INTAKE_API_KEY");
  if (!baseUrl || !apiKey) return null;

  const url = `${baseUrl.replace(/\/$/, "").replace(/\/v1$/, "")}/v1/workflows/run`;

  const payload: Record<string, unknown> = {
    inputs: args.inputs,
    response_mode: "blocking",
    user: args.user,
  };
  if (args.files && args.files.length > 0) {
    payload.files = args.files;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || `Dify workflow error (${res.status})`);

  const data = JSON.parse(text);
  return {
    workflowRunId: data.workflow_run_id,
    taskId: data.task_id,
    status: data.data?.status ?? "failed",
    outputs: data.data?.outputs ?? {},
    error: data.data?.error ?? undefined,
    elapsedTime: data.data?.elapsed_time,
    totalTokens: data.data?.total_tokens,
    totalSteps: data.data?.total_steps,
  };
}

export async function difyWorkflowStream(args: {
  inputs: Record<string, unknown>;
  user: string;
  apiKeyEnv?: string;
}): Promise<{
  stream: ReadableStream<Uint8Array>;
  response: Response;
} | null> {
  const baseUrl = optionalEnv("DIFY_API_URL");
  const apiKey = optionalEnv(args.apiKeyEnv || "DIFY_INTAKE_API_KEY");
  if (!baseUrl || !apiKey) return null;

  const url = `${baseUrl.replace(/\/$/, "").replace(/\/v1$/, "")}/v1/workflows/run`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      inputs: args.inputs,
      response_mode: "streaming",
      user: args.user,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Dify workflow stream error (${res.status})`);
  }

  if (!res.body) return null;

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = "";

  const transformStream = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonStr = line.slice(6).trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;
          controller.enqueue(encoder.encode(`data: ${jsonStr}\n\n`));
        }
      }
    },
    flush(controller) {
      if (buffer.startsWith("data: ")) {
        const jsonStr = buffer.slice(6).trim();
        if (jsonStr && jsonStr !== "[DONE]") {
          controller.enqueue(encoder.encode(`data: ${jsonStr}\n\n`));
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
    },
  });

  const stream = res.body.pipeThrough(transformStream);
  return { stream, response: res };
}

// Check drug interactions using Dify workflow
export async function difyDrugInteractionCheck(args: {
  drugName: string;
  patientConditions?: string;
  currentMeds?: string;
  allergies?: string;
  user: string;
}): Promise<{ 
  interactions: string[]; 
  warnings: string[];
  thinkingSteps: DifyThinkingStep[];
} | null> {
  const query = `Check drug interactions and safety for: ${args.drugName}
Patient conditions: ${args.patientConditions || "None reported"}
Current medications: ${args.currentMeds || "None"}
Known allergies: ${args.allergies || "NKDA (No Known Drug Allergies)"}

Please analyze:
1. Known drug-drug interactions
2. Contraindications based on conditions
3. Allergy cross-reactivity risks
4. Dosing considerations`;

  const result = await difyStreamQuery({
    query,
    user: args.user,
    inputs: {
      drug_name: args.drugName,
      conditions: args.patientConditions || "",
      current_meds: args.currentMeds || "",
      allergies: args.allergies || "",
    },
  });

  if (!result) return null;

  // Parse the response for interactions and warnings
  const interactions: string[] = [];
  const warnings: string[] = [];
  
  const lines = result.answer.split("\n");
  let currentSection = "";
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().includes("interaction")) {
      currentSection = "interactions";
    } else if (trimmed.toLowerCase().includes("warning") || trimmed.toLowerCase().includes("caution")) {
      currentSection = "warnings";
    } else if (trimmed.startsWith("-") || trimmed.startsWith("•") || trimmed.match(/^\d+\./)) {
      const content = trimmed.replace(/^[-•\d.]+\s*/, "").trim();
      if (content) {
        if (currentSection === "interactions") {
          interactions.push(content);
        } else if (currentSection === "warnings") {
          warnings.push(content);
        }
      }
    }
  }

  return {
    interactions,
    warnings,
    thinkingSteps: result.thinkingSteps,
  };
}
