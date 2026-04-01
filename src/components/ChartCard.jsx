import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Download } from 'lucide-react';

const ChartCard = memo(({ title, subtitle, children, style = {}, fullWidth = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass glass-hover chart-card p-5 ${fullWidth ? 'col-span-full' : ''}`}
      style={style}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-syne text-base font-bold text-text-primary mb-0.5">
            {title}
          </h3>
          {subtitle && (
            <p className="font-dm text-xs text-text-muted m-0">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            aria-label="Fullscreen"
            onClick={() => window.alert('Fullscreen view coming soon')}
            className="bg-white/5 border-none rounded-lg p-1.5 cursor-pointer text-text-muted flex"
          >
            <Maximize2 size={14} />
          </button>
          <button
            aria-label="Download"
            onClick={() => window.alert('Export coming soon')}
            className="bg-white/5 border-none rounded-lg p-1.5 cursor-pointer text-text-muted flex"
          >
            <Download size={14} />
          </button>
        </div>
      </div>
      {children}
    </motion.div>
  );
});

export default ChartCard;
