import { getDb } from "./mongodb";
import { Collection, Document } from "mongodb";

// Core MongoDB Document Types
export interface UserDoc extends Document {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "admin" | "user";
  createdAt: string;
}

export interface CompanyDoc extends Document {
  id: string;
  name: string;
  domain: string;
  industry?: string;
  employeeCount?: number | string;
  revenueRange?: string;
  source: "live" | "cached" | "fixture" | "unavailable";
  externalId?: string;
  rawData?: Record<string, any>;
  isDemo?: boolean;
  cachedAt?: string;
  createdAt: string;
}

export interface WorkflowDoc extends Document {
  id: string;
  ownerId?: string;
  name: string;
  description?: string;
  companyId?: string;
  sourceType: string;
  destinationType: string;
  status: "draft" | "active" | "archived";
  currentMappingVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface MappingVersionDoc extends Document {
  id: string;
  workflowId: string;
  version: number;
  mapping: Record<string, any>;
  status: "draft" | "tested" | "approved" | "rejected";
  createdBy: "agent" | "human";
  changeReason?: string;
  createdAt: string;
}

export interface WorkflowRunDoc extends Document {
  id: string;
  workflowId: string;
  ownerId?: string;
  companyId?: string;
  mappingVersionId: string;
  parentRunId?: string;
  status: "queued" | "running" | "verifying" | "repairing" | "failed" | "succeeded" | "blocked";
  triggerType: "manual" | "retry" | "demo";
  attemptNumber: number;
  maxAttempts: number;
  inputSnapshot: Record<string, any>;
  outputSnapshot?: Record<string, any>;
  verification?: Record<string, any>;
  errorSummary?: string;
  neatlogsTraceId?: string;
  entireCheckpointId?: string;
  startedAt?: string;
  finishedAt?: string;
  durationMs?: number;
  idempotencyKey?: string;
  isDuplicateBlocked?: boolean;
  createdAt: string;
}

export interface RunStepDoc extends Document {
  id: string;
  runId: string;
  stepNumber: number;
  stepType: "inspect" | "enrich" | "map" | "execute" | "verify" | "repair" | "destination_write";
  toolName?: string;
  status: "pending" | "running" | "succeeded" | "failed" | "repaired";
  title?: string;
  detail?: string;
  inputData?: Record<string, any>;
  outputData?: Record<string, any>;
  errorMessage?: string;
  durationMs?: number;
  createdAt: string;
}

export interface RunArtifactDoc extends Document {
  id: string;
  runId: string;
  artifactType: "test_report" | "diff" | "checkpoint" | "trace" | "report";
  name: string;
  uri?: string;
  externalId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface FinancialEstimateDoc extends Document {
  id: string;
  workflowId: string;
  currency: string;
  monthlyRuns: number;
  minutesSavedPerRun: number;
  laborCostPerHour: number;
  monthlyInfrastructureCost: number;
  monthlyModelCost: number;
  monthlyRevenue: number;
  annualizedMrr: number;
  grossMarginPercentage: number;
  totalMonthlySavingsUsd: number;
  assumptions?: Record<string, any>;
  cfoaiReference?: string;
  createdAt: string;
}

export interface ConnectorConfigDoc extends Document {
  id: string;
  workflowId: string;
  role: "source" | "destination";
  connectorType: "mock_crm" | "mock_sales" | "mock_task";
  displayName: string;
  config?: Record<string, any>;
  status: "active" | "disabled" | "error";
  createdAt: string;
}

export interface IdempotencyRecordDoc extends Document {
  key: string;
  workflowId: string;
  sourceRecordId: string;
  actionType: string;
  status: "in_progress" | "completed" | "failed";
  destinationRecordId?: string;
  resultPayload?: Record<string, any>;
  createdAt: string;
}

// Database Collection Getters
export async function getUsersCol(): Promise<Collection<UserDoc>> {
  const db = await getDb();
  return db.collection<UserDoc>("users");
}

export async function getCompaniesCol(): Promise<Collection<CompanyDoc>> {
  const db = await getDb();
  return db.collection<CompanyDoc>("companies");
}

export async function getWorkflowsCol(): Promise<Collection<WorkflowDoc>> {
  const db = await getDb();
  return db.collection<WorkflowDoc>("workflows");
}

export async function getMappingVersionsCol(): Promise<Collection<MappingVersionDoc>> {
  const db = await getDb();
  return db.collection<MappingVersionDoc>("mapping_versions");
}

export async function getWorkflowRunsCol(): Promise<Collection<WorkflowRunDoc>> {
  const db = await getDb();
  return db.collection<WorkflowRunDoc>("workflow_runs");
}

export async function getRunStepsCol(): Promise<Collection<RunStepDoc>> {
  const db = await getDb();
  return db.collection<RunStepDoc>("run_steps");
}

export async function getRunArtifactsCol(): Promise<Collection<RunArtifactDoc>> {
  const db = await getDb();
  return db.collection<RunArtifactDoc>("run_artifacts");
}

export async function getFinancialEstimatesCol(): Promise<Collection<FinancialEstimateDoc>> {
  const db = await getDb();
  return db.collection<FinancialEstimateDoc>("financial_estimates");
}

export async function getConnectorConfigsCol(): Promise<Collection<ConnectorConfigDoc>> {
  const db = await getDb();
  return db.collection<ConnectorConfigDoc>("connector_configs");
}

export async function getIdempotencyRecordsCol(): Promise<Collection<IdempotencyRecordDoc>> {
  const db = await getDb();
  return db.collection<IdempotencyRecordDoc>("idempotency_records");
}
