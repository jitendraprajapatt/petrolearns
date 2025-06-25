'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FiUser, FiShield, FiUsers } from 'react-icons/fi';
import api from '@/utils/api';
import customToast from '@/utils/toast';
import { useAuth } from '@/contexts/AuthContext'; // ✅ Add this

const roleOptions = [
  { label: 'User', icon: <FiUser className="mr-1" /> },
  { label: 'Volunteer', icon: <FiUsers className="mr-1" /> },
  { label: 'Admin', icon: <FiShield className="mr-1" /> },
];

export default function LoginForm() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth(); // ✅ use context
  const [role, setRole] = useState('User');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return customToast('Please fill in all fields', 'error');
    }

    setLoading(true);
    try {
      const { data } = await api.post('/user/login', { role, email, password }, { withCredentials: true });

      if (data.success) {
        setIsLoggedIn(true); // ✅ Set global auth state
        router.push(role === 'Admin' ? '/admin' : '/');
        customToast(data.message, 'success');
      } else {
        customToast('Login unsuccessful. Please try again.', 'error');
      }
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || 'Login failed.';
      customToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 px-4 pt-12">
      <motion.div
        className="bg-white px-6 sm:px-8 pt-8 pb-10 w-full max-w-md rounded-2xl shadow-md"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Login to PetroLearn</h2>
        <p className="text-center text-gray-500 mb-6">Access the petroleum knowledge platform</p>

        {/* Role Selector */}
        <div className="grid grid-cols-3 bg-gray-100 rounded-md overflow-hidden mb-6">
          {roleOptions.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setRole(label)}
              className={`flex items-center justify-center py-2 text-sm font-medium transition ${
                role === label ? 'bg-white shadow text-blue-600' : 'text-gray-500'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Email Input */}
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full text-black px-4 py-2 mt-1 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Password Input */}
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full text-black px-4 py-2 mt-1 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full bg-sky-500 text-white py-2 rounded-md transition ${
            loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-sky-600'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-3 text-sm text-gray-400">OR CONTINUE WITH</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>

        {/* Google Login */}
        <button className="w-full text-black flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition">
          <FcGoogle className="text-xl" />
          <span>Google</span>
        </button>

        {/* Sign Up */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
}
