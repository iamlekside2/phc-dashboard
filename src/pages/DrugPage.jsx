import React, { useMemo, memo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, Treemap,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { COLORS, CHART_COLORS } from '../styles/theme';
import { DRUGS } from '../data/constants';
import { PHC_DATA, DRUG_TREND, DRUG_TREEMAP } from '../data/mockData';
import { formatNumber } from '../utils/helpers';
import ChartCard from '../components/ChartCard';
import CustomTooltip from '../components/CustomTooltip';

const DrugPage = memo(() => {
  const flatDrugTM = useMemo(() => {
    const items = [];
    DRUG_TREEMAP.forEach(cat => {
      cat.children.forEach(d => {
        items.push({ name: d.name, size: d.size, fill: d.fill });
      });
    });
    return items;
  }, []);

  const topDrugs = useMemo(() => {
    const agg = {};
    PHC_DATA.forEach(p => {
      DRUGS.forEach(d => { agg[d] = (agg[d] || 0) + (p.drugs[d] || 0); });
    });
    return DRUGS.map(d => ({ name: d, units: agg[d] * 30 })).sort((a, b) => b.units - a.units);
  }, []);

  return (
    <div>
      <h2 className="font-syne text-[22px] font-extrabold mb-1">Drug Dispensing Analytics</h2>
      <p className="font-dm text-[13px] text-text-muted mb-6">National drug dispensing trends and inventory</p>

      <div className="charts-grid-2col">
        <ChartCard title="Drug Dispensing Trend" subtitle="Monthly volumes by category">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={DRUG_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
              <YAxis stroke={COLORS.textMuted} fontSize={11} tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {['Antimalarials','Antibiotics','Antihypertensives','Vitamins'].map((d, i) => (
                <Area key={d} type="monotone" dataKey={d} stackId="1" stroke={CHART_COLORS[i]} fill={CHART_COLORS[i]} fillOpacity={0.3} name={d} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Drug Dispensing Treemap" subtitle="Proportional distribution by drug">
          <ResponsiveContainer width="100%" height={320}>
            <Treemap data={flatDrugTM} dataKey="size" stroke={COLORS.border}
              content={({ x, y, width, height, name, size, fill }) => {
                const show = width > 50 && height > 28;
                return (
                  <g>
                    <rect x={x} y={y} width={width} height={height} fill={fill} stroke={COLORS.border} strokeWidth={1} rx={4} opacity={0.8} />
                    {show && (
                      <>
                        <text x={x + width / 2} y={y + height / 2 - 5} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={600}>{name}</text>
                        <text x={x + width / 2} y={y + height / 2 + 9} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={9}>{formatNumber(size)}</text>
                      </>
                    )}
                  </g>
                );
              }}
            />
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top 15 Drugs Dispensed" subtitle="Units dispensed nationally" fullWidth>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={topDrugs} layout="vertical" margin={{ left: 140 }}>
              <defs>
                <linearGradient id="drugBarGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={COLORS.purple} />
                  <stop offset="100%" stopColor={COLORS.cyan} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis type="number" stroke={COLORS.textMuted} fontSize={11} tickFormatter={formatNumber} />
              <YAxis type="category" dataKey="name" stroke={COLORS.textMuted} fontSize={11} width={135} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="units" fill="url(#drugBarGrad)" radius={[0, 6, 6, 0]} name="Units" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
});

export default DrugPage;
