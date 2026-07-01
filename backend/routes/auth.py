from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from services.auth_service import AuthService
from utils.validators import is_valid_email, is_strong_password
from utils.response import success_response, error_response

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "student")
    department = data.get("department")
    semester = data.get("semester")

    if not full_name or not email or not password:
        return error_response("Please fill all required fields")

    if not is_valid_email(email):
        return error_response("Invalid email address")

    if not is_strong_password(password):
        return error_response(
            "Password must contain at least 8 characters"
        )

    existing_user = AuthService.get_user_by_email(email)

    if existing_user:
        return error_response("Email already exists")

    user = AuthService.create_user(
        full_name,
        email,
        password,
        role,
        department,
        semester
    )

    token = AuthService.create_token(user)

    return success_response(
        "Registration successful",
        {
            "token": token,
            "user": user.to_dict()
        },
        201
    )


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return error_response("Email and password are required")

    user = AuthService.get_user_by_email(email)

    if not user:
        return error_response("Invalid credentials", 401)

    if not AuthService.verify_password(password, user.password):
        return error_response("Invalid credentials", 401)

    token = AuthService.create_token(user)

    return success_response(
        "Login successful",
        {
            "token": token,
            "user": user.to_dict()
        }
    )


@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():

    user_id = get_jwt_identity()

    return success_response(
        "Profile fetched successfully",
        {
            "user_id": user_id
        }
    )