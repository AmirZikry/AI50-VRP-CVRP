import Sidebar from "@/components/Sidebar";
import { BestStrip } from "@/components/BestStrip";
import { MetricCard } from "@/components/MetricCard";
import { Panel } from "@/components/Panel";
import { useRunStore } from "@/store/runStore";
import { Percent, Truck, ShieldCheck, Scale } from "lucide-react";
import { RunHeader } from "@/components/RunHeader";
import { Link } from "react-router-dom";
import RouteVisualizer from "@/components/RouteVisualizer";
import ConvergenceChart from "@/components/ConvergenceChart";

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

          <div className="shrink-0 flex items-center justify-between">
            <RunHeader />
            {run && (
              <Link
                to="/visualization"
                className="text-xs font-medium text-primary hover:underline"
              >
                Open full Visualization →
              </Link>
            )}
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
              <RouteVisualizer />
            </Panel>

            <Panel title="Convergence Profile" subtitle="Cost progression over iterations / time">
              <ConvergenceChart />
            </Panel>
          </section>
        </main>
      </div>
    </div>
  );
}