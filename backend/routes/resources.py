from database.db import db
from services.resource_service import ResourceService
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from services.resource_service import ResourceService
from services.cloudinary_service import CloudinaryService
from utils.response import success_response, error_response

resources_bp = Blueprint("resources", __name__)


@resources_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_resource():

    print("FORM:", request.form)
    print("FILES:", request.files)

    title = request.form.get("title")
    description = request.form.get("description")
    subject = request.form.get("subject")
    semester = request.form.get("semester")
    department = request.form.get("department")
    tags = request.form.get("tags")

    pdf = request.files.get("pdf")
    print(pdf.filename)
    print(pdf.content_type)

    if not pdf:
        return error_response("PDF file is required")

    pdf_url = CloudinaryService.upload_pdf(pdf)

    resource = ResourceService.create_resource(
        title=title,
        description=description,
        subject=subject,
        semester=semester,
        department=department,
        tags=tags,
        pdf_url=pdf_url,
        thumbnail_url=None,
        uploaded_by=get_jwt_identity()
    )

    return success_response(
        "Resource uploaded successfully",
        resource.to_dict(),
        201
    )
@resources_bp.route("/", methods=["GET"])
def get_resources():

    search = request.args.get("search", "")

    resources = ResourceService.search_resources(search)

    return success_response(
        "Resources fetched successfully",
        [resource.to_dict() for resource in resources]
    )

@resources_bp.route("/my-uploads", methods=["GET"])
@jwt_required()
def my_uploads():

    user_id = int(get_jwt_identity())

    print("JWT USER:", user_id)

    resources = ResourceService.get_user_resources(user_id)

    print("FOUND:", len(resources))

    return success_response(
        "Resources fetched successfully",
        [resource.to_dict() for resource in resources]
    )
    
@resources_bp.route("/<int:resource_id>/like", methods=["POST"])
@jwt_required()
def like_resource(resource_id):

    result = ResourceService.like_resource(
        resource_id,
        int(get_jwt_identity())
    )

    if not result:
        return error_response(
            "Resource not found",
            404
        )

    if result == "own_resource":
        return error_response(
            "You cannot like your own resource",
            400
        )

    return success_response(
        "Like updated",
        result.to_dict()
    )

@resources_bp.route("/<int:resource_id>", methods=["DELETE"])
@jwt_required()
def delete_resource(resource_id):

    user_id = int(get_jwt_identity())

    resource = ResourceService.delete_resource(
        resource_id,
        user_id
    )

    if not resource:
        return error_response(
            "Resource not found",
            404
        )

    return success_response(
        "Resource deleted successfully"
    )

@resources_bp.route("/<int:resource_id>/download", methods=["POST"])
def download_resource(resource_id):

    resource = ResourceService.increment_download(resource_id)

    if not resource:
        return error_response(
            "Resource not found",
            404
        )

    return success_response(
        "Download counted",
        {
            "pdf_url": resource.pdf_url
        }
    )