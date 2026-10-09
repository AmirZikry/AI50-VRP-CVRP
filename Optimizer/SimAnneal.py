from Optimizer.BaseOptimizer import BaseOptimizer
from Models.Solution import Solution
import random
import math
import copy

class Simulated_Annealing(BaseOptimizer):
    def __init__(self, solution: Solution, coolingRate: float = 0.998, initTemp: float = 10000.0, minTemp: float = 1e-3):
        super().__init__(solution)
        self.coolingRate = coolingRate
        self.initTemp = initTemp
        self.minTemp = minTemp

    def Change_Neighbor(self,cost:float,routes:list):
        #copy route
        neighborRoutes=copy.deepcopy(routes)

        #filter route that is eligible for 2opt swap
        validRoutes=[r for r in neighborRoutes if len(r.stops)>4]

        if not validRoutes:
            return 0,cost,routes

        chosenRoute=random.choice(validRoutes)
        n=len(chosenRoute.stops)
        
        #applying 2 opt algorithm
        i=random.randint(1,n-3)
        j=random.randint(i+1,n-2)

        #compute delta
        oldRouteCost=chosenRoute.totalCost(self.dist_matrix)
        chosenRoute.stops[i:j+1]=list(reversed(chosenRoute.stops[i:j+1]))
        newRouteCost=chosenRoute.totalCost(self.dist_matrix)

        delta=newRouteCost-oldRouteCost

        neighborCost=delta+cost
        return delta,neighborCost,neighborRoutes

    def optimize(self) -> Solution:

        temp=self.initTemp

        currentRoutes=copy.deepcopy(self.routes)
        currentCost=self.cost

        bestRoutes=copy.deepcopy(currentRoutes)
        bestCost=currentCost

        while temp > self.minTemp:
            print(f"Current Temp: {temp:.4f}, Current Cost: {currentCost:.4f}, Best Cost: {bestCost:.4f}")
            delta,neighborCost,neighborRoutes=self.Change_Neighbor(currentCost,currentRoutes)
            
            if delta < 0 or random.random() < math.exp(-delta/temp):
                #accept Solution
                currentCost=neighborCost
                currentRoutes=neighborRoutes

            if(currentCost<bestCost):
                bestCost=currentCost
                bestRoutes=currentRoutes
                

            temp*=self.coolingRate
        
        return Solution(bestRoutes, self.dist_matrix)





