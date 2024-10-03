import re
from flask import Blueprint, render_template, request, jsonify
from app import db
from app.models import User


auth_blueprint = Blueprint('auth', __name__)

def validate_password_minimum_requirements(password):
    if len(password) < 16:
        return False, "Password must be at least 16 characters long."
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number."
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter."
    return True, ""
    

@auth_blueprint.route('/register', methods=['POST'])
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
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'User already exists'}), 400

    # Create a new user
    new_user = User(email=email)
    new_user.set_password(password)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201