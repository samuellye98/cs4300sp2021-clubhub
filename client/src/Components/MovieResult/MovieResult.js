import React from 'react';
import './movieresult.css';

const MovieResult = (props) => {
  // we should also get a ranking to display and a similarity score if possible
  const { id, name, description, rating, cosine_similarity, img } = props.movie;
  const cut_desc = description.split(' ').slice(0, 50).join(' ');
  const rounded_sim = cosine_similarity.toFixed(3);

  return (
    <a href={"https://www.themoviedb.org/tv/" + id} target="_blank" rel="noreferrer noopener">
      <section className="movie-card">
        <h4 className="movie-title">{name}</h4>
        <div className="movie-content">
          <div className="movie-txt">
            <p className="movie-rating">Similarity: {rounded_sim}</p>
            <p className="movie-rating">TMDb Rating: {rating}</p>
            <p className="movie-description">
              {cut_desc}... <a href={"https://www.themoviedb.org/tv/" + id} target="_blank" rel="noreferrer noopener">read more</a>
            </p>
          </div>
          <img
            src={`https://image.tmdb.org/t/p/original/${img}`}
            alt={`${name}-img`}
            className="movie-img"
          />
        </div>
      </section >
    </a>
  );
};

export default MovieResult;
