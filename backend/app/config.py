import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'GhiredConclaveExileRhinoArmy2019'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://trading_cards_db_user:magic-pokemon-yu-gi-oh-3471@db:5432/trading_cards_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False