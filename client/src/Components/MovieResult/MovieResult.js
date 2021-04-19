import React from 'react';
import './movieresult.css';

const MovieResult = (props) => {
  // we should also get a ranking to display and a similarity score if possible
  const { name, description, rating, cosine_similarity } = props.movie;

  return (
    <section className="movie-card">
      <img src="{img}" alt="{name}-img" className="movie-img" />
      <h3 className="movie-title">{name}</h3>
      <p className="movie-rating">TMDb Rating: {rating}</p>
      <p className="movie-rating">Cosine Similarity: {cosine_similarity}</p>
      <p className="movie-description">{description}</p>
    </section>
  );
};

export default MovieResult;
