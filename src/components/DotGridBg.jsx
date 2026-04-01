import React from 'react';
import { COLORS } from '../styles/theme';

const DotGridBg = () => (
  <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none">
    <defs>
      <pattern id="dotgrid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill={COLORS.cyan} opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite" />
        </circle>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dotgrid)" />
  </svg>
);

export default DotGridBg;
