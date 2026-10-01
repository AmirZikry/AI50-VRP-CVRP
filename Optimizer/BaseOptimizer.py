from Models.Solution import Solution

class BaseOptimizer:
    def __init__(self,solution:Solution):
        self.routes=solution.routes
        self.cost=solution.total_cost
        self.dist_matrix=solution.dist_matrix
