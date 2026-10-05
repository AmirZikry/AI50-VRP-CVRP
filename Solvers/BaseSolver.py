from abc import ABC, abstractmethod
from Models.Instance import VrpInstance
from Models.Solution import Solution

class BaseVRPSolver(ABC):
    def __init__(self, instance: VrpInstance):
        self.instance = instance

    @abstractmethod
    def solve(self) -> Solution:
        """Run algorithm and return a Solution."""
        pass