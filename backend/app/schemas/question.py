from pydantic import BaseModel


class QuestionCreate(BaseModel):
    question: str
    option1: str
    option2: str
    option3: str
    option4: str
    correct_answer: str
    category: str | None = None