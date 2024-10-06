from datetime import datetime, timedelta, timezone
import re
from flask import Blueprint, jsonify, request, make_response
from flask_login import login_user, current_user
import jwt

from app.models import User, UserToken
from app.validation import ApiRequestValidator
from . import db, login_manager

authentication_blueprint = Blueprint('authentication', __name__)

JWT_SECRET = 'In Magic: The Gathering, planeswalkers are powerful mages who can travel between different planes of existence. The Multiverse is home to countless worlds, from Dominaria, a land rich in history, to Ravnica, a city-wide plane ruled by ten powerful guilds.'
JWT_ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRATION_DELTA = timedelta(minutes=15)
REFRESH_TOKEN_EXPIRATION_DELTA = timedelta(days=1)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))  # Get the user by their ID from the database


def create_access_token(user_id):
    expiration = datetime.now(timezone.utc) + ACCESS_TOKEN_EXPIRATION_DELTA
    return jwt.encode({'user_id': user_id, 'exp': expiration}, JWT_SECRET, algorithm=JWT_ALGORITHM), expiration


def create_refresh_token(user_id):
    expiration = datetime.now(timezone.utc) + REFRESH_TOKEN_EXPIRATION_DELTA
    return jwt.encode({'user_id': user_id, 'exp': expiration}, JWT_SECRET, algorithm=JWT_ALGORITHM), expiration



def create_logged_in_user_response(user):
    login_user(user)

    # Issue both access and refresh tokens
    access_token, access_token_expires = create_access_token(user.id)
    refresh_token, refresh_token_expires = create_refresh_token(user.id)

    new_user_token = UserToken(
        user_id=user.id,
        refresh_token=refresh_token,
        access_token_expires=access_token_expires,
        refresh_token_expires=refresh_token_expires
    )
    db.session.add(new_user_token)
    db.session.commit()

    return jsonify({
        'access_token': access_token,
        'access_token_expires': access_token_expires.timestamp(),
        'refresh_token': refresh_token,
        'refresh_token_expires': refresh_token_expires.timestamp(),
    })

    


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


@authentication_blueprint.route('/protected', methods=['GET'])
@token_required
def protected_route():
    return jsonify({'message': f'Welcome, {current_user.display_name}!'})



@authentication_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Validate parameters
    errors = []
    validator = ApiRequestValidator()


    email = data.get('email')
    if validator.ensure_value_provided ('email', email) and validator.ensure_is_string('email', email):
        validator.ensure_email_format('email', email)
        validator.ensure_string_max_length('email', email, User.EMAIL_MAX_LENGTH)

        if validator.get_error_count() < 1:
            user = User.query.filter_by(email=email).first()
            if user:
                validator.add_parameter_error('The email is already in use.', 'email')


    password = data.get('password')
    if validator.ensure_value_provided ('password', password) and validator.ensure_is_string('password', password):
        password_meets_minimum_requirements, validate_password_minimum_requirements_message = validate_password_minimum_requirements(password)
        if not password_meets_minimum_requirements:
            validator.add_parameter_error(validate_password_minimum_requirements_message, 'password')


    display_name = data.get('display_name')
    if validator.ensure_value_provided ('display_name', display_name) and validator.ensure_is_string('display_name', display_name):
        validator.ensure_string_max_length('display_name', display_name, User.DISPLAY_NAME_MAX_LENGTH)
    
    
    if validator.get_error_count() > 0:
        return jsonify(validator.get_error_object()), 400
    

    # Create a new user
    new_user = User(email=email,display_name=display_name)
    new_user.set_password(password)
    
    db.session.add(new_user)
    db.session.commit()

    saved_user = User.query.filter_by(email=email).first()

    response = create_logged_in_user_response(saved_user)
    return response, 201



@authentication_blueprint.route('/authenticate', methods=['POST'])
def authenticate():
    data = request.get_json()

    # Validate parameters
    errors = []
    validator = ApiRequestValidator()

    areCredentialsInvalid = False
    httpStatus = 400
    user = None

    email = data.get('email')
    if validator.ensure_value_provided ('email', email) and validator.ensure_is_string('email', email):
        user = User.query.filter_by(email=email).first()
        if not user:
            areCredentialsInvalid = True

    password = data.get('password')
    if validator.ensure_value_provided ('password', password) and validator.ensure_is_string('password', password):
        if not user or areCredentialsInvalid == False and not user.check_password(password):
            areCredentialsInvalid = True

    if areCredentialsInvalid == True:
        validator.add_invalid_credentials_error("Login failed due to invalid credentials.")
        httpStatus = 401
    
    if validator.get_error_count() > 0:
        return jsonify(validator.get_error_object()), httpStatus
    
    # The credentials are valid, log the user in
    response = create_logged_in_user_response(user)
    return response, 200



@authentication_blueprint.route('/refresh_token', methods=['POST'])
def refresh_token():
    data = request.get_json()

    # Validate parameters
    errors = []
    validator = ApiRequestValidator()

    refresh_token = data.get('refresh_token')
    validator.ensure_value_provided ('refresh_token', refresh_token)
    validator.ensure_is_string('refresh_token', refresh_token)
        
    if validator.get_error_count() > 0:
        return jsonify(validator.get_error_object()), 400

    # Has the token expired?
    user_token = UserToken.query.filter_by(refresh_token=refresh_token).first()
    if not user_token or datetime.now(timezone.utc) >= user_token.refresh_token_expires:
        validator.add_expired_refresh_token_error()
        return jsonify(validator.get_error_object()), 401

    # Generate new tokens
    user_id = user_token.user_id

    new_access_token, access_token_expires = create_access_token(user_id)
    new_refresh_token, refresh_token_expires = create_refresh_token(user_id)

    # Update the existing token record
    user_token.refresh_token = new_refresh_token
    user_token.access_token_expires = access_token_expires
    user_token.refresh_token_expires = refresh_token_expires

    db.session.commit()

    return jsonify({
        'access_token': new_access_token,
        'access_token_expires': access_token_expires.timestamp(),
        'refresh_token': new_refresh_token,
        'refresh_token_expires': refresh_token_expires.timestamp(),
    }), 200