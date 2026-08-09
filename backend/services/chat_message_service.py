from database.db import db
from models.chat_message import ChatMessage
from models.chat_room import ChatRoom


class ChatMessageService:

    @staticmethod
    def get_messages(room_id, user_id):

        room = ChatRoom.query.get(room_id)

        if not room:
            return None

        if user_id not in [
            room.student_id,
            room.alumni_id
        ]:
            return None

        return ChatMessage.query.filter_by(
            room_id=room_id
        ).order_by(
            ChatMessage.created_at.asc()
        ).all()

    @staticmethod
    def send_message(room_id, user_id, content):

        room = ChatRoom.query.get(room_id)

        if not room:
            return None

        if user_id not in [
            room.student_id,
            room.alumni_id
        ]:
            return None

        message = ChatMessage(
            room_id=room_id,
            sender_id=user_id,
            content=content
        )

        db.session.add(message)
        db.session.commit()

        return message