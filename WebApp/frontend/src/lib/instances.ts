// XML100 instance names code : XML100_ABCD_EF
//   A = depot position    B = customer layout    C = demand pattern    D = route length    EF = ID of instances

export type Choice = { value: string; label: string };

export const DEPOT: Choice[] = [
  { value: "1", label: "Random" },
  { value: "2", label: "Central" },
  { value: "3", label: "Corner" },
];

export const CUSTOMERS: Choice[] = [
  { value: "1", label: "Random" },
  { value: "2", label: "Clustered" },
  { value: "3", label: "Mixed" },
];

export const DEMAND: Choice[] = [
  { value: "1", label: "All equal (1)" },
  { value: "2", label: "Small (1–10)" },
  { value: "3", label: "Small (5–10)" },
  { value: "4", label: "Large (1–100)" },
  { value: "5", label: "Large (50–100)" },
  { value: "6", label: "Depends on location" },
  { value: "7", label: "Mostly small, a few large" },
];

export const ROUTE_LENGTH: Choice[] = [
  { value: "1", label: "~4 customers" },
  { value: "2", label: "~6 customers" },
  { value: "3", label: "~10 customers" },
  { value: "4", label: "~14 customers" },
  { value: "5", label: "~20 customers" },
  { value: "6", label: "~38 customers" },
];

export type Parts = { depot: string; customers: string; demand: string; route: string; num: number };

export function parseInstance(name: string): Parts | null {
  const m = /^XML100_(\d)(\d)(\d)(\d)_(\d+)$/.exec(name);
  if (!m) return null;
  return { depot: m[1], customers: m[2], demand: m[3], route: m[4], num: Number(m[5]) };
}

export function buildInstance(p: Parts): string {
  return `XML100_${p.depot}${p.customers}${p.demand}${p.route}_${String(p.num).padStart(2, "0")}`;
}

// choose instances that exist only 
export function availableNumbers(all: string[], p: Omit<Parts, "num">): number[] {
  const prefix = `XML100_${p.depot}${p.customers}${p.demand}${p.route}_`;
  return all
    .filter((n) => n.startsWith(prefix))
    .map((n) => Number(n.slice(prefix.length)))
    .sort((a, b) => a - b);
}
