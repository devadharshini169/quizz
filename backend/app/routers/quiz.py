from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.attempt import Attempt
from app.models.question import Question
from app.models.answer import Answer
from app.models.result import Result
from app.schemas.quiz import QuizStart, QuizSubmit


router = APIRouter(
    prefix="/quiz",
    tags=["Quiz"]
)


# Start Quiz
@router.post("/start")
def start_quiz(
    data: QuizStart,
    db: Session = Depends(get_db)
):
    if not data.username.strip():
        raise HTTPException(
            status_code=400,
            detail="Username is required"
        )

    questions = db.query(Question).all()

    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No questions available"
        )

    attempt = Attempt(
        username=data.username.strip(),
        started_at=datetime.now()
    )

    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return {
        "message": "Quiz started successfully",
        "attempt_id": attempt.id,
        "username": attempt.username,
        "total_questions": len(questions)
    }


# Submit Quiz
@router.post("/submit")
def submit_quiz(
    data: QuizSubmit,
    db: Session = Depends(get_db)
):
    # Find the attempt
    attempt = (
        db.query(Attempt)
        .filter(Attempt.id == data.attempt_id)
        .first()
    )

    if not attempt:
        raise HTTPException(
            status_code=404,
            detail="Quiz attempt not found"
        )

    # Check whether already submitted
    existing_result = (
        db.query(Result)
        .filter(Result.attempt_id == data.attempt_id)
        .first()
    )

    if existing_result:
        raise HTTPException(
            status_code=400,
            detail="Quiz has already been submitted"
        )

    # Get all questions
    questions = db.query(Question).all()

    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No questions available"
        )

    # Save answers and calculate score
    score = 0

    for question in questions:

        selected_answer = data.answers.get(question.id)

        if selected_answer is None:
            selected_answer = ""

        answer = Answer(
            attempt_id=attempt.id,
            question_id=question.id,
            selected_answer=selected_answer
        )

        db.add(answer)

        if selected_answer == question.correct_answer:
            score += 1

    total_questions = len(questions)

    percentage = (
        (score / total_questions) * 100
        if total_questions > 0
        else 0
    )

    # Update attempt submission time
    attempt.submitted_at = datetime.now()

    # Save result
    result = Result(
        attempt_id=attempt.id,
        score=score,
        total_questions=total_questions,
        percentage=percentage
    )

    db.add(result)

    db.commit()
    db.refresh(result)

    return {
        "message": "Quiz submitted successfully",
        "attempt_id": attempt.id,
        "username": attempt.username,
        "score": score,
        "total_questions": total_questions,
        "percentage": round(percentage, 2)
    }