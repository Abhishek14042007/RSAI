from database.db import db
from models.chat_request import ChatRequest
from models.chat_room import ChatRoom


class ChatRequestService:

    @staticmethod
    def send_request(sender_id, receiver_id):

        if sender_id == receiver_id:
            return "self"

        existing = ChatRequest.query.filter(
            (
                (ChatRequest.sender_id == sender_id) &
                (ChatRequest.receiver_id == receiver_id)
            ) |
            (
                (ChatRequest.sender_id == receiver_id) &
                (ChatRequest.receiver_id == sender_id)
            )
        ).order_by(
            ChatRequest.created_at.desc()
        ).first()

        if existing:

            if existing.status == "accepted":
                return "connected"

            if existing.status == "pending":
                return "exists"

            if existing.status == "rejected":
                existing.status = "pending"
                existing.sender_id = sender_id
                existing.receiver_id = receiver_id

                db.session.commit()

                return existing

        chat_request = ChatRequest(
            sender_id=sender_id,
            receiver_id=receiver_id,
            status="pending"
        )

        db.session.add(chat_request)
        db.session.commit()

        return chat_request

    @staticmethod
    def get_pending_requests(user_id):

        return ChatRequest.query.filter_by(
            receiver_id=user_id,
            status="pending"
        ).order_by(
            ChatRequest.created_at.desc()
        ).all()

    @staticmethod
    def respond_request(request_id, user_id, action):

        chat_request = ChatRequest.query.filter_by(
            id=request_id,
            receiver_id=user_id,
            status="pending"
        ).first()

        if not chat_request:
            return None

        if action == "reject":

            chat_request.status = "rejected"

            db.session.commit()

            return "rejected"

        if action == "accept":

            chat_request.status = "accepted"

            room = ChatRoom.query.filter_by(
                student_id=chat_request.sender_id,
                alumni_id=chat_request.receiver_id
            ).first()

            if not room:

                room = ChatRoom(
                    student_id=chat_request.sender_id,
                    alumni_id=chat_request.receiver_id
                )

                db.session.add(room)

            db.session.commit()

            return room

        return None

    @staticmethod
    def get_user_rooms(user_id):

        return ChatRoom.query.filter(
            (ChatRoom.student_id == user_id) |
            (ChatRoom.alumni_id == user_id)
        ).order_by(
            ChatRoom.created_at.desc()
        ).all()

    @staticmethod
    def get_room(room_id, user_id):

        return ChatRoom.query.filter(
            ChatRoom.id == room_id,
            (
                (ChatRoom.student_id == user_id) |
                (ChatRoom.alumni_id == user_id)
            )
        ).first()