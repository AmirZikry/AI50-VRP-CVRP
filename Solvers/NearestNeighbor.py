from Models.Routes import Route 
from Models.Solution import Solution 
from Solvers.BaseSolver import BaseVRPSolver

class NearestNeighborSolver(BaseVRPSolver):
    def solve(self) -> Solution:
        inst=self.instance
        unvisited= set(i for i in range (inst.dimension) if i != inst.depot)
        routes : list[Route] = [] #initialize empty list of only Route objects

        while unvisited:
            route = Route(inst.capacity,inst.depot)

            while unvisited:
                bestCandidate= None
                minDistance= float('inf')

                for candidate in unvisited:
                    if route.canFitCapacity(inst.demands[candidate]):
                        dist= inst.edge_weights[route.currentNode,candidate]
                        if dist < minDistance:
                            bestCandidate=candidate
                            minDistance=dist

                if bestCandidate == None:
                    break

                route.addStop(bestCandidate,inst.demands[bestCandidate])
                unvisited.remove(bestCandidate)
            
            route.close()
            routes.append(route)
        return Solution(routes=routes,dist_matrix=inst.edge_weights)
