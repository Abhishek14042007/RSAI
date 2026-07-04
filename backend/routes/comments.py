from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from database.db import db
from models.comment import Comment

comments_bp = Blueprint("comments", __name__)


@comments_bp.route("/<int:resource_id>", methods=["GET"])
def get_comments(resource_id):

    comments = Comment.query.filter_by(
        resource_id=resource_id
    ).order_by(Comment.created_at.desc()).all()

    return {
        "success": True,
        "comments": [comment.to_dict() for comment in comments]
    }, 200


@comments_bp.route("/<int:resource_id>", methods=["POST"])
@jwt_required()
def add_comment(resource_id):

    data = request.get_json()

    content = data.get("content")

    if not content:
        return {
            "success": False,
            "message": "Comment cannot be empty."
        }, 400

    comment = Comment(
        content=content,
        resource_id=resource_id,
        user_id=get_jwt_identity()
    )

    db.session.add(comment)
    db.session.commit()

    return {
        "success": True,
        "message": "Comment added successfully.",
        "comment": comment.to_dict()
    }, 201