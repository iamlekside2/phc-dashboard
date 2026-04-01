import React from 'react';

const Sparkline = ({ data, color, width = 80, height = 28 }) => {
  const values = data || [30, 45, 35, 60, 42, 70, 55];
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values
    .map(
      (v, i) =>
        `${(i / (values.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`
    )
    .join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        opacity={0.8}
      />
    </svg>
  );
};

export default Sparkline;
