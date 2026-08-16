from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from database.db import db
from models.comment import Comment
from models.resource import Resource
from models.user import User

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
@comments_bp.route("/<int:comment_id>", methods=["DELETE"])
@jwt_required()
def delete_comment(comment_id):

    user_id = int(get_jwt_identity())

    comment = Comment.query.get(comment_id)

    if not comment:
        return {
            "success": False,
            "message": "Comment not found."
        }, 404

    user = User.query.get(user_id)

    if not user:
        return {
            "success": False,
            "message": "User not found."
        }, 404

    resource = Resource.query.get(comment.resource_id)

    if not resource:
        return {
            "success": False,
            "message": "Resource not found."
        }, 404

    # Comment owner, resource owner, or admin can delete
    allowed = (
        comment.user_id == user_id
        or resource.uploaded_by == user_id
        or user.role == "admin"
    )

    if not allowed:
        return {
            "success": False,
            "message": "You are not allowed to delete this comment."
        }, 403

    db.session.delete(comment)
    db.session.commit()

    return {
        "success": True,
        "message": "Comment deleted successfully."
    }, 200