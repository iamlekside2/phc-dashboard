import React, { useMemo, memo } from 'react';
import {
  LineChart, Line, PieChart, Pie, Cell, Treemap,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { COLORS, CHART_COLORS } from '../styles/theme';
import { DIAGNOSES, MONTHS } from '../data/constants';
import { DISEASE_TREEMAP, DISEASE_MONTH_MATRIX, EPIDEMIC_DATA, AGE_DISTRIBUTION } from '../data/mockData';
import { formatNumber } from '../utils/helpers';
import ChartCard from '../components/ChartCard';
import CustomTooltip from '../components/CustomTooltip';
import { AlertTriangle } from 'lucide-react';

const DiagnosticsPage = memo(() => {
  const flatDiseaseTM = useMemo(() => {
    const items = [];
    DISEASE_TREEMAP.forEach(cat => {
      cat.children.forEach(d => {
        items.push({ name: d.name, size: d.size, fill: d.fill, category: cat.name });
      });
    });
    return items;
  }, []);

  const choleraAlert = EPIDEMIC_DATA.some(d => d.Cholera > 340);
  const meningitisAlert = EPIDEMIC_DATA.some(d => d.Meningitis > 170);

  return (
    <div>
      <h2 className="font-syne text-[22px] font-extrabold mb-1">Diagnostics Intelligence</h2>
      <p className="font-dm text-[13px] text-text-muted mb-6">Disease surveillance and diagnostic analytics</p>

      <div className="charts-grid-2col">
        <ChartCard title="Disease Burden by Category" subtitle="Treemap — larger blocks indicate more cases">
          <ResponsiveContainer width="100%" height={320}>
            <Treemap
              data={flatDiseaseTM}
              dataKey="size"
              stroke={COLORS.border}
              content={({ x, y, width, height, name, size, fill }) => {
                const show = width > 45 && height > 25;
                return (
                  <g>
                    <rect x={x} y={y} width={width} height={height} fill={fill} stroke={COLORS.border} strokeWidth={1} rx={4} opacity={0.8} />
                    {show && (
                      <>
                        <text x={x + width / 2} y={y + height / 2 - 5} textAnchor="middle" fill="#fff" fontSize={10} fontFamily="DM Sans" fontWeight={600}>{name}</text>
                        <text x={x + width / 2} y={y + height / 2 + 9} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={9}>{formatNumber(size)}</text>
                      </>
                    )}
                  </g>
                );
              }}
            />
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Disease × Month Heatmap" subtitle="Intensity matrix — darker = more cases">
          <div className="overflow-x-auto">
            <div style={{ display: 'grid', gridTemplateColumns: '140px repeat(12, 36px)', gap: 2 }}>
              <div />
              {MONTHS.map(m => (
                <div key={m} className="text-center text-[9px] text-text-muted py-1">{m}</div>
              ))}
              {DISEASE_MONTH_MATRIX.map(row => (
                <React.Fragment key={row.disease}>
                  <div className="text-[10px] text-text-muted flex items-center pr-1.5 whitespace-nowrap">{row.disease}</div>
                  {row.months.map((val, mi) => {
                    const intensity = val / 100;
                    return (
                      <div
                        key={mi}
                        title={`${row.disease} — ${MONTHS[mi]}: ${val}`}
                        className="w-9 h-[22px] rounded-[3px] cursor-pointer"
                        style={{
                          background: intensity < 0.3 ? COLORS.border : intensity < 0.6 ? 'rgba(0,212,255,0.3)' : `rgba(0,212,255,${0.4 + intensity * 0.6})`,
                        }}
                      />
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Epidemic Alert Tracker" subtitle={
          <span>
            Flagged diseases monitored against thresholds
            {(choleraAlert || meningitisAlert) && (
              <span className="text-coral ml-2 font-semibold">
                <AlertTriangle size={12} className="align-middle mr-1 inline" />
                Alert Active
              </span>
            )}
          </span>
        }>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={EPIDEMIC_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
              <YAxis stroke={COLORS.textMuted} fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={340} stroke={COLORS.coral} strokeDasharray="5 5" label={{ value: 'Cholera Threshold', fill: COLORS.coral, fontSize: 10 }} />
              <ReferenceLine y={170} stroke={COLORS.amber} strokeDasharray="5 5" label={{ value: 'Meningitis Threshold', fill: COLORS.amber, fontSize: 10 }} />
              <Line type="monotone" dataKey="Cholera" stroke={COLORS.coral} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Meningitis" stroke={COLORS.amber} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Monkeypox" stroke={COLORS.purple} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Age Group Distribution" subtitle="Patient demographics across all PHCs">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={AGE_DISTRIBUTION}
                cx="50%" cy="45%"
                outerRadius={90}
                dataKey="value"
                animationBegin={0} animationDuration={800}
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {AGE_DISTRIBUTION.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
});

export default DiagnosticsPage;
