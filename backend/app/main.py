from datetime import datetime, timezone
import hashlib
from math import ceil
from flask import Blueprint, jsonify, render_template, request, send_from_directory, current_app as app
from flask_login import login_required

from app.authentication import token_required
from app.models import Card
from app.validation import ApiRequestValidator
from . import db

from werkzeug.utils import secure_filename
import os
import logging

logging.basicConfig(level=logging.DEBUG)


ALLOWED_UPLOAD_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_UPLOAD_EXTENSIONS



main_blueprint = Blueprint('main', __name__)



@main_blueprint.route('/')
def default():
    return render_template('index.html')



@main_blueprint.route('/secure')
@login_required
def test_auth():
    return render_template('test-auth.html')



def get_unique_filename(filename):
    # Get the current time with millisecond precision
    current_time = datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S_%f')
    
    # Secure the original filename to avoid any unwanted characters
    secure_name = secure_filename(filename)
    
    # Concatenate timestamp and original filename
    timestamped_filename = f"{current_time}_{secure_name}"
    
    # Hash the concatenated string
    hashed_filename = hashlib.sha256(timestamped_filename.encode()).hexdigest()
    
    # Return the final hashed filename and timestamped filename for directory structure
    return hashed_filename, timestamped_filename



def save_file(file):
    # Get the original filename
    original_filename = file.filename
    
    # Generate the hashed filename and the directory-safe timestamped filename
    hashed_filename, timestamped_filename = get_unique_filename(original_filename)
    
    # Create a 3-depth directory structure based on hash
    subfolder_1 = hashed_filename[0:2]
    subfolder_2 = hashed_filename[2:4]
    subfolder_3 = hashed_filename[4:6]
    
    upload_directory = app.config['UPLOAD_FOLDER']
    save_directory = os.path.join(upload_directory, subfolder_1, subfolder_2, subfolder_3)
    os.makedirs(save_directory, exist_ok=True)
    
    # Save the file in the created directory
    file_path = os.path.join(save_directory, timestamped_filename)
    file.save(file_path)
    
    return file_path, original_filename



@main_blueprint.route('/uploads/<path:filepath>')
def uploaded_file(filepath):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filepath)



@main_blueprint.route('/cards', methods=['POST'])
@token_required
def create_card(user):

    # Validate parameters
    errors = []
    validator = ApiRequestValidator()
    file = None
    
    if 'file' in request.files:
        file = request.files['file']
        if file.filename == '':
            validator.add_parameter_error("No filename has been provided.", "file")
        validator.ensure_string_max_length("file", file.filename, Card.IMAGE_FILENAME_MAX_LENGTH)
    else:
        validator.add_parameter_error("No file has been provided.", "file")


    description = request.form['description']
    if validator.ensure_value_provided ('description', description) and validator.ensure_is_string('description', description):
        validator.ensure_string_max_length('description', description, Card.DESCRIPTION_MAX_LENGTH)


    price = request.form['price']
    if validator.ensure_value_provided ('price', price) and validator.ensure_is_float('price', price):
        price = float(price)
        validator.ensure_positive_value('price', price)


    if not file or not allowed_file(file.filename):
        validator.add_invalid_file_format_error('file', ALLOWED_UPLOAD_EXTENSIONS)
    

    if validator.get_error_count() > 0:
        return jsonify(validator.get_error_object()), 400
    
    
    file_path, original_filename = save_file(file)
    
    new_card = Card(user_id=user.id, image_filename=original_filename, image_filepath=file_path, description=description, price=price)
    db.session.add(new_card)
    db.session.commit()

    return jsonify(validator.get_error_object()), 201







@main_blueprint.route('/cards/list/mine', methods=['GET'])
@token_required
def get_paginated_cards_created_by_user(user):
    args = request.args

    # Validate parameters
    validator, page_index, page_size = prepare_paginated_cards()

    if validator.get_error_count() > 0:
        return jsonify(validator.get_error_object()), 400

    return get_paginated_cards(page_index=page_index, page_size=page_size, user_id=user.id)


@main_blueprint.route('/cards/list', methods=['GET'])
def get_paginated_cards_indiscriminately():
    args = request.args

    # Validate parameters
    validator, page_index, page_size = prepare_paginated_cards()

    if validator.get_error_count() > 0:
        return jsonify(validator.get_error_object()), 400

    return get_paginated_cards(page_index=page_index, page_size=page_size, user_id=None)



def prepare_paginated_cards():
    args = request.args

    validator = ApiRequestValidator()

    page_index = args.get('page_index')
    if validator.ensure_value_provided ('page_index', page_index) and validator.ensure_is_int('page_index', page_index):
        validator.ensure_positive_value('page_index', page_index)

    page_size = args.get('page_size')
    if validator.ensure_value_provided ('page_size', page_size) and validator.ensure_is_int('page_size', page_size):
        validator.ensure_positive_value('page_size', page_size)

    return validator, int(page_index), int(page_size)
    


def get_paginated_cards(page_index, page_size, user_id=None):
    
    query = Card.query

    if user_id:
        query = query.filter(Card.user_id == user_id)
        print(str(query))
    
    
    # Get the details from the database
    total_cards = query.count()
    total_pages = ceil(total_cards / page_size)

    if page_index < 1 or page_index > total_pages:
        return jsonify({
            'cards': {},
            'current_page': page_index,
            'total_pages': total_pages,
            'total_cards': total_cards
        }), 204

    cards = query.order_by(Card.id.desc())\
        .offset((page_index - 1) * page_size)\
        .limit(page_size)\
        .all()

    # Convert card objects to dictionaries
    card_list = [card.to_api_dict() for card in cards]

    # Return paginated data as JSON response
    return jsonify({
        'cards': card_list,
        'total_pages': total_pages,
        'total_cards': total_cards
    }), 200

