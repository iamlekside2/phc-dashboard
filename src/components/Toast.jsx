import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const Toast = memo(({ message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, x: 20 }}
    animate={{ opacity: 1, y: 0, x: 0 }}
    exit={{ opacity: 0, y: 40 }}
    className="glass fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 px-6 py-3.5 font-dm text-sm text-text-primary border-l-3 border-l-cyan"
  >
    <Check size={16} className="text-emerald" />
    {message}
    <button onClick={onClose} className="bg-transparent border-none text-text-muted cursor-pointer ml-2">
      <X size={14} />
    </button>
  </motion.div>
));

export default Toast;
