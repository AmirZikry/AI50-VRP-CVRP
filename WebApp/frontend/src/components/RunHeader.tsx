import { useRunStore } from "@/store/runStore";

export function RunHeader() {
    const run = useRunStore((s) => s.currentRun)
    if (!run) return null;


    return (
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-base font-semibold tracking-normal text-foreground">
                {run.solver}
                {run.optimizer ? ` + ${run.optimizer}` : ""}
            </h2>
            <span className="text-xs font-mono text-muted-foreground">{run.instance}</span>
        </div>
    )
}