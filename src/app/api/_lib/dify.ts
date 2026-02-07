import { optionalEnv } from "./env";

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
