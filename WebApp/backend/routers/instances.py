import sys 
from pathlib import Path

root_dir = Path(__file__).resolve().parent.parent.parent.parent
if str(root_dir) not in sys.path:
    sys.path.append(str(root_dir))

import vrplib
from fastapi import APIRouter, HTTPException, status
from main import BASE_DIR, get_instances

router = APIRouter(prefix="/instances", tags=["Instances"])

@router.get("/{name}")
def get_instance(name:str):
    if name not in get_instances():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unknown instance: {name!r}"
        )

    raw = vrplib.read_instance(
        str(BASE_DIR / "DataCVRP" / "instances" / f"{name}.vrp"),
        compute_edge_weights=False,        
    )

    best_known = None
    try:
        sol = vrplib.read_solution(str(BASE_DIR / "DataCVRP" / "solutions" / f"{name}.sol"))
        best_known = {
            "cost": float(sol["cost"]),
            "routes": [[int(c) for c in r] for r in sol["routes"]],
        }
    except FileNotFoundError:
        pass

    return {
        "name": name,
        "customers": int(raw["dimension"]) - 1,
        "capacity": int(raw["capacity"]),
        "depot": int(raw["depot"][0]),
        "coords": raw["node_coord"].astype(float).tolist(), 
        "demands": raw["demand"].astype(int).tolist(),      
        "bestKnown": best_known,
    }
