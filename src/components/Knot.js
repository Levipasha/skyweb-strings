import React, { useState } from 'react';
import { motion } from 'framer-motion';

const knotColorMap = {
  pending: '#9CA3AF',
  completed: '#10B981',
  'in-progress': '#F59E0B',
  break: '#EF4444'
};

const knotLabelMap = {
  pending: 'Pending',
  completed: 'Completed',
  'in-progress': 'In Progress',
  break: 'Break'
};

const Knot = ({ hour, status, description, onClick, clickable = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const color = knotColorMap[status] || knotColorMap.pending;

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        className={`w-4 h-4 rounded-full border-2 border-white shadow-md ${
          clickable ? 'cursor-pointer hover:scale-125' : ''
        }`}
        style={{ backgroundColor: color }}
        whileHover={clickable ? { scale: 1.3 } : {}}
        whileTap={clickable ? { scale: 0.9 } : {}}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2, delay: hour * 0.02 }}
      />

      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          className="absolute bottom-full mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="font-semibold">{hour}:00 - {knotLabelMap[status]}</div>
          {description && (
            <div className="text-gray-300 mt-1 max-w-xs">{description}</div>
          )}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="border-4 border-transparent border-t-gray-800"></div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Knot;

