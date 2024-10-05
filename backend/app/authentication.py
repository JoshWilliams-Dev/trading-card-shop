from datetime import datetime, timedelta, timezone
import re
from flask import Blueprint, jsonify, request
from flask_login import login_user, current_user
import jwt

from app.models import User
from . import db, login_manager

authentication_blueprint = Blueprint('authentication', __name__)

JWT_SECRET = 'In Magic: The Gathering, planeswalkers are powerful mages who can travel between different planes of existence. The Multiverse is home to countless worlds, from Dominaria, a land rich in history, to Ravnica, a city-wide plane ruled by ten powerful guilds.'
JWT_EXPIRATION_DELTA = timedelta(minutes=5)  # Token expires in 1 hour


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))  # Get the user by their ID from the database


def token_required(f):
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization')
        if token:
            try:
                # Decode the token
                data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
                user_id = data['user_id']
                user = load_user(user_id=user_id)
                if user:
                    login_user(user)  # Log in user based on token
                    return f(*args, **kwargs)
            except jwt.ExpiredSignatureError:
                return jsonify({'message': 'Token expired'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'message': 'Invalid token'}), 401
        return jsonify({'message': 'Token required'}), 403
    return wrapper


def validate_password_minimum_requirements(password):
    if len(password) < 16:
        return False, "Password must be at least 16 characters long."
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number."
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter."
    return True, ""



@authentication_blueprint.route('/login')
def login():
    return 'Login'

@authentication_blueprint.route('/signup')
def signup():
    return 'Signup'

@authentication_blueprint.route('/logout')
def logout():
    return 'Logout'


@authentication_blueprint.route('/protected', methods=['GET'])
@token_required
def protected_route():
    return jsonify({'message': f'Welcome, {current_user.display_name}!'})



@authentication_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Validate input
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
        
    password_meets_minimum_requirements, validate_password_minimum_requirements_message = validate_password_minimum_requirements(password)
    if not password_meets_minimum_requirements:
        return jsonify({'error': validate_password_minimum_requirements_message}), 400

    # Check if user already exists
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'error': 'User already exists'}), 400

    # Create a new user
    new_user = User(email=email)
    new_user.set_password(password)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201



@authentication_blueprint.route('/authenticate', methods=['POST'])
def authenticate():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        login_user(user)

        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.now(timezone.utc) + JWT_EXPIRATION_DELTA
        }, JWT_SECRET, algorithm='HS256')

        return jsonify({
            "token": token
        }), 200
    else:
        return jsonify({"message": "Invalid email or password."}), 401