import React from 'react';
import { motion } from 'framer-motion';
import Knot from './Knot';

const Thread = ({ employee, hours, onKnotClick, isEmployee = false }) => {
  const threadColor = employee.threadColor || '#3B82F6';
  
  return (
    <motion.div 
      className="mb-8 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Employee Info */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: threadColor }}
          ></div>
          <div>
            <h3 className="font-semibold text-gray-800">{employee.name}</h3>
            <p className="text-sm text-gray-500">{employee.department}</p>
          </div>
        </div>
        {!isEmployee && (
          <span className="text-xs text-gray-400">{employee.email}</span>
        )}
      </div>

      {/* Thread with Knots */}
      <div className="relative px-2 py-6">
        {/* Thread Line */}
        <svg 
          width="100%" 
          height="40" 
          className="absolute top-0 left-0"
          style={{ zIndex: 0 }}
        >
          <line
            x1="0"
            y1="20"
            x2="100%"
            y2="20"
            stroke={threadColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Knots Container */}
        <div className="relative flex justify-between items-center" style={{ zIndex: 1 }}>
          {hours.map((hourData, index) => (
            <Knot
              key={index}
              hour={hourData.hour}
              status={hourData.knotColor}
              description={hourData.description}
              onClick={() => onKnotClick && onKnotClick(hourData)}
              clickable={isEmployee}
            />
          ))}
        </div>
      </div>

      {/* Hour Labels */}
      <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">
        {[0, 6, 12, 18, 23].map((hour) => (
          <span key={hour}>{hour}:00</span>
        ))}
      </div>
    </motion.div>
  );
};

export default Thread;

