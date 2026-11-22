import type { RunSettings, RunResult, RunType } from "@/types";

const API_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type ApiRow = {
  type: RunType;
  solver: string;
  optimizer: string | null;
  cost: number | null;
  gap: number | null;
  vehicles: number | null;
  valid: boolean;
  runtime: number;
  routes: number[][];
  history: { t: number; cost: number }[];
  error: string | null;
};

async function postSolutions(
  instanceName: string,
  solvers: string[] | "all",
  optimizer: string | null,
): Promise<ApiRow[]> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/solutions/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instanceName, solvers, optimizer }),
    });
  } catch {
    throw new Error(`Cannot reach the backend at ${API_URL}. Is it running?`);
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(typeof body?.detail === "string" ? body.detail : `Request failed (${res.status})`);
  }
  return res.json();
}

// ApiRow (backend) -> RunResult 
function toRunResult(row: ApiRow, instance: string): RunResult {
  if (row.error || row.cost === null || row.gap === null || row.vehicles === null) {
    throw new Error(row.error ?? "The run failed");
  }
  return {
    id: crypto.randomUUID(),
    instance,
    type: row.type,
    solver: row.solver,
    optimizer: row.optimizer,
    cost: row.cost,
    gap: row.gap,
    vehicles: row.vehicles,
    runtime: row.runtime,
    valid: row.valid,
    routes: row.routes,
    history: row.history,
  };
}

// "Run solver": one solver with or w/o solver
export async function startRun(s: RunSettings): Promise<RunResult> {
  const rows = await postSolutions(s.instance, [s.solver], s.optimizer);
  const row = rows.find((r) => r.optimizer === s.optimizer);
  if (!row) throw new Error("The backend returned no result for this configuration.");
  return toRunResult(row, s.instance);
}

// "Run all": every solver (15 rows)
export async function startRunAll(instance: string): Promise<RunResult[]> {
  const rows = await postSolutions(instance, "all", "all");
  const ok: RunResult[] = [];
  for (const row of rows) {
    try {
      ok.push(toRunResult(row, instance));
    } catch (e) {
      console.warn(`${row.solver} + ${row.optimizer} failed:`, (e as Error).message);   // skip failed rows
    }
  }
  if (ok.length === 0) throw new Error("All runs failed.");
  return ok;
}