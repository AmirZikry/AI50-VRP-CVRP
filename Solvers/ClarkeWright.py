from Models.Routes import Route 
from Models.Solution import Solution 
from Solvers.BaseSolver import BaseVRPSolver


class ClarkeWrightSolver(BaseVRPSolver):
    
    def solve(self) -> Solution:
        inst = self.instance
        depot = inst.depot

        # All customers except the depot
        customers = [
            i for i in range(inst.dimension)
            if i != depot
        ]

        # 1. Start with one route for every customer
        routes = [[customer] for customer in customers]

        # 2. Calculate savings for every pair of customers
        savings = []

        for i in range(len(customers)):
            for j in range(i + 1, len(customers)):

                customer_i = customers[i]
                customer_j = customers[j]

                # S(i,j)= d(0,i)+d(0,j)-d(i,j) 
                saving = (
                    inst.edge_weights[depot, customer_i]
                    + inst.edge_weights[depot, customer_j]
                    - inst.edge_weights[customer_i, customer_j]
                )

                savings.append((saving, customer_i, customer_j))

        # Highest savings first
        savings.sort(reverse=True, key=lambda x: x[0])

        # Find the route containing a customer
        def find_route(customer):
            for index, route in enumerate(routes):
                if customer in route:
                    return index

            return None

        # 3. Merge routes based on savings // Try merging routes using the savings list // du best --> not good one
        for saving, customer_i, customer_j in savings:

            route_i_index = find_route(customer_i)
            route_j_index = find_route(customer_j)

            # Safety check
            if route_i_index is None or route_j_index is None:
                continue

            # Already in the same route
            if route_i_index == route_j_index:
                continue

            route_i = routes[route_i_index]
            route_j = routes[route_j_index]

            # Customers must be at the ends of their routes
            i_at_start = route_i[0] == customer_i
            i_at_end = route_i[-1] == customer_i

            j_at_start = route_j[0] == customer_j
            j_at_end = route_j[-1] == customer_j

            if not (i_at_start or i_at_end):
                continue

            if not (j_at_start or j_at_end):
                continue


            # Check vehicle capacity before merging
            route_i_demand = sum(inst.demands[c] for c in route_i)
            route_j_demand = sum(inst.demands[c] for c in route_j)

            if route_i_demand + route_j_demand > inst.capacity:
                continue


            # Merge routes in the correct orientation
            # ... i -> j ...
            if i_at_end and j_at_start:

                merged_route = route_i + route_j

            # ... j -> i ...
            elif i_at_start and j_at_end:

                merged_route = route_j + route_i

            # Both customers are at the end
            elif i_at_end and j_at_end:

                merged_route = (route_i + list(reversed(route_j)))

            # Both customers are at the start
            elif i_at_start and j_at_start:

                merged_route = (list(reversed(route_i)) + route_j)

            else:
                continue

            # Remove old routes
            first = max(route_i_index, route_j_index)
            second = min(route_i_index, route_j_index)

            routes.pop(first)
            routes.pop(second)

            # Add merged route
            routes.append(merged_route)


        #  4. Convert normal lists into the project's Route objects
        final_routes: list[Route] = []

        for customer_route in routes:

            route = Route(capacity=inst.capacity, depot=depot)

            for customer in customer_route:

                route.addStop(customer, inst.demands[customer])

            # Add depot at the end
            route.close()

            final_routes.append(route)


        # 5. Return project's Solution object
        return Solution(routes=final_routes, dist_matrix=inst.edge_weights)