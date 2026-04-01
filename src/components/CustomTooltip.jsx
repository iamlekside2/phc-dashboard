import React from 'react';
import { formatNumber } from '../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-[10px] px-3.5 py-2.5 text-[13px] font-dm">
      <div className="font-syne font-bold mb-1.5 text-text-primary">
        {label}
      </div>
      {payload.map((p, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 py-0.5 text-text-primary"
        >
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: p.color }}
          />
          <span className="text-text-muted">{p.name}:</span>
          <span className="font-semibold">{formatNumber(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomTooltip;
