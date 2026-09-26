import vrplib
from Utils.dataLoader import load_instance
from Solvers.NearestNeighbor import NearestNeighborSolver

def main():
    # 1. Load instance into domain model
    instance = load_instance("./DataCVRP/instances/XML100_1111_01.vrp", is_local=True)
    print(f"Loaded: {instance.name} (Customers: {instance.dimension - 1}, Capacity: {instance.capacity})")

    # 2. Solve
    solver = NearestNeighborSolver(instance)
    solution = solver.solve()

    # 3. Print output
    print(f"\nSolution Cost: {solution.total_cost:.2f}")
    print(f"Vehicles Used: {solution.num_vehicles}")
    for idx, route in enumerate(solution.routes, 1):
        print(f"Route #{idx} (Load: {route.load}/{route.capacity}): {route.stops}")

    # 4. Compare with BSK
    solution=vrplib.read_solution("./DataCVRP/solutions/XML100_1111_01.sol")
    print("Best Known Solution Cost = ", solution['cost'] )

if __name__ == "__main__":
    main()