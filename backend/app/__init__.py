from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # Load configuration from config.py
    app.config.from_object('app.config.Config')

    # Initialize the database and bcrypt
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)

    # Import the routes
    from app.routes import auth_blueprint
    app.register_blueprint(auth_blueprint)
    
    @app.route('/')
    def default():
        return render_template('index.html')

    return app