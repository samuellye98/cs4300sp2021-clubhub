import React from 'react';

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
      <i
        className="icon-search"
        style={{
          fontSize: '20px',
          color: '#ccc',
          marginLeft: 10,
          marginRight: 15,
        }}
      />
      <input
        className="autotag-input"
        ref={inputRef}
        value={query}
        placeholder={'Enter a club'}
        {...inputEventHandlers}
        disabled={numTags === 5}
      />
      {showAdvanced ? (
        <i
          className="icon-chevron-up"
          style={{ cursor: 'pointer', fontSize: '30px', color: '#ccc' }}
          onClick={() => setShowAdvanced(false)}
        />
      ) : (
        <i
          className="icon-chevron-down"
          style={{ cursor: 'pointer', fontSize: '30px', color: '#ccc' }}
          onClick={() => setShowAdvanced(true)}
        />
      )}
    </div>
  );
};

export default Input;
