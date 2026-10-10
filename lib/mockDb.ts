import { Lead, IntegrationRun, DestinationTask } from "./schemas";

// Sample CRM Leads
export const SAMPLE_LEADS: Lead[] = [
  {
    id: "lead_9821",
    name: "Sarah Chen",
    email: "sarah.chen@stripe.example",
    companyDomain: "stripe.example",
    status: "qualified",
    estimatedValue: 120000,
    isDemo: true,
  },
  {
    id: "lead_4419",
    name: "Alex Rivera",
    email: "alex@linear.example",
    companyDomain: "linear.example",
    status: "qualified",
    estimatedValue: 45000,
    isDemo: true,
  },
  {
    id: "lead_3310",
    name: "Marcus Vance",
    email: "marcus@supabase.example",
    companyDomain: "supabase.example",
    status: "lead",
    estimatedValue: 30000,
    isDemo: true,
  },
  {
    id: "lead_7712",
    name: "Elena Rostova",
    email: "elena@acme.example",
    companyDomain: "acme.example",
    status: "qualified",
    estimatedValue: 85000,
    isDemo: true,
  },
];

// In-Memory Global Storage (survives requests during dev session)
declare global {
  var __oplink_runs: Map<string, IntegrationRun> | undefined;
  var __oplink_tasks: Map<string, DestinationTask> | undefined;
}

const runsStore: Map<string, IntegrationRun> = global.__oplink_runs ?? new Map<string, IntegrationRun>();
const tasksStore: Map<string, DestinationTask> = global.__oplink_tasks ?? new Map<string, DestinationTask>();

if (process.env.NODE_ENV !== "production") {
  global.__oplink_runs = runsStore;
  global.__oplink_tasks = tasksStore;
}

export function saveRun(run: IntegrationRun): void {
  runsStore.set(run.id, run);
}

export function getRun(id: string): IntegrationRun | undefined {
  return runsStore.get(id);
}

export function getAllRuns(): IntegrationRun[] {
  return Array.from(runsStore.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function hasTaskWithIdempotencyKey(key: string): boolean {
  return tasksStore.has(key);
}

export function saveDestinationTask(task: DestinationTask): boolean {
  if (tasksStore.has(task.idempotency_key)) {
    return false; // duplicate blocked
  }
  tasksStore.set(task.idempotency_key, task);
  return true;
}

export function getAllDestinationTasks(): DestinationTask[] {
  return Array.from(tasksStore.values());
}
