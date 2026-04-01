import React, { memo, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, Download, Image, FileSpreadsheet } from 'lucide-react';

const ChartCard = memo(({ title, subtitle, children, style = {}, fullWidth = false }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const chartRef = useRef(null);

  const handleExportPNG = useCallback(() => {
    setShowExportMenu(false);
    const container = isFullscreen
      ? document.querySelector('.chart-fullscreen-modal .recharts-wrapper')
      : chartRef.current?.querySelector('.recharts-wrapper');
    if (!container) return;
    const svg = container.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.scale(2, 2);
      ctx.fillStyle = '#0D1627';
      ctx.fillRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0);
      const a = document.createElement('a');
      a.download = `${(title || 'chart').replace(/\s+/g, '_')}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  }, [title, isFullscreen]);

  const handleExportCSV = useCallback(() => {
    setShowExportMenu(false);
    const container = isFullscreen
      ? document.querySelector('.chart-fullscreen-modal .recharts-wrapper')
      : chartRef.current?.querySelector('.recharts-wrapper');
    if (!container) return;

    // Try to extract data from recharts internal props
    const chart = container.querySelector('.recharts-surface');
    if (!chart) return;

    // Get all text elements to build a rough CSV
    const texts = container.querySelectorAll('.recharts-cartesian-axis-tick-value, .recharts-legend-item-text');
    const values = [...texts].map(t => t.textContent);
    if (values.length === 0) return;

    const csvContent = `${title}\n${values.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const a = document.createElement('a');
    a.download = `${(title || 'chart').replace(/\s+/g, '_')}.csv`;
    a.href = URL.createObjectURL(blob);
    a.click();
    URL.revokeObjectURL(a.href);
  }, [title, isFullscreen]);

  return (
    <>
      <motion.div
        ref={chartRef}
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
          <div className="flex gap-2 relative">
            <button
              aria-label="Fullscreen"
              onClick={() => setIsFullscreen(true)}
              className="bg-white/5 border-none rounded-lg p-1.5 cursor-pointer text-text-muted flex hover:text-cyan hover:bg-cyan/10 transition-colors"
            >
              <Maximize2 size={14} />
            </button>
            <div className="relative">
              <button
                aria-label="Export"
                onClick={() => setShowExportMenu(v => !v)}
                className="bg-white/5 border-none rounded-lg p-1.5 cursor-pointer text-text-muted flex hover:text-cyan hover:bg-cyan/10 transition-colors"
              >
                <Download size={14} />
              </button>
              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-50 min-w-[150px] overflow-hidden">
                    <button onClick={handleExportPNG}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-[12px] text-text-primary font-dm bg-transparent border-none cursor-pointer hover:bg-cyan/5 transition-colors text-left"
                    >
                      <Image size={13} className="text-cyan" /> Export as PNG
                    </button>
                    <button onClick={handleExportCSV}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-[12px] text-text-primary font-dm bg-transparent border-none cursor-pointer hover:bg-cyan/5 transition-colors text-left border-t border-border/30"
                    >
                      <FileSpreadsheet size={13} className="text-emerald" /> Export as CSV
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {children}
      </motion.div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-6"
            onClick={(e) => { if (e.target === e.currentTarget) setIsFullscreen(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="chart-fullscreen-modal glass w-full max-w-[1200px] max-h-[90vh] p-8 overflow-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-syne text-xl font-bold text-text-primary mb-1">{title}</h3>
                  {subtitle && <p className="font-dm text-sm text-text-muted">{subtitle}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={handleExportPNG}
                    className="flex items-center gap-1.5 px-3 py-2 bg-cyan/10 border border-cyan/20 rounded-lg text-cyan text-xs cursor-pointer font-dm hover:bg-cyan/20 transition-colors"
                  >
                    <Image size={13} /> PNG
                  </button>
                  <button onClick={() => setIsFullscreen(false)}
                    className="bg-white/5 border-none rounded-lg p-2 cursor-pointer text-text-muted flex hover:text-coral hover:bg-coral/10 transition-colors"
                  >
                    <Minimize2 size={18} />
                  </button>
                </div>
              </div>
              <div style={{ height: 'min(60vh, 500px)' }}>
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default ChartCard;
