from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from services.community_service import CommunityService
from utils.response import success_response, error_response

community_bp = Blueprint("community", __name__)
@community_bp.route("/", methods=["POST"])
@jwt_required()
def create_post():

    data = request.get_json()

    content = data.get("content")

    if not content:
        return error_response(
            "Post content is required"
        )

    post = CommunityService.create_post(
        content,
        int(get_jwt_identity())
    )

    return success_response(
        "Post created successfully",
        post.to_dict(),
        201
    )
@community_bp.route("/", methods=["GET"])
def get_posts():

    posts = CommunityService.get_posts()

    return success_response(
        "Posts fetched successfully",
        [
            post.to_dict()
            for post in posts
        ]
    )
@community_bp.route("/<int:post_id>/like", methods=["POST"])
@jwt_required()
def like_post(post_id):

    result = CommunityService.like_post(
        post_id,
        int(get_jwt_identity())
    )

    if not result:
        return error_response(
            "Post not found",
            404
        )

    if result == "own_post":
        return error_response(
            "You cannot like your own post",
            400
        )

    return success_response(
        "Like updated",
        result.to_dict()
    )
@community_bp.route("/<int:post_id>", methods=["DELETE"])
@jwt_required()
def delete_post(post_id):

    post = CommunityService.delete_post(
        post_id,
        int(get_jwt_identity())
    )

    if not post:
        return error_response(
            "Post not found",
            404
        )

    return success_response(
        "Post deleted successfully"
    )
@community_bp.route("/<int:post_id>/comments", methods=["POST"])
@jwt_required()
def add_comment(post_id):

    data = request.get_json()

    content = data.get("content")

    if not content:
        return error_response(
            "Comment cannot be empty"
        )

    comment = CommunityService.add_comment(
        post_id,
        int(get_jwt_identity()),
        content
    )

    if not comment:
        return error_response(
            "Post not found",
            404
        )

    return success_response(
        "Comment added",
        comment.to_dict(),
        201
    )
@community_bp.route("/<int:post_id>/comments", methods=["GET"])
def get_comments(post_id):

    comments = CommunityService.get_comments(post_id)

    return success_response(
        "Comments fetched",
        [
            comment.to_dict()
            for comment in comments
        ]
    )
@community_bp.route("/comments/<int:comment_id>", methods=["DELETE"])
@jwt_required()
def delete_comment(comment_id):

    comment = CommunityService.delete_comment(
        comment_id,
        int(get_jwt_identity())
    )

    if not comment:
        return error_response(
            "Comment not found",
            404
        )

    return success_response(
        "Comment deleted"
    )