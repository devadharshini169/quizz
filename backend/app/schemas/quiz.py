from pydantic import BaseModel
from typing import Dict


class QuizStart(BaseModel):
    username: str


class QuizSubmit(BaseModel):
    attempt_id: int
    answers: Dict[int, str]