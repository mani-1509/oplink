import OpenAI from "openai";
import { MappingSpec, MappingRule, MappingSpecSchema, Lead, CompanyProfile } from "./schemas";

const nebiusApiKey = process.env.NEBIUS_API_KEY || "";
const nebiusBaseUrl = process.env.NEBIUS_BASE_URL || "https://api.tokenfactory.nebius.com/v1/";
const nebiusModel = process.env.NEBIUS_MODEL || "openai/gpt-oss-120b";

export function getOpenAIClient(): OpenAI | null {
  if (!nebiusApiKey) return null;
  return new OpenAI({
    baseURL: nebiusBaseUrl,
    apiKey: nebiusApiKey,
    timeout: 10000,
  });
}

/**
 * Generate mapping proposal via Nebius Token Factory with Safe Mapping DSL
 */
export async function generateInitialMappingWithAgent(
  lead: Lead,
  company?: CompanyProfile,
  injectDemoError: boolean = true
): Promise<{ mapping: MappingSpec; isLiveLLM: boolean }> {
  const client = getOpenAIClient();

  const systemPrompt = `You are Oplink's Autonomous Integration Engineering Agent.
Generate a structured field mapping specification from a Source CRM Lead to a Destination Task API.

Allowed transformation types: "direct", "trim", "lowercase", "uppercase", "date_iso", "lookup", "template".
Never output arbitrary code or functions.

Output ONLY valid JSON matching:
{
  "id": "map_v1",
  "name": "CRM Lead to Task API Mapping",
  "version": 1,
  "reasoning": "Explanation of proposed mapping",
  "rules": [
    { "source": "...", "destination": "...", "transform": "direct|trim|lowercase|uppercase|date_iso|lookup|template", "templateString": "...", "required": true }
  ]
}`;

  if (client) {
    try {
      const response = await client.chat.completions.create({
        model: nebiusModel,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Source Lead: ${JSON.stringify(lead)}\nCompany: ${JSON.stringify(company)}\n${
              injectDemoError ? "Note: Intentionally map due_date with direct raw pass-through to demonstrate validation detection." : "Ensure all fields match destination ISO schemas."
            }`,
          },
        ],
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const validation = MappingSpecSchema.safeParse(parsed);
        if (validation.success) {
          return { mapping: validation.data, isLiveLLM: true };
        }
      }
    } catch (err) {
      console.warn("Nebius Token Factory call warning, using deterministic DSL mapping:", err);
    }
  }

  // Deterministic safe mapping DSL rules
  const rules: MappingRule[] = [
    { source: "name", destination: "lead_name", transform: "direct", required: true },
    { source: "email", destination: "lead_email", transform: "lowercase", required: true },
    { source: "company.name", destination: "company_name", transform: "direct", required: true },
    { source: "company.domain", destination: "company_domain", transform: "lowercase", required: true },
    { source: "company.industry", destination: "industry", transform: "direct", required: true },
    {
      source: "company.headcount",
      destination: "headcount_range",
      transform: "template",
      templateString: `${company?.headcount || "50-100"} employees`,
      required: true,
    },
    {
      source: "status",
      destination: "priority",
      transform: "lookup",
      notes: lead.status === "qualified" ? "HIGH" : "MEDIUM",
      required: true,
    },
    {
      source: "created_at",
      destination: "due_date",
      // If demo error injected: use 'direct' on raw localized date to demonstrate Zod regex detection
      transform: injectDemoError ? "direct" : "date_iso",
      defaultValue: injectDemoError ? "10/24/2026" : "2026-10-24",
      notes: injectDemoError ? "Direct pass-through of non-ISO localized date" : "date_iso transform applied",
      required: true,
    },
    {
      source: "id",
      destination: "idempotency_key",
      transform: "template",
      templateString: `idemp_${lead.id}_${lead.companyDomain.replace(/\./g, "_")}`,
      required: true,
    },
    {
      source: "custom",
      destination: "task_title",
      transform: "template",
      templateString: `[High Priority] Onboard ${company?.name || "Company"} - ${lead.name}`,
      required: true,
    },
  ];

  return {
    mapping: {
      id: "map_v1",
      name: "CRM Lead to Task API Mapping",
      version: 1,
      reasoning: injectDemoError
        ? "Proposed direct field mappings from CRM Lead and Crustdata profile. Warning: Localized date format passed without ISO normalization."
        : "Standardized mapping with strict ISO-8601 YYYY-MM-DD date transformation.",
      rules,
    },
    isLiveLLM: Boolean(client),
  };
}
