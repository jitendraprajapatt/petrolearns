import React, { useEffect, useState } from 'react';
import ReadOnlySlateViewer from './ReadOnlySlateViewer';
import api from '@/utils/api';
import { FiUser, FiCalendar, FiLoader } from 'react-icons/fi';
import { format } from 'date-fns';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface ContentData {
  subjectId: string;
  title: string;
  description: string;
  publisherId: string;
  adminId: string;
  content: any[];
  publisherName: string;
  createdAt: string;
  updatedAt: string;
}

const TopicDetail: React.FC<{ contentId: string }> = ({ contentId }) => {
  const [data, setData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/get/content/${contentId}`);
        setData(res.data.content);
      } catch (err) {
        setError('Failed to load topic content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (contentId) fetchContent();
  }, [contentId]);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton height={40} width={300} className="mb-4" />
        <Skeleton count={5} className="mb-2" />
        <Skeleton height={200} className="mt-4" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <div className="bg-red-100 p-4 rounded-full mb-3">
          <FiLoader className="text-red-500" size={24} />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-1">Error Loading Content</h3>
        <p className="text-gray-600 max-w-md">{error || 'Content not available.'}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-1">
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
            <div className="flex items-center">
              <FiUser className="mr-2" />
              <span>Published by: {data.publisherName}</span>
            </div>
            <div className="flex items-center">
              <FiCalendar className="mr-2" />
              <span>Created: {format(new Date(data.createdAt), 'MMM d, yyyy')}</span>
            </div>
            {data.createdAt !== data.updatedAt && (
              <div className="flex items-center">
                <FiCalendar className="mr-2" />
                <span>Updated: {format(new Date(data.updatedAt), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="prose max-w-none">
          <ReadOnlySlateViewer content={data.content} />
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;