from flask import Blueprint, render_template, request, jsonify
from app import db

read_blueprint = Blueprint('read', __name__)

@read_blueprint.route('/read')
def default():
    return render_template('index.html')