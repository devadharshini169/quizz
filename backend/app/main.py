from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine, SessionLocal

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


# Create database tables
Base.metadata.create_all(bind=engine)


# Create default admin account
db = SessionLocal()

existing_admin = (
    db.query(admin.Admin)
    .filter(admin.Admin.username == "admin")
    .first()
)

if not existing_admin:
    new_admin = admin.Admin(
        username="admin",
        password="admin123"
    )

    db.add(new_admin)
    db.commit()

db.close()


app = FastAPI(
    title="Online Quiz System"
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Local frontend
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

        # Vercel frontend
        "https://quizz-brown-seven.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register routers
app.include_router(auth.router)
app.include_router(questions.router)
app.include_router(quiz.router)
app.include_router(results.router)


@app.get("/")
def home():
    return {
        "message": "Online Quiz System Backend is Running"
    }