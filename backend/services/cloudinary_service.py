import os
import cloudinary.uploader


class CloudinaryService:

    @staticmethod
    def upload_pdf(file):

        filename = file.filename.replace("%20", " ")

        result = cloudinary.uploader.upload(
            file.stream,
            resource_type="raw",
            folder="rsai/resources",
            filename=filename,
            use_filename=True,
            unique_filename=False,
            overwrite=True,
        )

        print(result)

        return result["secure_url"]

    @staticmethod
    def upload_image(file):

        result = cloudinary.uploader.upload(
            file,
            folder="rsai/profile_images"
        )

        return result["secure_url"]