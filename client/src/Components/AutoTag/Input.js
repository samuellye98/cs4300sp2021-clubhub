import React from 'react';
import SearchIcon from './SearchIcon';
import ArrowDown from './ArrowDown';
import ArrowUp from './ArrowUp';
import './autotag.css';

const Input = (props) => {
  const {
    numTags,
    inputRef,
    query,
    inputEventHandlers,
    showAdvanced,
    setShowAdvanced,
  } = props;

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
      {showAdvanced ? (
        <ArrowUp
          width={30}
          height={30}
          color="#ccc"
          setShowAdvanced={setShowAdvanced}
        />
      ) : (
        <ArrowDown
          width={30}
          height={30}
          color="#ccc"
          setShowAdvanced={setShowAdvanced}
        />
      )}
    </div>
  );
};

export default Input;
