import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import env from 'react-dotenv';
import Title from '../Title/Title';
import AutoTag from '../AutoTag/AutoTag';
import PopcornLoading from '../PopcornLoading/PopcornLoading';
import ShowResult from '../ShowResult/ShowResult';
import suggestionsJson from '../../suggestions.json';
import './search.css';

const postAPI =
  process.env.NODE_ENV === 'production'
    ? env.POST_API_PRODUCTION
    : env.POST_API_DEV;

const Search = () => {
  const [tags, setTags] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef();

  useEffect(() => {
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
    setLoading(true);
    axios
      .post(postAPI, JSON.stringify({ data: tags }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        console.log(res.data);
        setShows(res.data);
        setLoading(false);
      })
      .catch((e) => setLoading(false));
  };

  useEffect(() => {
    if (shows.length > 0 && !loading) {
      resultsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [shows, loading]);

  return (
    <section id="search">
      <div className="search-hero-image">
        <div className="hero-content">
          <Title />
          {/* <div className="search-title">
            <span>What are you looking for?</span>
          </div> */}
          <AutoTag
            tags={tags}
            suggestions={suggestionsJson['suggestions']}
            onDelete={onDelete}
            onAddition={onAddition}
            updateWeight={updateWeight}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>

      {loading ? <PopcornLoading /> : null}
      <div ref={resultsRef}>
        {shows.length > 0 && !loading ? (
          <div id="results">
            {shows.map((m, i) => (
              <ShowResult key={i} movie={m} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Search;
