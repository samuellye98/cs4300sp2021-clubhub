import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import './search.css';
import env from 'react-dotenv';

const searchAPI =
  env.NODE_ENV === 'production'
    ? env.SEARCH_API_PRODUCTION
    : env.SEARCH_API_DEV;
console.log(searchAPI);
const Search = () => {
  const [data, setData] = useState({ project_name: '', net_id: '' });

  useEffect(() => {
    async function fectchData() {
      const result = await axios(searchAPI);
      setData(result.data);
    }

    fectchData();
  }, []);

  return (
    <>
      <div className="topcorner">
        <p>Project Name: {data.project_name}</p>
        <p>Student Name: {data.net_id}</p>
      </div>

      <form
        className="form-inline global-search"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <h1
          style={{ fontSize: '55px', fontFamily: 'Futura', color: '#4285f4' }}
        >
          C<span style={{ color: '#ea4335' }}>S</span>
          <span style={{ color: '#fbbc05' }}>4</span>3
          <span style={{ color: '#34a853' }}>0</span>
          <span style={{ color: '#ea4335' }}>0</span>
        </h1>

        <br />
        <br />

        <div className="form-group">
          <input
            id="input"
            type="text"
            name="search"
            className="form-control"
            placeholder="Your Input"
          />
          <Button style={{ marginLeft: '5px' }} className="btn btn-info">
            Go!
          </Button>
        </div>
      </form>
    </>
  );
};

export default Search;
