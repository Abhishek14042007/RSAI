from routes import auth_bp, resources_bp
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

from config import Config
from database.db import db

# Import models
from models.user import User
from models.resource import Resource
from models.comment import Comment
from models.chat_request import ChatRequest
from models.chat_room import ChatRoom
from models.chat_message import ChatMessage

# Import routes
from routes.auth import auth_bp
from routes.comments import comments_bp
from routes.community import community_bp
from routes.chat_request import chat_request_bp
from routes.chat_messages import chat_messages_bp
from routes.chat import chat_bp
from routes.admin import admin_bp

app = Flask(__name__)

app.config.from_object(Config)

CORS(app)

db.init_app(app)

migrate = Migrate(app, db)

jwt = JWTManager(app)

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(resources_bp, url_prefix="/api/resources")
app.register_blueprint(
    comments_bp,
    url_prefix="/api/comments"
)
app.register_blueprint(
    community_bp,
    url_prefix="/api/community"
)
app.register_blueprint(
    chat_request_bp,
    url_prefix="/api/chat"
)
app.register_blueprint(chat_bp, url_prefix="/api/chat")
app.register_blueprint(
    chat_messages_bp,
    url_prefix="/api/chat"
)
app.register_blueprint(
    admin_bp,
    url_prefix="/api/admin"
)

@app.route("/")
def home():
    return {
        "status": "success",
        "message": "RSAI Backend Running"
    }


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)