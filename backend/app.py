from routes import auth_bp
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

from config import Config
from database.db import db

# Import models
from models import User

# Import routes
from routes.auth import auth_bp

app = Flask(__name__)

app.config.from_object(Config)

CORS(app)

db.init_app(app)

migrate = Migrate(app, db)

jwt = JWTManager(app)

app.register_blueprint(auth_bp, url_prefix="/api/auth")


@app.route("/")
def home():
    return {
        "status": "success",
        "message": "RSAI Backend Running"
    }


if __name__ == "__main__":
    app.run(debug=True)