from Models.Solution import Solution

class BaseOptimizer:
    def __init__(self,solution:Solution):
        self.currentRoute=solution.routes
        self.currentCost=solution.total_cost
            