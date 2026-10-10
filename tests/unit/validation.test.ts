import { describe, it, expect } from "vitest";
import { verifyDestinationRecord } from "@/lib/engine/verify-result";
import { RunStateMachine } from "@/lib/engine/state-machine";

describe("Independent Verification & State Machine", () => {
  const validPayload = {
    task_title: "[High Priority] Onboard Stripe - Sarah Chen",
    lead_name: "Sarah Chen",
    lead_email: "sarah.chen@stripe.example",
    company_name: "Stripe Demo Infrastructure",
    company_domain: "stripe.example",
    industry: "Financial Services",
    headcount_range: "7000 employees",
    priority: "HIGH",
    due_date: "2026-10-24",
    idempotency_key: "idemp_test_123_stripe",
  };

  it("should pass independent verification for valid payload", () => {
    const result = verifyDestinationRecord(validPayload, "idemp_test_123_stripe");
    expect(result.isValid).toBe(true);
    expect(result.verification.schemaPassed).toBe(true);
    expect(result.verification.businessRulesPassed).toBe(true);
    expect(result.verification.idempotencyVerified).toBe(true);
  });

  it("should reject payloads with localized non-ISO dates", () => {
    const invalidPayload = { ...validPayload, due_date: "10/24/2026" };
    const result = verifyDestinationRecord(invalidPayload, "idemp_test_123_stripe");
    expect(result.isValid).toBe(false);
    expect(result.verification.schemaPassed).toBe(false);
  });

  it("should enforce valid state machine transitions", () => {
    const sm = new RunStateMachine("queued");
    expect(sm.getStatus()).toBe("queued");

    sm.transitionTo("running", "Start");
    expect(sm.getStatus()).toBe("running");

    sm.transitionTo("verifying", "Dry-run evaluation");
    expect(sm.getStatus()).toBe("verifying");

    sm.transitionTo("repairing", "Recoverable failure");
    expect(sm.getStatus()).toBe("repairing");

    sm.transitionTo("verifying", "Re-verifying new mapping");
    expect(sm.getStatus()).toBe("verifying");

    sm.transitionTo("succeeded", "Verification passed");
    expect(sm.getStatus()).toBe("succeeded");

    // Terminal state cannot transition
    expect(() => sm.transitionTo("running")).toThrow();
  });
});
