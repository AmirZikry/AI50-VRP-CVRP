import random
import numpy as np

from Models.Routes import Route
from Models.Solution import Solution
from Solvers.base import BaseVRPSolver


class GeneticAlgorithmSolver(BaseVRPSolver):

    def __init__(self, instance, pop_size=100, generations=500, crossover_rate=0.9,
                 mutation_rate=0.2, tournament_size=3, elite_size=2,
                 use_local_search=True, seed=None, verbose=True):

        # --- variables ---
        super().__init__(instance)
        self.pop_size = pop_size
        self.generations = generations
        self.crossover_rate = crossover_rate
        self.mutation_rate = mutation_rate
        self.tournament_size = tournament_size
        self.elite_size = elite_size
        self.use_local_search = use_local_search
        self.verbose = verbose
        self.rng = random.Random(seed)

        self.customers = [i for i in range(instance.dimension) if i != instance.depot]
        self.dist = instance.edge_weights
        self.demands = instance.demands
        self.history: list[float] = [] 

    # --- Split ---
    def _split(self, tour):
        d, dem, cap, depot = self.dist, self.demands, self.instance.capacity, self.instance.depot
        n = len(tour)
        INF = float("inf")
        cost = [INF] * (n + 1)
        pred = [0] * (n + 1)
        cost[0] = 0.0

        for i in range(n):
            if cost[i] == INF:
                continue
            load = 0
            route_cost = 0.0
            
            for j in range(i, n):
                c = tour[j]
                load += dem[c]
                if load > cap:
                    break
                if j == i:
                    route_cost = d[depot, c] + d[c, depot]
                else:
                    prev = tour[j - 1]
                    route_cost += d[prev, c] + d[c, depot] - d[prev, depot]
                if cost[i] + route_cost < cost[j + 1]:
                    cost[j + 1] = cost[i] + route_cost
                    pred[j + 1] = i

        routes, j = [], n
        while j > 0:
            i = pred[j]
            routes.append(list(tour[i:j]))
            j = i
        routes.reverse()
        return cost[n], routes

    # --- 2-opt ---
    def _two_opt(self, route):
        d, depot = self.dist, self.instance.depot
        path = [depot] + route + [depot]
        improved = True
        while improved:
            improved = False
            for i in range(1, len(path) - 2):
                for j in range(i + 1, len(path) - 1):
                    delta = (d[path[i - 1], path[j]] + d[path[i], path[j + 1]]
                             - d[path[i - 1], path[i]] - d[path[j], path[j + 1]])
                    if delta < -1e-9:
                        path[i:j + 1] = reversed(path[i:j + 1])
                        improved = True
        return path[1:-1]

    def _improve(self, tour):
        _, routes = self._split(tour)
        new_tour = [c for r in routes for c in self._two_opt(r)]
        return new_tour

    # --- GA operators ---
    def _init_population(self):
        pop = []
        coords = self.instance.node_coords
        # sweep algo: 
        if coords is not None:
            dep = coords[self.instance.depot]
            ang = lambda c: np.arctan2(coords[c][1] - dep[1], coords[c][0] - dep[0])
            pop.append(sorted(self.customers, key=ang))
        while len(pop) < self.pop_size:
            t = self.customers[:]
            self.rng.shuffle(t)
            pop.append(t)
        return pop
    
    def _fitness(self, tour):
        return self._split(tour)[0]
    
    def _tournament(self, pop, fits):
        idx = self.rng.sample(range(len(pop)), self.tournament_size)
        return pop[min(idx, key=lambda i: fits[i])]

    def _order_crossover(self, p1, p2):
        n = len(p1)
        a, b = sorted(self.rng.sample(range(n), 2))
        child = [None] * n
        child[a:b + 1] = p1[a:b + 1]
        used = set(child[a:b + 1])
        fill = [g for g in p2 if g not in used]
        k = 0
        for i in list(range(0, a)) + list(range(b + 1, n)):
            child[i] = fill[k]
            k += 1
        return child

    def _mutate(self, tour):
        t = tour[:]
        r = self.rng.random()
        i, j = sorted(self.rng.sample(range(len(t)), 2))
        if r < 0.33:                      # swap
            t[i], t[j] = t[j], t[i]
        elif r < 0.66:                    # inversion
            t[i:j + 1] = reversed(t[i:j + 1])
        else:                             # relocate
            g = t.pop(i)
            t.insert(j, g)
        return t

    # --- main ---
    def solve(self) -> Solution:
        pop = self._init_population()
        fits = [self._fitness(t) for t in pop]
        best_tour, best_fit = min(zip(pop, fits), key=lambda x: x[1])
        best_tour = best_tour[:]

        for gen in range(self.generations):
            # Elitism
            best_indices = sorted(range(len(pop)), key=lambda i: fits[i])[:self.elite_size]
            new_pop = [pop[i][:] for i in best_indices]

            # Breeding loop
            while len(new_pop) < self.pop_size:
                p1 = self._tournament(pop, fits)
                p2 = self._tournament(pop, fits)
                
                child = (self._order_crossover(p1, p2) 
                         if self.rng.random() < self.crossover_rate else p1[:])
                
                if self.rng.random() < self.mutation_rate:
                    child = self._mutate(child)
                    
                new_pop.append(child)

            pop = new_pop
            fits = [self._fitness(t) for t in pop]

            # Apply Local Search (top-5 optimization)
            if self.use_local_search:
                top_indices = sorted(range(len(pop)), key=lambda i: fits[i])[:5]
                for idx in top_indices:
                    polished = self._improve(pop[idx])
                    pf = self._fitness(polished)
                    if pf < fits[idx]:
                        pop[idx], fits[idx] = polished, pf

            # Track global best
            gi = min(range(len(pop)), key=lambda i: fits[i])
            if fits[gi] < best_fit:
                best_fit, best_tour = fits[gi], pop[gi][:]
            self.history.append(best_fit)

            if self.verbose and (gen % 50 == 0 or gen == self.generations - 1):
                print(f"Gen {gen:4d} | best = {best_fit:.2f}")

        return self._to_solution(best_tour)
    
    def _to_solution(self, tour) -> Solution:
        inst = self.instance
        _, routes_customers = self._split(tour)
        routes = []
        for rc in routes_customers:
            r = Route(inst.capacity, inst.depot)
            for c in rc:
                r.addStop(c, inst.demands[c])
            r.close()
            routes.append(r)
        return Solution(routes=routes, dist_matrix=inst.edge_weights)