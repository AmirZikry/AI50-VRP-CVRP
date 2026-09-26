from dataclasses import dataclass
import numpy as np

@dataclass(frozen=True)
class VrpInstance:
    name:str
    dimension:int
    capacity:int
    demands:np.ndarray
    edge_weights:np.ndarray
    depot:int=0
    node_coords:np.ndarray | None=None