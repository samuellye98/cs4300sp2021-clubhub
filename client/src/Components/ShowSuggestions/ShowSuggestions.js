import React from 'react';
import StarRatings from 'react-star-ratings';
import './showsuggestions.css';

const ShowSuggestions = (props) => {
  const { id, name, description, rating, cosine_similarity, img } = props.movie;
  const cut_desc = description.split(' ').slice(0, 30).join(' ');

  return (
    <section className="suggestion-card">
      <div className="suggestion-content">
        <h4 className="suggestion-title">{name}</h4>

        <div className="suggestion-txt">
          <div className="suggestion-rating">
            <span>Rating: </span>
            <StarRatings
              rating={rating / 2}
              starRatedColor="#FFD700"
              starDimension="15px"
              starSpacing="1px"
              numberOfStars={5}
            />
          </div>
          <p className="suggestion-description">
            {cut_desc}...{' '}
            <a
              href={'https://www.themoviedb.org/movie/' + id}
              target="_blank"
              rel="noreferrer noopener"
            >
              read more
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShowSuggestions;
