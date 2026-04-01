import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { COLORS } from '../styles/theme';
import DotGridBg from '../components/DotGridBg';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setTimeout(() => {
      if (email === 'admin@phc.ng' && password === 'phc2024') {
        onLogin(true);
      } else {
        setError(true);
        setLoading(false);
      }
    }, 1200);
  };

  const inputStyle = (hasError) => ({
    background: 'rgba(6,11,24,0.8)',
    border: `1px solid ${hasError ? COLORS.coral : COLORS.border}`,
    boxShadow: hasError ? '0 0 12px rgba(255,107,107,0.3)' : 'none',
  });

  return (
    <div className="fixed inset-0 bg-bg flex items-center justify-center overflow-hidden">
      <div
        className="absolute w-[500px] h-[500px] rounded-full top-[10%] left-[15%] blur-[60px] animate-[float1_20s_ease-in-out_infinite]"
        style={{
          background: `radial-gradient(circle, ${COLORS.cyan}20, transparent 70%)`,
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full bottom-[5%] right-[10%] blur-[80px] animate-[float2_25s_ease-in-out_infinite]"
        style={{
          background: `radial-gradient(circle, ${COLORS.purple}20, transparent 70%)`,
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full top-1/2 left-[60%] blur-[70px] animate-[float3_22s_ease-in-out_infinite]"
        style={{
          background: `radial-gradient(circle, ${COLORS.emerald}15, transparent 70%)`,
        }}
      />

      <DotGridBg />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="glass max-w-[420px] w-[90%] px-9 py-12 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full mx-auto mb-5 bg-[rgba(0,212,255,0.1)] flex items-center justify-center shadow-[0_0_30px_rgba(0,212,255,0.2)]">
            <Heart size={32} color={COLORS.cyan} />
          </div>
          <h1 className="font-syne text-[28px] font-extrabold text-text-primary mb-2">
            PHC Intelligence Hub
          </h1>
          <p className="font-dm text-sm text-text-muted">
            Federal Ministry of Health — Nigeria
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="font-dm block text-[13px] text-text-muted mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(false); }}
              placeholder="Enter your email"
              className="w-full py-3.5 px-4 rounded-xl text-text-primary text-[15px] font-dm transition-all duration-300 ease-in-out outline-none"
              style={inputStyle(error)}
            />
          </div>
          <div className="mb-6">
            <label className="font-dm block text-[13px] text-text-muted mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter your password"
              className="w-full py-3.5 px-4 rounded-xl text-text-primary text-[15px] font-dm transition-all duration-300 ease-in-out outline-none"
              style={inputStyle(error)}
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-coral text-[13px] mb-4 text-center"
            >
              Invalid credentials. Please try again.
            </motion.p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-glow w-full py-3.5 border-none rounded-[14px] text-base font-bold font-syne transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
            style={{
              background: loading ? COLORS.border : COLORS.cyan,
              color: loading ? COLORS.textMuted : '#060B18',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-5 h-5 rounded-full"
                style={{
                  border: `2px solid ${COLORS.textMuted}`,
                  borderTopColor: 'transparent',
                }}
              />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 py-3 px-4 bg-[rgba(0,212,255,0.05)] rounded-[10px] border border-[rgba(0,212,255,0.1)] text-center">
          <p className="font-dm text-xs text-text-muted m-0">
            Demo: <span className="text-cyan">admin@phc.ng</span> /{' '}
            <span className="text-cyan">phc2024</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
