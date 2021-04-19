import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import env from 'react-dotenv';
import AutoTag from '../AutoTag/AutoTag';
import PopcornLoading from '../PopcornLoading/PopcornLoading';
import MovieResult from '../MovieResult/MovieResult';
import suggestionsJson from '../../suggestions.json';
import './search.css';

// const searchAPI =
//   process.env.NODE_ENV === 'production'
//     ? env.SEARCH_API_PRODUCTION
//     : env.SEARCH_API_DEV;

const postAPI =
  process.env.NODE_ENV === 'production'
    ? env.POST_API_PRODUCTION
    : env.POST_API_DEV;

const Search = () => {
  const [data, setData] = useState({ project_name: '', net_id: '' });
  const [tags, setTags] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // async function fectchData() {
    //   const result = await axios(searchAPI);
    //   setData(result.data);
    // }
    // fectchData();
    document.title = 'ClubHub'; // Set HTML title
  }, []);

  const onDelete = (i) => {
    const newTags = tags.slice(0);
    newTags.splice(i, 1);
    setTags(newTags);
  };

  const onAddition = (tagName) => {
    var tag = { name: tagName };
    if (tags.length === 0) {
      tag['weight'] = 10;
    } else {
      var max = 0;
      var idx = 0;
      tags.forEach((t, i) => {
        if (t.weight > max) {
          max = t.weight;
          idx = i;
        }
      });

      const newTags = tags.slice(0);
      newTags[idx].weight = max - 1;
      tag['weight'] = 1;
    }
    setTags([...tags, tag]);
  };

  const updateWeight = (weight, i) => {
    const newTags = tags.slice(0);
    newTags[i].weight = weight;
    setTags(newTags);
  };

  const handleSubmit = () => {
    console.log(tags);
    setLoading(true);
    axios
      .post(postAPI, JSON.stringify({ data: tags }), {
        headers: {
          // Overwrite Axios's automatically set Content-Type
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        setLoading(false);
        setMovies(res.data);
      });
  };

  return (
    <section id="search">
      <div className="search-hero-image">
        <div className="hero-content">
          <div className="search-title">
            <span>What are you looking for?</span>
          </div>
          <AutoTag
            tags={tags}
            suggestions={suggestionsJson['suggestions']}
            onDelete={onDelete}
            onAddition={onAddition}
            updateWeight={updateWeight}
          />
          <button className="submit-btn" onClick={handleSubmit}>
            Search for movies
          </button>
        </div>
      </div>

      {loading ? <PopcornLoading /> : null}
      {movies.length > 0
        ? movies.map((m, i) => <MovieResult key={i} movie={m} />)
        : null}
    </section>
  );
};

export default Search;
