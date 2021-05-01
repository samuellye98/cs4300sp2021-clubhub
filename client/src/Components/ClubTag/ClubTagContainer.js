import React from 'react';
import ClubTag from './ClubTag';
import './clubtag.css';

const ClubTagContainer = (props) => {
  const { tags, onDelete, updateWeight, handleSubmit, loading } = props;
  return tags.length > 0 ? (
    <div className="clubtag-container ">
      {tags.map((tag, i) => (
        <ClubTag
          key={i}
          i={i}
          tag={tag}
          deleteTag={() => onDelete(i)}
          updateWeight={updateWeight}
        />
      ))}

      <div className="submit-btn-container">
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          Search for shows
        </button>
      </div>
    </div>
  ) : null;
};

export default ClubTagContainer;
