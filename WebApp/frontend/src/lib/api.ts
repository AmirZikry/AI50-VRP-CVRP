// frontend that will call backend nanti
import type { RunSettings, RunResult, InstanceData, RunType } from "@/types";

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
    throw new Error(
      typeof body?.detail === "string"
        ? body.detail
        : `Request failed (${res.status})`,
    );
  }
  return res.json();
}

// ApiRow (backend) -> RunResult
function toRunResult(row: ApiRow, instance: string): RunResult {
  if (
    row.error ||
    row.cost === null ||
    row.gap === null ||
    row.vehicles === null
  ) {
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
  if (!row)
    throw new Error("The backend returned no result for this configuration.");
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
      console.warn(
        `${row.solver} + ${row.optimizer} failed:`,
        (e as Error).message,
      ); // skip failed rows
    }
  }
  if (ok.length === 0) throw new Error("All runs failed.");
  return ok;
}

// Names of every instance the backend knows (GET /options/). Fetched once, then reused.
let instanceNames: Promise<string[]> | null = null;
export function getInstanceNames(): Promise<string[]> {
  instanceNames ??= fetch(`${API_URL}/options/`)
    .then((res) => {
      if (!res.ok)
        throw new Error(`Could not load the instance list (${res.status}).`);
      return res.json();
    })
    .then((data) => data.instances as string[])
    .catch((e) => {
      instanceNames = null;
      throw new Error(
        e instanceof TypeError
          ? `Cannot reach the backend at ${API_URL}.`
          : e.message,
      );
    });
  return instanceNames;
}

// Used by Sidebar to fill the solver / optimizer dropdowns (GET /options/)
export async function getInstanceList(signal?: AbortSignal) {
  const res = await fetch(`${API_URL}/options/`, { signal });

  if (!res.ok) {
    throw new Error(`Failed to fetch options (${res.status})`);
  }

  return res.json();
}

// fake data :
export async function startRun(s: RunSettings): Promise<RunResult> {
  await new Promise((r) => setTimeout(r, 1000));

  // Generate a few sample routes with convergence history
  const routes = [
    [0, 24, 54, 53, 81, 0],
    [0, 3, 10, 16, 42, 0],
    [0, 8, 9, 13, 96, 0],
    [0, 2, 14, 20, 21, 23, 0],
    [0, 4, 5, 7, 18, 19, 12, 0],
    [0, 6, 22, 97, 15, 0],
    [0, 11, 1, 99, 100, 0],
    [0, 17, 46, 47, 48, 0],
    [0, 25, 26, 27, 28, 0],
    [0, 29, 30, 31, 32, 33, 0],
    [0, 34, 35, 36, 37, 0],
    [0, 38, 39, 40, 41, 0],
    [0, 43, 44, 45, 49, 0],
    [0, 50, 51, 52, 55, 0],
    [0, 56, 57, 58, 59, 0],
    [0, 60, 61, 62, 63, 64, 0],
    [0, 65, 66, 67, 68, 0],
    [0, 69, 70, 71, 72, 0],
    [0, 73, 74, 75, 76, 0],
    [0, 77, 78, 79, 80, 0],
    [0, 82, 83, 84, 85, 0],
    [0, 86, 87, 88, 89, 0],
    [0, 90, 91, 92, 93, 0],
    [0, 94, 95, 98, 0],
  ];

  // Build a mock convergence history
  const history: { t: number; cost: number }[] = [];
  let c = 42000;
  for (let i = 0; i < 50; i++) {
    c -= Math.random() * 400 * Math.exp(-i / 15);
    history.push({ t: i, cost: Math.round(c * 100) / 100 });
  }
  // Ensure last matches reported cost
  history[history.length - 1].cost = 30553.6;

  return {
    id: crypto.randomUUID(),
    instance: s.instance,
    solver: s.solver,
    optimizer: s.optimizer,
    cost: 30553.6,
    gap: 2.23,
    vehicles: routes.length,
    runtime: 1.65,
    valid: true,
    routes,
    history,
  };
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const row = (
  solver: string,
  optimizer: string | null,
  cost: number,
  gap: number,
  runtime: number,
): RunResult => ({
  id: crypto.randomUUID(),
  instance: "XML100_1111_01",
  solver,
  optimizer,
  cost,
  gap,
  runtime,
  vehicles: 25, // placeholder
  valid: true,
  routes: [],
  history: [],
});

export async function startRunAll(_instance: string): Promise<RunResult[]> {
  await delay(1500);
  return [
    row("Nearest Neighbor", null, 32366.34, 8.29, 0.002),
    row("Cheapest Insertion", null, 31328.04, 4.82, 0.01),
    row("Clarke-Wright", null, 30619.31, 2.45, 0.029),
    row("Genetic Algorithm", null, 31938.48, 6.86, 7.086),
    row("Clarke-Wright", "Simulated Annealing", 30553.46, 2.23, 1.727),
    row("Ant Colony", "Simulated Annealing", 33247.82, 11.24, 31.4),
  ];
}

/** Fetch instance geometry (coords + demands) for route visualisation.
 *  Uses mock data matching XML100_1111_01 until backend endpoint is wired. */
export async function fetchInstanceData(
  instanceName: string,
): Promise<InstanceData> {
  // TODO: replace with real API call: GET /options/instance/{instanceName}
  // For now, generate deterministic coordinates from the VRP file dimensions

  await delay(200);

  // Seed-based pseudo-random for reproducibility
  const seed = instanceName.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (i: number) => {
    const x = Math.sin(seed * 9301 + i * 49297) * 49297;
    return x - Math.floor(x);
  };

  const dimension = 101;
  const coords: [number, number][] = [];
  const demands: number[] = [0]; // depot demand = 0

  // Depot
  coords.push([Math.round(rng(0) * 1000), Math.round(rng(1) * 1000)]);

  // Customers
  for (let i = 1; i < dimension; i++) {
    coords.push([
      Math.round(rng(i * 2) * 1000),
      Math.round(rng(i * 2 + 1) * 1000),
    ]);
    demands.push(1); // XML100 instances typically have demand=1 with low capacity
  }

  return {
    name: instanceName,
    dimension,
    capacity: 4,
    coords,
    demands,
  };
}
