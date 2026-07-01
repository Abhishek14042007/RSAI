import bcrypt
from flask_jwt_extended import create_access_token

from database.db import db
from models.user import User


class AuthService:

    @staticmethod
    def hash_password(password):
        hashed = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        )
        return hashed.decode("utf-8")


    @staticmethod
    def verify_password(password, hashed_password):
        return bcrypt.checkpw(
            password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )


    @staticmethod
    def create_token(user):
        return create_access_token(
            identity=str(user.id),
            additional_claims={
                "role": user.role,
                "email": user.email
            }
        )


    @staticmethod
    def get_user_by_email(email):
        return User.query.filter_by(email=email).first()


    @staticmethod
    def create_user(
        full_name,
        email,
        password,
        role,
        department,
        semester
    ):

        hashed_password = AuthService.hash_password(password)

        user = User(
            full_name=full_name,
            email=email,
            password=hashed_password,
            role=role,
            department=department,
            semester=semester
        )

        db.session.add(user)
        db.session.commit()

        return user