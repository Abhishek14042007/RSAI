from database.db import db
from datetime import datetime


class CommunityPost(db.Model):

    __tablename__ = "community_posts"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    content = db.Column(
        db.Text,
        nullable=False
    )
    image_url = db.Column(
    db.Text,
    nullable=True
    )
    comments = db.relationship(
    "PostComment",
    cascade="all, delete-orphan",
    lazy=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    likes = db.relationship(
        "PostLike",
        cascade="all, delete-orphan",
        lazy=True
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
            "image_url": self.image_url,
            "likes": len(self.likes),
            "comment_count": len(self.comments),
            "created_at": self.created_at.isoformat(),
            "user": {
                "id": self.user.id,
                "name": self.user.full_name,
                "role": self.user.role,
                "avatar": self.user.profile_picture,
            }
        }