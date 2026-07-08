from database.db import db


class PostLike(db.Model):

    __tablename__ = "post_likes"

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

    __table_args__ = (
        db.UniqueConstraint(
            "post_id",
            "user_id",
            name="unique_post_like"
        ),
    )