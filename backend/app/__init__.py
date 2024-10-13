from flask import Flask, jsonify, render_template
from flask_cors import CORS, cross_origin
from flask_login import LoginManager, login_required
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate

from app.errors import InternalServerError

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()
migrate = Migrate()
login_manager = LoginManager()


def create_app():
    app = Flask(__name__)

    # Load configuration from config.py
    app.config.from_object('app.config.Config')

    # Initialize the database and bcrypt
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)

    login_manager.init_app(app)
    login_manager.login_view = "auth.login"
    login_manager.login_message = "Please log in to access this page."
    login_manager.refresh_view = "reauth"

    # Import the routes
    from .authentication import authentication_blueprint as authentication_bp
    app.register_blueprint(authentication_bp)

    from .main import main_blueprint as main_bp
    app.register_blueprint(main_bp)

    # CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "*", "expose_headers": "*"}})
    # Enable CORS with specific settings using the environment variable for origins
    CORS(app, supports_credentials=True, resources={r"/*": {
        "origins": app.config['CORS_ORIGINS'],
        "allow_headers": ["Content-Type", "Authorization"],
        "methods": ["GET", "POST", "OPTIONS", "DELETE"],
        "expose_headers": ["Authorization"]
    }})

    @app.errorhandler(500)
    def internal_error(error):
        error_message = str(error)
        response = InternalServerError(error_message).to_dict()
        return jsonify(response), 500

    return app