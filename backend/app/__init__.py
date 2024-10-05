from flask import Flask, render_template
from flask_cors import CORS, cross_origin
from flask_login import LoginManager, login_required
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate

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

    from app.routes import auth_blueprint
    app.register_blueprint(auth_blueprint)

    CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "*", "expose_headers": "*"}})
    
    
    @app.route('/')
    def default():
        return render_template('index.html')
    
    @app.route('/secure')
    @login_required
    def test_auth():
        return render_template('test-auth.html')

    return app