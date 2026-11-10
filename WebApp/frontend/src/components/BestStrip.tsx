// section best solution ( bila tekan run all solver )
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRunStore } from "@/store/runStore";
import { Trophy } from "lucide-react";

export function BestStrip() {
  const batch = useRunStore((s) => s.batch);
  if (batch.length === 0) return null;

  const valid = batch.filter((r) => r.valid);
  const best = [...valid].sort((a, b) => a.gap - b.gap)[0];
  if (!best) return null;

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 px-5 py-3.5">
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Trophy className="h-5 w-5" />
      </div>

      {/* Text Info */}
      <div className="flex-1 min-w-60">
        <div className="text-lg font-bold text-foreground">
          Best: {best.solver}{best.optimizer ? ` + ${best.optimizer}` : ""}
        </div>
        <div className="text-xs text-muted-foreground">
          Cost {best.cost.toLocaleString()} · gap {best.gap.toFixed(2)}% · full table on the Benchmark page
        </div>
      </div>

      {/* Button */}
      <Button>
        <Link to="/benchmark">Benchmark Page</Link>
      </Button>
    </div>
  );
}

