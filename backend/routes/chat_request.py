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
    print("Headers:", request.headers)
    print("Raw Data:", request.data)
    print("JSON:", request.get_json())

    data = request.get_json()

    receiver_id = data.get("receiver_id")

    if not receiver_id:
        return error_response(
            "Receiver ID is required"
        )

    result = ChatRequestService.send_request(
        int(get_jwt_identity()),
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

    requests = ChatRequestService.get_pending_requests(
        int(get_jwt_identity())
    )

    return success_response(
        "Requests fetched successfully",
        [
            {
                "id": req.id,
                "sender_id": req.sender.id,
                "sender_name": req.sender.full_name,
                "sender_role": req.sender.role,
                "status": req.status,
                "created_at": req.created_at.isoformat()
            }
            for req in requests
        ]
    )
@chat_request_bp.route("/respond/<int:request_id>", methods=["POST"])
@jwt_required()
def respond_request(request_id):

    data = request.get_json()

    action = data.get("action")

    if action not in ["accept", "reject"]:
        return error_response(
            "Invalid action"
        )

    result = ChatRequestService.respond_request(
        request_id,
        int(get_jwt_identity()),
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