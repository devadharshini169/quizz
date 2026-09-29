from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.models import (
    admin,
    question,
    attempt,
    answer,
    result
)

from app.routers import (
    auth,
    questions,
    quiz,
    results
)


# =========================================
# CREATE DATABASE TABLES
# =========================================

Base.metadata.create_all(bind=engine)


# =========================================
# CREATE FASTAPI APPLICATION
# =========================================

app = FastAPI(
    title="Online Quiz System"
)


# =========================================
# CORS CONFIGURATION
# =========================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        "http://localhost:5174",
        "http://127.0.0.1:5174",

        "http://localhost:5175",
        "http://127.0.0.1:5175",

        "http://localhost:5176",
        "http://127.0.0.1:5176",

        "http://localhost:5177",
        "http://127.0.0.1:5177",

        "http://localhost:5178",
        "http://127.0.0.1:5178",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================================
# REGISTER ROUTERS
# =========================================

app.include_router(auth.router)

app.include_router(questions.router)

app.include_router(quiz.router)

app.include_router(results.router)


# =========================================
# HOME API
# =========================================

@app.get("/")
def home():
    return {
        "message": "Online Quiz System Backend is Running"
    }