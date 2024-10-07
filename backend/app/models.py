import base64
import os
from app import db, bcrypt
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'Users'
    EMAIL_MAX_LENGTH = 254
    DISPLAY_NAME_MAX_LENGTH = 50

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(EMAIL_MAX_LENGTH), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    display_name = db.Column(db.String(DISPLAY_NAME_MAX_LENGTH), nullable=False)

    def set_password(self, password):
        # Bcrypt includes a salt when creating the hash
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        # Verify the password by comparing it with the stored hash.
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'password_hash': self.password_hash,
            'display_name': self.display_name
        }
    



class UserToken(db.Model):
    __tablename__ = 'UserTokens'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.__tablename__ + ".id"), nullable=False)
    refresh_token = db.Column(db.String(255), unique=True, nullable=False)
    access_token_expires = db.Column(db.DateTime(timezone=True), nullable=False)
    refresh_token_expires = db.Column(db.DateTime(timezone=True), nullable=False)

    user = db.relationship('User', backref='tokens', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'refresh_token': self.refresh_token,
            'access_token_expires': self.access_token_expires.timestamp(),
            'refresh_token_expires': self.refresh_token_expires.timestamp()
        }
    



class Card(db.Model):
    __tablename__ = 'Cards'
    IMAGE_FILENAME_MAX_LENGTH = 50
    IMAGE_FILEPATH_MAX_LENGTH = 120
    DESCRIPTION_MAX_LENGTH = 255

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.__tablename__ + ".id"), nullable=False)
    image_filename = db.Column(db.String(IMAGE_FILENAME_MAX_LENGTH), nullable=False)
    image_filepath = db.Column(db.String(IMAGE_FILEPATH_MAX_LENGTH), nullable=False)
    description = db.Column(db.String(DESCRIPTION_MAX_LENGTH), nullable=False)
    price = db.Column(db.Float, nullable=False)

    user = db.relationship('User', backref='cards', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'image_filename': self.image_filename,
            'image_filepath': self.image_filepath,
            'description': self.description,
            'price': self.price
        }

    def to_api_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'image_filename': self.image_filename,
            'description': self.description,
            'price': self.price,
            'base64_image': self.get_base64_image()
        }
    
    def get_base64_image(self):
        """
        Reads the image from the image_filepath and returns it as a base64 string.

        Returns:
            str: Base64-encoded string of the image file.
        """
        if os.path.exists(self.image_filepath):
            try:
                with open(self.image_filepath, 'rb') as image_file:
                    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                    return encoded_string
            except Exception as e:
                print(f"Error reading image file: {e}")
                return None
        else:
            return None  # File path does not exist
        


class CartItem(db.Model):
    __tablename__ = 'CartItems'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    card_id = db.Column(db.Integer, db.ForeignKey(Card.id), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    user = db.relationship('User', backref='cart_items', lazy=True)
    card = db.relationship('Card', backref='cart_items', lazy=True)