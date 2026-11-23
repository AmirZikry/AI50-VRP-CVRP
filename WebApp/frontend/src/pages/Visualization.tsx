import { Panel } from "@/components/Panel";
import RouteVisualizer from "@/components/RouteVisualizer";
import ConvergenceChart from "@/components/ConvergenceChart";
import ComparisonChart from "@/components/ComparisonChart";
import { useRunStore } from "@/store/runStore";
import { RunHeader } from "@/components/RunHeader";

export default function Visualization() {
  const run = useRunStore((s) => s.currentRun);
  const runs = useRunStore((s) => s.runs);

  return (
    <div className="h-[calc(100vh-57px)] w-full overflow-hidden bg-background">
      <div className="mx-auto flex h-full max-w-[1440px] flex-col gap-4 p-5">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Visualization
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Route map, convergence profile &amp; solver comparison
            </p>
          </div>
          <RunHeader />
        </div>

        {/* Top row: Route Visualizer + Convergence */}
        <section className="grid flex-1 min-h-0 gap-4 lg:grid-cols-2">
          <Panel title="Route Visualizer" subtitle="Hover nodes for details · click route badges to highlight">
            <RouteVisualizer />
          </Panel>

          <Panel title="Convergence Profile" subtitle="Cost progression over iterations / time">
            <ConvergenceChart />
          </Panel>
        </section>

        {/* Bottom row: Comparison Charts */}
        <section className="shrink-0 h-[280px]">
          <Panel
            title="Solver Comparison"
            subtitle={`${runs.length} run${runs.length !== 1 ? "s" : ""} recorded — updates on each new run`}
          >
            <ComparisonChart />
          </Panel>
        </section>
      </div>
    </div>
  );
}
