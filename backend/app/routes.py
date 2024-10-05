from flask import Blueprint, request, jsonify, render_template
from app import db
from app.models import User

from flask_login import LoginManager, UserMixin, login_user, confirm_login, login_required, logout_user, current_user
from werkzeug.security import check_password_hash




auth_blueprint = Blueprint('auth', __name__)


    




@auth_blueprint.route('/login',methods = ['POST', 'GET'])
def login():
    return render_template('login.html')



@auth_blueprint.route("/reauth", methods=["GET", "POST"])
@login_required
def reauth():
    if request.method == "POST":
        confirm_login()
        pass
    return render_template("reauth.html")
