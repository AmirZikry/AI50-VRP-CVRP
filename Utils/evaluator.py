from dataclasses import dataclass, field
from Models.Instance import VrpInstance
from Models.Solution import Solution

@dataclass
class EvaluationResult:
    is_valid: bool
    total_cost: float
    num_vehicles: int
    violations: list[str] = field(default_factory=list)
    gap_to_best_known: float | None = None  
    runtime_seconds: float | None = None

    def report(self) -> str:
        lines = [
            f"Valid: {self.is_valid}",
            f"Total cost: {self.total_cost:.2f}",
            f"Vehicles used: {self.num_vehicles}",
        ]
        if self.gap_to_best_known is not None:
            lines.append(f"Gap to BKS: {self.gap_to_best_known:.2f}%")
        if self.runtime_seconds is not None:           
            lines.append(f"Runtime: {self.runtime_seconds:.2f} s")
        if self.violations:
            lines.append("Violations:")
            lines.extend(f"  - {v}" for v in self.violations)
        return "\n".join(lines)

#  Compute gap
def compute_gap(cost: float, best_known_cost: float) -> float:
    if best_known_cost == 0:
        raise ValueError("best_known_cost must be non-zero to compute a gap.")
    return (cost - best_known_cost) / best_known_cost * 100


def evaluate_solution(
    instance: VrpInstance,
    solution: Solution,
    best_known_cost: float | None = None,
) -> EvaluationResult:

    violations: list[str] = []
    total_cost = 0.0
    all_visited: list[int] = []

    # initialize target 
    expected_customers = {i for i in range(instance.dimension) if i != instance.depot}

    for idx, route in enumerate(solution.routes, start=1):
        stops = route.stops

        # Depot loop rule: 
        if len(stops) < 2 or stops[0] != instance.depot or stops[-1] != instance.depot:
            violations.append(
                f"Route #{idx} must start and end at depot {instance.depot}: {stops}"
            )
            continue

        customers = stops[1:-1]

        # Valid node index rule: 
        out_of_range = [c for c in customers if c < 0 or c >= instance.dimension]
        if out_of_range:
            violations.append(f"Route #{idx} visits invalid node ids: {out_of_range}")
            continue

        # Vehicle capacity rule:
        load = sum(int(instance.demands[c]) for c in customers)
        if load > instance.capacity:
            violations.append(
                f"Route #{idx} exceeds capacity: load {load} > capacity {instance.capacity}"
            )

        # Cost accumulation:
        route_cost = sum(
            instance.edge_weights[stops[i], stops[i + 1]] for i in range(len(stops) - 1)
        )
        total_cost += route_cost
        all_visited.extend(customers)

    # Duplicate visits check:
    seen = set()
    duplicates = set()
    for c in all_visited:
        (duplicates if c in seen else seen).add(c)
    if duplicates:
        violations.append(f"Customers visited more than once: {sorted(duplicates)}")

    # No missing customers check:
    missing = expected_customers - seen
    if missing:
        violations.append(f"Customers never visited: {sorted(missing)}")

    gap = compute_gap(total_cost, best_known_cost) if best_known_cost else None

    return EvaluationResult(
        is_valid=len(violations) == 0,
        total_cost=total_cost,
        num_vehicles=len(solution.routes),
        violations=violations,
        gap_to_best_known=gap,
    )