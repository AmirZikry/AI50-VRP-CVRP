from Optimizer.BaseOptimizer import BaseOptimizer
from Models.Solution import Solution
import random
import math
import copy

class Simulated_Annealing(BaseOptimizer):
    def __init__(self, solution: Solution, coolingRate: float = 0.995, initTemp: float = 1000.0, minTemp: float = 1e-3):
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
        i=random.randomint(1,n-3)
        j=random.randomint(i+1,n-2)

        #compute delta
        oldRouteCost=chosenRoute.totalCost(self.dist_matrix)
        chosenRoute.stops[i:j]=list(reversed(chosenRoute.stops[i:j]))
        newRouteCost=chosenRoute.totalCost(self.dist_matrix)

        delta=newRouteCost-oldRouteCost

        neighborCost=delta+cost
        return delta,neighborCost,neighborRoutes

    def Start_Optimize(self) -> Solution:

        temp=self.initTemp

        currentRoutes=copy.deepcopy(self.routes)
        currentCost=self.cost

        bestRoutes=copy.deepcopy(currentRoutes)
        bestCost=currentCost

        while temp > self.minTemp:

            delta,neighborCost,neighborRoutes=self.Change_Neighbor(currentCost,currentRoutes)
            
            if delta < 0 or random.random() < math.exp(-delta/temp):
                #accept Solution
                currentCost=neighborCost
                currentRoutes=neighborRoutes

            if(currentCost<bestCost):
                bestCost=currentCost
                bestRoutes=currentRoutes
                

            temp*=self.coolingRate
        
        return bestCost,bestRoutes





