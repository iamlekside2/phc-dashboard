import React, { useState, useMemo, useContext, memo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, FileDown, X } from 'lucide-react';
import { COLORS } from '../styles/theme';
import { PHC_DATA } from '../data/mockData';
import AppContext from '../context/AppContext';
import CustomTooltip from '../components/CustomTooltip';

const DirectoryPage = memo(() => {
  const { selectedState, selectedLGA } = useContext(AppContext);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('visits.total');
  const [sortDir, setSortDir] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('All');
  const [minVisits, setMinVisits] = useState(0);
  const [minSatisfaction, setMinSatisfaction] = useState(0);
  const [selectedPHC, setSelectedPHC] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const perPage = 50;

  const filtered = useMemo(() => {
    let result = [...PHC_DATA];
    if (selectedState && selectedState !== 'All') result = result.filter(p => p.state === selectedState);
    if (selectedLGA && selectedLGA !== 'All') result = result.filter(p => p.lga === selectedLGA);
    if (statusFilter !== 'All') result = result.filter(p => p.status === statusFilter);
    if (minVisits > 0) result = result.filter(p => p.visits.total >= minVisits);
    if (minSatisfaction > 0) result = result.filter(p => p.satisfactionScore >= minSatisfaction);

    const getVal = (obj, key) => key.split('.').reduce((o, k) => o?.[k], obj);
    result.sort((a, b) => {
      const av = getVal(a, sortKey) ?? 0;
      const bv = getVal(b, sortKey) ?? 0;
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return result;
  }, [selectedState, selectedLGA, statusFilter, minVisits, minSatisfaction, sortKey, sortDir]);

  const scaledCount = Math.round((filtered.length / 200) * 6000);
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const thClass = 'px-3.5 py-3 text-left text-xs font-semibold text-text-muted cursor-pointer whitespace-nowrap border-b border-border font-dm select-none';
  const tdClass = 'px-3.5 py-3 text-[13px] border-b border-border/[0.125] text-text-primary';

  const SortIndicator = ({ field }) => {
    if (sortKey !== field) return null;
    return <span className="ml-1 text-[10px]">{sortDir === 'asc' ? '\u25B2' : '\u25BC'}</span>;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-syne text-[22px] font-extrabold m-0">PHC Directory</h2>
          <p className="font-dm text-[13px] text-text-muted mt-1 mb-0">
            Showing <span className="text-cyan font-semibold">{filtered.length}</span> of <span className="text-cyan">{scaledCount.toLocaleString()}</span> PHCs
          </p>
        </div>
        <div className="flex gap-2.5">
          <button onClick={() => setShowFilters(!showFilters)}
            className="glass px-[18px] py-2.5 border border-border text-text-primary cursor-pointer rounded-xl text-[13px] font-dm flex items-center gap-1.5"
          >
            <Filter size={14} /> Filters
          </button>
          <button onClick={() => {
              const headers = ['Name','State','LGA','Ward','Type','Status','Total Visits','Outpatient','Inpatient','ANC','Deliveries','Immunisations','Referrals','Staff','Satisfaction (%)','Drug Stock (%)'];
              const rows = filtered.map(p => [
                p.name, p.state, p.lga, p.ward, p.type, p.status,
                p.visits.total, p.visits.outpatient, p.visits.inpatient, p.visits.anc,
                p.deliveries, p.immunisations, p.referrals, p.staffCount,
                p.satisfactionScore, p.drugStockLevel,
              ]);
              const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const a = document.createElement('a');
              a.download = `PHC_Directory_${selectedState || 'All'}.csv`;
              a.href = URL.createObjectURL(blob);
              a.click();
              URL.revokeObjectURL(a.href);
            }}
            className="btn-glow px-[18px] py-2.5 border-none rounded-xl text-[13px] font-semibold cursor-pointer font-dm flex items-center gap-1.5"
            style={{ background: COLORS.cyan, color: '#060B18' }}
          >
            <FileDown size={14} /> Export CSV
          </button>
        </div>
      </div>

      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="glass p-5 mb-5 flex gap-4 items-end flex-wrap"
        >
          <div>
            <label className="font-dm text-[11px] text-text-muted block mb-1">Status</label>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 bg-[rgba(6,11,24,0.8)] border border-border rounded-lg text-text-primary text-[13px] font-dm"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Reporting Issues">Reporting Issues</option>
            </select>
          </div>
          <div>
            <label className="font-dm text-[11px] text-text-muted block mb-1">Min Visits: {minVisits}</label>
            <input type="range" min={0} max={20000} step={500} value={minVisits}
              onChange={e => { setMinVisits(+e.target.value); setPage(1); }}
              className="w-[140px]" style={{ accentColor: COLORS.cyan }}
            />
          </div>
          <div>
            <label className="font-dm text-[11px] text-text-muted block mb-1">Min Satisfaction: {minSatisfaction}%</label>
            <input type="range" min={0} max={100} step={5} value={minSatisfaction}
              onChange={e => { setMinSatisfaction(+e.target.value); setPage(1); }}
              className="w-[140px]" style={{ accentColor: COLORS.cyan }}
            />
          </div>
          <button onClick={() => { setStatusFilter('All'); setMinVisits(0); setMinSatisfaction(0); setPage(1); }}
            className="px-4 py-2 bg-transparent border border-border rounded-lg text-text-muted cursor-pointer text-xs font-dm"
          >Clear All</button>
        </motion.div>
      )}

      <div className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr>
                <th className={thClass} onClick={() => toggleSort('name')}>PHC Name<SortIndicator field="name" /></th>
                <th className={thClass} onClick={() => toggleSort('state')}>State<SortIndicator field="state" /></th>
                <th className={thClass} onClick={() => toggleSort('lga')}>LGA<SortIndicator field="lga" /></th>
                <th className={thClass} onClick={() => toggleSort('visits.total')}>Total Visits<SortIndicator field="visits.total" /></th>
                <th className={thClass} onClick={() => toggleSort('visits.anc')}>ANC<SortIndicator field="visits.anc" /></th>
                <th className={thClass} onClick={() => toggleSort('deliveries')}>Deliveries<SortIndicator field="deliveries" /></th>
                <th className={thClass} onClick={() => toggleSort('satisfactionScore')}>Satisfaction<SortIndicator field="satisfactionScore" /></th>
                <th className={thClass} onClick={() => toggleSort('drugStockLevel')}>Drug Stock<SortIndicator field="drugStockLevel" /></th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map(p => {
                const satColor = p.satisfactionScore < 50 ? COLORS.coral : p.satisfactionScore < 75 ? COLORS.amber : COLORS.emerald;
                const drugColor = p.drugStockLevel < 30 ? COLORS.coral : p.drugStockLevel < 70 ? COLORS.amber : COLORS.emerald;
                const statusColor = p.status === 'Active' ? COLORS.emerald : p.status === 'Inactive' ? COLORS.coral : COLORS.amber;
                return (
                  <tr key={p.id} className="cursor-pointer transition-colors duration-200"
                    onClick={() => setSelectedPHC(p)}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className={`${tdClass} font-medium`}>{p.name}</td>
                    <td className={tdClass}>{p.state}</td>
                    <td className={tdClass}>{p.lga}</td>
                    <td className={tdClass}>{p.visits.total.toLocaleString()}</td>
                    <td className={tdClass}>{p.visits.anc.toLocaleString()}</td>
                    <td className={tdClass}>{p.deliveries.toLocaleString()}</td>
                    <td className={`${tdClass} font-semibold`} style={{ color: satColor }}>{p.satisfactionScore}%</td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-border rounded-sm overflow-hidden max-w-[60px]">
                          <div className="h-full rounded-sm" style={{ width: `${p.drugStockLevel}%`, background: drugColor }} />
                        </div>
                        <span className="text-xs" style={{ color: drugColor }}>{p.drugStockLevel}%</span>
                      </div>
                    </td>
                    <td className={tdClass}>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{
                        background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30`,
                        boxShadow: `0 0 8px ${statusColor}20`,
                      }}>{p.status}</span>
                    </td>
                    <td className={tdClass}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedPHC(p); }}
                        className="px-3.5 py-1.5 bg-[rgba(0,212,255,0.1)] rounded-lg text-cyan cursor-pointer text-xs font-dm"
                        style={{ border: `1px solid ${COLORS.cyan}30` }}
                      >View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center px-5 py-4 border-t border-border">
          <span className="font-dm text-[13px] text-text-muted">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-1.5">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{
              padding: '6px 12px', background: page <= 1 ? COLORS.border : 'rgba(0,212,255,0.1)',
              border: `1px solid ${COLORS.border}`, borderRadius: 8,
              color: page <= 1 ? COLORS.textMuted : COLORS.cyan, cursor: page <= 1 ? 'not-allowed' : 'pointer', fontSize: 12,
            }}>Prev</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pn = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              if (pn > totalPages) return null;
              return (
                <button key={pn} onClick={() => setPage(pn)} style={{
                  padding: '6px 12px', background: pn === page ? COLORS.cyan : 'rgba(0,212,255,0.05)',
                  border: `1px solid ${pn === page ? COLORS.cyan : COLORS.border}`, borderRadius: 8,
                  color: pn === page ? '#060B18' : COLORS.textMuted, cursor: 'pointer', fontSize: 12, fontWeight: pn === page ? 700 : 400,
                }}>{pn}</button>
              );
            })}
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{
              padding: '6px 12px', background: page >= totalPages ? COLORS.border : 'rgba(0,212,255,0.1)',
              border: `1px solid ${COLORS.border}`, borderRadius: 8,
              color: page >= totalPages ? COLORS.textMuted : COLORS.cyan, cursor: page >= totalPages ? 'not-allowed' : 'pointer', fontSize: 12,
            }}>Next</button>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedPHC && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedPHC(null)}
              className="fixed inset-0 bg-black/50 z-[99]"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-[420px] h-screen bg-card border-l border-border z-[100] overflow-y-auto p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-syne text-lg font-extrabold m-0">{selectedPHC.name}</h3>
                  <p className="font-dm text-[13px] text-text-muted my-1">{selectedPHC.state} · {selectedPHC.lga}</p>
                  <span className="px-2.5 py-[3px] rounded-xl text-[11px] font-medium"
                    style={{ background: `${COLORS.purple}20`, color: COLORS.purple }}
                  >{selectedPHC.type}</span>
                </div>
                <button aria-label="Close panel" onClick={() => setSelectedPHC(null)}
                  className="bg-white/5 border-none rounded-lg p-2 cursor-pointer text-text-muted flex"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mini KPIs */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {[
                  { label: 'Visits', value: selectedPHC.visits.total, color: COLORS.cyan },
                  { label: 'ANC', value: selectedPHC.visits.anc, color: COLORS.purple },
                  { label: 'Staff', value: selectedPHC.staffCount, color: COLORS.emerald },
                  { label: 'Satisfaction', value: `${selectedPHC.satisfactionScore}%`, color: COLORS.amber },
                ].map(k => (
                  <div key={k.label} className="glass px-3.5 py-3" style={{ borderLeft: `3px solid ${k.color}` }}>
                    <div className="font-dm text-[11px] text-text-muted">{k.label}</div>
                    <div className="glow-number text-xl" style={{ color: k.color }}>{typeof k.value === 'number' ? k.value.toLocaleString() : k.value}</div>
                  </div>
                ))}
              </div>

              {/* PHC trend chart */}
              <div className="glass p-4 mb-4">
                <h4 className="font-syne text-[13px] font-bold mb-2">12-Month Visit Trend</h4>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={selectedPHC.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={10} />
                    <YAxis stroke={COLORS.textMuted} fontSize={10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="outpatient" stroke={COLORS.cyan} strokeWidth={2} dot={false} name="OPD" />
                    <Line type="monotone" dataKey="anc" stroke={COLORS.emerald} strokeWidth={2} dot={false} name="ANC" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* PHC visit type donut */}
              <div className="glass p-4 mb-4">
                <h4 className="font-syne text-[13px] font-bold mb-2">Visit Breakdown</h4>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={[
                      { name: 'OPD', value: selectedPHC.visits.outpatient, fill: COLORS.cyan },
                      { name: 'IPD', value: selectedPHC.visits.inpatient, fill: COLORS.purple },
                      { name: 'ANC', value: selectedPHC.visits.anc, fill: COLORS.emerald },
                    ]} innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                      {[COLORS.cyan, COLORS.purple, COLORS.emerald].map((c, i) => <Cell key={i} fill={c} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top 8 diagnoses */}
              <div className="glass p-4 mb-4">
                <h4 className="font-syne text-[13px] font-bold mb-2">Top 8 Diagnoses</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={Object.entries(selectedPHC.diagnoses).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }))}
                    layout="vertical" margin={{ left: 90 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis type="number" stroke={COLORS.textMuted} fontSize={10} />
                    <YAxis type="category" dataKey="name" stroke={COLORS.textMuted} fontSize={10} width={85} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill={COLORS.cyan} radius={[0, 4, 4, 0]} name="Cases" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top 8 drugs */}
              <div className="glass p-4">
                <h4 className="font-syne text-[13px] font-bold mb-2">Top 8 Drugs</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={Object.entries(selectedPHC.drugs).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }))}
                    layout="vertical" margin={{ left: 100 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis type="number" stroke={COLORS.textMuted} fontSize={10} />
                    <YAxis type="category" dataKey="name" stroke={COLORS.textMuted} fontSize={10} width={95} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill={COLORS.purple} radius={[0, 4, 4, 0]} name="Units" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

export default DirectoryPage;
