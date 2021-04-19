import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Input from './Input';
import Tag from './Tag';
import Suggestions from './Suggestions';
import './autotag.css';

const KEYS = {
  ENTER: 'Enter',
  TAB: 'Tab',
  UP_ARROW: 'ArrowUp',
  UP_ARROW_COMPAT: 'Up',
  DOWN_ARROW: 'ArrowDown',
  DOWN_ARROW_COMPAT: 'Down',
};

function escapeForRegExp(string) {
  return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
}

function matchPartial(string) {
  return new RegExp(`(?:^|\\s)${escapeForRegExp(string)}`, 'i');
}

// function matchExact(string) {
//   return new RegExp(`^${escapeForRegExp(string)}$`, 'i');
// }

const AutoTag = (props) => {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState([]);

  const containerRef = useRef();
  const inputRef = useRef();

  const onInput = (event) => {
    const input = event.target.value;
    setQuery(input);
  };

  useEffect(() => {
    if (query.trim().length >= props.minQueryLength) {
      let options = props.suggestions.filter((item) => {
        var regexp = matchPartial(query);
        return regexp.test(item.name);
      });

      options = options.slice(0, props.maxSuggestionsLength);

      if (options.length === 0) {
        options.push({
          name: 'No clubs found',
          disabled: true,
        });
      }
      setOptions(options);
    } else {
      setOptions([]);
    }
  }, [query]);

  const onKeyDown = (event) => {
    // when one of the terminating keys is pressed, add current query to the tags
    if (event.key === KEYS.ENTER || event.key === KEYS.TAB) {
      if (query || index >= 0) {
        event.preventDefault();
      }

      // TO FIX
      console.log('OPTIONS', options, index);
      if (options.length > 0 && !options[index].hasOwnProperty('disabled')) {
        addTag(options[index]);
      }
    }

    if (event.key === KEYS.UP_ARROW || event.key === KEYS.UP_ARROW_COMPAT) {
      event.preventDefault();
      setIndex(index <= 0 ? options.length - 1 : index - 1); // if first item, cycle to the bottom
    }

    if (event.key === KEYS.DOWN_ARROW || event.key === KEYS.DOWN_ARROW_COMPAT) {
      event.preventDefault();
      setIndex(index >= options.length - 1 ? 0 : index + 1); // if last item, cycle to top
    }
  };

  const inputEventHandlers = {
    onInput: onInput,
    // onFocus: onFocus,
    // onChange: () => {},
    onKeyDown: onKeyDown,
  };

  const addTag = (tag) => {
    // Check for duplicates
    if (!props.tags.some((t) => t.name === tag.name)) {
      props.onAddition(tag.name);
      reset();
    }
  };

  const reset = () => {
    setQuery('');
    setIndex(0);
  };

  return (
    <div ref={containerRef} className="autotag-container">
      <Input
        numTags={props.tags.length}
        query={query}
        inputRef={inputRef}
        inputEventHandlers={inputEventHandlers}
      />
      <Suggestions
        query={query}
        index={index}
        options={options}
        addTag={addTag}
      />

      {props.tags.length > 0 ? (
        <div className="results-container ">
          {props.tags.map((tag, i) => (
            <Tag
              key={i}
              i={i}
              tag={tag}
              deleteTag={() => props.onDelete(i)}
              updateWeight={props.updateWeight}
            />
          ))}

          <div className="submit-btn-container">
            <button className="submit-btn" onClick={props.handleSubmit}>
              Search for movies
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

AutoTag.defaultProps = {
  minQueryLength: 2,
  maxSuggestionsLength: 6,
};

AutoTag.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object),
  suggestions: PropTypes.arrayOf(PropTypes.object),
  onDelete: PropTypes.func.isRequired,
  onAddition: PropTypes.func.isRequired,
  minQueryLength: PropTypes.number,
  maxSuggestionsLength: PropTypes.number,
};

export default AutoTag;
