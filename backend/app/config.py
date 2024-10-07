import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'GhiredConclaveExileRhinoArmy2019')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://trading_cards_db_user:magic-pokemon-yu-gi-oh-3471@postgres-db:5432/trading_cards_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = os.environ.get('SQLALCHEMY_TRACK_MODIFICATIONS', False)
    SQLALCHEMY_ECHO = os.environ.get('SQLALCHEMY_ECHO', False)
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000')
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', '/app/static/uploads')