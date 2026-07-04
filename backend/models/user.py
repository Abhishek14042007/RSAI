from datetime import datetime
from database.db import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    full_name = db.Column(db.String(120), nullable=False)

    email = db.Column(db.String(120), unique=True, nullable=False)

    password = db.Column(db.String(255), nullable=False)

    role = db.Column(
        db.Enum("student", "alumni", "admin", name="user_roles"),
        default="student",
        nullable=False
    )

    department = db.Column(db.String(100))

    semester = db.Column(db.String(20))

    profile_picture = db.Column(db.String(500))

    bio = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    comments = db.relationship(
    "Comment",
    backref="user",
    lazy=True,
    cascade="all, delete"
    )
    
    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "role": self.role,
            "department": self.department,
            "semester": self.semester,
            "profile_picture": self.profile_picture,
            "bio": self.bio
        }
    
    
    def __repr__(self):
        return f"<User {self.email}>"