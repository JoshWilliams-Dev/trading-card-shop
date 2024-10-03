from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)

    # Load configuration from config.py
    app.config.from_object('app.config.Config')

    # Initialize the database and bcrypt
    db.init_app(app)
    bcrypt.init_app(app)

    # Import the routes
    from app.routes import read_blueprint
    app.register_blueprint(read_blueprint)
    
    @app.route('/')
    def default():
        return render_template('index.html')

    return app