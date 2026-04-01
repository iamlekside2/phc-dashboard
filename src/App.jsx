import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import Dashboard from './components/Dashboard';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!authenticated ? (
        <motion.div key="login" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
          <LoginPage onLogin={() => setAuthenticated(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Dashboard onLogout={() => setAuthenticated(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default App;
