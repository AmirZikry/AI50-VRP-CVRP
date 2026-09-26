import vrplib
from Models.Instance import VrpInstance

def load_instance(path_or_name: str, is_local: bool = True) -> VrpInstance:
    raw = vrplib.read_instance(path_or_name) if is_local else vrplib.download_instance(path_or_name)

    depot = raw["depot"]
    depot_idx = int(depot[0]) if hasattr(depot, "__iter__") else int(depot)

    return VrpInstance(
        name=raw.get("name", "Unknown"),
        dimension=int(raw["dimension"]),
        capacity=int(raw["capacity"]),
        demands=raw["demand"],
        edge_weights=raw["edge_weight"],
        depot=depot_idx,
        node_coords=raw.get("node_coord"),
    )