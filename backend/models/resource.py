from database.db import db
from datetime import datetime


class Resource(db.Model):
    __tablename__ = "resources"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(255), nullable=False)

    description = db.Column(db.Text)

    subject = db.Column(db.String(100))

    semester = db.Column(db.String(20))

    department = db.Column(db.String(100))

    tags = db.Column(db.Text)

    pdf_url = db.Column(db.Text, nullable=False)

    thumbnail_url = db.Column(db.Text)

    uploaded_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    downloads = db.Column(
        db.Integer,
        default=0
    )

    likes = db.relationship(
    "ResourceLike",
    cascade="all, delete-orphan",
    lazy=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    comments = db.relationship(
    "Comment",
    backref="resource",
    lazy=True,
    cascade="all, delete"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "subject": self.subject,
            "semester": self.semester,
            "department": self.department,
            "tags": self.tags,
            "pdf_url": self.pdf_url,
            "thumbnail_url": self.thumbnail_url,
            "uploaded_by": self.uploaded_by,
            "downloads": self.downloads,
            "likes": len(self.likes),
            "comments": len(self.comments),
            "created_at": self.created_at.isoformat()
        }