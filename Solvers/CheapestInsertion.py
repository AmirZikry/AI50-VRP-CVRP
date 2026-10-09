from Models.Routes import Route
from Models.Solution import Solution
from Solvers.BaseSolver import BaseVRPSolver


class CheapestInsertionSolver(BaseVRPSolver):
    SEED_RULES = ("nearest", "farthest")

    def __init__(self, instance, seed_rule: str = "nearest"):
        super().__init__(instance)
        if seed_rule not in self.SEED_RULES:
            raise ValueError(f"seed_rule must be one of {self.SEED_RULES}, got '{seed_rule}'")
        self.seed_rule = seed_rule

    def _pick_seed(self, unrouted: set) -> int:
        depot_distance = self.instance.edge_weights[self.instance.depot]
        pick = min if self.seed_rule == "nearest" else max
        return pick(sorted(unrouted), key=lambda c: depot_distance[c])

    def solve(self) -> Solution:
        inst = self.instance
        D = inst.edge_weights
        depot = inst.depot
        unrouted = set(range(inst.dimension)) - {depot}
        routes = []

        while unrouted:
            seed = self._pick_seed(unrouted)
            stops = [seed]
            load = inst.demands[seed]
            unrouted.remove(seed)

            while True:
                path = [depot] + stops + [depot]
                best = None
                for c in sorted(unrouted):
                    if load + inst.demands[c] > inst.capacity:
                        continue
                    for p in range(len(path) - 1):
                        before, after = path[p], path[p + 1]
                        delta = D[before, c] + D[c, after] - D[before, after]
                        if best is None or delta < best[0]:
                            best = (delta, c, p)
                if best is None:
                    break
                _, c, p = best
                stops.insert(p, c)
                load += inst.demands[c]
                unrouted.remove(c)

            route = Route(inst.capacity, depot)
            for c in stops:
                route.addStop(c, inst.demands[c])
            route.close()
            routes.append(route)

        return Solution(routes=routes, dist_matrix=D)