# Gevent needed for sockets
from gevent import monkey
monkey.patch_all()

# from api import api as api
from nltk.tokenize import TreebankWordTokenizer
from collections import defaultdict
import pickle
import json
import math
import requests
# from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, jsonify, request, g
import os


# Imports

# Configure app
socketio = SocketIO()
app = Flask(__name__,
            static_url_path='',
            static_folder='client/build')
# CORS(app)
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


doc_norms = pickle.load(open("api/bin_files/doc_norms.bin", "rb"))
idf = pickle.load(open("api/bin_files/idf.bin", "rb"))
index_to_movieid = pickle.load(open("api/bin_files/index_to_movieid.bin", "rb"))
inv_idx = pickle.load(open("api/bin_files/inv_idx.bin", "rb"))
club_to_desc = pickle.load(open("api/bin_files/club_to_desc.bin", "rb"))


@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.route('/milestone1', methods=['GET'])
def milestone1():
    return jsonify({"project_name": "ClubHub",
                    "net_id": "Cora Wu (cjw322), Jonathan Gao (jg992), Josiah Kek (jrk322), Rishabh Sarup (rs868), Samuel Lye (sl2982)"})


@app.route('/getMovies', methods=['POST'])
# @cross_origin()
def getMovies():
    clubs = request.json['data']
    query = ' '.join([club_to_desc[c['name']] for c in clubs])
    return json.dumps(index_search(query))


def index_search(query, index=inv_idx, idf=idf, doc_norms=doc_norms, tokenizer=TreebankWordTokenizer()):
    ret = []

    # tokenize
    query = query.lower()
    query = tokenizer.tokenize(query)

    # get frequencies
    freq = {}
    for token in query:
        if token in idf:
            if not token in freq:
                freq[token] = 1
            else:
                freq[token] += 1

    # get tfidf
    query_tfidf = defaultdict(float)
    for term in freq:
        if term in idf:
            query_tfidf[term] = freq[term] * idf[term]

    # normalize
    norm = math.sqrt(sum([query_tfidf[term] ** 2 for term in query_tfidf]))

    document_scores = defaultdict(int)
    for term in query_tfidf:
        for doc, freq in index[term]:
            document_scores[doc] += query_tfidf[term] * freq * idf[term]

    for doc_idx in document_scores:
        document_scores[doc_idx] /= (doc_norms[doc_idx] * norm)

    for doc, score in document_scores.items():
        ret.append((score, doc))

    sortedMovies = sorted(ret, key=lambda x: (-x[0], x[1]))[:10]

    movieRes = []
    for score, idx in sortedMovies:
        showId = index_to_movieid[idx]
        queryUrl = 'https://api.themoviedb.org/3/tv/' + str(
            showId) + '?api_key=06f6526774c6bdba14bded4a2244fe36&language=en-US'
        resp = requests.get(queryUrl)
        print('abc', resp)
        res = resp.json()
        showItem = {}
        showItem['id'] = showId
        showItem['cosine_similarity'] = score
        showItem['episode_run_time'] = res['episode_run_time']
        showItem['genres'] = res['genres']
        showItem['name'] = res['name']
        showItem['number_of_episodes'] = res['number_of_episodes']
        showItem['number_of_seasons'] = res['number_of_seasons']
        showItem['description'] = res['overview']
        showItem['img'] = res['poster_path']
        showItem['rating'] = res['vote_average']
        movieRes.append(showItem)
    return movieRes


if __name__ == "__main__":
    print("Flask app running at http://0.0.0.0:5000")
    socketio.run(app, host="0.0.0.0", port=5000)
