from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from services.chat_message_service import ChatMessageService
from models.chat_room import ChatRoom
from utils.response import success_response, error_response


chat_bp = Blueprint("chat", __name__)


# Get user's chat rooms
@chat_bp.route("/rooms", methods=["GET"])
@jwt_required()
def get_chat_rooms():

    user_id = int(get_jwt_identity())

    rooms = ChatRoom.query.filter(
        (ChatRoom.student_id == user_id) |
        (ChatRoom.alumni_id == user_id)
    ).order_by(
        ChatRoom.created_at.desc()
    ).all()

    result = []

    for room in rooms:

        other_user = (
            room.alumni
            if room.student_id == user_id
            else room.student
        )

        result.append({
            "id": room.id,
            "student_id": room.student_id,
            "alumni_id": room.alumni_id,
            "other_user": {
                "id": other_user.id,
                "name": other_user.full_name,
                "role": other_user.role,
                "profile_picture": other_user.profile_picture
            },
            "created_at": room.created_at.isoformat()
        })

    return success_response(
        "Chat rooms fetched successfully",
        result
    )


# Get messages
@chat_bp.route("/rooms/<int:room_id>/messages", methods=["GET"])
@jwt_required()
def get_messages(room_id):

    user_id = int(get_jwt_identity())

    messages = ChatMessageService.get_messages(
        room_id,
        user_id
    )

    if messages is None:
        return error_response(
            "Chat room not found or access denied",
            404
        )

    return success_response(
        "Messages fetched successfully",
        [
            message.to_dict()
            for message in messages
        ]
    )


# Send message
@chat_bp.route("/rooms/<int:room_id>/messages", methods=["POST"])
@jwt_required()
def send_message(room_id):

    user_id = int(get_jwt_identity())

    data = request.get_json()

    content = data.get("content", "").strip()

    if not content:
        return error_response(
            "Message cannot be empty",
            400
        )

    message = ChatMessageService.send_message(
        room_id,
        user_id,
        content
    )

    if message is None:
        return error_response(
            "Chat room not found or access denied",
            404
        )

    return success_response(
        "Message sent successfully",
        message.to_dict(),
        201
    )