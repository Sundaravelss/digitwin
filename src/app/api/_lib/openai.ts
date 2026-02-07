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
  const model = optionalEnv("OPENAI_MODEL") ?? "gpt-4o-mini";

  // Convert content format for chat completions API
  const userContent = args.user.content.map(part => {
    if (part.type === "input_text") {
      return { type: "text" as const, text: part.text };
    } else {
      return { type: "image_url" as const, image_url: { url: part.image_url } };
    }
  });

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: args.instructions },
        { role: "user", content: userContent },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
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

  const outputText: string | undefined = payload?.choices?.[0]?.message?.content;
  if (!outputText) {
    throw new Error("OpenAI response missing content");
  }

  try {
    return JSON.parse(outputText) as T;
  } catch {
    throw new Error(
      "OpenAI did not return valid JSON. Tip: ensure the prompt demands strict JSON only.",
    );
  }
}
