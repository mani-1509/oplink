import { describe, it, expect } from "vitest";
import { executeWorkflowMapping } from "@/lib/engine/execute-workflow";
import { verifyDestinationRecord } from "@/lib/engine/verify-result";
import { repairMappingDslWithAgent } from "@/lib/engine/repair";
import { MappingSpec, Lead, CompanyProfile } from "@/lib/schemas";

describe("Deterministic Failure & Self-Healing Recovery Integration", () => {
  const lead: Lead = {
    id: "lead_9821",
    name: "Sarah Chen",
    email: "sarah.chen@stripe.example",
    companyDomain: "stripe.example",
    status: "qualified",
    isDemo: true,
  };

  const company: CompanyProfile = {
    domain: "stripe.example",
    name: "Stripe Demo Infrastructure",
    industry: "Financial Services",
    headcount: "7000",
    enrichmentSource: "fixture",
    isDemo: true,
  };

  const initialBrokenMapping: MappingSpec = {
    id: "map_v1",
    name: "Initial Mapping Spec with Localized Date",
    version: 1,
    rules: [
      { source: "name", destination: "lead_name", transform: "direct", required: true },
      { source: "email", destination: "lead_email", transform: "lowercase", required: true },
      { source: "company.name", destination: "company_name", transform: "direct", required: true },
      { source: "company.domain", destination: "company_domain", transform: "lowercase", required: true },
      { source: "company.industry", destination: "industry", transform: "direct", required: true },
      {
        source: "company.headcount",
        destination: "headcount_range",
        transform: "template",
        templateString: "{headcount} employees",
        required: true,
      },
      { source: "status", destination: "priority", transform: "lookup", notes: "HIGH", required: true },
      {
        source: "created_at",
        destination: "due_date",
        transform: "direct", // passes raw localized date '10/24/2026'
        defaultValue: "10/24/2026",
        required: true,
      },
      {
        source: "custom",
        destination: "task_title",
        transform: "template",
        templateString: "[Priority] Onboard {company_name} - {lead_name}",
        required: true,
      },
    ],
  };

  it("should fail validation on initial broken mapping", () => {
    const payload = executeWorkflowMapping(initialBrokenMapping, lead, company);
    payload.idempotency_key = "idemp_test_9821";

    const verification = verifyDestinationRecord(payload, "idemp_test_9821");
    expect(verification.isValid).toBe(false);
    expect(verification.verification.schemaPassed).toBe(false);
  });

  it("should diagnose failure and self-heal to a passing mapping version 2", async () => {
    const payload = executeWorkflowMapping(initialBrokenMapping, lead, company);
    payload.idempotency_key = "idemp_test_9821";

    const initialVerification = verifyDestinationRecord(payload, "idemp_test_9821");
    const errors = initialVerification.verification.assertions
      .filter((a) => !a.passed)
      .map((a) => ({ path: a.name, message: a.message || "failed" }));

    // Run repair
    const { repairedMapping } = await repairMappingDslWithAgent(
      initialBrokenMapping,
      errors,
      lead,
      company
    );

    expect(repairedMapping.version).toBe(2);

    // Re-execute with repaired mapping
    const repairedPayload = executeWorkflowMapping(repairedMapping, lead, company);
    repairedPayload.idempotency_key = "idemp_test_9821";

    const repairedVerification = verifyDestinationRecord(repairedPayload, "idemp_test_9821");
    expect(repairedVerification.isValid).toBe(true);
    expect(repairedVerification.verification.schemaPassed).toBe(true);
    expect(repairedVerification.destinationTask?.due_date).toBe("2026-10-24");
  });
});
