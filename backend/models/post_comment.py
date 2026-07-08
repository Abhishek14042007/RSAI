from datetime import datetime

from database.db import db


class PostComment(db.Model):

    __tablename__ = "post_comments"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    post_id = db.Column(
        db.Integer,
        db.ForeignKey("community_posts.id"),
        nullable=False
    )

    user_id = db.Column(
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

    user = db.relationship("User")

    def to_dict(self):

        return {
            "id": self.id,
            "content": self.content,
            "created_at": self.created_at.isoformat(),
            "user": {
                "id": self.user.id,
                "name": self.user.full_name,
                "role": self.user.role,
                "avatar": self.user.profile_picture,
            }
        }