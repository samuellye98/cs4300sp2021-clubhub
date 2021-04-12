import React from 'react';
import './autotag.css';

const Tag = (props) => {
  const { tag, updateWeight, deleteTag } = props;
  return (
    <div className="tag-container">
      <div className="tag">
        <span className="tag-name">{tag.name}</span>
        <button type="button" className="cancel-button" onClick={deleteTag}>
          &#x2715;
        </button>
      </div>

      <div className="weight-container">
        <input
          className="weight-input"
          //   value={tag.weight}
          type="number"
          min="0.1"
          max="1.0"
          step="0.1"
          //   onChange={() => updateWeight(t)}
        />
        <span className="weight-text">Weight</span>
      </div>
    </div>
  );
};

export default Tag;
