import React, { useState } from 'react';
import './multiselect.css';

const MultiSelect = (props) => {
  const { options, selectedValues, setSelectedValues, placeholder } = props;
  const [showDropdown, setShowDropdown] = useState(false);

  const onRemoveSelectedItem = (item) => {
    var tempValues = selectedValues.splice(0);
    var index = selectedValues.findIndex((i) => i.id === item.id);
    tempValues.splice(index, 1);
    setSelectedValues(tempValues);
  };

  const renderSelectedList = () => {
    return selectedValues.map((value, index) => (
      <span className="chip" key={index}>
        {value.name}
        <i
          className="icon-cancel-circle"
          style={{
            marginLeft: 5,
            fontSize: '15px',
            color: '#fff',
          }}
          onClick={() => onRemoveSelectedItem(value)}
        />
      </span>
    ));
  };

  const onSelectItem = (item) => {
    setSelectedValues([...selectedValues, item]);
  };

  const isSelectedValue = (item) => {
    return selectedValues.filter((i) => i.id === item.id).length > 0;
  };

  const renderOptionList = () => {
    return (
      <ul className="optionContainer">
        {options.map((option, i) => {
          return isSelectedValue(option) ? null : (
            <li key={i} onClick={() => onSelectItem(option)}>
              {option.name}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="multiSelectContainer">
      <div className="searchWrapper">
        {renderSelectedList()}
        <input
          type="text"
          className="searchBox"
          placeholder={placeholder}
          disabled
        />

        {showDropdown ? (
          <i
            className="icon-chevron-up"
            style={{
              cursor: 'pointer',
              fontSize: '15px',
              color: '#999',
              marginLeft: 'auto',
              padding: '0px 5px',
            }}
            onClick={() => setShowDropdown(false)}
          />
        ) : (
          <i
            className="icon-chevron-down"
            style={{
              cursor: 'pointer',
              fontSize: '15px',
              color: '#999',
              marginLeft: 'auto',
              padding: '0px 5px',
            }}
            onClick={() => setShowDropdown(true)}
          />
        )}
      </div>
      {showDropdown ? (
        <div className="optionListContainer">{renderOptionList()}</div>
      ) : null}
    </div>
  );
};

export default MultiSelect;
