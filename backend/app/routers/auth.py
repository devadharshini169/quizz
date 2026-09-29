from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.admin import Admin
from app.schemas.admin import AdminLogin

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
def admin_login(data: AdminLogin, db: Session = Depends(get_db)):

    admin = (
        db.query(Admin)
        .filter(Admin.username == data.username)
        .first()
    )

    if not admin or admin.password != data.password:
        return {
            "success": False,
            "message": "Invalid username or password"
        }

    return {
        "success": True,
        "message": "Admin login successful"
    }