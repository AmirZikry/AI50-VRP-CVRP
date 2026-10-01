from Models.Solution import Solution
from abc import ABC, abstractmethod

class BaseOptimizer(ABC):
    def __init__(self,solution:Solution):
        self.routes=solution.routes
        self.cost=solution.total_cost
        self.dist_matrix=solution.dist_matrix

    @abstractmethod
    def optimize(self)->Solution:
        pass
