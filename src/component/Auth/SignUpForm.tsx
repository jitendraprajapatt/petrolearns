'use client';

import { useState } from 'react';
import api from '../../utils/api';
import OtpPopup from './OtpPopup';
import customToast from '@/utils/toast';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  interface FormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const sendOtp = async (email: string, type: string) => {
    try {
      const { data } = await api.post('/send-otp', { email, type });
      if (data.success) {
        setShowOtp(true);
        customToast('OTP sent to your email', 'success');
      }
    } catch (error: any) {
      console.error('OTP error:', error);
      customToast(error.response?.data?.message || 'Failed to send OTP', 'error');
      throw error;
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      customToast('Passwords do not match!', 'error');
      return false;
    }

    const requiredFields: (keyof FormData)[] = ['fullName', 'email', 'password', 'confirmPassword'];
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        customToast(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}!`, 'error');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await sendOtp(formData.email, 'User');
    } catch {
      setLoading(false);
    }
  };

  const postDataToDb = async () => {
    try {
      const response = await api.post('/user/register', formData);
      if (response.data.success) return true;
      throw new Error(response.data.message || 'Registration failed');
    } catch (error: any) {
      customToast(error.message || 'Registration failed!', 'error');
      throw error;
    }
  };

  const onSuccessHandler = async () => {
    try {
      const success = await postDataToDb();
      if (success) {
        setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
        customToast('Registration successful!', 'success');
        router.push('/login');
      }
    } catch {
      customToast('Something went wrong. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-30 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 p-10 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create an Account</h2>
  
          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              value={formData.fullName}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              value={formData.email}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              value={formData.password}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              value={formData.confirmPassword}
              required
            />
  
            <button
              type="submit"
              className={`w-full text-white py-3 rounded-xl font-semibold transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
              }`}
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Create Account'}
            </button>
          </div>
  
          <p className="text-center text-sm text-gray-700 mt-6">
            Want to become a volunteer?{' '}
            <a href="/volunteer" className="text-blue-700 font-semibold hover:underline">
              Register here
            </a>
          </p>
        </form>
      </div>
  
      {showOtp && (
        <OtpPopup
          email={formData.email}
          onClose={() => setShowOtp(false)}
          type="User"
          onSuccess={onSuccessHandler}
        />
      )}
    </>
  );
  
  
}
