from database.db import db

from models.user import User
from models.chat_message import ChatMessage
from models.chat_request import ChatRequest
from models.chat_room import ChatRoom

from models.resource import Resource
from models.comment import Comment
from models.resource_like import ResourceLike

from models.community_post import CommunityPost
from models.post_like import PostLike
from models.post_comment import PostComment


class AdminService:

    @staticmethod
    def get_all_users():

        return User.query.order_by(
            User.id.asc()
        ).all()


    @staticmethod
    def delete_user(user_id):

        user = User.query.get(user_id)

        if not user:
            return None

        # Never allow deletion of an admin account
        if user.role == "admin":
            return "admin"

        try:

            # =====================================================
            # 1. FIND RESOURCES UPLOADED BY THIS USER
            # =====================================================

            resources = Resource.query.filter_by(
                uploaded_by=user_id
            ).all()

            resource_ids = [
                resource.id
                for resource in resources
            ]


            # =====================================================
            # 2. DELETE COMMENTS ON USER'S RESOURCES
            # =====================================================

            if resource_ids:

                Comment.query.filter(
                    Comment.resource_id.in_(resource_ids)
                ).delete(
                    synchronize_session=False
                )


            # =====================================================
            # 3. DELETE ALL COMMENTS WRITTEN BY USER
            #    (including comments on other users' resources)
            # =====================================================

            Comment.query.filter_by(
                user_id=user_id
            ).delete(
                synchronize_session=False
            )


            # =====================================================
            # 4. DELETE LIKES ON USER'S RESOURCES
            # =====================================================

            if resource_ids:

                ResourceLike.query.filter(
                    ResourceLike.resource_id.in_(resource_ids)
                ).delete(
                    synchronize_session=False
                )


            # =====================================================
            # 5. DELETE ALL RESOURCE LIKES MADE BY USER
            #    (including likes on other users' resources)
            # =====================================================

            ResourceLike.query.filter_by(
                user_id=user_id
            ).delete(
                synchronize_session=False
            )


            # =====================================================
            # 6. DELETE USER'S RESOURCES
            # =====================================================

            if resource_ids:

                Resource.query.filter(
                    Resource.id.in_(resource_ids)
                ).delete(
                    synchronize_session=False
                )


            # =====================================================
            # 7. FIND COMMUNITY POSTS CREATED BY USER
            # =====================================================

            community_posts = CommunityPost.query.filter_by(
                user_id=user_id
            ).all()

            community_post_ids = [
                post.id
                for post in community_posts
            ]


            # =====================================================
            # 8. DELETE COMMENTS ON USER'S COMMUNITY POSTS
            # =====================================================

            if community_post_ids:

                PostComment.query.filter(
                    PostComment.post_id.in_(community_post_ids)
                ).delete(
                    synchronize_session=False
                )


            # =====================================================
            # 9. DELETE LIKES ON USER'S COMMUNITY POSTS
            # =====================================================

            if community_post_ids:

                PostLike.query.filter(
                    PostLike.post_id.in_(community_post_ids)
                ).delete(
                    synchronize_session=False
                )


            # =====================================================
            # 10. DELETE ALL POST COMMENTS WRITTEN BY USER
            #     (including comments on other users' posts)
            # =====================================================

            PostComment.query.filter_by(
                user_id=user_id
            ).delete(
                synchronize_session=False
            )


            # =====================================================
            # 11. DELETE ALL POST LIKES MADE BY USER
            #     (including likes on other users' posts)
            # =====================================================

            PostLike.query.filter_by(
                user_id=user_id
            ).delete(
                synchronize_session=False
            )


            # =====================================================
            # 12. DELETE USER'S COMMUNITY POSTS
            # =====================================================

            if community_post_ids:

                CommunityPost.query.filter(
                    CommunityPost.id.in_(community_post_ids)
                ).delete(
                    synchronize_session=False
                )


            # =====================================================
            # 13. FIND CHAT ROOMS INVOLVING USER
            # =====================================================

            chat_rooms = ChatRoom.query.filter(
                (ChatRoom.student_id == user_id) |
                (ChatRoom.alumni_id == user_id)
            ).all()

            chat_room_ids = [
                room.id
                for room in chat_rooms
            ]


            # =====================================================
            # 14. DELETE ALL MESSAGES IN THOSE CHAT ROOMS
            # =====================================================

            if chat_room_ids:

                ChatMessage.query.filter(
                    ChatMessage.room_id.in_(chat_room_ids)
                ).delete(
                    synchronize_session=False
                )


            # =====================================================
            # 15. DELETE ALL MESSAGES SENT BY USER
            #     IN OTHER ROOMS
            # =====================================================

            ChatMessage.query.filter_by(
                sender_id=user_id
            ).delete(
                synchronize_session=False
            )


            # =====================================================
            # 16. DELETE CHAT REQUESTS
            # =====================================================

            ChatRequest.query.filter(
                (ChatRequest.sender_id == user_id) |
                (ChatRequest.receiver_id == user_id)
            ).delete(
                synchronize_session=False
            )


            # =====================================================
            # 17. DELETE CHAT ROOMS
            # =====================================================

            if chat_room_ids:

                ChatRoom.query.filter(
                    ChatRoom.id.in_(chat_room_ids)
                ).delete(
                    synchronize_session=False
                )


            # =====================================================
            # 18. DELETE USER
            # =====================================================

            db.session.delete(user)

            db.session.commit()

            return user


        except Exception as error:

            db.session.rollback()

            print("========== ADMIN DELETE ERROR ==========")
            print(error)
            print("========================================")

            raise error