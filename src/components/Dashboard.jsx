import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppContext from '../context/AppContext';
import Sidebar from './Sidebar';
import HeaderBar from './HeaderBar';
import DotGridBg from './DotGridBg';
import Toast from './Toast';
import OverviewPage from '../pages/OverviewPage';
import DirectoryPage from '../pages/DirectoryPage';
import ComparePage from '../pages/ComparePage';
import DiagnosticsPage from '../pages/DiagnosticsPage';
import DrugPage from '../pages/DrugPage';
import ReportsPage from '../pages/ReportsPage';

const Dashboard = ({ onLogout }) => {
  const [activePage, setActivePage] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedState, setSelectedState] = useState('All');
  const [selectedLGA, setSelectedLGA] = useState('All');
  const [toast, setToast] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      const tablet = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (tablet && !sidebarCollapsed) setSidebarCollapsed(true);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleLogout = useCallback(() => {
    showToast('Logged out successfully');
    setTimeout(() => onLogout(), 500);
  }, [onLogout, showToast]);

  const handleNavigate = useCallback((page) => {
    setActivePage(page);
    if (isMobile) setMobileOpen(false);
  }, [isMobile]);

  const handleToggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileOpen((v) => !v);
    } else {
      setSidebarCollapsed((v) => !v);
    }
  }, [isMobile]);

  const contextValue = useMemo(
    () => ({
      activePage,
      selectedState,
      selectedLGA,
      setSelectedState,
      setSelectedLGA,
    }),
    [activePage, selectedState, selectedLGA]
  );

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewPage />;
      case 'directory':
        return <DirectoryPage />;
      case 'compare':
        return <ComparePage />;
      case 'diagnostics':
        return <DiagnosticsPage />;
      case 'drugs':
        return <DrugPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="flex min-h-screen bg-bg">
        <Sidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileOpen}
          activePage={activePage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onToggle={handleToggleSidebar}
        />

        <div
          className="main-content flex-1 h-screen flex flex-col min-w-0 transition-[margin-left] duration-300 ease-in-out"
          style={{ marginLeft: sidebarCollapsed ? 60 : 240 }}
        >
          <HeaderBar
            activePage={activePage}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedLGA={selectedLGA}
            setSelectedLGA={setSelectedLGA}
            onToggleSidebar={handleToggleSidebar}
          />

          <main className={`flex-1 relative overflow-auto ${isMobile ? 'p-3' : 'p-6'}`}>
            <DotGridBg />
            <div className="relative z-[1]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderPage()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>

        <AnimatePresence>
          {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
};

export default Dashboard;
