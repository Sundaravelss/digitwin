import { NextResponse } from "next/server";
import { difyQuery } from "../../_lib/dify";

export const runtime = "nodejs";

type PolicyClause = {
  section: string;
  title: string;
  content: string;
  coverage: "covered" | "not_covered" | "partial" | "requires_preauthorization";
  maxBenefit?: string;
  claimLink?: string;
};

type PolicyDecoderResponse = {
  query: string;
  answer: string;
  relevantClauses: PolicyClause[];
  actionItems: string[];
  source: "dify_rag" | "demo";
};

function demoPolicyResponse(query: string): PolicyDecoderResponse {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes("gym") || lowerQuery.includes("fitness")) {
    return {
      query,
      answer: "Yes, gym memberships are covered under the Wellness Benefits section up to $600/year when enrolled in the Vitality Program.",
      relevantClauses: [
        {
          section: "Section 4.2.1",
          title: "Wellness Benefits - Physical Activity",
          content: "Members enrolled in the Vitality Credits program may claim reimbursement for gym membership fees, fitness classes, and personal training sessions up to the annual maximum benefit.",
          coverage: "covered",
          maxBenefit: "$600/year",
          claimLink: "/claims/wellness/gym",
        },
        {
          section: "Section 4.2.3",
          title: "Wellness Benefits - Eligibility",
          content: "To be eligible for wellness reimbursement, member must: (a) be enrolled in Vitality Credits program, (b) maintain active policy status, (c) submit receipts within 90 days of purchase.",
          coverage: "partial",
        },
      ],
      actionItems: [
        "Enroll in Vitality Credits program if not already enrolled",
        "Save gym membership receipts",
        "Submit claim within 90 days via online portal",
      ],
      source: "demo",
    };
  }
  
  if (lowerQuery.includes("preventive") || lowerQuery.includes("checkup") || lowerQuery.includes("screening")) {
    return {
      query,
      answer: "Annual preventive care visits and recommended screenings are covered at 100% with no deductible when using in-network providers.",
      relevantClauses: [
        {
          section: "Section 3.1.1",
          title: "Preventive Care Services",
          content: "Covered preventive services include: annual wellness exam, age-appropriate immunizations, cancer screenings as per USPSTF guidelines, cardiovascular risk assessments, diabetes screening, and depression screening.",
          coverage: "covered",
          maxBenefit: "No limit",
        },
      ],
      actionItems: [
        "Schedule annual wellness visit with in-network provider",
        "No claim submission needed - provider bills directly",
      ],
      source: "demo",
    };
  }

  return {
    query,
    answer: "Please refer to your specific policy document for detailed coverage information. Standard preventive care and wellness benefits may apply.",
    relevantClauses: [
      {
        section: "General",
        title: "Coverage Overview",
        content: "Coverage varies by plan type and enrollment date. Contact member services for specific benefit details.",
        coverage: "partial",
      },
    ],
    actionItems: [
      "Review your Summary of Benefits document",
      "Contact member services at 1-800-XXX-XXXX",
      "Log into member portal for personalized coverage details",
    ],
    source: "demo",
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { query?: string; policyId?: string };
    const query = (body.query ?? "").trim();
    if (!query) throw new Error("Missing query");

    // Try Dify RAG first (searches the insurance policy knowledge base)
    const difyAnswer = await difyQuery({
      user: "digitwin-insurer-policy",
      query: `Search the insurance policy knowledge base for: "${query}"
      
Return a JSON object with:
- answer: Direct answer to the question
- relevantClauses: Array of {section, title, content, coverage, maxBenefit, claimLink}
- actionItems: Array of next steps

Focus on specific policy sections, coverage limits, and claim procedures.`,
      inputs: { 
        policyId: body.policyId ?? "standard-health-2025",
        mode: "rag_policy" 
      },
    }).catch(() => null);

    if (difyAnswer) {
      try {
        const parsed = JSON.parse(difyAnswer) as Omit<PolicyDecoderResponse, "query" | "source">;
        return NextResponse.json<PolicyDecoderResponse>({
          query,
          answer: parsed.answer,
          relevantClauses: parsed.relevantClauses ?? [],
          actionItems: parsed.actionItems ?? [],
          source: "dify_rag",
        });
      } catch {
        // Dify returned non-JSON, wrap it
        return NextResponse.json<PolicyDecoderResponse>({
          query,
          answer: difyAnswer,
          relevantClauses: [],
          actionItems: [],
          source: "dify_rag",
        });
      }
    }

    // Fallback to demo response
    return NextResponse.json(demoPolicyResponse(query));
  } catch (e) {
    return new NextResponse(
      e instanceof Error ? e.message : "Unknown error",
      { status: 400 },
    );
  }
}
