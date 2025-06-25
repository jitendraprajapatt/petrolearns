'use client';

import { useState } from 'react';
// import axios from 'axios'; // Axios is already imported via `api`
import api from '@/utils/api'; // Assuming this is your Axios instance
import customToast from '@/utils/toast'; // Assuming this is your toast utility

export default function ContactPage() {
  const [type, setType] = useState<'general' | 'subject'>('general');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subjectName: '',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (newType: 'general' | 'subject') => {
    setType(newType);
    setFormData({ name: '', email: '', message: '', subjectName: '', reason: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: {
        type: 'general' | 'subject';
        name: string;
        email: string;
        message?: string;
        subjectName?: string;
        reason?: string;
      } = {
        type,
        name: formData.name,
        email: formData.email,
      };

      if (type === 'general') {
        payload.message = formData.message;
      } else {
        payload.subjectName = formData.subjectName;
        payload.reason = formData.reason;
      }

      const endpoint = '/contact'; // This is your API endpoint

      const response = await api.post(endpoint, payload);

      if (response.data.success === true) {
        // Changed to customToast(message, 'success')
        customToast('Form submitted successfully!', 'success');
        setFormData({ name: '', email: '', message: '', subjectName: '', reason: '' });
      } else {
        // Changed to customToast(message, 'error')
        customToast('Submission failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Changed to customToast(message, 'error')
      customToast('An error occurred. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-2 py-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Contact Us</h1>

        <div className="flex justify-center mb-5 space-x-3">
          <button
            onClick={() => handleTypeChange('general')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
              type === 'general'
                ? 'bg-gray-800 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
            }`}
          >
            General Inquiry
          </button>
          <button
            onClick={() => handleTypeChange('subject')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
              type === 'subject'
                ? 'bg-gray-800 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
            }`}
          >
            Subject Request
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2.5 rounded-md border border-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2.5 rounded-md border border-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          {type === 'general' ? (
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2.5 rounded-md border border-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Type your message here..."
              />
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  id="subjectName"
                  name="subjectName"
                  required
                  value={formData.subjectName}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-md border border-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="e.g., Advanced Calculus"
                />
              </div>
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Why should we add it?</label>
                <textarea
                  id="reason"
                  name="reason"
                  required
                  rows={4}
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-md border border-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Explain why this subject would be valuable..."
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2.5 text-white text-base font-semibold rounded-md shadow-md ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 transition-colors duration-300 ease-in-out'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}