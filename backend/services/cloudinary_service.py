import cloudinary
import cloudinary.uploader

from config import Config

cloudinary.config(
    cloud_name=Config.CLOUDINARY_CLOUD_NAME,
    api_key=Config.CLOUDINARY_API_KEY,
    api_secret=Config.CLOUDINARY_API_SECRET,
    secure=True
)


class CloudinaryService:

    @staticmethod
    def upload_pdf(file):

        result = cloudinary.uploader.upload(
            file,
            resource_type="raw",
            folder="rsai/resources"
        )

        return result["secure_url"]

    @staticmethod
    def upload_image(file):

        result = cloudinary.uploader.upload(
            file,
            folder="rsai/profile_images"
        )

        return result["secure_url"]