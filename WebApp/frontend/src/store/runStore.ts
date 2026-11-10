import {create} from "zustand";
import type { RunResult } from "@/types";

type RunStore = {
    status: "idle" | "running" | "done" | "failed";
    runs: RunResult[];
    batch: RunResult[]; 
    currentRun: RunResult | null;
    setStatus: (s: RunStore["status"]) => void;
    addRun: (r: RunResult) => void;
    setBatch: (b: RunResult[]) => void;
};

export const useRunStore = create<RunStore>((set) => ({
    status: "idle",
    runs: [],
    currentRun:null,
    batch: [],
    setStatus: (status) => set({ status }),
    addRun: (r) => set((s) => ({ runs: [...s.runs, r], currentRun: r, status: "done" })),
    setBatch: (batch) => set((s) => ({ batch, runs: [...s.runs, ...batch], status: "done" })),
}));

