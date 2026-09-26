import numpy as np

class Route:
    def __init__(self,capacity:int,depot:int=0) :
        self.capacity=capacity
        self.depot=depot
        self.load=0
        self.stops:list[int]=[depot]
    
    @property
    def currentNode(self)->int:
        return self.stops[-1]

    def canFitCapacity(self,demand) -> bool:
        return demand + self.load <= self.capacity

    def close(self):
        self.stops.append(self.depot)

    def totalCost(self,dist_matrix:np.ndarray):
        return sum(dist_matrix[self.stops[i], self.stops[i + 1]] for i in range(len(self.stops) - 1))
    
    def addStop(self,stop,demand):
        self.stops.append(stop)
        self.load += demand
    
    