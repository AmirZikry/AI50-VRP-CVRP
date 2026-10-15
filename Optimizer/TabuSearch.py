import copy

from Optimizer.BaseOptimizer import BaseOptimizer
from Models.Solution import Solution


class Tabu_Search(BaseOptimizer):
    def __init__(
        self,
        solution: Solution,
        tabu_tenure: int = 10,
        max_iterations: int = 1000,
    ):
        if tabu_tenure < 1:
            raise ValueError("tabu_tenure must be at least 1")
        if max_iterations < 1:
            raise ValueError("max_iterations must be at least 1")

        super().__init__(solution)
        self.tabu_tenure = tabu_tenure
        self.max_iterations = max_iterations
        self.tabu_list: list[tuple[tuple[int, ...], ...]] = []

    @staticmethod
    def _route_key(routes) -> tuple[tuple[int, ...], ...]:
        return tuple(tuple(route.stops) for route in routes)

    def _cost(self, routes) -> float:
        return sum(route.totalCost(self.dist_matrix) for route in routes)

    def generate_neighbors(self, routes):
        """Create all intra-route 2-opt neighbors."""
        neighbors = []

        for route_index, route in enumerate(routes):
            if len(route.stops) < 4:
                continue

            for i in range(1, len(route.stops) - 2):
                for j in range(i + 1, len(route.stops) - 1):
                    neighbor_routes = copy.deepcopy(routes)
                    stops = neighbor_routes[route_index].stops
                    stops[i : j + 1] = reversed(stops[i : j + 1])
                    neighbors.append(neighbor_routes)

        return neighbors

    def optimize(self) -> Solution:
        current_routes = copy.deepcopy(self.routes)
        current_cost = self.cost

        best_routes = copy.deepcopy(current_routes)
        best_cost = current_cost

        for _ in range(self.max_iterations):
            neighbors = self.generate_neighbors(current_routes)
            if not neighbors:
                break

            candidates = []
            for neighbor in neighbors:
                neighbor_cost = self._cost(neighbor)
                neighbor_key = self._route_key(neighbor)
                is_tabu = neighbor_key in self.tabu_list

                # Aspiration: a tabu move is allowed if it improves the best result.
                if not is_tabu or neighbor_cost < best_cost:
                    candidates.append((neighbor_cost, neighbor_key, neighbor))

            if not candidates:
                break

            current_cost, current_key, current_routes = min(
                candidates, key=lambda candidate: candidate[0]
            )

            self.tabu_list.append(current_key)
            if len(self.tabu_list) > self.tabu_tenure:
                self.tabu_list.pop(0)

            if current_cost < best_cost:
                best_cost = current_cost
                best_routes = copy.deepcopy(current_routes)

        return Solution(best_routes, self.dist_matrix)