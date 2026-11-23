import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { useRunStore } from "@/store/runStore";

const BAR_COLORS = [
  "#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#06b6d4",
];

type Metric = "gap" | "cost" | "runtime";

const METRIC_LABELS: Record<Metric, string> = {
  gap: "Gap to BKS (%)",
  cost: "Total Cost",
  runtime: "Runtime (s)",
};

export default function ComparisonChart() {
  const runs = useRunStore((s) => s.runs);

  if (runs.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
        Run solvers to compare performance
      </div>
    );
  }

  /* ── Build comparison data from stored runs ──────────────── */
  const data = runs.map((r) => ({
    name: r.solver + (r.optimizer ? ` + ${r.optimizer}` : ""),
    gap: parseFloat(r.gap.toFixed(2)),
    cost: r.cost,
    runtime: parseFloat(r.runtime.toFixed(3)),
  }));

  /* ── Deduplicate by name, keeping last run ───────────────── */
  const unique = [...new Map(data.map((d) => [d.name, d])).values()];

  const metrics: Metric[] = ["gap", "cost", "runtime"];

  return (
    <div className="h-full w-full flex flex-col gap-4 overflow-y-auto pr-1">
      {metrics.map((metric) => (
        <div key={metric} className="min-h-[200px] shrink-0">
          <h4 className="text-xs font-semibold text-muted-foreground mb-1 pl-1">
            {METRIC_LABELS[metric]}
          </h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={unique} margin={{ top: 4, right: 12, bottom: 4, left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
                stroke="#94a3b8"
              />
              <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #dce4ee" }}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey={metric} name={METRIC_LABELS[metric]} radius={[4, 4, 0, 0]}>
                {unique.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}
