import { NextResponse } from "next/server";
import { fileToDataUrl } from "../../_lib/base64";
import { callFalGenerate } from "../../_lib/fal";

export const runtime = "nodejs";

type AvatarGenerateResult = {
  imageUrl?: string;
  notes?: string;
};

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const image = form.get("image");
    const imageFile = image instanceof File ? image : null;

    if (!imageFile) {
      throw new Error("No image provided");
    }

    const imageDataUrl = await fileToDataUrl(imageFile);

    const prompt =
      "3D rendered game character portrait in the style of a modern video game character select screen. " +
      "Stylized semi-realistic proportions like Fortnite or Overwatch heroes. " +
      "Smooth clean skin with subtle cel-shading, vibrant saturated colors, " +
      "heroic confident standing pose, upper body centered, " +
      "dark gradient background with subtle cyan and blue rim lighting, " +
      "highly detailed, 4k quality, digital art style, " +
      "maintain the subject's facial features and identity faithfully. " +
      "No text, no watermarks.";

    const fal = await callFalGenerate({ prompt, imageDataUrl });

    return NextResponse.json<AvatarGenerateResult>({
      imageUrl: fal.imageUrl,
      notes: fal.imageUrl ? undefined : "FAL returned no image URL",
    });
  } catch (e) {
    return new NextResponse(
      e instanceof Error ? e.message : "Unknown error",
      { status: 400 },
    );
  }
}
