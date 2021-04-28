# Gevent needed for sockets
from gevent import monkey
monkey.patch_all()

import os
from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_cors import CORS, cross_origin
import requests
import math
import json
import pickle
from collections import defaultdict, Counter
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# from api import api as api

# Configure app
socketio = SocketIO()
app = Flask(__name__,
            static_url_path='',
            static_folder='client/build')
CORS(app)
app.config.from_object(os.environ["APP_SETTINGS"])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['CORS_HEADERS'] = 'Content-Type'

# DB
db = SQLAlchemy(app)

# Import + Register Blueprints
# app.register_blueprint(api)

# Initialize app w/SocketIO
socketio.init_app(app)

# HTTP error handling
# @app.errorhandler(404)
# def not_found(error):
#     return render_template("404.html"), 404


tfidf_vec_movies = pickle.load(open("api/bin_files/tfidf_vec_movies.bin", "rb"))
tfidf_mat_movies = pickle.load(open("api/bin_files/tfidf_mat_movies.bin", "rb"))
index_to_movieid = pickle.load(open("api/bin_files/index_to_movieid.bin", "rb"))
club_to_desc = pickle.load(open("api/bin_files/club_to_desc.bin", "rb"))

import resource
mac_memory_in_MB = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / (2**20)
print(mac_memory_in_MB)

@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.route('/milestone1', methods=['GET'])
def milestone1():
    return jsonify({"project_name": "ClubHub",
                    "net_id": "Cora Wu (cjw322), Jonathan Gao (jg992), Josiah Kek (jrk322), Rishabh Sarup (rs868), Samuel Lye (sl2982)"})



@app.route('/getShows', methods=['POST'])
@cross_origin()
def getShows():
    resp = request.json
    clubs, freeText, genre = resp['data'], resp['freeText'], resp['genre']
    query = ' '.join([club_to_desc[c['name']] for c in clubs]) 
    if freeText:
        query += ' ' + freeText
    
    mac_memory_in_MB = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / (2**20)
    print(mac_memory_in_MB)
    
    return json.dumps(gen_cosine_sim(query))


def gen_cosine_sim(query, tfidf_vectorizer=tfidf_vec_movies, tfidf_mat=tfidf_mat_movies):
    """
    query: query string
    tfidf_vectorizer: TfIdfVectorizer model
    tfidf_mat: tfidf vectors for all docs

    return: cosine similarity between query and all docs
    """
    query_tfidf = tfidf_vectorizer.transform([query])
    cosineSimilarities = cosine_similarity(query_tfidf, tfidf_mat).flatten()
    sortedShows = np.argsort(-1*cosineSimilarities)[:20]

    showRes = []
    for idx in sortedShows:
        showId = index_to_movieid[idx]
        queryUrl = 'https://api.themoviedb.org/3/movie/' + str(
            showId) + '?api_key=06f6526774c6bdba14bded4a2244fe36&language=en-US'
        resp = requests.get(queryUrl)
        res = resp.json()
        showItem = {}
        showItem['id'] = showId
        showItem['cosine_similarity'] = cosineSimilarities[idx]
        showItem['runtime'] = res['runtime']
        showItem['genres'] = res['genres']
        showItem['name'] = res['title']
        showItem['description'] = res['overview']
        showItem['img'] = res['poster_path']
        showItem['rating'] = res['vote_average']
        showRes.append(showItem)

    
    showRes = sorted(showRes, key = lambda x: (9*x['cosine_similarity']+ 0.1*x['rating']), reverse = True)
    
    return showRes



if __name__ == "__main__":
    print("Flask app running at http://0.0.0.0:5000")
    socketio.run(app, host="0.0.0.0", port=5000)
