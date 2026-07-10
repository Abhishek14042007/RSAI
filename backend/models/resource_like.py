from database.db import db


class ResourceLike(db.Model):

    __tablename__ = "resource_likes"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    resource_id = db.Column(
        db.Integer,
        db.ForeignKey("resources.id"),
        nullable=False
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    __table_args__ = (
        db.UniqueConstraint(
            "resource_id",
            "user_id",
            name="unique_resource_like"
        ),
    )