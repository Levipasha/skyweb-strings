import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const knotStatuses = [
  { value: 'pending', label: 'Pending', color: '#9CA3AF' },
  { value: 'in-progress', label: 'In Progress', color: '#F59E0B' },
  { value: 'completed', label: 'Completed', color: '#10B981' },
  { value: 'break', label: 'Break', color: '#EF4444' }
];

const WorkLogModal = ({ isOpen, onClose, hourData, onSave }) => {
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hourData) {
      setDescription(hourData.description || '');
      setStatus(hourData.knotColor || 'pending');
    }
  }, [hourData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave({ hour: hourData.hour, description, knotColor: status });
    setLoading(false);
    onClose();
  };

  if (!isOpen || !hourData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-10"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Log Work - Hour {hourData.hour}:00
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Status Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {knotStatuses.map((statusOption) => (
                    <button
                      key={statusOption.value}
                      type="button"
                      onClick={() => setStatus(statusOption.value)}
                      className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                        status === statusOption.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: statusOption.color }}
                      ></div>
                      <span className="text-sm font-medium">{statusOption.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What did you work on during this hour?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="4"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WorkLogModal;

