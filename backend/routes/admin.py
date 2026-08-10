from flask import Blueprint

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from models.user import User
from services.admin_service import AdminService
from utils.response import success_response, error_response


admin_bp = Blueprint(
    "admin",
    __name__
)


def check_admin():

    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)

    if not user:
        return None

    if user.role != "admin":
        return None

    return user


@admin_bp.route(
    "/users",
    methods=["GET"]
)
@jwt_required()
def get_users():

    admin = check_admin()

    if not admin:
        return error_response(
            "Admin access required",
            403
        )

    users = AdminService.get_all_users()

    return success_response(
        "Users fetched successfully",
        [
            {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role
            }
            for user in users
        ]
    )


@admin_bp.route(
    "/users/<int:user_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_user(user_id):

    admin = check_admin()

    if not admin:
        return error_response(
            "Admin access required",
            403
        )

    # Prevent admin from deleting themselves
    if admin.id == user_id:
        return error_response(
            "You cannot delete your own admin account",
            400
        )

    result = AdminService.delete_user(user_id)

    if result is None:
        return error_response(
            "User not found",
            404
        )

    if result == "admin":
        return error_response(
            "Admin accounts cannot be deleted",
            403
        )

    return success_response(
        "User and all associated data deleted successfully"
    )