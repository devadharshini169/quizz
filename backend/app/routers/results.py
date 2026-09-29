from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.result import Result
from app.models.attempt import Attempt


router = APIRouter(
    prefix="/results",
    tags=["Results"]
)


@router.get("/")
def get_all_results(
    db: Session = Depends(get_db)
):
    results = (
        db.query(Result, Attempt)
        .join(
            Attempt,
            Result.attempt_id == Attempt.id
        )
        .all()
    )

    return [
        {
            "result_id": result.id,
            "attempt_id": attempt.id,
            "username": attempt.username,
            "score": result.score,
            "total_questions": result.total_questions,
            "percentage": result.percentage,
            "started_at": attempt.started_at,
            "submitted_at": attempt.submitted_at,
        }
        for result, attempt in results
    ]