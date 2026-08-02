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