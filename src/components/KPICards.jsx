import React, { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Users, Heart, Star, Syringe, ArrowUpRight, User, Package,
  TrendingUp, TrendingDown,
} from 'lucide-react';
import { COLORS } from '../styles/theme';
import { formatNumber } from '../utils/helpers';
import Skeleton from './Skeleton';
import Sparkline from './Sparkline';

const buildCards = (kpis) => [
  { label: 'Total PHCs', value: kpis.totalPHCs, change: 2.3, color: COLORS.cyan, icon: Building2, sparkline: [40,45,38,52,48,55,50] },
  { label: 'Total Visits', value: kpis.totalVisits, change: 8.1, color: COLORS.emerald, icon: Users, sparkline: [120,135,128,145,152,148,160] },
  { label: 'ANC Visits', value: kpis.ancVisits, change: 5.4, color: COLORS.purple, icon: Heart, sparkline: [22,25,23,28,26,30,29] },
  { label: 'Deliveries', value: kpis.deliveries, change: 3.7, color: COLORS.coral, icon: Star, sparkline: [3,4,3.5,4.2,3.8,4.5,4.1] },
  { label: 'Immunisations', value: kpis.immunisations, change: 12.5, color: COLORS.amber, icon: Syringe, sparkline: [60,68,65,72,75,78,82] },
  { label: 'Referrals', value: kpis.referrals, change: -2.1, color: '#3B82F6', icon: ArrowUpRight, sparkline: [2.1,2.0,1.9,2.2,2.0,1.8,1.9] },
  { label: 'Avg Satisfaction', value: `${kpis.avgSatisfaction}%`, change: 1.2, color: '#EC4899', icon: User, sparkline: [65,68,66,70,69,72,71] },
  { label: 'Drug Adequacy', value: `${kpis.avgDrugStock}%`, change: -3.4, color: '#14B8A6', icon: Package, sparkline: [78,76,75,74,73,72,73] },
];

const KPICards = memo(({ loading, kpis }) => {
  const cards = kpis ? buildCards(kpis) : [];

  return (
    <div className="kpi-scroll">
      {(loading ? Array.from({ length: 8 }, (_, i) => ({ label: `k${i}`, color: COLORS.cyan })) : cards).map((card, i) => {
        const Icon = card.icon;
        const isUp = card.change > 0;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="kpi-card glass relative overflow-hidden"
            style={{
              padding: '18px 20px',
              borderLeft: `3px solid ${card.color}`,
            }}
          >
            {loading ? (
              <div>
                <Skeleton height={14} width="60%" style={{ marginBottom: 8 }} />
                <Skeleton height={32} width="80%" style={{ marginBottom: 8 }} />
                <Skeleton height={12} width="40%" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                    style={{ background: `${card.color}15` }}
                  >
                    <Icon size={16} color={card.color} />
                  </div>
                  <span className="font-dm text-xs text-text-muted font-medium">
                    {card.label}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="glow-number text-[26px] leading-[1.1]" style={{ color: card.color }}>
                      {typeof card.value === 'number' ? formatNumber(card.value) : card.value}
                    </div>
                    <div className="flex items-center gap-1 mt-1.5">
                      {isUp ? (
                        <TrendingUp size={12} color={COLORS.emerald} />
                      ) : (
                        <TrendingDown size={12} color={COLORS.coral} />
                      )}
                      <span
                        className="text-xs font-semibold"
                        style={{ color: isUp ? COLORS.emerald : COLORS.coral }}
                      >
                        {isUp ? '+' : ''}{card.change}%
                      </span>
                      <span className="text-[11px] text-text-muted">vs last month</span>
                    </div>
                  </div>
                  <Sparkline data={card.sparkline} color={card.color} />
                </div>
              </>
            )}
          </motion.div>
        );
      })}
    </div>
  );
});

export default KPICards;
