'use client';

import { useState } from 'react';
import { customToast } from '../../utils/toast';
import api from '../../utils/api';
import OtpPopup from './OtpPopup';
import { useRouter } from 'next/navigation';

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  skills: string;
  experience: string;
  motivation: string;
  linkedin: string;
}

export default function VolunteerForm() {
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    skills: '',
    experience: '',
    motivation: '',
    linkedin: '',
  });
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      customToast('Passwords do not match!', 'error');
      return false;
    }

    const requiredFields: (keyof FormData)[] = [
      'fullName', 'email', 'phone', 'password',
      'confirmPassword', 'skills', 'experience', 'motivation'
    ];

    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        customToast(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}!`, 'error');
        return false;
      }
    }

    if (formData.linkedin && !/linkedin\.com\/in\//.test(formData.linkedin)) {
      customToast('Please enter a valid LinkedIn URL (e.g., linkedin.com/in/username)', 'error');
      return false;
    }

    return true;
  };

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
    }
  };


  const postDataToDb = async () => {
    try {
      console.log(formData)
      const response = await api.post('/volunteer/register', formData);

      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      customToast(error.message || 'Registration failed!', 'error');
      throw error; // Re-throw to handle in verify flow
    }

  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await sendOtp(formData.email, "Volunteer");
    } catch (error: any) {
      console.error('Registration error:', error);
      customToast(error.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };


  const onSuccessHandler = async () => {
    try {
      const flag = await postDataToDb();
      if (flag === true) {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          skills: '',
          experience: '',
          motivation: '',
          linkedin: '',
        });
        customToast('Registration successful!', 'success');
        router.push('/login');
      } else {
        customToast('Registration failed. Please try again.', 'error');
      }
    } catch (error: any) {
      console.error('Error during registration:', error);
      customToast('Something went wrong. Please try again later.', 'error');
    }
  };


  return (
    <div className=" w-full flex items-center justify-center px-4 ">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-gray-300 rounded-2xl  p-8 space-y-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Volunteer Application</h2>
          <p className="text-gray-600">Join our team and make a difference</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500 text-black outline-none"
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500 text-black outline-none"
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500 text-black outline-none"
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500 text-black outline-none"
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500 text-black outline-none"
              required
            />
          </div>
        </div>

        {/* Multi-line Text Areas */}
        {(['skills', 'experience', 'motivation'] as (keyof typeof formData)[]).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
            <textarea
              name={field}
              value={formData[field]}
              onChange={handleChange}
              rows={field === 'motivation' ? 3 : 2}
              className="w-full px-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500 text-black outline-none"
              required
            />
          </div>
        ))}


        {/* LinkedIn Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn Profile 
          </label>
          <input
            name="linkedin"
            type="url"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500 text-black outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
        >
          {isLoading ? 'Processing...' : 'Submit Application'}
        </button>
      </form>

      {/* OTP Popup */}
      {showOtp && (
        <OtpPopup
          email={formData.email}
          onClose={() => setShowOtp(false)}
          type="Volunteer"
          onSuccess={onSuccessHandler}
        />
      )}
    </div>
  );


}