import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Admin details
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Organization details
  const [orgName, setOrgName] = useState('');
  const [orgCode, setOrgCode] = useState('');
  const [orgDescription, setOrgDescription] = useState('');
  const [departments, setDepartments] = useState('Engineering, Design, Marketing, HR, Sales');
  
  const [loading, setLoading] = useState(false);

  const handleStep1Submit = (e) => {
    e.preventDefault();
    
    if (!adminName || !adminEmail || !adminPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (adminPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (adminPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setStep(2);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    
    if (!orgName || !orgCode) {
      toast.error('Please provide organization name and code');
      return;
    }
    
    if (orgCode.length < 4) {
      toast.error('Organization code must be at least 4 characters');
      return;
    }
    
    try {
      setLoading(true);
      
      // Register admin and create organization in one call
      const { data } = await axios.post('/api/auth/admin-register', {
        adminName,
        adminEmail,
        adminPassword,
        orgName,
        orgCode: orgCode.toUpperCase(),
        orgDescription,
        departments: departments.split(',').map(d => d.trim()).filter(d => d)
      });
      
      setLoading(false);
      toast.success('Registration successful! Please login.');
      navigate('/login');
      
    } catch (error) {
      setLoading(false);
      const errorMsg = error.response?.data?.message || 'Registration failed';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          className="inline-block mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <img src="/logo.png" alt="SkyWeb" className="h-32 mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-medium">A Product of SkyWeb</p>
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Strings Admin Registration</h1>
        <p className="text-gray-600">Create your organization and start connecting</p>
      </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <span className="ml-2 font-medium">Admin Details</span>
          </div>
          <div className={`w-12 h-0.5 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
              2
            </div>
            <span className="ml-2 font-medium">Organization</span>
          </div>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 ? (
            /* Step 1: Admin Details */
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="admin@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                  minLength="6"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium mt-6"
              >
                Next: Organization Details →
              </button>
            </form>
          ) : (
            /* Step 2: Organization Details */
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name *
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="TechCorp Solutions"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Code *
                </label>
                <input
                  type="text"
                  value={orgCode}
                  onChange={(e) => setOrgCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  placeholder="TECH123"
                  required
                  minLength="4"
                  maxLength="10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Unique code for employees to join (4-10 characters)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={orgDescription}
                  onChange={(e) => setOrgDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Brief description of your organization"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departments
                </label>
                <input
                  type="text"
                  value={departments}
                  onChange={(e) => setDepartments(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Engineering, Design, Marketing"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Comma-separated list of departments
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Creating...' : 'Complete Registration'}
                </button>
              </div>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminRegister;

