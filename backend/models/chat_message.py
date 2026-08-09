from database.db import db
from datetime import datetime


class ChatMessage(db.Model):

    __tablename__ = "chat_messages"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    room_id = db.Column(
        db.Integer,
        db.ForeignKey("chat_rooms.id"),
        nullable=False
    )

    sender_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    content = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    sender = db.relationship(
        "User",
        foreign_keys=[sender_id]
    )

    room = db.relationship(
        "ChatRoom",
        foreign_keys=[room_id]
    )

    def to_dict(self):

        return {
            "id": self.id,
            "room_id": self.room_id,
            "sender_id": self.sender_id,
            "sender_name": self.sender.full_name if self.sender else "Unknown",
            "sender_role": self.sender.role if self.sender else None,
            "content": self.content,
            "created_at": self.created_at.isoformat()
        }