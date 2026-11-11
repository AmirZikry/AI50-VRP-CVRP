from pydantic import BaseModel, Field
from typing import Literal

class BenchmarkRequest(BaseModel):
    solvers: list[str] | Literal["all"]="all"
    optimizer:str | None=None
    instanceName : str