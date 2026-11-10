// Define type of something 

export type RunSettings ={
    instance : string;
    solver : string;
    optimizer : string | null; 
    timeLimit : number;

}

export type RunResult = {
    id : string;
    instance: string;
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
