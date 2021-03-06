import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import env from 'react-dotenv';
import Title from '../Title/Title';
import AutoTag from '../AutoTag/AutoTag';
import ClubTagContainer from '../ClubTag/ClubTagContainer';
import MultiSelect from '../MultiSelect/MultiSelect';
import PopcornLoading from '../PopcornLoading/PopcornLoading';
import ShowResult from '../ShowResult/ShowResult';
import ShowSuggestions from '../ShowSuggestions/ShowSuggestions';
import suggestionsJson from '../../suggestions.json';
import { genres } from '../../constants.js';
import './search.css';

const postAPI =
  process.env.NODE_ENV === 'production'
    ? env.POST_API_PRODUCTION
    : env.POST_API_DEV;

const Search = () => {
  // Regular search
  const [tags, setTags] = useState([]);
  const [shows, setShows] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [neighbors, setNeighbors] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);

  // Advanced search
  const [showAdvanced, setShowAdvanced] = useState(false);
  const freeTextRef = useRef();
  const [selectedGenres, setSelectedGenres] = useState([]);

  // Movie Results ref
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
    var tag = { name: tagName, weight: 5 };
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
      .post(
        postAPI,
        JSON.stringify({
          data: tags,
          freeText:
            freeTextRef.current === undefined
              ? ''
              : freeTextRef.current.value.trim(),
          genre: selectedGenres,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
      .then((res) => {
        setShows(res.data.results);
        setSuggestions(res.data.suggestions);
        setNeighbors(res.data.neighbors);
        setFeatures(res.data.key_features);
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
      <div className="prototype">
        <a target="_blank" href="https://clubhub-4300-snd.herokuapp.com/">
          Second prototype
        </a>
        <a target="_blank" href="https://clubhub-4300-fst.herokuapp.com/">
          First prototype
        </a>
      </div>
      <div className="search-hero-image">
        <div className="hero-content">
          <Title />
          <AutoTag
            tags={tags}
            suggestions={suggestionsJson['suggestions']}
            onAddition={onAddition}
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
          />

          {showAdvanced ? (
            <div className="advanced-search-container">
              <div className="advanced-search">
                <span className="advanced-search-title">Advanced Search</span>
                <div className="input-group">
                  <input
                    ref={freeTextRef}
                    className="free-form-input"
                    type="text"
                    name="freeforminput"
                    placeholder="Keyword Search (Enter additional search keywords or sentences here)"
                  ></input>
                </div>

                <MultiSelect
                  options={genres}
                  selectedValues={selectedGenres}
                  setSelectedValues={setSelectedGenres}
                  placeholder={'Genres'}
                />
              </div>
            </div>
          ) : null}

          <ClubTagContainer
            tags={tags}
            onDelete={onDelete}
            updateWeight={updateWeight}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>

      {loading ? <PopcornLoading /> : null}
      <div ref={resultsRef}>
        {shows.length > 0 && !loading ? (
          <div>
            <div className="suggestions-title">
              <h2>Movie Suggestions</h2>
            </div>
            <div id="stemmed-words-div">
              <h4>Important Stemmed Words that Led to Your Results</h4>
              {features.map((f, i) => (
                <p key={i} className="items">
                  {f}
                </p>
              ))}
            </div>
            <div id="results">
              {shows.map((m, i) => (
                <ShowResult key={i} movie={m} />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {suggestions.length > 0 && !loading ? (
        <div>
          <hr className="suggestions-divider" />
          <div className="suggestions-title">
            <h2>Movie Suggestions for Similar Clubs</h2>
          </div>
          <div className="neighbors-div">
            <h4>Similar Clubs</h4>
            {neighbors.map((m, i) => (
              <p key={i} className="items">
                {m}
              </p>
            ))}
          </div>
          <div id="suggestions">
            {suggestions.map((m, i) => (
              <ShowSuggestions key={i} movie={m} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default Search;
