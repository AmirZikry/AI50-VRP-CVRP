
import numpy as np
from Solvers.BaseSolver import BaseVRPSolver
from Models.Instance import VrpInstance
from Models.Solution import Solution
from Models.Routes import Route


class AntColonySolver(BaseVRPSolver):
    
    def __init__(self, instance:VrpInstance, num_ants:int = 20, num_iterations:int = 100, alpha:float = 1.0, beta:float = 2.5, rho:float = 0.2, Q:float = 1.0):
        
        super().__init__(instance)
        self.num_ants = num_ants
        self.num_iterations = num_iterations
        self.alpha = alpha  # weight of pheromone
        self.beta = beta    # weight of heuristic information
        self.rho = rho      # evaporation rate
        self.Q = Q          # pheromone constant

        # initialize pheromone matrix
        self.tau = np.ones((self.instance.dimension, self.instance.dimension))

        self.eta = np.divide(1.0, self.instance.edge_weights, out=np.zeros_like(self.instance.edge_weights, dtype=float), where=self.instance.edge_weights > 0)


    def construct_solution(self) -> Solution:

        instance = self.instance
        unvisited_node = set(i for i in range(instance.dimension) if i != instance.depot)
        routes : list[Route] = []

        while unvisited_node:

            route = Route(instance.capacity, instance.depot)

            while True:
                
                feasible = [c for c in unvisited_node if route.canFitCapacity(instance.demands[c])]

                if not feasible:
                    break

                current = route.currentNode

                attract = np.array([
                    self.tau[current, j] ** self.alpha * self.eta[current, j] ** self.beta
                    for j in feasible
                ])

                probs = attract / attract.sum()
                chosen = np.random.choice(feasible, p=probs)

                route.addStop(chosen, instance.demands[chosen])
                unvisited_node.remove(chosen)

            route.close()
            routes.append(route)
        return Solution(routes=routes, dist_matrix=instance.edge_weights)
                        
    def update_pheromone(self, solutions: List[Solution]):
        # reducing all pheromone values
        self.tau *= (1 - self.rho)

        for solution in solutions:
            deposit = self.Q / solution.total_cost

            for route in solution.routes:
                for i in range(len(route.stops) - 1):
                    a, b = route.stops[i], route.stops[i + 1]
                    self.tau[a][b] += deposit 
                    self.tau[b][a] += deposit              

    def solve(self) -> Solution:

        best_solution = None

        for _ in range(self.num_iterations):

            solutions = [self.construct_solution() for _ in range(self.num_ants)]
            self.update_pheromone(solutions)

            best_iteration = min(solutions, key=lambda s: s.total_cost)

            if best_solution is None or best_iteration.total_cost < best_solution.total_cost:

                best_solution = best_iteration
            
        return best_solution

                
            




    

        