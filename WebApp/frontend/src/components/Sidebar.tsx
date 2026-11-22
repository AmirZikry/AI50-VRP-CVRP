import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { startRun, startRunAll, getInstanceList, fetchInstanceData} from "@/lib/api";
import InstancePicker from "@/components/InstancePicker";
import { useRunStore } from "@/store/runStore";
import { useEffect, useState } from "react";


const STATUS_LABELS: Record<string, string> = {
  idle: "Ready",
  running: "Running...",
  done: "Done",
  failed: "Failed",
};

export default function Sidebar() {
  const [solvers, setSolvers] = useState<string[]>([]);
  const [optimizers, setOptimizers] = useState<string[]>(["none"]);
  const settings = useRunStore((s) => s.settings);
  const setSettings = useRunStore((s) => s.setSettings);
  const cancelRun = useRunStore((s) => s.cancelRun);
  const status = useRunStore((s) => s.status);
  const setStatus = useRunStore((s) => s.setStatus);
  const run = useRunStore((s) => s.currentRun);
  const addRun = useRunStore((s) => s.addRun);
  const setBatch = useRunStore((s) => s.setBatch);
  const setInstanceData = useRunStore((s) => s.setInstanceData);
  const instanceData = useRunStore((s) => s.instanceData);

  useEffect(() => {
    const controller = new AbortController();

    getInstanceList(controller.signal)
      .then((data) => {
        const solverList = Array.isArray(data?.solvers) ? data.solvers : [];
        setSolvers(solverList);
        const optimizerList = Array.isArray(data?.optimizers) ? data.optimizers : [];
        setOptimizers(["None", ...optimizerList]);
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });

    return () => controller.abort();
  }, []);

  const isStale = (token: number) => useRunStore.getState().runToken !== token;

  async function handleRun() {
    const token = useRunStore.getState().runToken;
    setStatus("running");
    try {
      const result = await startRun(settings);
      if (isStale(token)) return;
      addRun(result);
      // Fetch instance node data for route visualisation if not cached
      if (!useRunStore.getState().instanceData || useRunStore.getState().instanceData?.name !== settings.instance) {
        fetchInstanceData(settings.instance).then((d) => {
          if (!isStale(token)) setInstanceData(d);
        });
      }
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
    <aside className="w-full lg:w-96 shrink-0 bg-card border border-border rounded-xl p-5 flex flex-col gap-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Configuration
        </h2>
        <span className="text-[11px] font-mono text-muted-foreground">CVRP</span>
      </div>

      <div className="space-y-4">
        {/* Instance */}
        <InstancePicker />
        {/* Solver */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Solver</Label>
          <Select
            value={settings.solver}
            onValueChange={(value) => value && setSettings({ solver: value })}
            disabled={solvers.length === 0}
          >
            <SelectTrigger id="solver" className="w-full font-mono text-xs bg-background/50 h-9">
              <SelectValue placeholder="Select a solver..." />
            </SelectTrigger>
            <SelectContent>
              {solvers.map((solver) => (
                <SelectItem key={solver} value={solver} className="font-mono text-xs">
                  {solver}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Optimizer */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Optimizer (hybrid)</Label>
          <Select
            value={settings.optimizer ?? "None"}
            onValueChange={(value) => value && setSettings({ optimizer: value })}
            disabled={optimizers.length === 0}
          >
            <SelectTrigger id="optimizer" className="w-full font-mono text-xs bg-background/50 h-9">
              <SelectValue placeholder="Select an optimizer..." />
            </SelectTrigger>
            <SelectContent>
              {optimizers.map((opt) => (
                <SelectItem key={opt} value={opt} className="font-mono text-xs">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Zone */}
      <div className="mt-auto pt-4 flex flex-col gap-2.5 border-t border-border/60">
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

        <Button
          onClick={handleRun}
          disabled={status === "running"}
          className="w-full h-9 text-xs font-semibold"
        >
          {status === "running" ? "Running..." : "Run solver"}
        </Button>

        {status === "running" && (
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full h-8 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            Cancel run
          </Button>
        )}

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