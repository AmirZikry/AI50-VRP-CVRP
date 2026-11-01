import time
import streamlit as st
import matplotlib.pyplot as plt
import vrplib

from Utils.dataLoader import load_instance
from Utils.evaluator import evaluate_solution
from Solvers.NearestNeighbor import NearestNeighborSolver
from Solvers.GeneticAlgo import GeneticAlgorithmSolver
from Solvers.AntColony import AntColonySolver
from Solvers.ClarkeWright import ClarkeWrightSolver
from Solvers.CheapestInsertion import CheapestInsertionSolver
from Optimizer.SimAnneal import Simulated_Annealing

# Registre : nom -> (classe, paramètres)
# Paramètre = (type, défaut, min, max)
SOLVERS = {
    "Nearest Neighbor":   (NearestNeighborSolver, {}),
    "Clarke & Wright":    (ClarkeWrightSolver, {}),
    "Cheapest Insertion": (CheapestInsertionSolver, {}),
    "Genetic Algorithm": (GeneticAlgorithmSolver, {
        "pop_size":    ("int", 200, 10, 1000),
        "generations": ("int", 400, 10, 5000),
        "seed":        ("int", 42, 0, 9999),
    }),
    "Ant Colony": (AntColonySolver, {
        "num_ants":       ("int", 100, 10, 500),
        "num_iterations": ("int", 200, 10, 2000),
        "alpha":          ("float", 0.95, 0.0, 5.0),
        "beta":           ("float", 0.45, 0.0, 5.0),
        "rho":            ("float", 0.3, 0.0, 1.0),
        "Q":              ("float", 0.5, 0.0, 10.0),
    }),
}

LIST_INSTANCES = ["XML100_1111_01","XML100_1111_02","XML100_1111_03","XML100_1111_04", "XML100_1232_08"]

st.title("CVRP")

# ---------- Barre latérale ----------
instance_name = st.sidebar.selectbox("Instance", LIST_INSTANCES)
solver_name = st.sidebar.selectbox("Solveur", list(SOLVERS))

solver_cls, param_specs = SOLVERS[solver_name]
params = {}
st.sidebar.subheader("Paramètres")
for name, (kind, default, lo, hi) in param_specs.items():
    if kind == "int":
        params[name] = st.sidebar.number_input(name, lo, hi, default, step=1)
    else:
        params[name] = st.sidebar.slider(name, float(lo), float(hi), float(default))

use_sa = st.sidebar.checkbox("Améliorer avec Simulated Annealing")
run = st.sidebar.button("▶ Lancer")

# ---------- Exécution ----------
if run:
    instance = load_instance(f"./DataCVRP/instances/{instance_name}.vrp", is_local=True)
    best = vrplib.read_solution(f"./DataCVRP/solutions/{instance_name}.sol")

    with st.spinner("Calcul en cours..."):
        start = time.perf_counter()
        solution = solver_cls(instance, **params).solve()
        if use_sa:
            solution = Simulated_Annealing(solution).optimize()
        runtime = time.perf_counter() - start

    result = evaluate_solution(instance, solution, best_known_cost=best["cost"])
    result.runtime_seconds = runtime

    # Résultats
    st.text(result.report())

    # Carte des routes
    fig, ax = plt.subplots()
    for route in solution.routes:
        pts = [instance.node_coords[i] for i in route.stops]
        ax.plot(*zip(*pts), marker="o")
    st.pyplot(fig)
    
    st.success("Solution valide ✅") if result.is_valid else st.error("Solution invalide ❌")


    for i, r in enumerate(solution.routes, 1):
        st.write(f"Route #{i} (Charge {r.load}/{r.capacity}) : {r.stops}")