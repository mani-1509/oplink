import { DestinationTaskSchema, DestinationTask, VerificationResult } from "../schemas";

export interface Assertion {
  name: string;
  passed: boolean;
  expected: any;
  actual: any;
  message?: string;
}

/**
 * Perform independent deterministic verification on destination output payload
 */
export function verifyDestinationRecord(
  payload: Record<string, any>,
  idempotencyKey: string
): { isValid: boolean; destinationTask?: DestinationTask; verification: VerificationResult } {
  const assertions: Assertion[] = [];

  // 1. Zod Schema Verification
  const zodResult = DestinationTaskSchema.safeParse(payload);
  assertions.push({
    name: "zod_destination_schema_conformance",
    passed: zodResult.success,
    expected: "valid Zod schema match",
    actual: zodResult.success ? "PASSED" : zodResult.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", "),
    message: zodResult.success ? "All field types match strict destination schema." : "Schema mismatch detected.",
  });

  // 2. Date Format Assertion
  const isIsoDate = typeof payload.due_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(payload.due_date);
  assertions.push({
    name: "iso_date_format_check",
    passed: isIsoDate,
    expected: "YYYY-MM-DD",
    actual: payload.due_date,
    message: isIsoDate ? "due_date conforms to ISO-8601 standard." : `due_date '${payload.due_date}' is not in YYYY-MM-DD format.`,
  });

  // 3. Email Format Assertion
  const isEmail = typeof payload.lead_email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.lead_email);
  assertions.push({
    name: "lead_email_rfc5322_check",
    passed: isEmail,
    expected: "valid email format",
    actual: payload.lead_email,
    message: isEmail ? "Valid email address verified." : "Invalid email format.",
  });

  // 4. Idempotency Key Consistency
  const hasValidKey = Boolean(payload.idempotency_key && payload.idempotency_key === idempotencyKey);
  assertions.push({
    name: "idempotency_key_verification",
    passed: hasValidKey,
    expected: idempotencyKey,
    actual: payload.idempotency_key,
    message: hasValidKey ? "Idempotency key matched execution context." : "Idempotency key mismatch.",
  });

  // 5. Enriched Firmographic Non-Empty Check
  const hasCompanyData = Boolean(payload.company_name && payload.company_domain && payload.industry);
  assertions.push({
    name: "enriched_firmographic_presence",
    passed: hasCompanyData,
    expected: "non-empty company_name, company_domain, industry",
    actual: {
      name: payload.company_name,
      domain: payload.company_domain,
      industry: payload.industry,
    },
    message: hasCompanyData ? "Crustdata firmographic fields verified." : "Missing required company enrichment data.",
  });

  const allPassed = assertions.every((a) => a.passed);

  const verification: VerificationResult = {
    isVerified: allPassed,
    schemaPassed: zodResult.success,
    businessRulesPassed: isIsoDate && isEmail && hasCompanyData,
    idempotencyVerified: hasValidKey,
    assertions,
    verifiedAt: new Date().toISOString(),
  };

  return {
    isValid: allPassed && zodResult.success,
    destinationTask: zodResult.success ? zodResult.data : undefined,
    verification,
  };
}
