import React, { useState, useMemo, memo } from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { COLORS } from '../styles/theme';
import { NIGERIAN_STATES, LGAS_BY_STATE } from '../data/constants';
import { PHC_DATA } from '../data/mockData';
import { NAV_ITEMS } from './Sidebar';

const HeaderBar = memo(
  ({ activePage, selectedState, setSelectedState, selectedLGA, setSelectedLGA, onToggleSidebar }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const searchResults = useMemo(() => {
      if (!searchQuery || searchQuery.length < 2) return [];
      const q = searchQuery.toLowerCase();
      return PHC_DATA.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.lga.toLowerCase().includes(q)
      ).slice(0, 6);
    }, [searchQuery]);

    const lgas = useMemo(
      () => (selectedState && selectedState !== 'All' ? LGAS_BY_STATE[selectedState] || [] : []),
      [selectedState]
    );

    const breadcrumb = NAV_ITEMS.find((n) => n.key === activePage)?.label || 'Overview';

    return (
      <div
        className="header-bar sticky top-0 z-50 bg-bg/95 backdrop-blur-[20px] border-b border-border px-6 py-3"
      >
        <button
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
          className="bg-transparent border-none text-text-muted cursor-pointer flex p-1 shrink-0"
        >
          <Menu size={20} />
        </button>

        <div className="font-dm header-breadcrumb text-sm text-text-muted whitespace-nowrap shrink-0">
          Dashboard / <span className="text-text-primary">{breadcrumb}</span>
        </div>

        <div className="header-search relative mx-auto">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              placeholder="Search PHC by name, state, or LGA..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              className="w-full py-2.5 pr-3 pl-9 bg-card/60 border border-border rounded-xl text-text-primary text-[13px] font-dm"
            />
          </div>
          {showSearch && searchResults.length > 0 && (
            <div
              className="glass absolute top-full left-0 right-0 mt-1 py-2 max-h-[300px] overflow-y-auto z-100"
            >
              {searchResults.map((p) => (
                <div
                  key={p.id}
                  className="px-4 py-2.5 cursor-pointer text-[13px] border-b border-border/[0.12]"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div className="text-text-primary font-medium">{p.name}</div>
                  <div className="text-text-muted text-[11px]">{p.state} · {p.lga}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="header-right">
          <select
            value={selectedState}
            onChange={(e) => { setSelectedState(e.target.value); setSelectedLGA('All'); }}
            className="px-2.5 py-2 bg-card/90 border border-border rounded-[10px] text-text-primary text-[13px] font-dm cursor-pointer"
          >
            <option value="All">All States</option>
            {NIGERIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {lgas.length > 0 && (
            <select
              value={selectedLGA}
              onChange={(e) => setSelectedLGA(e.target.value)}
              className="px-2.5 py-2 bg-card/90 border border-border rounded-[10px] text-text-primary text-[13px] font-dm cursor-pointer"
            >
              <option value="All">All LGAs</option>
              {lgas.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          )}

          <div className="relative shrink-0">
            <button
              aria-label="Notifications"
              className="bg-transparent border-none text-text-muted cursor-pointer flex p-1.5"
            >
              <Bell size={20} />
            </button>
            <span
              className="absolute top-0 right-0 w-4 h-4 rounded-full bg-amber text-[10px] font-bold text-black flex items-center justify-center"
            >
              3
            </span>
          </div>

          <div
            className="w-[34px] h-[34px] rounded-full shrink-0 flex items-center justify-center text-[13px] font-bold text-white font-syne"
            style={{ background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.purple})` }}
          >
            DA
          </div>
        </div>
      </div>
    );
  }
);

export default HeaderBar;
