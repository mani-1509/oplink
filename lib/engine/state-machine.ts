export type RunStatus =
  | "queued"
  | "running"
  | "verifying"
  | "repairing"
  | "failed"
  | "succeeded"
  | "blocked";

export interface StateTransitionEvent {
  from: RunStatus;
  to: RunStatus;
  reason?: string;
  timestamp: string;
}

const VALID_TRANSITIONS: Record<RunStatus, RunStatus[]> = {
  queued: ["running", "failed", "blocked"],
  running: ["verifying", "failed", "blocked"],
  verifying: ["succeeded", "repairing", "failed", "blocked"],
  repairing: ["verifying", "blocked", "failed"],
  failed: ["queued"], // retry starts new attempt or transitions to queued
  succeeded: [], // terminal
  blocked: [], // terminal (retry budget exhausted)
};

export class RunStateMachine {
  private currentStatus: RunStatus;
  private history: StateTransitionEvent[] = [];

  constructor(initialStatus: RunStatus = "queued") {
    this.currentStatus = initialStatus;
    this.history.push({
      from: initialStatus,
      to: initialStatus,
      reason: "Initial state",
      timestamp: new Date().toISOString(),
    });
  }

  public getStatus(): RunStatus {
    return this.currentStatus;
  }

  public getHistory(): StateTransitionEvent[] {
    return [...this.history];
  }

  public transitionTo(nextStatus: RunStatus, reason?: string): boolean {
    const allowed = VALID_TRANSITIONS[this.currentStatus] || [];
    if (!allowed.includes(nextStatus)) {
      throw new Error(
        `Invalid state transition: Cannot transition from '${this.currentStatus}' to '${nextStatus}'. Allowed: [${allowed.join(", ")}]`
      );
    }

    const event: StateTransitionEvent = {
      from: this.currentStatus,
      to: nextStatus,
      reason,
      timestamp: new Date().toISOString(),
    };

    this.currentStatus = nextStatus;
    this.history.push(event);
    return true;
  }
}
