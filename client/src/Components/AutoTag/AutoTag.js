import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import Input from './Input';
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
  // const elmRefs = useRef();

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

  // Scroll suggestions using up and down keys
  const [liRefs, setLiRefs] = useState({});
  useEffect(() => {
    // Change refs to <li> tags if options change
    setLiRefs(
      options.reduce((acc, value, i) => {
        acc[i] = React.createRef();
        return acc;
      }, {})
    );
  }, [options]);

  useLayoutEffect(() => {
    // Scroll to appropriate li element
    if (options.length > 0) {
      liRefs[index].current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [index]);

  const inputEventHandlers = {
    onInput: onInput,
    onKeyDown: onKeyDown,
    // onFocus: onFocus,
    // onChange: () => {},
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
        showAdvanced={props.showAdvanced}
        setShowAdvanced={props.setShowAdvanced}
      />
      <Suggestions
        liRefs={liRefs}
        query={query}
        index={index}
        options={options}
        addTag={addTag}
      />
    </div>
  );
};

AutoTag.defaultProps = {
  minQueryLength: 2,
};

AutoTag.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object),
  suggestions: PropTypes.arrayOf(PropTypes.object),
  onAddition: PropTypes.func.isRequired,
  minQueryLength: PropTypes.number,
};

export default AutoTag;
