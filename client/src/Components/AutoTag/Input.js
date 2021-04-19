import React from 'react';
import SearchIcon from './SearchIcon';
import './autotag.css';

const Input = (props) => {
  const { numTags, inputRef, query, inputEventHandlers } = props;
  return (
    <div className="autotag-input-container">
      <SearchIcon width={30} height={30} color="#ccc" />
      <input
        className="autotag-input"
        ref={inputRef}
        value={query}
        placeholder={'Enter a club'}
        {...inputEventHandlers}
        disabled={numTags === 5}
      />
    </div>
  );
};

export default Input;
