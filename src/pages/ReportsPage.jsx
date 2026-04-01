import React, { memo } from 'react';
import { FileDown, Download } from 'lucide-react';
import { COLORS } from '../styles/theme';

const ReportsPage = memo(() => (
  <div className="text-center p-20">
    <FileDown size={64} className="text-text-muted opacity-30 mb-5 inline-block" />
    <h2 className="font-syne text-2xl font-extrabold mb-2">Reports Center</h2>
    <p className="font-dm text-sm text-text-muted mb-6">
      Download formatted reports for national and state-level PHC performance.
    </p>
    <div className="flex gap-3 justify-center flex-wrap">
      {['National Summary Report','State Performance Report','Drug Inventory Report','Immunisation Coverage Report'].map(r => (
        <button key={r} onClick={() => window.alert('Export coming soon')}
          className="btn-glow glass px-6 py-3.5 border border-border text-text-primary cursor-pointer rounded-[14px] text-sm font-dm flex items-center gap-2"
        >
          <Download size={16} className="text-cyan" /> {r}
        </button>
      ))}
    </div>
  </div>
));

export default ReportsPage;
