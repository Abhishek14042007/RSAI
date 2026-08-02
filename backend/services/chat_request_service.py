from database.db import db
from models.chat_request import ChatRequest
from models.chat_room import ChatRoom

class ChatRequestService:

    @staticmethod
    def send_request(sender_id, receiver_id):

        if sender_id == receiver_id:
            return "self"

        existing = ChatRequest.query.filter_by(
            sender_id=sender_id,
            receiver_id=receiver_id
        ).first()

        if existing:
            return "exists"

        request = ChatRequest(
            sender_id=sender_id,
            receiver_id=receiver_id
        )

        db.session.add(request)
        db.session.commit()

        return request
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
    
        request = ChatRequest.query.filter_by(
            id=request_id,
            receiver_id=user_id
        ).first()
    
        if not request:
            return None
    
        if action == "accept":
        
            request.status = "accepted"
    
            room = ChatRoom.query.filter_by(
                student_id=request.sender_id,
                alumni_id=request.receiver_id
            ).first()
    
            if not room:
            
                room = ChatRoom(
                    student_id=request.sender_id,
                    alumni_id=request.receiver_id
                )
    
                db.session.add(room)
    
            db.session.commit()
    
            return room
    
        elif action == "reject":
        
            request.status = "rejected"
    
            db.session.commit()
    
            return "rejected"
    
        return None