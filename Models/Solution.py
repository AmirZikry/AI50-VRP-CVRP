import numpy as np
from Models.Routes import Route

class Solution:
    def __init__(self, routes: list[Route], dist_matrix: np.ndarray):
        self.routes = routes
        self.dist_matrix = dist_matrix

    @property
    def num_vehicles(self) -> int:
        return len(self.routes)

    @property
    def total_cost(self) -> float:
        return sum(r.totalCost(self.dist_matrix) for r in self.routes)

    def to_dict(self) -> dict:
        return {
            "num_vehicles": self.num_vehicles,
            "total_cost": self.totalCost,
            "routes": [r.stops for r in self.routes],
        }