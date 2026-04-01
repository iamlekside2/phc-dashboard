import React, { memo } from 'react';
import {
  LayoutDashboard, Building2, Activity, Pill, GitCompare, FileDown,
  Menu, LogOut,
} from 'lucide-react';

export const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'directory', label: 'PHC Directory', icon: Building2 },
  { key: 'diagnostics', label: 'Diagnostics', icon: Activity },
  { key: 'drugs', label: 'Drug Dispensing', icon: Pill },
  { key: 'compare', label: 'Compare PHCs', icon: GitCompare },
  { key: 'reports', label: 'Reports', icon: FileDown },
];

const Sidebar = memo(({ collapsed, activePage, onNavigate, onLogout, onToggle, mobileOpen }) => (
  <>
    {/* Mobile overlay */}
    {mobileOpen && (
      <div
        className="sidebar-overlay fixed inset-0 bg-black/50 z-[59] hidden"
        onClick={onToggle}
      />
    )}
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`sidebar-nav fixed top-0 left-0 h-screen bg-sidebar border-r border-border transition-all duration-300 ease-in-out flex flex-col z-60 overflow-hidden${mobileOpen ? ' sidebar-open' : ''}`}
      style={{ width: collapsed ? 60 : 240 }}
    >
      <div
        className={`border-b border-border flex items-center ${
          collapsed ? 'px-3 py-4 justify-center' : 'px-5 py-4 justify-between'
        }`}
      >
        {!collapsed && (
          <span className="syne sidebar-brand text-lg font-extrabold text-cyan">
            PHC Hub
          </span>
        )}
        <button
          aria-label="Toggle sidebar"
          onClick={onToggle}
          className="bg-transparent border-none text-text-muted cursor-pointer p-1 flex"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex-1 py-3 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const active = activePage === key;
          return (
            <button
              key={key}
              tabIndex={0}
              className={`sidebar-btn flex items-center gap-3 w-full text-sm font-dm border-none cursor-pointer transition-all duration-200 ease-in-out ${
                collapsed ? 'py-3 px-0 justify-center' : 'py-3 px-5 justify-start'
              } ${
                active
                  ? 'bg-cyan/[0.08] border-l-3 border-l-cyan text-cyan font-semibold'
                  : 'border-l-3 border-l-transparent text-text-muted font-normal'
              }`}
              onClick={() => onNavigate(key)}
              aria-label={label}
            >
              <Icon size={20} />
              {!collapsed && <span className="sidebar-label">{label}</span>}
            </button>
          );
        })}
      </div>

      <div
        className={`sidebar-user border-t border-border flex items-center gap-3 ${
          collapsed ? 'px-2 py-4 flex-col' : 'px-5 py-4 flex-row'
        }`}
      >
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-cyan to-purple flex items-center justify-center text-sm font-bold text-white font-syne shrink-0">
          DA
        </div>
        {!collapsed && (
          <div className="sidebar-user-info flex-1 min-w-0">
            <div className="syne text-[13px] font-bold text-text-primary whitespace-nowrap">
              Dr. Admin
            </div>
            <div className="dm text-[11px] text-text-muted">National Admin</div>
          </div>
        )}
        <button
          aria-label="Logout"
          onClick={onLogout}
          className="bg-transparent border-none text-text-muted cursor-pointer p-1 flex"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  </>
));

export default Sidebar;
