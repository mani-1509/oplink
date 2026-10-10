import { describe, it, expect } from "vitest";
import { executeTransformation, executeWorkflowMapping } from "@/lib/engine/execute-workflow";
import { MappingSpec, Lead, CompanyProfile } from "@/lib/schemas";

describe("Safe Mapping DSL & Transformation Engine", () => {
  const sampleLead: Lead = {
    id: "lead_123",
    name: " Sarah Chen ",
    email: "SARAH.CHEN@STRIPE.EXAMPLE",
    companyDomain: "stripe.example",
    status: "qualified",
    isDemo: true,
  };

  const sampleCompany: CompanyProfile = {
    domain: "stripe.example",
    name: "Stripe Demo Infrastructure",
    industry: "Financial Services",
    headcount: 7000,
    enrichmentSource: "fixture",
    isDemo: true,
  };

  it("should execute direct and trim transforms correctly", () => {
    const trimmed = executeTransformation(
      { source: "name", destination: "lead_name", transform: "trim", required: true },
      sampleLead,
      sampleCompany
    );
    expect(trimmed).toBe("Sarah Chen");
  });

  it("should execute lowercase transform on email", () => {
    const lower = executeTransformation(
      { source: "email", destination: "lead_email", transform: "lowercase", required: true },
      sampleLead,
      sampleCompany
    );
    expect(lower).toBe("sarah.chen@stripe.example");
  });

  it("should safely convert MM/DD/YYYY to strict ISO YYYY-MM-DD", () => {
    const leadWithDate = { ...sampleLead, created_at: "10/24/2026" } as any;
    const isoDate = executeTransformation(
      { source: "created_at", destination: "due_date", transform: "date_iso", required: true },
      leadWithDate,
      sampleCompany
    );
    expect(isoDate).toBe("2026-10-24");
  });

  it("should execute safe template interpolation without evaluating code", () => {
    const templ = executeTransformation(
      {
        source: "custom",
        destination: "task_title",
        transform: "template",
        templateString: "[Priority] Onboard {company_name} - {lead_name}",
        required: true,
      },
      sampleLead,
      sampleCompany
    );
    expect(templ).toBe("[Priority] Onboard Stripe Demo Infrastructure -  Sarah Chen ");
  });

  it("should execute complete workflow mapping cleanly", () => {
    const mapping: MappingSpec = {
      id: "map_test_v1",
      name: "Test Mapping",
      version: 1,
      rules: [
        { source: "name", destination: "lead_name", transform: "trim", required: true },
        { source: "email", destination: "lead_email", transform: "lowercase", required: true },
        { source: "company.name", destination: "company_name", transform: "direct", required: true },
        { source: "company.domain", destination: "company_domain", transform: "direct", required: true },
        { source: "company.industry", destination: "industry", transform: "direct", required: true },
        {
          source: "company.headcount",
          destination: "headcount_range",
          transform: "template",
          templateString: "{headcount} employees",
          required: true,
        },
        {
          source: "status",
          destination: "priority",
          transform: "lookup",
          lookupMap: { qualified: "HIGH", lead: "MEDIUM" },
          required: true,
        },
      ],
    };

    const output = executeWorkflowMapping(mapping, sampleLead, sampleCompany);
    expect(output.lead_name).toBe("Sarah Chen");
    expect(output.lead_email).toBe("sarah.chen@stripe.example");
    expect(output.priority).toBe("HIGH");
    expect(output.headcount_range).toBe("7000 employees");
  });
});
