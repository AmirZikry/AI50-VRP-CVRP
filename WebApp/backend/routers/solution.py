from fastapi import APIRouter, HTTPException,status
from ..schemas.solutionSchema import SolutionResponse

router=APIRouter(prefix="/solutions", tags=["items"])

testsolution= [{
    "id":1,
    "method":"Nearest Neighbour",
    "type":"Heuristic",
    "bks":30, 
    "runtime":10,
    "mean_gap":5,
    "status_gap":5, 
    "valid":True,
    "status":'done',
    "routes":[[1,2,3,5,8,7,4],[1,3,5,8,7,4,6]], 
    "total_cost":80
}
]

@router.get("/", response_model=list[SolutionResponse])
def get_solutions():
    return testsolution