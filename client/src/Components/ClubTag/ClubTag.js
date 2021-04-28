import React from 'react';
import './clubtag.css';

const ClubTag = (props) => {
  const { i, tag, updateWeight, deleteTag } = props;

  return (
    <div className="tag-container">
      <div className="tag">
        <span className="tag-name">{tag.name}</span>
        <button type="button" className="cancel-button" onClick={deleteTag}>
          <i
            className="icon-clear"
            style={{ fontSize: '15px', color: '#fff' }}
          />
        </button>
      </div>

      <div className="slider-container">
        <output
          style={{
            left: `calc(${Number((tag.weight * 100) / 10)}% + (${
              8 - Number((tag.weight * 100) / 10) * 0.15
            }px))`,
          }}
          className="slider-output"
        >
          {tag.weight}
        </output>
        <input
          className="slider-input"
          type="range"
          min={0}
          max={10}
          step={1}
          value={tag.weight}
          onChange={(e) => {
            updateWeight(e.target.value, i);
          }}
        />
      </div>
    </div>
  );
};

export default ClubTag;
