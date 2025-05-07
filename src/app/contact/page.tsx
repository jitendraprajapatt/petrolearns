'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [type, setType] = useState<'general' | 'subject'>('general');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subjectName: '',
    reason: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (newType: 'general' | 'subject') => {
    setType(newType);
    setFormData({ name: '', email: '', message: '', subjectName: '', reason: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit form logic here (API call or email)
    alert('Form submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Contact Us</h1>

        <div className="flex justify-center mb-4 space-x-4">
          <button
            onClick={() => handleTypeChange('general')}
            className={`px-5 py-2 rounded-full text-lg font-medium transition duration-300 ${
              type === 'general' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white'
            }`}
          >
            General Query
          </button>
          <button
            onClick={() => handleTypeChange('subject')}
            className={`px-5 py-2 rounded-full text-lg font-medium transition duration-300 ${
              type === 'subject' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white'
            }`}
          >
            Request New Subject
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg shadow-sm bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg shadow-sm bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {type === 'general' ? (
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 rounded-lg shadow-sm bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  name="subjectName"
                  required
                  value={formData.subjectName}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg shadow-sm bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-1">Why should we add it?</label>
                <textarea
                  name="reason"
                  required
                  rows={3}
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg shadow-sm bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
