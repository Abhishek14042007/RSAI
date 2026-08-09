from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from services.chat_request_service import ChatRequestService
from utils.response import success_response, error_response


chat_request_bp = Blueprint(
    "chat_request",
    __name__
)


@chat_request_bp.route("/request", methods=["POST"])
@jwt_required()
def send_request():

    data = request.get_json(silent=True) or {}

    receiver_id = data.get("receiver_id")

    if not receiver_id:
        return error_response(
            "Receiver ID is required",
            400
        )

    try:
        receiver_id = int(receiver_id)
    except (TypeError, ValueError):
        return error_response(
            "Invalid receiver ID",
            400
        )

    sender_id = int(get_jwt_identity())

    result = ChatRequestService.send_request(
        sender_id,
        receiver_id
    )

    if result == "self":
        return error_response(
            "You cannot send a request to yourself",
            400
        )

    if result == "exists":
        return error_response(
            "Request already exists",
            400
        )

    if result == "connected":
        return error_response(
            "You are already connected",
            400
        )

    return success_response(
        "Request sent successfully",
        {
            "id": result.id,
            "status": result.status
        },
        201
    )


@chat_request_bp.route("/requests", methods=["GET"])
@jwt_required()
def get_requests():

    user_id = int(get_jwt_identity())

    requests = ChatRequestService.get_pending_requests(
        user_id
    )

    return success_response(
        "Requests fetched successfully",
        [
            request.to_dict()
            for request in requests
        ]
    )


@chat_request_bp.route(
    "/respond/<int:request_id>",
    methods=["POST"]
)
@jwt_required()
def respond_request(request_id):

    data = request.get_json(silent=True) or {}

    action = data.get("action")

    if action not in ["accept", "reject"]:
        return error_response(
            "Invalid action",
            400
        )

    user_id = int(get_jwt_identity())

    result = ChatRequestService.respond_request(
        request_id,
        user_id,
        action
    )

    if not result:
        return error_response(
            "Request not found",
            404
        )

    if action == "reject":

        return success_response(
            "Request rejected"
        )

    return success_response(
        "Request accepted",
        {
            "room_id": result.id
        }
    )


@chat_request_bp.route(
    "/rooms",
    methods=["GET"]
)
@jwt_required()
def get_rooms():

    user_id = int(get_jwt_identity())

    rooms = ChatRequestService.get_user_rooms(
        user_id
    )

    return success_response(
        "Chat rooms fetched successfully",
        [
            room.to_dict()
            for room in rooms
        ]
    )


@chat_request_bp.route(
    "/rooms/<int:room_id>",
    methods=["GET"]
)
@jwt_required()
def get_room(room_id):

    user_id = int(get_jwt_identity())

    room = ChatRequestService.get_room(
        room_id,
        user_id
    )

    if not room:
        return error_response(
            "Chat room not found",
            404
        )

    return success_response(
        "Chat room fetched successfully",
        room.to_dict()
    )