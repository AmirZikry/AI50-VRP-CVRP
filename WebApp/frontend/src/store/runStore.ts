import {create} from "zustand";
import type { RunResult, RunSettings, InstanceData } from "@/types";

type RunStore = {
    status: "idle" | "running" | "done" | "failed";
    runToken: number;
    settings: RunSettings;                              // what the user picked in the sidebar
    runs: RunResult[];                                  // history of every run (benchmark page)
    batch: RunResult[];                                 // result of 'run all'
    currentRun: RunResult | null;                       // result of 'run solver'
    instanceData: InstanceData | null;                  // coords & demands for the route visualiser
    setStatus: (s: RunStore["status"]) => void;         
    setSettings: (patch: Partial<RunSettings>) => void;
    cancelRun: () => void;
    addRun: (r: RunResult) => void;
    setBatch: (b: RunResult[]) => void;
    setInstanceData: (d: InstanceData) => void;
};

export const DEFAULT_SETTINGS: RunSettings = {
    instance: "XML100_1111_01",
    solver: "Clarke-Wright",
    optimizer: null,
};

export const useRunStore = create<RunStore>((set) => ({
    status: "idle",
    settings: DEFAULT_SETTINGS,
    runs: [],
    currentRun: null,
    batch: [],
    instanceData: null,
    runToken: 0,
    setStatus: (status) => set({ status }),

    setSettings: (patch) =>
        set((s) => {
            const next = { ...s.settings, ...patch };
            const changed =
                next.instance !== s.settings.instance ||
                next.solver !== s.settings.solver ||
                next.optimizer !== s.settings.optimizer;
            if (!changed) return { settings: next };
            return {
                settings: next,
                currentRun: null,         // clear the displayed solution
                batch: [],                // clear the "Run all" result
                status: "idle",
                runToken: s.runToken + 1,
                instanceData: next.instance !== s.settings.instance ? null : s.instanceData,
            };
        }),

    cancelRun: () => set((s) => ({ status: "idle", runToken: s.runToken + 1 })),
    addRun: (r) => set((s) => ({ runs: [...s.runs, r], currentRun: r, batch: [], status: "done" })),
    setBatch: (batch) => set((s) => ({ batch, currentRun: null, runs: [...s.runs, ...batch], status: "done" })),
    setInstanceData: (d) => set({ instanceData: d }),
}));
