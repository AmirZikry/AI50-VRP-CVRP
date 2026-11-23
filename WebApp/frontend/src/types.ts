// Define type of something

export type RunType = "Heuristic" | "Metaheuristic" | "Hybrid";

export type RunSettings ={
    instance : string;
    solver : string;
    optimizer : string | null; 

}

export type RunResult = {
    id : string;
    instance: string;
    type: RunType;
    solver: string;
    optimizer: string|null;
    cost: number;
    gap: number;
    vehicles: number;
    runtime: number;
    valid: boolean;
    routes: number [][]
    history: { t: number; cost: number }[];
}

// type utk nodes
export type InstanceData = {
  name: string;
  dimension: number;
  capacity: number;
  coords: [number, number][]; // [x, y] per node (index 0 = depot)
  demands: number[]; // demand per node
};
