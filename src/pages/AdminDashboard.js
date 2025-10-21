import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Thread from '../components/Thread';
import MinimumLoader from '../components/MinimumLoader';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [departments, setDepartments] = useState(['all']);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate]);

  useEffect(() => {
    if (socket) {
      socket.on('workLogUpdate', (updatedLog) => {
        fetchDashboardData();
        toast.success('Work log updated in real-time!');
      });

      return () => {
        socket.off('workLogUpdate');
      };
    }
  }, [socket]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/worklogs/dashboard', {
        params: { date: selectedDate }
      });

      setDashboardData(data);

      // Extract unique departments
      const uniqueDepts = ['all', ...new Set(data.map(d => d.employee.department))];
      setDepartments(uniqueDepts);

      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  const filteredData = selectedDepartment === 'all'
    ? dashboardData
    : dashboardData.filter(d => d.employee.department === selectedDepartment);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="SkyWeb" className="h-14" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Strings Admin</h1>
                <p className="text-sm text-gray-600">{user?.organization?.name} • <span className="text-xs text-gray-500">by SkyWeb</span></p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/employees')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                👥 Manage Employees
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchDashboardData}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Total Employees</div>
            <div className="text-3xl font-bold text-gray-800">{filteredData.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Active Today</div>
            <div className="text-3xl font-bold text-green-600">
              {filteredData.filter(d => d.hours.some(h => h.knotColor !== 'pending')).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Total Hours Logged</div>
            <div className="text-3xl font-bold text-blue-600">
              {filteredData.reduce((acc, d) => 
                acc + d.hours.filter(h => h.knotColor === 'completed').length, 0
              )}
            </div>
          </div>
        </div>

        {/* Employee Threads */}
        <div className="space-y-2">
          <MinimumLoader loading={loading} minDuration={2000} size={180}>
            {filteredData.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600">No employees found</p>
            </motion.div>
            ) : (
              filteredData.map((data) => (
                <Thread
                  key={data.employee._id}
                  employee={data.employee}
                  hours={data.hours}
                  isEmployee={false}
                />
              ))
            )}
          </MinimumLoader>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

