import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import env from 'react-dotenv';
import AutoTag from '../AutoTag/AutoTag';
import PopcornLoading from '../PopcornLoading/PopcornLoading';
import suggestionsJson from '../../suggestions.json';
import './search.css';

const searchAPI =
  process.env.NODE_ENV === 'production'
    ? env.SEARCH_API_PRODUCTION
    : env.SEARCH_API_DEV;

const Search = () => {
  const [data, setData] = useState({ project_name: '', net_id: '' });
  const [tags, setTags] = useState([]);

  useEffect(() => {
    async function fectchData() {
      const result = await axios(searchAPI);
      setData(result.data);
    }

    fectchData();
  }, []);

  const onDelete = (i) => {
    const newTags = tags.slice(0);
    newTags.splice(i, 1);
    setTags(newTags);
  };

  const onAddition = (tag) => {
    setTags([...tags, tag]);
  };

  const updateWeight = (i, weight) => {
    const newTags = tags.slice(0);
    newTags[i].weight = weight;
    setTags(newTags);
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
        </div>
      </div>

      <PopcornLoading />
    </section>
  );
};

export default Search;
