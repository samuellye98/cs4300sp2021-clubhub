import React from 'react';
import './showresult.css';

const ShowResult = (props) => {
  // we should also get a ranking to display and a similarity score if possible
  const { id, name, description, rating, cosine_similarity, img } = props.movie;
  const cut_desc = description.split(' ').slice(0, 50).join(' ');
  const rounded_sim = cosine_similarity.toFixed(3);

  return (
    // <a
    //   href={'https://www.themoviedb.org/tv/' + id}
    //   target="_blank"
    //   rel="noreferrer noopener"
    // >
    <section className="show-card">
      <h4 className="show-title">{name}</h4>
      <div className="show-content">
        <div className="show-txt">
          <p className="show-rating">Similarity: {rounded_sim}</p>
          <p className="show-rating">TMDb Rating: {rating}</p>
          <p className="show-description">
            {cut_desc}...{' '}
            <a
              href={'https://www.themoviedb.org/tv/' + id}
              target="_blank"
              rel="noreferrer noopener"
            >
              read more
            </a>
          </p>
        </div>
        <img
          src={
            img === null
              ? require('../../assets/images/show_placeholder.png').default
              : `https://image.tmdb.org/t/p/original/${img}`
          }
          alt={`${name}-img`}
          className="show-img"
        />
      </div>
    </section>
    // </a>
  );
};

export default ShowResult;
