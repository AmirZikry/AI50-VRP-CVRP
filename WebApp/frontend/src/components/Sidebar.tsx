import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { startRun, startRunAll } from "@/lib/api";
import { useRunStore } from "@/store/runStore";

const SOLVERS = [
  "Clarke-Wright",
  "Nearest Neighbor",
  "Cheapest Insertion",
  "Genetic Algorithm",
  "Ant Colony",
];
const OPTIMIZERS = ["none", "Simulated Annealing", "Tabu Search"];

const STATUS_LABELS: Record<string, string> = {
  idle: "Ready",
  running: "Running...",
  done: "Done",
  failed: "Failed",
};


export default function Sidebar() {
  const settings = useRunStore((s) => s.settings);
  const setSettings = useRunStore((s) => s.setSettings);
  const cancelRun = useRunStore((s) => s.cancelRun);
  const status = useRunStore((s) => s.status);
  const setStatus = useRunStore((s) => s.setStatus);
  const run = useRunStore((s) => s.currentRun);
  const addRun = useRunStore((s) => s.addRun);
  const setBatch = useRunStore((s) => s.setBatch);

  const isStale = (token: number) => useRunStore.getState().runToken !== token;

  async function handleRun() {
    const token = useRunStore.getState().runToken;
    setStatus("running");
  try {
      const result = await startRun(settings);
      if (isStale(token)) return;
      addRun(result);
    } catch {
      if (!isStale(token)) setStatus("failed");
    }
  }

  async function handleRunAll() {
    const token = useRunStore.getState().runToken;
    setStatus("running");
    try {
      const results = await startRunAll(settings.instance);
      if (isStale(token)) return;
      setBatch(results);
    } catch {
      if (!isStale(token)) setStatus("failed");
    }
  }

  function handleCancel() {
    cancelRun();
  }

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-card border border-border rounded-xl p-5 flex flex-col gap-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Configuration
        </h2>
        <span className="text-[11px] font-mono text-muted-foreground">CVRP</span>
      </div>

      <div className="space-y-4">
        {/* Instance */}
        <div className="space-y-1.5">
          <Label htmlFor="instance" className="text-xs font-medium">Instance</Label>
          <Input
            id="instance"
            value={settings.instance}
            onChange={(e) => setSettings({ instance: e.target.value })}
            className="font-mono text-xs bg-background/50 h-9"
          />
        </div>

        {/* Solver */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Solver</Label>
          <Select value={settings.solver} onValueChange={(val) => val && setSettings({solver:val})}>
            <SelectTrigger className="w-full text-xs bg-background/50 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SOLVERS.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Optimizer */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Optimizer (hybrid)</Label>
          <Select value={settings.optimizer ?? "none"} 
            onValueChange={(val) => val && setSettings({ optimizer: val === "none" ? null : val })}>
            <SelectTrigger className="w-full text-xs bg-background/50 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OPTIMIZERS.map((o) => (
                <SelectItem key={o} value={o} className="text-xs">
                  {o === "none" ? "None" : o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Zone */}
      <div className="mt-auto pt-4 flex flex-col gap-2.5 border-t border-border/60">
        
        {/* 1. Status Bar directly above "Run solver" */}
        <div className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-xs">
          <span
            className={`h-2.5 w-2.5 rounded-full shrink-0 ${
              status === "running"
                ? "bg-amber-500 animate-pulse"
                : status === "failed"
                ? "bg-destructive"
                : status === "done"
                ? "bg-emerald-500"
                : "bg-muted-foreground/40"
            }`}
          />
          <span className="font-semibold text-foreground">
            {STATUS_LABELS[status] ?? "Ready"}
          </span>

          {run && (
            <span className="text-muted-foreground truncate text-[11px] ml-auto">
              {run.solver}{run.optimizer && run.optimizer !== "none" ? ` + ${run.optimizer}` : ""}
            </span>
          )}
        </div>

        {/* 2. Run solver button */}
        <Button
          onClick={handleRun}
          disabled={status === "running"}
          className="w-full h-9 text-xs font-semibold"
        >
          {status === "running" ? "Running..." : "Run solver"}
        </Button>

        {/* 3. Cancel button */}
        {status === "running" && (
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full h-8 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            Cancel run
          </Button>
        )}

        {/* 4. Batch runner */}
        <Button
          variant="outline"
          onClick={handleRunAll}
          disabled={status === "running"}
          className="w-full h-9 text-xs"
        >
          Run all (15 combinations)
        </Button>
      </div>
    </aside>
  );
}