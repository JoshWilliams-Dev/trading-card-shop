from flask import Blueprint, render_template
from flask_login import login_required
from . import db

main_blueprint = Blueprint('main', __name__)



@main_blueprint.route('/')
def default():
    return render_template('index.html')



@main_blueprint.route('/secure')
@login_required
def test_auth():
    return render_template('test-auth.html')