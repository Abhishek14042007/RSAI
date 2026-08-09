from database.db import db
from models.chat_message import ChatMessage
from models.chat_room import ChatRoom


class ChatService:

    @staticmethod
    def get_room(room_id, user_id):

        return ChatRoom.query.filter(
            ChatRoom.id == room_id,
            (
                (ChatRoom.student_id == user_id) |
                (ChatRoom.alumni_id == user_id)
            )
        ).first()

    @staticmethod
    def send_message(room_id, sender_id, message):

        room = ChatService.get_room(
            room_id,
            sender_id
        )

        if not room:
            return None

        message = message.strip()

        if not message:
            return "empty"

        chat_message = ChatMessage(
            room_id=room_id,
            sender_id=sender_id,
            message=message
        )

        db.session.add(chat_message)
        db.session.commit()

        return chat_message

    @staticmethod
    def get_messages(room_id, user_id):

        room = ChatService.get_room(
            room_id,
            user_id
        )

        if not room:
            return None

        return ChatMessage.query.filter_by(
            room_id=room_id
        ).order_by(
            ChatMessage.created_at.asc()
        ).all()