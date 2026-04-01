import { useMemo } from 'react';
import { COLORS, CHART_COLORS } from '../styles/theme';
import { DIAGNOSES, DRUGS, MONTHS, VACCINE_TYPES } from '../data/constants';
import { PHC_DATA } from '../data/mockData';

export default function useFilteredData(selectedState, selectedLGA) {
  return useMemo(() => {
    // Filter PHCs
    let phcs = PHC_DATA;
    if (selectedState && selectedState !== 'All')
      phcs = phcs.filter((p) => p.state === selectedState);
    if (selectedLGA && selectedLGA !== 'All')
      phcs = phcs.filter((p) => p.lga === selectedLGA);

    const scale = phcs.length > 0 ? 6247 / 200 : 0; // scale factor to represent ~6000 PHCs

    // ═══ KPI aggregates ═══
    const kpis = {
      totalPHCs: Math.round(phcs.length * scale),
      totalVisits: phcs.reduce((s, p) => s + p.visits.total, 0),
      ancVisits: phcs.reduce((s, p) => s + p.visits.anc, 0),
      deliveries: phcs.reduce((s, p) => s + p.deliveries, 0),
      immunisations: phcs.reduce((s, p) => s + p.immunisations, 0),
      referrals: phcs.reduce((s, p) => s + p.referrals, 0),
      staffCount: phcs.reduce((s, p) => s + p.staffCount, 0),
      avgSatisfaction: phcs.length
        ? Math.round(phcs.reduce((s, p) => s + p.satisfactionScore, 0) / phcs.length)
        : 0,
      avgDrugStock: phcs.length
        ? Math.round(phcs.reduce((s, p) => s + p.drugStockLevel, 0) / phcs.length)
        : 0,
    };

    // ═══ Monthly visits trend (aggregated from per-PHC monthly data) ═══
    const monthlyVisits = MONTHS.map((m, mi) => ({
      month: m,
      Outpatient: phcs.reduce((s, p) => s + (p.monthlyTrend[mi]?.outpatient || 0), 0),
      Inpatient: phcs.reduce((s, p) => s + (p.monthlyTrend[mi]?.inpatient || 0), 0),
      ANC: phcs.reduce((s, p) => s + (p.monthlyTrend[mi]?.anc || 0), 0),
    }));

    // ═══ Visit type breakdown ═══
    const visitTypes = [
      { name: 'Outpatient', value: phcs.reduce((s, p) => s + p.visits.outpatient, 0), fill: COLORS.cyan },
      { name: 'Inpatient', value: phcs.reduce((s, p) => s + p.visits.inpatient, 0), fill: COLORS.purple },
      { name: 'ANC', value: phcs.reduce((s, p) => s + p.visits.anc, 0), fill: COLORS.emerald },
    ];

    // ═══ Top diagnoses ═══
    const diagAgg = {};
    phcs.forEach((p) => {
      DIAGNOSES.forEach((d) => { diagAgg[d] = (diagAgg[d] || 0) + (p.diagnoses[d] || 0); });
    });
    const topDiagnoses = DIAGNOSES.map((d) => ({ name: d, cases: diagAgg[d] || 0 }))
      .sort((a, b) => b.cases - a.cases);

    // ═══ Top drugs ═══
    const drugAgg = {};
    phcs.forEach((p) => {
      DRUGS.forEach((d) => { drugAgg[d] = (drugAgg[d] || 0) + (p.drugs[d] || 0); });
    });
    const topDrugs = DRUGS.map((d) => ({ name: d, units: drugAgg[d] || 0 }))
      .sort((a, b) => b.units - a.units);

    // ═══ PHC Status breakdown ═══
    const statusCounts = { Active: 0, Inactive: 0, 'Reporting Issues': 0 };
    phcs.forEach((p) => { statusCounts[p.status] = (statusCounts[p.status] || 0) + 1; });
    const statusData = [
      { name: 'Active', value: Math.round(statusCounts.Active * scale), fill: COLORS.emerald },
      { name: 'Inactive', value: Math.round(statusCounts.Inactive * scale), fill: COLORS.coral },
      { name: 'Reporting Issues', value: Math.round(statusCounts['Reporting Issues'] * scale), fill: COLORS.amber },
    ];

    // ═══ Drug stock level distribution (histogram buckets) ═══
    const stockBuckets = [
      { range: '0–20%', min: 0, max: 20, count: 0, fill: COLORS.coral },
      { range: '21–40%', min: 21, max: 40, count: 0, fill: '#F97316' },
      { range: '41–60%', min: 41, max: 60, count: 0, fill: COLORS.amber },
      { range: '61–80%', min: 61, max: 80, count: 0, fill: COLORS.emerald },
      { range: '81–100%', min: 81, max: 100, count: 0, fill: COLORS.cyan },
    ];
    phcs.forEach((p) => {
      const bucket = stockBuckets.find((b) => p.drugStockLevel >= b.min && p.drugStockLevel <= b.max);
      if (bucket) bucket.count++;
    });
    const drugStockDist = stockBuckets.map((b) => ({
      range: b.range,
      PHCs: Math.round(b.count * scale),
      fill: b.fill,
    }));

    // ═══ Satisfaction distribution ═══
    const satBuckets = [
      { range: '0–25%', min: 0, max: 25, count: 0, fill: COLORS.coral },
      { range: '26–50%', min: 26, max: 50, count: 0, fill: COLORS.amber },
      { range: '51–75%', min: 51, max: 75, count: 0, fill: '#F97316' },
      { range: '76–100%', min: 76, max: 100, count: 0, fill: COLORS.emerald },
    ];
    phcs.forEach((p) => {
      const bucket = satBuckets.find((b) => p.satisfactionScore >= b.min && p.satisfactionScore <= b.max);
      if (bucket) bucket.count++;
    });
    const satisfactionDist = satBuckets.map((b) => ({
      range: b.range,
      PHCs: Math.round(b.count * scale),
      fill: b.fill,
    }));

    // ═══ Maternal health trend (ANC + Deliveries per month) ═══
    const maternalTrend = MONTHS.map((m, mi) => ({
      month: m,
      'ANC Visits': phcs.reduce((s, p) => s + (p.monthlyTrend[mi]?.anc || 0), 0),
      Deliveries: Math.round(phcs.reduce((s, p) => s + p.deliveries, 0) / 12 * (0.7 + Math.sin(mi * 0.5) * 0.3)),
    }));

    // ═══ Referrals per month (computed from PHC data) ═══
    const referralTrend = MONTHS.map((m, mi) => {
      const monthReferrals = Math.round(phcs.reduce((s, p) => s + p.referrals, 0) / 12 * (0.8 + Math.sin(mi * 0.6) * 0.2));
      return {
        month: m,
        Referrals: monthReferrals,
        'Follow-up %': Math.round(55 + Math.cos(mi * 0.4) * 15 + (phcs.length % 7)),
      };
    });

    // ═══ Immunisation by vaccine (scaled from filtered PHCs) ═══
    const immunData = MONTHS.map((m) => {
      const base = phcs.reduce((s, p) => s + p.immunisations, 0) / 12;
      const row = { month: m };
      VACCINE_TYPES.forEach((v, vi) => {
        row[v] = Math.round(base * (0.12 + vi * 0.03) * (0.8 + Math.random() * 0.4));
      });
      return row;
    });

    // ═══ Geographic ranking — states if national, LGAs if state selected ═══
    const geoKey = (selectedState && selectedState !== 'All') ? 'lga' : 'state';
    const geoAgg = {};
    phcs.forEach((p) => {
      geoAgg[p[geoKey]] = (geoAgg[p[geoKey]] || 0) + p.visits.total;
    });
    const stateRanking = Object.entries(geoAgg)
      .map(([state, visits]) => ({ state, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);

    // ═══ Weekly trend ═══
    const weeklyTrend = Array.from({ length: 13 }, (_, w) => ({
      week: `W${w + 1}`,
      Visits: phcs.reduce((s, p) => s + (p.weeklyTrend[w]?.visits || 0), 0),
    }));

    return {
      phcs,
      kpis,
      monthlyVisits,
      visitTypes,
      topDiagnoses,
      topDrugs,
      statusData,
      drugStockDist,
      satisfactionDist,
      maternalTrend,
      referralTrend,
      immunData,
      stateRanking,
      weeklyTrend,
    };
  }, [selectedState, selectedLGA]);
}
