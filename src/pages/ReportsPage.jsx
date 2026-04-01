import React, { useState, useContext, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  FileDown, Download, FileText, BarChart3, Pill, Syringe,
  Baby, Clock, CheckCircle2, ChevronDown,
} from 'lucide-react';
import { COLORS } from '../styles/theme';
import { NIGERIAN_STATES } from '../data/constants';
import { PHC_DATA } from '../data/mockData';
import AppContext from '../context/AppContext';
import useFilteredData from '../hooks/useFilteredData';

const REPORT_TYPES = [
  {
    id: 'national-summary',
    name: 'National Summary Report',
    description: 'Comprehensive overview of all PHC facilities including visits, staffing, and drug stock levels across Nigeria.',
    icon: BarChart3,
    color: COLORS.cyan,
  },
  {
    id: 'state-performance',
    name: 'State Performance Report',
    description: 'Detailed performance breakdown by state with ranking, visit trends, and satisfaction scores.',
    icon: FileText,
    color: COLORS.purple,
  },
  {
    id: 'drug-inventory',
    name: 'Drug Inventory Report',
    description: 'Drug dispensing volumes and stock levels across facilities with critical shortage alerts.',
    icon: Pill,
    color: COLORS.emerald,
  },
  {
    id: 'immunisation-coverage',
    name: 'Immunisation Coverage Report',
    description: 'Vaccine administration data by type, monthly trends, and facility-level coverage rates.',
    icon: Syringe,
    color: COLORS.amber,
  },
  {
    id: 'maternal-health',
    name: 'Maternal Health Report',
    description: 'ANC visits, deliveries, and maternal health indicators across selected facilities.',
    icon: Baby,
    color: COLORS.coral,
  },
  {
    id: 'facility-directory',
    name: 'Facility Directory Export',
    description: 'Complete listing of all PHC facilities with contact details, status, and key metrics.',
    icon: FileDown,
    color: '#3B82F6',
  },
];

function generateCSV(reportId, phcs, kpis, data) {
  switch (reportId) {
    case 'national-summary': {
      const header = ['Metric', 'Value'];
      const rows = [
        ['Total PHCs', kpis.totalPHCs],
        ['Total Visits', kpis.totalVisits],
        ['ANC Visits', kpis.ancVisits],
        ['Deliveries', kpis.deliveries],
        ['Immunisations', kpis.immunisations],
        ['Referrals', kpis.referrals],
        ['Staff Count', kpis.staffCount],
        ['Avg Satisfaction (%)', kpis.avgSatisfaction],
        ['Avg Drug Stock (%)', kpis.avgDrugStock],
        ['', ''],
        ['Monthly Visits Trend', ''],
        ['Month', 'Outpatient', 'Inpatient', 'ANC'],
        ...data.monthlyVisits.map(m => [m.month, m.Outpatient, m.Inpatient, m.ANC]),
        ['', ''],
        ['Facility Status', ''],
        ...data.statusData.map(s => [s.name, s.value]),
        ['', ''],
        ['Top Diagnoses', ''],
        ['Diagnosis', 'Cases'],
        ...data.topDiagnoses.map(d => [d.name, d.cases]),
      ];
      return [header, ...rows];
    }
    case 'state-performance': {
      const header = ['State', 'Total Visits'];
      const rows = data.stateRanking.map(s => [s.state, s.visits]);
      return [header, ...rows];
    }
    case 'drug-inventory': {
      const header = ['Drug', 'Units Dispensed'];
      const rows = data.topDrugs.map(d => [d.name, d.units]);
      const extra = [
        ['', ''],
        ['Drug Stock Distribution', ''],
        ['Range', 'PHCs'],
        ...data.drugStockDist.map(d => [d.range, d.PHCs]),
      ];
      return [header, ...rows, ...extra];
    }
    case 'immunisation-coverage': {
      const header = ['Month', ...Object.keys(data.immunData[0] || {}).filter(k => k !== 'month')];
      const rows = data.immunData.map(d => {
        const row = [d.month];
        header.slice(1).forEach(h => row.push(d[h] || 0));
        return row;
      });
      return [header, ...rows];
    }
    case 'maternal-health': {
      const header = ['Month', 'ANC Visits', 'Deliveries'];
      const rows = data.maternalTrend.map(m => [m.month, m['ANC Visits'], m.Deliveries]);
      return [header, ...rows];
    }
    case 'facility-directory': {
      const header = ['ID', 'Name', 'State', 'LGA', 'Ward', 'Type', 'Status', 'Total Visits', 'ANC', 'Deliveries', 'Immunisations', 'Staff', 'Satisfaction (%)', 'Drug Stock (%)'];
      const rows = phcs.map(p => [
        p.id, p.name, p.state, p.lga, p.ward, p.type, p.status,
        p.visits.total, p.visits.anc, p.deliveries, p.immunisations,
        p.staffCount, p.satisfactionScore, p.drugStockLevel,
      ]);
      return [header, ...rows];
    }
    default:
      return [['No data']];
  }
}

