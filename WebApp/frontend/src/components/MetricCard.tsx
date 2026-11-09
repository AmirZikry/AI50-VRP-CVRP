import { type LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
}

export function MetricCard({ label, value, icon: Icon }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
      {/* Top row Label + Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </span>
        {Icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Main value */}
      <div className="mt-2 text-2xl font-bold tracking-tight text-foreground font-mono tabular-nums">
        {value}
      </div>

    </div>
  );
}