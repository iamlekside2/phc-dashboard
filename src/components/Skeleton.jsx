import React from 'react';

const Skeleton = ({ width = '100%', height = 20, style = {} }) => (
  <div className="skeleton" style={{ width, height, ...style }} />
);

export default Skeleton;