const ReportsPage = memo(() => {
  const { selectedState, selectedLGA } = useContext(AppContext);
  const data = useFilteredData(selectedState, selectedLGA);
  const [generating, setGenerating] = useState(null);
  const [generated, setGenerated] = useState([]);
  const [reportState, setReportState] = useState(selectedState || 'All');

  const reportPhcs = useMemo(() => {
    let list = PHC_DATA;
    if (reportState !== 'All') list = list.filter(p => p.state === reportState);
    return list;
  }, [reportState]);

  const reportData = useFilteredData(reportState, 'All');

  const handleGenerate = (reportId) => {
    setGenerating(reportId);
    // Simulate brief generation time
    setTimeout(() => {
      const csvRows = generateCSV(reportId, reportPhcs, reportData.kpis, reportData);
      const csv = csvRows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a');
      const report = REPORT_TYPES.find(r => r.id === reportId);
      a.download = `${report.name.replace(/\s+/g, '_')}_${reportState}_${new Date().toISOString().slice(0, 10)}.csv`;
      a.href = URL.createObjectURL(blob);
      a.click();
      URL.revokeObjectURL(a.href);
      setGenerating(null);
      setGenerated(prev => prev.includes(reportId) ? prev : [...prev, reportId]);
    }, 800);
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-syne text-[22px] font-extrabold mb-1">Reports Center</h2>
          <p className="font-dm text-[13px] text-text-muted">
            Generate and download formatted reports for PHC performance analysis
          </p>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-1 block">Report Scope</label>
          <div className="relative">
            <select
              value={reportState}
              onChange={e => setReportState(e.target.value)}
              className="py-2 px-3 pr-8 bg-bg/80 border border-border rounded-lg text-text-primary text-[13px] font-dm appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="All">All States (National)</option>
              {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="glass p-4 mb-6 flex gap-6 flex-wrap items-center">
        <div className="flex items-center gap-2 text-[12px] text-text-muted">
          <span className="font-semibold text-text-primary">{reportData.kpis.totalPHCs.toLocaleString()}</span> PHCs
        </div>
        <div className="flex items-center gap-2 text-[12px] text-text-muted">
          <span className="font-semibold text-text-primary">{reportData.kpis.totalVisits.toLocaleString()}</span> Total Visits
        </div>
        <div className="flex items-center gap-2 text-[12px] text-text-muted">
          <span className="font-semibold text-text-primary">{reportData.kpis.avgSatisfaction}%</span> Avg Satisfaction
        </div>
        <div className="flex items-center gap-2 text-[12px] text-text-muted">
          <span className="font-semibold text-text-primary">{reportData.kpis.avgDrugStock}%</span> Avg Drug Stock
        </div>
        <span className="text-[11px] text-text-muted ml-auto">
          Scope: <span className="text-cyan font-medium">{reportState === 'All' ? 'National' : reportState}</span>
        </span>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {REPORT_TYPES.map((report, idx) => {
          const Icon = report.icon;
          const isGenerating = generating === report.id;
          const wasGenerated = generated.includes(report.id);
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="glass p-5 flex flex-col"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: `${report.color}15` }}>
                  <Icon size={20} style={{ color: report.color }} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-syne text-[14px] font-bold text-text-primary mb-0.5">{report.name}</h3>
                  <p className="font-dm text-[11px] text-text-muted leading-relaxed">{report.description}</p>
                </div>
              </div>

              <div className="mt-auto pt-3 flex items-center justify-between">
                <span className="text-[10px] text-text-muted">
                  Format: CSV &middot; {reportState === 'All' ? 'National' : reportState}
                </span>
                <button
                  onClick={() => handleGenerate(report.id)}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold font-dm cursor-pointer border-none transition-all"
                  style={{
                    background: isGenerating ? `${report.color}20` : wasGenerated ? `${COLORS.emerald}15` : `${report.color}15`,
                    color: isGenerating ? report.color : wasGenerated ? COLORS.emerald : report.color,
                    opacity: isGenerating ? 0.7 : 1,
                  }}
                >
                  {isGenerating ? (
                    <>
                      <Clock size={13} className="animate-spin" /> Generating...
                    </>
                  ) : wasGenerated ? (
                    <>
                      <CheckCircle2 size={13} /> Download Again
                    </>
                  ) : (
                    <>
                      <Download size={13} /> Generate & Download
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent downloads */}
      {generated.length > 0 && (
        <div className="glass p-4 mt-6">
          <h4 className="font-syne text-[13px] font-bold mb-3 text-text-primary">Recent Downloads</h4>
          <div className="flex gap-2 flex-wrap">
            {generated.map(id => {
              const report = REPORT_TYPES.find(r => r.id === id);
              return (
                <div key={id} className="flex items-center gap-2 px-3 py-1.5 bg-emerald/8 border border-emerald/20 rounded-lg">
                  <CheckCircle2 size={12} className="text-emerald" />
                  <span className="text-[11px] text-text-primary font-dm">{report.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

export default ReportsPage;
