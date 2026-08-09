from database.db import db
from datetime import datetime


class ChatRoom(db.Model):
    __tablename__ = "chat_rooms"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    alumni_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    student = db.relationship(
        "User",
        foreign_keys=[student_id]
    )

    alumni = db.relationship(
        "User",
        foreign_keys=[alumni_id]
    )

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "student_name": (
                self.student.full_name
                if self.student
                else "Unknown"
            ),
            "alumni_id": self.alumni_id,
            "alumni_name": (
                self.alumni.full_name
                if self.alumni
                else "Unknown"
            ),
            "created_at": self.created_at.isoformat()
        }