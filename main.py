import vrplib
from Utils.dataLoader import load_instance
from Utils.evaluator import evaluate_solution
from Solvers.NearestNeighbor import NearestNeighborSolver
from Optimizer.SimAnneal import Simulated_Annealing
from Solvers.CheapestInsertion import CheapestInsertionSolver


def main():
    instance_path  = "./DataCVRP/instances/XML100_1111_01.vrp"
    solution_path = "./DataCVRP/solutions/XML100_1111_01.sol"
    
    # 1. Load instance into domain model
    instance = load_instance(instance_path, is_local=True)
    print(f"Loaded: {instance.name} (Customers: {instance.dimension - 1}, Capacity: {instance.capacity})")

    # 2. Solve
    solver = NearestNeighborSolver(instance)
    initial_solution = solver.solve()
    solution = Simulated_Annealing(initial_solution).optimize()
    # 3. Load best-known solution cost 
    best_known = vrplib.read_solution(solution_path)

    # 4. Validate with the universal evaluator
    result = evaluate_solution(instance, solution, best_known_cost=best_known["cost"])

    # 5. Print report
    for idx, route in enumerate(solution.routes, 1):
        print(f"Route #{idx} (Load: {route.load}/{route.capacity}): {route.stops}")

    print("\nBest Known Solution Cost = ", best_known["cost"])
    print(f"\n{result.report()}")
    if not result.is_valid:
        raise ValueError("Solver produced an invalid solution")
if __name__ == "__main__":
    main()