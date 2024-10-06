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
            'user': self.user,
            'refresh_token': self.refresh_token,
            'access_token_expires': self.access_token_expires.timestamp(),
            'refresh_token_expires': self.refresh_token_expires.timestamp()
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
            'user_id': self.user_id,
            'refresh_token': self.refresh_token,
            'access_token_expires': self.access_token_expires.timestamp(),
            'refresh_token_expires': self.refresh_token_expires.timestamp()
        }