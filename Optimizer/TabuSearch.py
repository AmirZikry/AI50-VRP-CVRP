from Optimizer.BaseOptimizer import BaseOptimizer
from Models.Solution import Solution

class Tabu_Search(BaseOptimizer):
    def __init__(self, solution: Solution, tabu_tenure: int = 10):
        super().__init__(solution)
        self.tabu_tenure = tabu_tenure
        self.tabu_list = []

    def optimize(self) -> Solution:
        current_routes = self.routes
        current_cost = self.cost

        best_routes = current_routes
        best_cost = current_cost

        while True:
            # Generate neighbors and evaluate them
            neighbors = self.generate_neighbors(current_routes)
            best_neighbor = None
            best_neighbor_cost = float('inf')

            for neighbor in neighbors:
                neighbor_cost = self.evaluate_solution(neighbor)
                if neighbor_cost < best_neighbor_cost and neighbor not in self.tabu_list:
                    best_neighbor = neighbor
                    best_neighbor_cost = neighbor_cost

            if best_neighbor is None:
                break  # No valid neighbors found

            # Update current solution
            current_routes = best_neighbor
            current_cost = best_neighbor_cost

            # Update tabu list
            self.tabu_list.append(best_neighbor)
            if len(self.tabu_list) > self.tabu_tenure:
                self.tabu_list.pop(0)

            # Update best solution found
            if current_cost < best_cost:
                best_routes = current_routes
                best_cost = current_cost

        return Solution(best_routes, self.dist_matrix)