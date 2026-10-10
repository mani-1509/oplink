import { z } from "zod";

// Safe Transformation DSL Enum (No arbitrary executable code)
export const TransformTypeSchema = z.enum([
  "direct",
  "trim",
  "lowercase",
  "uppercase",
  "date_iso", // Converts MM/DD/YYYY or unix timestamps to ISO YYYY-MM-DD
  "lookup",   // Direct map lookup (e.g. qualified -> HIGH)
  "template", // Safe string interpolation e.g. "{company_name} - {lead_name}"
]);

export type TransformType = z.infer<typeof TransformTypeSchema>;

// Safe Mapping Rule Schema
export const MappingRuleSchema = z.object({
  source: z.string().min(1, "Source path is required"),
  destination: z.string().min(1, "Destination path is required"),
  transform: TransformTypeSchema.default("direct"),
  templateString: z.string().optional(),
  lookupMap: z.record(z.string(), z.string()).optional(),
  defaultValue: z.string().optional(),
  required: z.boolean().default(false),
  notes: z.string().optional(),
});

export type MappingRule = z.infer<typeof MappingRuleSchema>;

// Complete Mapping Specification Schema
export const MappingSpecSchema = z.object({
  id: z.string(),
  name: z.string().default("Integration Mapping Spec"),
  version: z.number().int().positive(),
  rules: z.array(MappingRuleSchema).min(1, "At least one mapping rule is required"),
  reasoning: z.string().optional(),
});

export type MappingSpec = z.infer<typeof MappingSpecSchema>;

// Source CRM Lead Schema
export const LeadSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  companyDomain: z.string().min(1),
  status: z.enum(["lead", "qualified", "customer"]).default("lead"),
  estimatedValue: z.number().optional(),
  isDemo: z.boolean().default(true),
});

export type Lead = z.infer<typeof LeadSchema>;

// Company Firmographic Profile (Crustdata)
export const CompanyProfileSchema = z.object({
  domain: z.string(),
  name: z.string(),
  industry: z.string().optional(),
  headcount: z.number().or(z.string()).optional(),
  revenueRange: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  enrichmentSource: z.enum(["live", "cached", "fixture", "unavailable"]).default("fixture"),
  isDemo: z.boolean().default(true),
});

export type CompanyProfile = z.infer<typeof CompanyProfileSchema>;

// Strict Destination Sales Task Payload Schema
export const DestinationTaskSchema = z.object({
  task_title: z.string().min(5, "Task title must be at least 5 characters"),
  lead_name: z.string().min(1, "Lead name is required"),
  lead_email: z.string().email("Must be a valid email format"),
  company_name: z.string().min(1, "Company name is required"),
  company_domain: z.string().min(3, "Valid domain required"),
  industry: z.string().min(2, "Industry must be populated from company context"),
  headcount_range: z.string().min(1, "Headcount range is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be in strict YYYY-MM-DD ISO format"),
  idempotency_key: z.string().min(8, "Idempotency key required for duplicate prevention"),
  notes: z.string().optional(),
});

export type DestinationTask = z.infer<typeof DestinationTaskSchema>;

// Verification Result Schema (Independent assertion outcomes)
export const VerificationResultSchema = z.object({
  isVerified: z.boolean(),
  schemaPassed: z.boolean(),
  businessRulesPassed: z.boolean(),
  idempotencyVerified: z.boolean(),
  assertions: z.array(
    z.object({
      name: z.string(),
      passed: z.boolean(),
      expected: z.any(),
      actual: z.any(),
      message: z.string().optional(),
    })
  ),
  verifiedAt: z.string(),
});

export type VerificationResult = z.infer<typeof VerificationResultSchema>;

// Telemetry Step Log Interface
export interface RunStep {
  id: string;
  timestamp: string;
  type: "inspect" | "enrich" | "map" | "execute" | "verify" | "repair" | "destination_write";
  status: "pending" | "running" | "succeeded" | "failed" | "repaired";
  title: string;
  detail: string;
  payload?: any;
  error?: string;
  durationMs?: number;
}

// Integration Run Interface
export interface IntegrationRun {
  id: string;
  workflowId: string;
  createdAt: string;
  status: "queued" | "running" | "verifying" | "repairing" | "failed" | "succeeded" | "blocked";
  sourceLead: Lead;
  enrichedCompany?: CompanyProfile;
  proposedMapping?: MappingSpec;
  repairedMapping?: MappingSpec;
  validationErrors?: Array<{ path: string; message: string }>;
  destinationResult?: DestinationTask;
  idempotencyKey: string;
  isDuplicateBlocked?: boolean;
  attempts: number;
  maxAttempts: number;
  steps: RunStep[];
  verification?: VerificationResult;
  neatlogsTraceId?: string;
  neatlogsTraceUrl?: string;
  entireCheckpointId?: string;
  cfoAiSavedHours?: number;
  cfoAiEstimatedSavingsUsd?: number;
}
