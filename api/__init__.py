from flask import Blueprint

# Define a Blueprint for this module (api)
api = Blueprint('api', __name__, url_prefix='/api')
# Import + Register Blueprints

# from api.accounts import accounts as accounts
# from api.irsystem import irsystem as irsystem
