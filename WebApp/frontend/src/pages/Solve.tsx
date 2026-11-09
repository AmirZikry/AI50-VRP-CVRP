import Sidebar from "@/components/Sidebar";
import { BestStrip } from "@/components/BestStrip";
import { MetricCard } from "@/components/MetricCard";
import { Panel } from "@/components/Panel";
import { useRunStore } from "@/store/runStore";
import { Percent, Truck, ShieldCheck, Scale } from "lucide-react";

export default function Solve() {
  const run = useRunStore((s) => s.currentRun);

  return (

    <div className="h-[calc(100vh-57px)] w-full overflow-hidden bg-background">
      <div className="mx-auto flex h-full max-w-[1440px] gap-5 p-5">
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 min-w-0 flex flex-col gap-4 overflow-hidden h-full">
          <div className="shrink-0">
            <BestStrip />
          </div>

          {/* Metric cards locked  */}
          <section className="grid shrink-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total Cost"
              value={run ? run.cost.toLocaleString() : "—"}
              icon={Scale}
            />
            <MetricCard
              label="Gap to BKS"
              value={run ? `${run.gap.toFixed(2)}%` : "—"}
              icon={Percent}
            />
            <MetricCard
              label="Vehicles Used"
              value={run ? String(run.vehicles) : "—"}
              icon={Truck}
            />
            <MetricCard
              label="Feasibility"
              value={run ? (run.valid ? "Valid" : "Violation") : "—"}
              icon={ShieldCheck}
            />
          </section>
            {/* untuk routes section */}
          <section className="grid flex-1 min-h-0 gap-4 lg:grid-cols-2">
            <Panel title="Route Visualizer" subtitle="Depot and dynamic customer routes">
              <div className="h-full w-full rounded-lg border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center p-4 text-center">
                <div className="h-8 w-8 rounded-full border border-border bg-card flex items-center justify-center text-xs text-muted-foreground font-mono">
                  Akmal
                </div>
              </div>
            </Panel>

            <Panel title="Convergence Profile" subtitle="Cost progression over iterations / time">
              <div className="h-full w-full rounded-lg border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center p-4 text-center">
                <div className="h-8 w-8 rounded-full border border-border bg-card flex items-center justify-center text-xs text-muted-foreground font-mono">
                  akmal
                </div>
              </div>
            </Panel>
          </section>
        </main>
      </div>
    </div>
  );
}