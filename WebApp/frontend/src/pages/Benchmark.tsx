import { useState } from "react";
import ResultsTable from "@/components/ResultTable";
import InstancePicker from "@/components/InstancePicker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/Card";
import { startRunAll, exportBenchmarkExcel } from "@/lib/api";
import { useRunStore } from "@/store/runStore";

const STATUS_LABELS: Record<string, string> = {
  idle: "Ready",
  running: "Running...",
  done: "Done",
  failed: "Failed",
};

export default function Benchmark() {
  const [exporting, setExporting] = useState(false);

  const settings = useRunStore((s) => s.settings);
  const status = useRunStore((s) => s.status);
  const setStatus = useRunStore((s) => s.setStatus);
  const batch = useRunStore((s) => s.batch);
  const setBatch = useRunStore((s) => s.setBatch);
  const cancelRun = useRunStore((s) => s.cancelRun);

  const hasResults = batch.length > 0;
  const isRunning = status === "running";
  const isStale = (token: number) => useRunStore.getState().runToken !== token;

  async function handleRunAll() {
    const token = useRunStore.getState().runToken;
    setStatus("running");
    try {
      const results = await startRunAll(settings.instance);
      if (isStale(token)) return;
      setBatch(results);
    } catch (err) {
      console.error("Run failed:", err);
      if (!isStale(token)) setStatus("failed");
    }
  }

  async function handleExportExcel() {
    if (!hasResults || exporting) return;
    setExporting(true);
    try {
      await exportBenchmarkExcel(settings.instance, batch);
    } catch (err) {
      console.error("Excel export failed:", err);
    } finally {
      setExporting(false);
    }
  }

  function handlePrimaryAction() {
    if (!hasResults) {
      handleRunAll();
    } else {
      handleExportExcel();
    }
  }

  return (
    <div className="h-[calc(100vh-57px)] w-full  bg-background">
      <div className="mx-auto flex h-full max-w-[1440px] flex-col lg:flex-row gap-5 p-5">
        
        <aside className="w-full lg:w-96 shrink-0 bg-card border border-border rounded-xl p-5 flex flex-col gap-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Benchmark Config
            </h2>
            <span className="text-[11px] font-mono text-muted-foreground">
              CVRP
            </span>
          </div>

          <div className="space-y-4">
            <InstancePicker />
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
              {hasResults && (
                <span className="text-muted-foreground truncate text-[11px] ml-auto">
                  {batch.length} results
                </span>
              )}
            </div>

            <Button
              onClick={handleRunAll}
              disabled={isRunning}
              className="w-full h-9 text-xs font-semibold"
            >
              {isRunning
                ? "Running..."
                : hasResults
                  ? "Re-run all (15 combinations)"
                  : "Run all (15 combinations)"}
            </Button>

            {isRunning && (
              <Button
                variant="outline"
                onClick={cancelRun}
                className="w-full h-8 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                Cancel run
              </Button>
            )}
          </div>
        </aside>

        {/* Scrollable Main Content */}
{/* Non-scrolling Main Content (only the table rows scroll internally) */}
        <main className="flex-1 min-w-0 h-full overflow-hidden flex flex-col items-center justify-center">
          <div className="flex w-full max-w-4xl flex-col items-center gap-4 max-h-full">
            <Card
              size="large"
              mainText="Benchmark Results"
              secondaryText={`Instance: ${settings.instance}`}
            >
              <ResultsTable />
            </Card>

            <button
              onClick={handlePrimaryAction}
              disabled={isRunning || exporting}
              className="shrink-0 bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              {isRunning
                ? "Running all..."
                : exporting
                  ? "Generating Excel..."
                  : hasResults
                    ? "Export to Excel"
                    : "Run all"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}