// frontend that will call backend nanti 
import type { RunSettings, RunResult } from "@/types";

// fake data :
export async function startRun(s: RunSettings): Promise <RunResult> {
    await new Promise((r) => setTimeout(r,1000));
    return {
        id: crypto.randomUUID(),
        instance: s.instance,
        solver: s.solver,
        optimizer: s.optimizer,
        cost: 30553.6,
        gap:2.23,
        vehicles: 25,
        runtime: 1.65,
        valid: true,
        routes : [[0,24,54,53,81,0]],
        history:[]

    }
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const row = (
  solver: string, optimizer: string | null,
  cost: number, gap: number, runtime: number
): RunResult => ({
  id: crypto.randomUUID(),
  instance: "XML100_1111_01",
  solver, optimizer, cost, gap, runtime,
  vehicles: 25,            // placeholder
  valid: true,
  routes: [],
  history: [],
});

export async function startRunAll(_instance: string): Promise<RunResult[]> {
  await delay(1500);
  return [
    row("Nearest Neighbor", null, 32366.34, 8.29, 0.002),
    row("Cheapest Insertion", null, 31328.04, 4.82, 0.010),
    row("Clarke-Wright", null, 30619.31, 2.45, 0.029),
    row("Genetic Algorithm", null, 31938.48, 6.86, 7.086),
    row("Clarke-Wright", "Simulated Annealing", 30553.46, 2.23, 1.727),
    row("Ant Colony", "Simulated Annealing", 33247.82, 11.24, 31.4),
  ];
}