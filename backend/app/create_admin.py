from app.database import SessionLocal
from app.models.admin import Admin


db = SessionLocal()

existing_admin = (
    db.query(Admin)
    .filter(Admin.username == "admin")
    .first()
)

if existing_admin:
    print("Admin account already exists.")
else:
    admin = Admin(
        username="admin",
        password="admin123"
    )

    db.add(admin)
    db.commit()

    print("Admin account created successfully.")

db.close()