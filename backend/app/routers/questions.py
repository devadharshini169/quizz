from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.question import Question
from app.schemas.question import QuestionCreate

router = APIRouter(prefix="/questions", tags=["Questions"])


# Create Question
@router.post("/")
def create_question(
    data: QuestionCreate,
    db: Session = Depends(get_db)
):
    question = Question(
        question=data.question,
        option1=data.option1,
        option2=data.option2,
        option3=data.option3,
        option4=data.option4,
        correct_answer=data.correct_answer,
        category=data.category
    )

    db.add(question)
    db.commit()
    db.refresh(question)

    return {
        "message": "Question created successfully",
        "question_id": question.id
    }


# Get All Questions
@router.get("/")
def get_questions(db: Session = Depends(get_db)):
    return db.query(Question).all()


# Update Question
@router.put("/{question_id}")
def update_question(
    question_id: int,
    data: QuestionCreate,
    db: Session = Depends(get_db)
):
    question = (
        db.query(Question)
        .filter(Question.id == question_id)
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    question.question = data.question
    question.option1 = data.option1
    question.option2 = data.option2
    question.option3 = data.option3
    question.option4 = data.option4
    question.correct_answer = data.correct_answer
    question.category = data.category

    db.commit()
    db.refresh(question)

    return {
        "message": "Question updated successfully"
    }


# Delete Question
@router.delete("/{question_id}")
def delete_question(
    question_id: int,
    db: Session = Depends(get_db)
):
    question = (
        db.query(Question)
        .filter(Question.id == question_id)
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    db.delete(question)
    db.commit()

    return {
        "message": "Question deleted successfully"
    }