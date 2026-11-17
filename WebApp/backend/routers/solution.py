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

router=APIRouter(prefix="/solutions", tags=["Solution"])


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