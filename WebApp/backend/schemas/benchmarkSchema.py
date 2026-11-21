from pydantic import BaseModel,ConfigDict
from typing import Literal

class BenchmarkRequest(BaseModel):
    solvers: list[str] | Literal["all"]="all"
    optimizer:str | None=None
    instanceName : str

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "instanceName": "XML100_1111_01",
                    "solvers": ["Clarke-Wright"],
                    "optimizer": "Simulated Annealing",
                }
            ]
        }
    )