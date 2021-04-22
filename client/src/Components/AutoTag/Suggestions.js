import React from 'react';
import './autotag.css';

function markIt(name, query) {
  const regexp = matchAny(query);
  return name.replace(regexp, '<mark>$&</mark>');
}

function escapeForRegExp(string) {
  return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
}

function matchAny(string) {
  return new RegExp(escapeForRegExp(string), 'gi');
}

const SuggestionComponent = ({ item, query }) =>
  item.hasOwnProperty('disabled') ? (
    <span>{item.name}</span>
  ) : (
    <span dangerouslySetInnerHTML={{ __html: markIt(item.name, query) }} />
  );

const Suggestions = (props) => {
  const { addTag, options, index, query, liRefs } = props;

  const onMouseDown = (event, item) => {
    // focus is shifted on mouse down but calling preventDefault prevents this
    event.preventDefault();

    if (!item.hasOwnProperty('disabled')) {
      // Only can add if it's a valid tag
      addTag(item);
    }
  };

  return options.length === 0 ? null : (
    <div className="autotag-suggestions">
      <ul className="autotag-scroll">
        {options.map((item, i) => {
          return (
            <li
              key={i}
              ref={liRefs[i]}
              disabled={item.disabled === true}
              onMouseDown={(event) => onMouseDown(event, item)}
              className={
                item.hasOwnProperty('disabled')
                  ? 'is-disabled'
                  : i === index
                  ? 'is-active'
                  : ''
              }
            >
              <SuggestionComponent item={item} query={query} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Suggestions;
