import { optionalEnv, requireEnv } from "./env";

type OpenAIContentPart =
  | { type: "input_text"; text: string }
  | { type: "input_image"; image_url: string };

export type OpenAIUserMessage = {
  role: "user";
  content: OpenAIContentPart[];
};

export async function callOpenAIJson<T>(args: {
  instructions: string;
  user: OpenAIUserMessage;
}): Promise<T> {
  const apiKey = requireEnv("OPENAI_API_KEY");
  const model = optionalEnv("OPENAI_MODEL") ?? "gpt-4.1-mini";

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions: args.instructions,
      input: [args.user],
      temperature: 0.2,
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || `OpenAI error (${res.status})`);
  }

  let payload: any;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("OpenAI returned non-JSON response");
  }

  const outputText: string | undefined = payload?.output_text;
  if (!outputText) {
    throw new Error("OpenAI response missing output_text");
  }

  try {
    return JSON.parse(outputText) as T;
  } catch {
    throw new Error(
      "OpenAI did not return valid JSON. Tip: ensure the prompt demands strict JSON only.",
    );
  }
}
