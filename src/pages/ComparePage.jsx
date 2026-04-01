import React, { useState, useMemo, memo } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { COLORS, CHART_COLORS } from '../styles/theme';
import { MONTHS, NIGERIAN_STATES, LGAS_BY_STATE } from '../data/constants';
import { PHC_DATA } from '../data/mockData';
import ChartCard from '../components/ChartCard';
import CustomTooltip from '../components/CustomTooltip';
import {
  Search, X, GitCompare, ChevronDown, CheckCircle2,
  MapPin, Users, Activity, TrendingUp, Filter,
} from 'lucide-react';

const COMPARE_COLORS = CHART_COLORS.slice(0, 4);

const ComparePage = memo(() => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('All');
  const [filterLGA, setFilterLGA] = useState('All');
  const [showBrowser, setShowBrowser] = useState(true);

  // Filtered browse list
  const browsePHCs = useMemo(() => {
    let list = PHC_DATA;
    if (filterState !== 'All') list = list.filter(p => p.state === filterState);
    if (filterLGA !== 'All') list = list.filter(p => p.lga === filterLGA);
    if (searchTerm.length >= 2) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.lga.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filterState, filterLGA, searchTerm]);

  const availableLGAs = useMemo(() => {
    if (filterState === 'All') return [];
    return LGAS_BY_STATE[filterState] || [];
  }, [filterState]);

  const selectedPHCs = useMemo(() =>
    selectedIds.map(id => PHC_DATA.find(p => p.id === id)).filter(Boolean),
  [selectedIds]);

  const togglePHC = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else if (selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getVal = (obj, key) => key.split('.').reduce((o, k) => o?.[k], obj);
  const colorFor = (id) => COMPARE_COLORS[selectedIds.indexOf(id)] || COMPARE_COLORS[0];

  // Chart data
  const monthlyCompare = useMemo(() =>
    MONTHS.map((m, mi) => {
      const row = { month: m };
      selectedPHCs.forEach(p => { row[p.name] = p.monthlyTrend[mi]?.outpatient || 0; });
      return row;
    }), [selectedPHCs]);

  const radarCompare = useMemo(() => {
    const dims = ['staffCount','visits.total','satisfactionScore','drugStockLevel','immunisations','referrals'];
    const labels = ['Staffing','Visits','Satisfaction','Drug Stock','Immunisation','Referrals'];
    const maxVals = [45, 20000, 100, 100, 5000, 400];
    return labels.map((label, i) => {
      const row = { dim: label };
      selectedPHCs.forEach(p => {
        row[p.name] = Math.min(100, (getVal(p, dims[i]) / maxVals[i]) * 100);
      });
      return row;
    });
  }, [selectedPHCs]);

  const diagCompare = useMemo(() => {
    if (selectedPHCs.length === 0) return [];
    const allDiag = new Set();
    selectedPHCs.forEach(p => Object.keys(p.diagnoses).forEach(d => allDiag.add(d)));
    const diagArr = [...allDiag];
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

  const METRICS = ['visits.total','visits.anc','deliveries','immunisations','staffCount','satisfactionScore','drugStockLevel','referrals'];
  const METRIC_LABELS = ['Total Visits','ANC','Deliveries','Immunisations','Staff','Satisfaction','Drug Stock','Referrals'];
  const METRIC_UNITS = ['','','','','','%','%',''];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-syne text-[22px] font-extrabold mb-1">PHC Comparison Tool</h2>
          <p className="font-dm text-[13px] text-text-muted">
            Select 2–4 facilities to compare performance side by side
          </p>
        </div>
        {selectedPHCs.length >= 2 && (
          <button
            onClick={() => setShowBrowser(v => !v)}
            className="glass px-4 py-2 text-xs font-medium text-cyan cursor-pointer flex items-center gap-2 hover:bg-cyan/10 transition-colors"
          >
            <Filter size={14} />
            {showBrowser ? 'Hide Selector' : 'Change Selection'}
          </button>
        )}
      </div>

      {/* ═══ Selected PHC Chips ═══ */}
      {selectedPHCs.length > 0 && (
        <div className="flex gap-2.5 flex-wrap items-center mb-4">
          {selectedPHCs.map((p, i) => (
            <div key={p.id}
              className="glass px-3.5 py-2 flex items-center gap-2.5 transition-all"
              style={{ borderLeft: `3px solid ${COMPARE_COLORS[i]}` }}
            >
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COMPARE_COLORS[i] }} />
              <div>
                <div className="font-dm font-semibold text-[12px] text-text-primary">{p.name}</div>
                <div className="text-[10px] text-text-muted">{p.state} &middot; {p.lga}</div>
              </div>
              <button onClick={() => togglePHC(p.id)} aria-label={`Remove ${p.name}`}
                className="bg-coral/10 border-none rounded-md p-1 cursor-pointer text-coral flex hover:bg-coral/20 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button onClick={() => setSelectedIds([])}
            className="bg-none border-none text-text-muted cursor-pointer text-[11px] underline hover:text-coral transition-colors"
          >Clear All</button>
          <span className="text-[11px] text-text-muted ml-auto">{selectedIds.length}/4 selected</span>
        </div>
      )}

      {/* ═══ PHC Browser Panel ═══ */}
      {showBrowser && (
        <div className="glass p-5 mb-6">
          {/* Filters Row */}
          <div className="flex gap-3 flex-wrap mb-4">
            <div className="flex-1 min-w-[160px] max-w-[220px]">
              <label className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-1 block">State</label>
              <div className="relative">
                <select
                  value={filterState}
                  onChange={e => { setFilterState(e.target.value); setFilterLGA('All'); }}
                  className="w-full py-2 px-3 pr-8 bg-bg/80 border border-border rounded-lg text-text-primary text-[13px] font-dm appearance-none cursor-pointer"
                >
                  <option value="All">All States</option>
                  {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>

            <div className="flex-1 min-w-[160px] max-w-[220px]">
              <label className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-1 block">LGA</label>
              <div className="relative">
                <select
                  value={filterLGA}
                  onChange={e => setFilterLGA(e.target.value)}
                  disabled={filterState === 'All'}
                  className="w-full py-2 px-3 pr-8 bg-bg/80 border border-border rounded-lg text-text-primary text-[13px] font-dm appearance-none cursor-pointer disabled:opacity-40"
                >
                  <option value="All">All LGAs</option>
                  {availableLGAs.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>

            <div className="flex-[2] min-w-[200px]">
              <label className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-1 block">Search</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  placeholder="Search by name, state, or LGA..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full py-2 pr-3 pl-8 bg-bg/80 border border-border rounded-lg text-text-primary text-[13px] font-dm"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-none border-none text-text-muted cursor-pointer flex p-0.5"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* PHC Grid */}
          <div className="text-[11px] text-text-muted mb-2">
            Showing {browsePHCs.length} facilities — click to select
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
            {browsePHCs.map(p => {
              const isSelected = selectedIds.includes(p.id);
              const isDisabled = !isSelected && selectedIds.length >= 4;
              return (
                <button
                  key={p.id}
                  onClick={() => !isDisabled && togglePHC(p.id)}
                  disabled={isDisabled}
                  className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan/8 border-cyan/40'
                      : isDisabled
                        ? 'bg-bg/40 border-border/40 opacity-40 cursor-not-allowed'
                        : 'bg-bg/60 border-border hover:border-cyan/30 hover:bg-cyan/[0.03]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-dm font-semibold text-[12px] text-text-primary truncate">{p.name}</div>
                      <div className="flex items-center gap-1 text-[10px] text-text-muted mt-0.5">
                        <MapPin size={9} />
                        <span className="truncate">{p.state} &middot; {p.lga}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: colorFor(p.id) }} />
                    )}
                  </div>
                  <div className="flex gap-3 mt-2">
                    <div className="flex items-center gap-1 text-[10px] text-text-muted">
                      <Activity size={9} className="text-cyan" />
                      <span>{p.visits.total.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-text-muted">
                      <Users size={9} className="text-purple" />
                      <span>{p.staffCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-text-muted">
                      <TrendingUp size={9} className="text-emerald" />
                      <span>{p.satisfactionScore}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      p.status === 'Active' ? 'bg-emerald' : p.status === 'Inactive' ? 'bg-coral' : 'bg-amber'
                    }`} />
                    <span className="text-[9px] text-text-muted">{p.status}</span>
                    <span className="text-[9px] text-text-muted ml-auto">Stock {p.drugStockLevel}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ Comparison Content ═══ */}
      {selectedPHCs.length >= 2 ? (
        <>
          {/* Summary Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {selectedPHCs.map((p, i) => (
              <div key={p.id} className="glass p-4" style={{ borderTop: `3px solid ${COMPARE_COLORS[i]}` }}>
                <div className="font-dm font-bold text-[13px] text-text-primary mb-0.5 truncate">{p.name}</div>
                <div className="text-[10px] text-text-muted mb-3">{p.state} &middot; {p.lga}</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-text-muted">Visits</div>
                    <div className="font-syne font-bold text-sm" style={{ color: COMPARE_COLORS[i] }}>
                      {p.visits.total.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-text-muted">Staff</div>
                    <div className="font-syne font-bold text-sm text-text-primary">{p.staffCount}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-text-muted">Satisfaction</div>
                    <div className="font-syne font-bold text-sm text-text-primary">{p.satisfactionScore}%</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-text-muted">Drug Stock</div>
                    <div className="font-syne font-bold text-sm text-text-primary">{p.drugStockLevel}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="charts-grid-2col">
            <ChartCard title="Monthly Visits Comparison" subtitle="Outpatient visits per facility — 12 months">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyCompare}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
                  <YAxis stroke={COLORS.textMuted} fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {selectedPHCs.map((p, i) => (
                    <Bar key={p.id} dataKey={p.name} fill={COMPARE_COLORS[i]} name={p.name} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Performance Radar" subtitle="Normalized scores (0–100) overlaid">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarCompare}>
                  <PolarGrid stroke={COLORS.border} />
                  <PolarAngleAxis dataKey="dim" stroke={COLORS.textMuted} fontSize={10} />
                  <PolarRadiusAxis domain={[0, 100]} stroke={COLORS.border} fontSize={9} />
                  {selectedPHCs.map((p, i) => (
                    <Radar key={p.id} name={p.name} dataKey={p.name} stroke={COMPARE_COLORS[i]} fill={COMPARE_COLORS[i]} fillOpacity={0.15} dot={{ r: 3, fill: COMPARE_COLORS[i] }} />
                  ))}
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Diagnosis Comparison" subtitle="Top 8 diagnoses across selected facilities">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={diagCompare} layout="vertical" margin={{ left: 90 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis type="number" stroke={COLORS.textMuted} fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke={COLORS.textMuted} fontSize={10} width={85} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {selectedPHCs.map((p, i) => (
                    <Bar key={p.id} dataKey={p.name} fill={COMPARE_COLORS[i]} name={p.name} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="12-Month Visit Trend" subtitle="Outpatient trend line per facility">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyCompare}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
                  <YAxis stroke={COLORS.textMuted} fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {selectedPHCs.map((p, i) => (
                    <Line key={p.id} type="monotone" dataKey={p.name} stroke={COMPARE_COLORS[i]} strokeWidth={2} dot={{ r: 3, fill: COMPARE_COLORS[i] }} name={p.name} />
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
                          style={{ color: COMPARE_COLORS[i] }}
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
                          {selectedPHCs.map((p) => {
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
                                {typeof v === 'number' ? v.toLocaleString() : v}{METRIC_UNITS[mi]}
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
        </>
      ) : (
        !showBrowser && (
          <div className="text-center p-15 text-text-muted">
            <GitCompare size={48} className="opacity-30 mb-4" />
            <p className="font-dm text-[15px]">Select at least 2 PHCs to begin comparison</p>
          </div>
        )
      )}

      {showBrowser && selectedPHCs.length < 2 && (
        <div className="text-center p-8 text-text-muted">
          <p className="font-dm text-[13px]">
            {selectedPHCs.length === 0
              ? 'Click on facilities above to select them for comparison'
              : 'Select at least one more facility to begin comparison'
            }
          </p>
        </div>
      )}
    </div>
  );
});

export default ComparePage;
