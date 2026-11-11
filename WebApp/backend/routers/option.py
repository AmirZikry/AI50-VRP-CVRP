import sys
from pathlib import Path

root_dir = Path(__file__).resolve().parent.parent.parent.parent
if str(root_dir) not in sys.path:
    sys.path.append(str(root_dir))

from fastapi import APIRouter,HTTPException,status
from main import list_options

router= APIRouter(prefix="/options", tags=["Options"])

@router.get("/")
def getOptions():
    try:
        return list_options()
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )