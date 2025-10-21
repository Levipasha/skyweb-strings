import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Thread from '../components/Thread';
import WorkLogModal from '../components/WorkLogModal';
import MinimumLoader from '../components/MinimumLoader';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedHour, setSelectedHour] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchWorkLogs();
  }, [selectedDate]);

  const fetchWorkLogs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/worklogs', {
        params: { 
          date: selectedDate,
          userId: user._id
        }
      });

      // Create array of 24 hours with data
      const hoursArray = Array.from({ length: 24 }, (_, hour) => {
        const log = data.find(l => l.hour === hour);
        return {
          hour,
          knotColor: log ? log.knotColor : 'pending',
          description: log ? log.description : '',
          logId: log ? log._id : null
        };
      });

      setHours(hoursArray);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch work logs');
      setLoading(false);
    }
  };

  const handleKnotClick = (hourData) => {
    setSelectedHour(hourData);
    setShowModal(true);
  };

  const handleSaveWorkLog = async (logData) => {
    try {
      await axios.post('/api/worklogs', {
        date: selectedDate,
        hour: logData.hour,
        description: logData.description,
        knotColor: logData.knotColor
      });

      toast.success('Work log saved successfully!');
      fetchWorkLogs();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save work log');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const completedHours = hours.filter(h => h.knotColor === 'completed').length;
  const inProgressHours = hours.filter(h => h.knotColor === 'in-progress').length;
  const pendingHours = hours.filter(h => h.knotColor === 'pending').length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="SkyWeb" className="h-14" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Strings</h1>
                <p className="text-sm text-gray-600">{user?.organization?.name} • <span className="text-xs text-gray-500">by SkyWeb</span></p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.department}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            className="bg-white rounded-lg shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-3xl font-bold text-green-600">{completedHours}h</div>
          </motion.div>
          <motion.div
            className="bg-white rounded-lg shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-sm text-gray-600 mb-1">In Progress</div>
            <div className="text-3xl font-bold text-yellow-600">{inProgressHours}h</div>
          </motion.div>
          <motion.div
            className="bg-white rounded-lg shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-sm text-gray-600 mb-1">Pending</div>
            <div className="text-3xl font-bold text-gray-400">{pendingHours}h</div>
          </motion.div>
        </div>

        {/* Instruction */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 Click on any knot (circle) to log your work for that hour
          </p>
        </div>

        {/* Thread */}
        <MinimumLoader loading={loading} minDuration={2000} size={180}>
          <Thread
            employee={{
              name: user?.name,
              department: user?.department,
              threadColor: user?.threadColor
            }}
            hours={hours}
            onKnotClick={handleKnotClick}
            isEmployee={true}
          />
        </MinimumLoader>
      </main>

      {/* Work Log Modal */}
      <WorkLogModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        hourData={selectedHour}
        onSave={handleSaveWorkLog}
      />
    </div>
  );
};

export default EmployeeDashboard;

