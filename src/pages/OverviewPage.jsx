import React, { useState, useEffect, useContext, memo } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { COLORS, CHART_COLORS } from '../styles/theme';
import { VACCINE_TYPES } from '../data/constants';
import { formatNumber } from '../utils/helpers';
import AppContext from '../context/AppContext';
import useFilteredData from '../hooks/useFilteredData';
import KPICards from '../components/KPICards';
import ChartCard from '../components/ChartCard';
import CustomTooltip from '../components/CustomTooltip';
import Skeleton from '../components/Skeleton';

const OverviewPage = memo(() => {
  const { selectedState, selectedLGA } = useContext(AppContext);
  const data = useFilteredData(selectedState, selectedLGA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const filterLabel = selectedState !== 'All'
    ? (selectedLGA !== 'All' ? `${selectedLGA}, ${selectedState}` : selectedState)
    : 'All States';

  if (loading) {
    return (
      <div>
        <KPICards loading={true} />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-5 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass p-5">
              <Skeleton height={18} width="50%" style={{ marginBottom: 12 }} />
              <Skeleton height={250} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalVisitsDonut = data.visitTypes.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      <KPICards loading={false} kpis={data.kpis} />

      <div className="charts-grid">
        {/* ═══ ROW 1: Visits + Disease + Visit Type ═══ */}
        <ChartCard
          title="Monthly Patient Visits"
          subtitle={`Outpatient, Inpatient & ANC across ${filterLabel} — 12 months`}
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.monthlyVisits}>
              <defs>
                <linearGradient id="colorOPD" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.cyan} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorIPD" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorANC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
              <YAxis stroke={COLORS.textMuted} fontSize={11} tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="Outpatient" stackId="1" stroke={COLORS.cyan} fill="url(#colorOPD)" />
              <Area type="monotone" dataKey="Inpatient" stackId="1" stroke={COLORS.purple} fill="url(#colorIPD)" />
              <Area type="monotone" dataKey="ANC" stackId="1" stroke={COLORS.emerald} fill="url(#colorANC)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Top Diagnoses"
          subtitle={`Case count across ${data.phcs.length} PHCs in ${filterLabel}`}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.topDiagnoses.slice(0, 10)} layout="vertical" margin={{ left: 100 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={COLORS.cyan} />
                  <stop offset="100%" stopColor={COLORS.purple} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis type="number" stroke={COLORS.textMuted} fontSize={11} tickFormatter={formatNumber} />
              <YAxis type="category" dataKey="name" stroke={COLORS.textMuted} fontSize={11} width={95} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cases" fill="url(#barGrad)" radius={[0, 6, 6, 0]} name="Cases" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Visit Type Breakdown" subtitle={`Service distribution — ${filterLabel}`}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.visitTypes} cx="50%" cy="45%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" animationBegin={0} animationDuration={800}>
                {data.visitTypes.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <text x="50%" y="42%" textAnchor="middle" fill={COLORS.textPrimary} style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20 }}>
                {formatNumber(totalVisitsDonut)}
              </text>
              <text x="50%" y="52%" textAnchor="middle" fill={COLORS.textMuted} style={{ fontFamily: 'DM Sans', fontSize: 11 }}>
                Total Visits
              </text>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ═══ ROW 2: Facility Status + Drug Stock + Satisfaction ═══ */}
        <ChartCard
          title="Facility Status"
          subtitle={`${data.kpis.totalPHCs.toLocaleString()} PHCs — operational readiness`}
        >
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.statusData} cx="50%" cy="45%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" animationDuration={800}>
                {data.statusData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <text x="50%" y="42%" textAnchor="middle" fill={COLORS.textPrimary} style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18 }}>
                {data.statusData[0].value.toLocaleString()}
              </text>
              <text x="50%" y="52%" textAnchor="middle" fill={COLORS.emerald} style={{ fontFamily: 'DM Sans', fontSize: 11 }}>
                Active
              </text>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Drug Stock Level Distribution"
          subtitle="How many PHCs fall in each stock adequacy range"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.drugStockDist}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="range" stroke={COLORS.textMuted} fontSize={11} />
              <YAxis stroke={COLORS.textMuted} fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="PHCs" radius={[6, 6, 0, 0]} name="Number of PHCs">
                {data.drugStockDist.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Patient Satisfaction Scores"
          subtitle="PHC count by satisfaction rating bracket"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.satisfactionDist}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="range" stroke={COLORS.textMuted} fontSize={11} />
              <YAxis stroke={COLORS.textMuted} fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="PHCs" radius={[6, 6, 0, 0]} name="Number of PHCs">
                {data.satisfactionDist.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ═══ ROW 3: Maternal Health + Referrals + Immunisation ═══ */}
        <ChartCard
          title="Maternal Health Trend"
          subtitle="Monthly ANC visits vs deliveries — tracking safe motherhood"
        >
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data.maternalTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
              <YAxis yAxisId="left" stroke={COLORS.purple} fontSize={11} tickFormatter={formatNumber} />
              <YAxis yAxisId="right" orientation="right" stroke={COLORS.coral} fontSize={11} tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area yAxisId="left" type="monotone" dataKey="ANC Visits" stroke={COLORS.purple} fill={COLORS.purple} fillOpacity={0.15} />
              <Line yAxisId="right" type="monotone" dataKey="Deliveries" stroke={COLORS.coral} strokeWidth={2} dot={{ r: 3, fill: COLORS.coral }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Referrals & Follow-up"
          subtitle="Are referred patients completing their care journey?"
        >
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data.referralTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
              <YAxis yAxisId="left" stroke={COLORS.amber} fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke={COLORS.cyan} fontSize={11} domain={[0, 100]} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="Referrals" fill={COLORS.amber} radius={[4, 4, 0, 0]} opacity={0.8} />
              <Line yAxisId="right" type="monotone" dataKey="Follow-up %" stroke={COLORS.cyan} strokeWidth={2} dot={{ r: 3, fill: COLORS.cyan }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Immunisation Coverage"
          subtitle="Monthly vaccinations by type — all age groups"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.immunData}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
              <YAxis stroke={COLORS.textMuted} fontSize={11} tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {VACCINE_TYPES.map((v, i) => (
                <Bar key={v} dataKey={v} stackId="a" fill={CHART_COLORS[i]} name={v} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ═══ ROW 4: State Ranking (full width) ═══ */}
        {data.stateRanking.length > 1 && (
          <ChartCard
            title={selectedState !== 'All' ? `LGA Ranking — ${selectedState}` : 'Top States by Patient Visits'}
            subtitle={selectedState !== 'All' ? 'Aggregated visits by Local Government Area' : 'Which states drive the most healthcare demand?'}
            fullWidth
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data.stateRanking} layout="vertical" margin={{ left: 90 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis type="number" stroke={COLORS.textMuted} fontSize={11} tickFormatter={formatNumber} />
                <YAxis type="category" dataKey="state" stroke={COLORS.textMuted} fontSize={12} width={85} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="visits" name="Total Visits" radius={[0, 8, 8, 0]}>
                  {data.stateRanking.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* ═══ ROW 5: Weekly Trend + Top Drugs ═══ */}
        <ChartCard
          title="Weekly Visit Volume"
          subtitle="Current quarter trend — 13 weeks"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.weeklyTrend}>
              <defs>
                <linearGradient id="weeklyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.cyan} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="week" stroke={COLORS.textMuted} fontSize={11} />
              <YAxis stroke={COLORS.textMuted} fontSize={11} tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={data.weeklyTrend.reduce((s, d) => s + d.Visits, 0) / 13}
                stroke={COLORS.textMuted}
                strokeDasharray="5 5"
                label={{ value: 'Avg', fill: COLORS.textMuted, fontSize: 10, position: 'right' }}
              />
              <Area type="monotone" dataKey="Visits" stroke={COLORS.cyan} fill="url(#weeklyGrad)" strokeWidth={2} dot={{ r: 3, fill: COLORS.cyan }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Top Drugs Dispensed"
          subtitle={`Most prescribed medications — ${filterLabel}`}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.topDrugs.slice(0, 10)} layout="vertical" margin={{ left: 120 }}>
              <defs>
                <linearGradient id="drugBarGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={COLORS.purple} />
                  <stop offset="100%" stopColor={COLORS.cyan} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis type="number" stroke={COLORS.textMuted} fontSize={11} tickFormatter={formatNumber} />
              <YAxis type="category" dataKey="name" stroke={COLORS.textMuted} fontSize={10} width={115} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="units" fill="url(#drugBarGrad)" radius={[0, 6, 6, 0]} name="Units Dispensed" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
});

export default OverviewPage;
