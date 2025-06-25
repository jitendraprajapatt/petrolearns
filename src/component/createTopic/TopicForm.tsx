'use client';

import React, { useState, useEffect } from 'react';
import TitleInput from './TitleInput';
import DescriptionInput from './DescriptionInput';
import SlateEditor from './SlateEditor';
import { initialValue } from './initialSlateValue';
import { Descendant } from 'slate';
import customToast from '@/utils/toast';
import api from '@/utils/api';

const TopicForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState<Descendant[]>(initialValue);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('subjectId');
    setSubjectId(id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      customToast('Title is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/create/new/topic', {
        title,
        description,
        content,
        subjectId,
      });

      if (response.data.success) {
        customToast(response.data.message || 'Topic created successfully!', 'success');
        setTitle('');
        setDescription('');
        setContent(initialValue);
      }
    } catch (error: any) {
      console.error('Error submitting topic:', error);
      const message = error?.response?.data?.message || 'Failed to create topic. Please try again.';
      customToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white ">
        <h2 className="text-2xl font-semibold text-gray-800">Create New Topic</h2>
      </div>

      {/* Main content area - uses all available space */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 min-h-0 overflow-hidden"
      >
        {/* Left panel - Form inputs */}
        {/* Removed border-r and added ml-4 and mr-2 for spacing */}
        <div className="w-full md:w-80 lg:w-96 p-4 bg-white flex flex-col ml-4 mr-2 my-4 rounded-xl shadow-md">
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <TitleInput value={title} onChange={setTitle} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <DescriptionInput value={description} onChange={setDescription} />
            </div>
          </div>

          {/* Submit button - stays at bottom */}
          <div className="pt-4 mt-auto">
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className={`w-full py-3 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors flex justify-center items-center ${
                loading || !title.trim() ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : 'Create Topic'}
            </button>
          </div>
        </div>

        {/* Right panel - Editor */}
        {/* Added ml-2 and mr-4, and my-4 for spacing, removed pt-0 from inner div */}
        <div className="flex-1 flex flex-col bg-gray-50 min-h-0 mr-4 ml-2 my-4">
          <div className="p-4 pb-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
          </div>
          {/* Removed p-4 and pt-2, the SlateEditor itself handles its padding */}
          <div className="flex-1 min-h-0">
            <SlateEditor value={content} onChange={setContent} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default TopicForm;