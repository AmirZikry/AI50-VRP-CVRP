# to import the benchmark runner
import sys
from pathlib import Path

root_dir = Path(__file__).resolve().parent.parent.parent.parent
if str(root_dir) not in sys.path:
    sys.path.append(str(root_dir))

from fastapi import APIRouter, HTTPException,status
from ..schemas.solutionSchema import ExportExcelRequest
from ..schemas.benchmarkSchema import BenchmarkRequest
from ..service.export import build_excel_bytes
from main import stream_result, getInstanceInfo

router=APIRouter(prefix="/solutions", tags=["Solution"])


from fastapi import APIRouter
from fastapi.responses import Response


@router.post("/export-excel")
def export_excel_endpoint(req: ExportExcelRequest):
    try:
        instance, best_cost = getInstanceInfo(req.instanceName)
    except FileNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    xlsx_bytes = build_excel_bytes(req.results, instance, best_cost)
    filename = f"benchmark_{req.instanceName}.xlsx"

    return Response(
        content=xlsx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )

@router.post("/")
def get_solutions(req: BenchmarkRequest):
    try:
        return stream_result(req.instanceName, req.solvers, req.optimizer)
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
    #TODO Stream Response send answer when done