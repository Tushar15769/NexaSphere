import React from 'react';
import '../styles/animations.css';

export function Skeleton({ width = '100%', height = '20px', borderRadius = '8px', className = '', style = {} }) {
  return (
    <div
      className={`skeleton-loader ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
      aria-hidden="true"
    />
  );
}

export default Skeleton;
