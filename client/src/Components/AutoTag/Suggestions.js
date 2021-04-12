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
  const onMouseDown = (event, item) => {
    // focus is shifted on mouse down but calling preventDefault prevents this
    event.preventDefault();

    if (!item.hasOwnProperty('disabled')) {
      // Only can add if it's a valid tag
      props.addTag(item);
    }
  };

  return props.options.length === 0 ? null : (
    <div className="autotag-suggestions">
      <ul>
        {props.options.map((item, i) => {
          return (
            <li
              key={i}
              disabled={item.disabled === true}
              onMouseDown={(event) => onMouseDown(event, item)}
              className={
                item.hasOwnProperty('disabled')
                  ? 'is-disabled'
                  : i === props.index
                  ? 'is-active'
                  : ''
              }
            >
              <SuggestionComponent item={item} query={props.query} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Suggestions;
