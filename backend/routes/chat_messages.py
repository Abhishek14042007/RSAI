from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from services.chat_message_service import ChatMessageService
from utils.response import success_response, error_response


chat_messages_bp = Blueprint(
    "chat_messages",
    __name__
)


@chat_messages_bp.route(
    "/rooms/<int:room_id>/messages",
    methods=["GET"]
)
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


@chat_messages_bp.route(
    "/rooms/<int:room_id>/messages",
    methods=["POST"]
)
@jwt_required()
def send_message(room_id):

    user_id = int(get_jwt_identity())

    data = request.get_json() or {}

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
@chat_messages_bp.route(
    "/rooms/<int:room_id>/messages/<int:message_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_message(room_id, message_id):

    user_id = int(get_jwt_identity())

    message = ChatMessageService.delete_message(
        message_id,
        user_id
    )

    if message is None:
        return error_response(
            "Message not found",
            404
        )

    if message == "forbidden":
        return error_response(
            "You can only delete your own messages",
            403
        )

    return success_response(
        "Message deleted successfully"
    )