import React, { useState, useMemo, memo } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { COLORS, CHART_COLORS } from '../styles/theme';
import { MONTHS } from '../data/constants';
import { PHC_DATA } from '../data/mockData';
import { formatNumber, getNestedValue } from '../utils/helpers';
import ChartCard from '../components/ChartCard';
import CustomTooltip from '../components/CustomTooltip';
import { Search, X, GitCompare } from 'lucide-react';

const ComparePage = memo(() => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    const q = searchTerm.toLowerCase();
    return PHC_DATA.filter(p =>
      !selectedIds.includes(p.id) &&
      (p.name.toLowerCase().includes(q) || p.state.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [searchTerm, selectedIds]);

  const selectedPHCs = useMemo(() =>
    selectedIds.map(id => PHC_DATA.find(p => p.id === id)).filter(Boolean),
  [selectedIds]);

  const addPHC = (id) => {
    if (selectedIds.length < 4 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
      setSearchTerm('');
    }
  };

  const removePHC = (id) => setSelectedIds(selectedIds.filter(x => x !== id));

  // Comparison metrics
  const METRICS = ['visits.total','visits.anc','deliveries','immunisations','staffCount','satisfactionScore','drugStockLevel','referrals'];
  const METRIC_LABELS = ['Total Visits','ANC','Deliveries','Immunisations','Staff','Satisfaction','Drug Stock','Referrals'];

  const getVal = (obj, key) => key.split('.').reduce((o, k) => o?.[k], obj);

  // Grouped monthly visits data
  const monthlyCompare = useMemo(() => {
    return MONTHS.map((m, mi) => {
      const row = { month: m };
      selectedPHCs.forEach(p => {
        row[p.name] = p.monthlyTrend[mi]?.outpatient || 0;
      });
      return row;
    });
  }, [selectedPHCs]);

  // Radar comparison
  const radarCompare = useMemo(() => {
    const dims = ['staffCount','visits.total','satisfactionScore','drugStockLevel','immunisations','referrals'];
    const dimLabels = ['Staffing','Visits','Satisfaction','Drug Avail.','Immunisation','Referrals'];
    return dimLabels.map((label, i) => {
      const row = { dim: label };
      selectedPHCs.forEach(p => {
        const v = getVal(p, dims[i]);
        // Normalize to 0-100 scale
        const maxVals = [45, 20000, 100, 100, 5000, 400];
        row[p.name] = Math.min(100, (v / maxVals[i]) * 100);
      });
      return row;
    });
  }, [selectedPHCs]);

  // Top 8 diagnoses comparison
  const diagCompare = useMemo(() => {
    if (selectedPHCs.length === 0) return [];
    const allDiag = new Set();
    selectedPHCs.forEach(p => Object.keys(p.diagnoses).forEach(d => allDiag.add(d)));
    const diagArr = [...allDiag];
    // Sort by average count across selected PHCs
    diagArr.sort((a, b) => {
      const avgA = selectedPHCs.reduce((s, p) => s + (p.diagnoses[a] || 0), 0) / selectedPHCs.length;
      const avgB = selectedPHCs.reduce((s, p) => s + (p.diagnoses[b] || 0), 0) / selectedPHCs.length;
      return avgB - avgA;
    });
    return diagArr.slice(0, 8).map(d => {
      const row = { name: d };
      selectedPHCs.forEach(p => { row[p.name] = p.diagnoses[d] || 0; });
      return row;
    });
  }, [selectedPHCs]);

  return (
    <div>
      <h2 className="font-syne text-[22px] font-extrabold mb-1">PHC Comparison Tool</h2>
      <p className="font-dm text-[13px] text-text-muted mb-6">Select 2 to 4 PHCs to compare side by side</p>

      {/* PHC Selector */}
      <div className="glass p-5 mb-6">
        <div className="relative max-w-[400px] mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            placeholder="Search PHC to add..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            disabled={selectedIds.length >= 4}
            className="w-full py-2.5 pr-3 pl-9 bg-[rgba(6,11,24,0.8)] border border-border rounded-xl text-text-primary text-[13px] font-dm"
            style={{ opacity: selectedIds.length >= 4 ? 0.5 : 1 }}
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl max-h-[200px] overflow-y-auto z-50">
              {searchResults.map(p => (
                <div key={p.id} onClick={() => addPHC(p.id)}
                  className="px-4 py-2.5 cursor-pointer border-b border-border/[0.12] text-[13px] hover:bg-[rgba(0,212,255,0.05)]"
                >
                  <div className="font-medium text-text-primary">{p.name}</div>
                  <div className="text-[11px] text-text-muted">{p.state} &middot; {p.lga}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2.5 flex-wrap items-center">
          {selectedPHCs.map((p, i) => (
            <div key={p.id}
              className="glass px-3.5 py-2.5 flex items-center gap-2.5"
              style={{ borderLeft: `3px solid ${CHART_COLORS[i]}` }}
            >
              <div>
                <div className="font-dm font-semibold text-[13px] text-text-primary">{p.name}</div>
                <div className="text-[11px] text-text-muted">{p.state} &middot; {p.lga}</div>
              </div>
              <button onClick={() => removePHC(p.id)} aria-label={`Remove ${p.name}`}
                className="bg-[rgba(255,107,107,0.1)] border-none rounded-md p-1 cursor-pointer text-coral flex"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {selectedIds.length > 0 && (
            <button onClick={() => setSelectedIds([])}
              className="bg-none border-none text-text-muted cursor-pointer text-xs underline"
            >Clear All</button>
          )}
        </div>
      </div>

      {selectedPHCs.length >= 2 && (
        <div className="charts-grid-2col">
          <ChartCard title="Monthly Visits Comparison" subtitle="Outpatient visits per PHC">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyCompare}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
                <YAxis stroke={COLORS.textMuted} fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {selectedPHCs.map((p, i) => (
                  <Bar key={p.id} dataKey={p.name} fill={CHART_COLORS[i]} name={p.name} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Diagnosis Comparison" subtitle="Top 8 diagnoses across selected PHCs">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={diagCompare} layout="vertical" margin={{ left: 90 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis type="number" stroke={COLORS.textMuted} fontSize={11} />
                <YAxis type="category" dataKey="name" stroke={COLORS.textMuted} fontSize={10} width={85} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {selectedPHCs.map((p, i) => (
                  <Bar key={p.id} dataKey={p.name} fill={CHART_COLORS[i]} name={p.name} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Performance Radar" subtitle="Normalized scores overlaid">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarCompare}>
                <PolarGrid stroke={COLORS.border} />
                <PolarAngleAxis dataKey="dim" stroke={COLORS.textMuted} fontSize={10} />
                <PolarRadiusAxis domain={[0, 100]} stroke={COLORS.border} fontSize={9} />
                {selectedPHCs.map((p, i) => (
                  <Radar key={p.id} name={p.name} dataKey={p.name} stroke={CHART_COLORS[i]} fill={CHART_COLORS[i]} fillOpacity={0.15} dot={{ r: 3, fill: CHART_COLORS[i] }} />
                ))}
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="12-Month Visit Trend" subtitle="Line comparison over time">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyCompare}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
                <YAxis stroke={COLORS.textMuted} fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {selectedPHCs.map((p, i) => (
                  <Line key={p.id} type="monotone" dataKey={p.name} stroke={CHART_COLORS[i]} strokeWidth={2} dot={{ r: 3, fill: CHART_COLORS[i] }} name={p.name} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Comparison Table */}
          <ChartCard title="Metric Comparison Table" subtitle="Best in green, worst in red" fullWidth>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-3.5 py-2.5 text-left text-xs text-text-muted border-b border-border">Metric</th>
                    {selectedPHCs.map((p, i) => (
                      <th key={p.id}
                        className="px-3.5 py-2.5 text-center text-xs font-bold border-b border-border"
                        style={{ color: CHART_COLORS[i] }}
                      >{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {METRICS.map((m, mi) => {
                    const values = selectedPHCs.map(p => getVal(p, m));
                    const maxV = Math.max(...values);
                    const minV = Math.min(...values);
                    return (
                      <tr key={m}>
                        <td className="px-3.5 py-2.5 text-[13px] text-text-muted border-b border-border/[0.12]">{METRIC_LABELS[mi]}</td>
                        {selectedPHCs.map((p, i) => {
                          const v = getVal(p, m);
                          const isBest = v === maxV && values.filter(x => x === maxV).length === 1;
                          const isWorst = v === minV && values.filter(x => x === minV).length === 1;
                          return (
                            <td key={p.id}
                              className="px-3.5 py-2.5 text-center text-sm font-semibold font-syne border-b border-border/[0.12]"
                              style={{
                                background: isBest ? 'rgba(16,185,129,0.08)' : isWorst ? 'rgba(255,107,107,0.06)' : 'transparent',
                                color: isBest ? COLORS.emerald : isWorst ? COLORS.coral : COLORS.textPrimary,
                              }}
                            >
                              {typeof v === 'number' ? v.toLocaleString() : v}
                              {m === 'satisfactionScore' || m === 'drugStockLevel' ? '%' : ''}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      )}

      {selectedPHCs.length < 2 && (
        <div className="text-center p-15 text-text-muted">
          <GitCompare size={48} className="opacity-30 mb-4" />
          <p className="font-dm text-[15px]">Select at least 2 PHCs to begin comparison</p>
        </div>
      )}
    </div>
  );
});

export default ComparePage;
