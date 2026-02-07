import { NextResponse } from "next/server";
import { sha256Hex } from "../../_lib/hash";

export const runtime = "nodejs";

type VerifyRequest = {
  challengeId: string;
  statement: string;
  result: boolean;
  // In a real ZK system this would be a ZK proof blob; here it's a demo commitment.
  commitmentInput: string;
};

type VerifyResponse = {
  ok: true;
  challengeId: string;
  result: boolean;
  proof: {
    scheme: "demo-commitment";
    commitment: string;
    note: string;
  };
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as VerifyRequest;
    if (!body.challengeId) throw new Error("Missing challengeId");

    const commitment = sha256Hex(
      `${body.challengeId}|${body.statement}|${body.result}|${body.commitmentInput}`,
    );

    return NextResponse.json<VerifyResponse>({
      ok: true,
      challengeId: body.challengeId,
      result: Boolean(body.result),
      proof: {
        scheme: "demo-commitment",
        commitment,
        note:
          "Demo only. Real zero-knowledge verification would use ZK proofs (e.g., zk-SNARKs) so the verifier learns only TRUE/FALSE, not raw biometrics.",
      },
    });
  } catch (e) {
    return new NextResponse(
      e instanceof Error ? e.message : "Unknown error",
      { status: 400 },
    );
  }
}
