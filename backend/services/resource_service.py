from database.db import db
from models.resource import Resource


class ResourceService:

    @staticmethod
    def create_resource(
        title,
        description,
        subject,
        semester,
        department,
        tags,
        pdf_url,
        thumbnail_url,
        uploaded_by
    ):

        resource = Resource(
            title=title,
            description=description,
            subject=subject,
            semester=semester,
            department=department,
            tags=tags,
            pdf_url=pdf_url,
            thumbnail_url=thumbnail_url,
            uploaded_by=uploaded_by
        )

        db.session.add(resource)
        db.session.commit()

        return resource

    @staticmethod
    def get_all_resources():
        return Resource.query.order_by(
            Resource.created_at.desc()
        ).all()

    @staticmethod
    def get_resource(resource_id):
        return Resource.query.get(resource_id)
    
    @staticmethod
    def search_resources(search):
    
        if not search:
            return Resource.query.order_by(
                Resource.created_at.desc()
            ).all()
    
        return Resource.query.filter(
            Resource.title.ilike(f"%{search}%")
        ).order_by(
            Resource.created_at.desc()
        ).all()