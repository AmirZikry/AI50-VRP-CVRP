import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useRunStore } from "@/store/runStore";

export default function ConvergenceChart() {
  const run = useRunStore((s) => s.currentRun);

  if (!run || !run.history || run.history.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
        No convergence data available — run a solver first
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={run.history} margin={{ top: 8, right: 16, bottom: 4, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="t"
          label={{ value: "Iteration / Time", position: "insideBottomRight", offset: -4, fontSize: 10 }}
          tick={{ fontSize: 10 }}
          stroke="#94a3b8"
        />
        <YAxis
          label={{ value: "Cost", angle: -90, position: "insideLeft", offset: 4, fontSize: 10 }}
          tick={{ fontSize: 10 }}
          stroke="#94a3b8"
          domain={["auto", "auto"]}
        />
        <Tooltip
          contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #dce4ee" }}
          formatter={(value: number) => [value.toLocaleString(), "Cost"]}
          labelFormatter={(label) => `Iter ${label}`}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line
          type="monotone"
          dataKey="cost"
          name="Best Cost"
          stroke="#3973b9"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
