import { optionalEnv, requireEnv } from "./env";

export type FalResult = {
  imageUrl?: string;
  raw?: unknown;
};

export async function callFalGenerate(args: {
  prompt: string;
  imageDataUrl?: string;
}): Promise<FalResult> {
  const key = requireEnv("FAL_KEY");
  const model = optionalEnv("FAL_MODEL") ?? "fal-ai/flux/dev";

  const res = await fetch(`https://fal.run/${model}`, {
    method: "POST",
    headers: {
      authorization: `Key ${key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      prompt: args.prompt,
      // Many fal image models accept image_url for img2img; if unsupported, the call will fail and
      // the API route can fall back to text-only.
      image_url: args.imageDataUrl,
      image_size: "square_hd",
      num_images: 1,
      enable_safety_checker: true,
    }),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || `fal error (${res.status})`);

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    return { raw: text };
  }

  const imageUrl: string | undefined =
    data?.images?.[0]?.url ?? data?.image?.url ?? data?.output?.[0]?.url;

  return { imageUrl, raw: data };
}
