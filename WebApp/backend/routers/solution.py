# to import the benchmark runner
import sys
from pathlib import Path

root_dir = Path(__file__).resolve().parent.parent.parent.parent
if str(root_dir) not in sys.path:
    sys.path.append(str(root_dir))

from fastapi import APIRouter, HTTPException,status
from ..schemas.solutionSchema import SolutionResponse
from ..schemas.benchmarkSchema import BenchmarkRequest
from main import run_benchmark

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

#@router.get("/",response_model=list[SolutionResponse])
@router.post("/")
def get_solutions(req: BenchmarkRequest):
    try:
        return run_benchmark(req.instanceName, req.solvers, req.optimizer)
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=str(e)
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=str(e)
        )