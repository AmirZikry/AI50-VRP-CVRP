from pydantic import BaseModel,Field
from typing import List

class SolutionBase(BaseModel):
    method:str
    type:str
    bks:int = Field(gt=0) 
    runtime:float = Field(gt=0)
    mean_gap:float
    status_gap:float 
    valid:bool = Field(default=True)
    status:str
    routes: List #count routes = vehicle count
    total_cost:int = Field(gt=0)

class SolutionResponse(SolutionBase):
    id:int
    class Config:
        from_attributes=True