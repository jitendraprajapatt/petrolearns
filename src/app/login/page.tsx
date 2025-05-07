'use client';

import { useState } from 'react';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { FiUser, FiShield, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';
import customToast from '@/utils/toast';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

type LoginResponse = {
  message: string;
  success: boolean;
  role: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<string>('User');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email || !password) {
      customToast("Please fill in all fields", "error");
      return;
    }
  
    setLoading(true);
    try {
      const response = await api.post<LoginResponse>(
        '/user/login',
        { role, email, password },
        { withCredentials: true }
      );
  
      const { success, message } = response.data;
  
      if (success) {
        customToast(message, "success");
  
        // Force refresh after login to ensure cookies and context are updated
        if (role === 'Admin') {
          router.push('/admin');
        } else {
          router.push('/study');
        }
  
        // Optional: Force refresh the window after routing
        setTimeout(() => {
          window.location.reload();
        }, 100); // slight delay allows router.push to finish
      } else {
        customToast("Login unsuccessful. Please try again.", "error");
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "Something went wrong during login.";
      customToast(errorMsg, "error");
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
  
        {/* Role Toggle */}
        <div className="grid grid-cols-3 bg-gray-100 rounded-md overflow-hidden mb-6">
          {['User', 'Volunteer', 'Admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex items-center justify-center py-2 text-sm font-medium transition ${
                role === r ? 'bg-white shadow text-blue-600' : 'text-gray-500'
              }`}
            >
              {r === 'User' && <FiUser className="mr-1" />}
              {r === 'Volunteer' && <FiUsers className="mr-1" />}
              {r === 'Admin' && <FiShield className="mr-1" />}
              {r}
            </button>
          ))}
        </div>
  
        {/* Email */}
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full text-black px-4 py-2 mt-1 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
  
        {/* Password */}
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
  
        {/* Signup */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
  
}
