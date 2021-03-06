# Gevent needed for sockets
from gevent import monkey
monkey.patch_all()

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
from collections import defaultdict, Counter
import pickle
import json
import math
import requests
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, jsonify, request
import os


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

# import resource
# mac_memory_in_MB = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / (2**20)
# print(mac_memory_in_MB)

with open("./api/bin_files/knn_names.json") as f:
    knn_names = json.load(f)
vectorizer = pickle.load(open("api/bin_files/knn_vectorizer.pickle", "rb"))
knn = pickle.load(open("api/bin_files/knn_model.pkl", "rb"))

with open("./api/bin_files/club_to_neighbors.json") as f:
    club_to_neighbors = json.load(f)


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
    clubs, freeText, genres = resp['data'], resp['freeText'], resp['genre']
    
    genreSet = set([g['id'] for g in genres])
    gcd = int(np.gcd.reduce([int(c['weight']) for c in clubs]))
    query = ' '.join([club_to_desc[c['name']]*(int(c['weight'])//gcd) for c in clubs])
    if freeText:
        query += ' ' + freeText
    neighbors, neighbor_query = getNeighborQuery(clubs, query)

    # Run cosine similarity to get results and suggestions
    res, features= gen_cosine_sim(query, 10, genreSet)
    all_suggestions, _= gen_cosine_sim(neighbor_query, 15)
    
    resSet = set([r['id'] for r in res])
    cut_suggestions = []
    for s in all_suggestions:
        if s['id'] not in resSet:
            cut_suggestions.append(s)
        if len(cut_suggestions) == 5:
            break

    return json.dumps({
        "results": res, 
        "suggestions": cut_suggestions, 
        "key_features": features, 
        "neighbors": neighbors
        })


def gen_cosine_sim(query, max_count, genreSet=[], tfidf_vectorizer=tfidf_vec_movies, tfidf_mat=tfidf_mat_movies):
    """
    query: query string
    tfidf_vectorizer: TfIdfVectorizer model
    tfidf_mat: tfidf vectors for all docs

    return: cosine similarity between query and all docs
    """
    query_tfidf = tfidf_vectorizer.transform([query])
    features_set = set(tfidf_vectorizer.get_feature_names())
    features = list(features_set.intersection(set(query.split(' '))))[:10]
    cosineSimilarities = cosine_similarity(query_tfidf, tfidf_mat).flatten()
    sortedShows = np.argsort(-1*cosineSimilarities)

    count, showRes = 0, []
    for idx in sortedShows:
        if count < max_count:
            showId = index_to_movieid[idx]
            queryUrl = 'https://api.themoviedb.org/3/movie/' + str(
                showId) + '?api_key=06f6526774c6bdba14bded4a2244fe36&language=en-US'
            resp = requests.get(queryUrl)
            res = resp.json()
            showItem = {}
            genres = res['genres']
            if len(genreSet) == 0:
                showItem['genres'] = genres
                showItem['id'] = showId
                showItem['cosine_similarity'] = cosineSimilarities[idx]
                showItem['runtime'] = res['runtime']
                showItem['name'] = res['title']
                showItem['description'] = res['overview']
                showItem['img'] = res['poster_path']
                showItem['rating'] = res['vote_average']
                showRes.append(showItem)
                count += 1
            else:
                for g in genres:
                    if g['id'] in genreSet: # check if movie is in selected genre
                        showItem['genres'] = genres
                        showItem['id'] = showId
                        showItem['cosine_similarity'] = cosineSimilarities[idx]
                        showItem['runtime'] = res['runtime']
                        showItem['name'] = res['title']
                        showItem['description'] = res['overview']
                        showItem['img'] = res['poster_path']
                        showItem['rating'] = res['vote_average']
                        showRes.append(showItem)
                        count += 1
                        break
        else:
            break
                
    showRes = sorted(showRes, key=lambda x: (9*x['cosine_similarity'] + 0.1*x['rating']), reverse=True)
    return showRes, features


def getNeighborQuery(clubs, query):
    """
    Returns a list of names for <=5 potential neighboring clubs to the query
    """
    query_clubs = [club['name'] for club in clubs]
    query_vec = vectorizer.transform([query])
    club_neighbors = knn.kneighbors(query_vec.reshape(1, -1), n_neighbors = 10, return_distance=False)[0]

    neighbor_lst = []
    for neighbor_idx in club_neighbors:
        neighbor = knn_names[str(neighbor_idx)]
        if neighbor not in query_clubs:
            neighbor_lst += [neighbor]

    neighbor_lst = neighbor_lst[:5]
    neighbor_query = ' '.join([club_to_desc[n] for n in neighbor_lst])
    return neighbor_lst, neighbor_query


if __name__ == "__main__":
    print("Flask app running at http://0.0.0.0:5000")
    socketio.run(app, host="0.0.0.0", port=5000)
