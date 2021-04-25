import React from 'react';

const ArrowDown = (props) => {
  const { width, height, color, setShowAdvanced } = props;
  return (
    <div className="icon-container" onClick={() => setShowAdvanced(true)}>
      <svg
        fill={color}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <path d="M23.245 4l-11.245 14.374-11.219-14.374-.781.619 12 15.381 12-15.391-.755-.609z" />
      </svg>
    </div>
  );
};

export default ArrowDown;
