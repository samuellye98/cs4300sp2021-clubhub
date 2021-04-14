# Gevent needed for sockets
# from app.irsystem import irsystem as irsystem
# from app.accounts import accounts as accounts
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, jsonify
import os
from gevent import monkey
monkey.patch_all()

# Imports

# Configure app
socketio = SocketIO()
app = Flask(__name__,
            static_url_path='',
            static_folder='../client/build')
app.config.from_object(os.environ["APP_SETTINGS"])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

# DB
db = SQLAlchemy(app)

# Import + Register Blueprints
# app.register_blueprint(accounts)
# app.register_blueprint(irsystem)

# Initialize app w/SocketIO
socketio.init_app(app)

# # HTTP error handling
# @app.errorhandler(404)
# def not_found(error):
#   return render_template("404.html"), 404


@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.route('/milestone1', methods=['GET'])
def milestone1():
    return jsonify({"project_name": "ClubHub",
                    "net_id": "Cora Wu (cjw322), Jonathan Gao (jg992), Josiah Kek (jrk322), Rishabh Sarup (rs868), Samuel Lye (sl2982)"})
