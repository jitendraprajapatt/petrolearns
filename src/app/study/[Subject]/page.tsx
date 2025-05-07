'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import TopicList from '@/component/Study/TopicList';
import TopicDetail from '@/component/Study/TopicDetail';
import { FiPlus, FiEdit, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Topic {
  id: number;
  title: string;
  description: string;
  published: string;
  fullContent: string;
}

const SubjectPage = () => {
  const params = useParams();
  const slugParts = params.Subject as string;
  const [id, ...name] = slugParts.split('-');
  const subject = name.join(' ').toUpperCase();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTopicList, setShowTopicList] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isVolunteer = true; // Simulated role

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowTopicList(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`/api/subjects/${subject}/topics`);
        setTopics(response.data);
        if (response.data.length > 0) {
          setSelectedTopicId(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (subject) fetchTopics();
  }, [subject]);

  const selectedTopic = topics.find((t) => t.id === selectedTopicId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-10 text-lg">Loading topics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header Section */}
      <header className="bg-white shadow-sm p-4 sm:p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{subject}</h1>
            <p className="text-gray-600 text-sm sm:text-base">Resources for {subject}</p>
          </div>

          {isVolunteer && (
            <div className="flex gap-2">
              <button className="p-2 bg-green-500 text-white rounded-full sm:hidden">
                <FiPlus size={18} />
              </button>
              <button className="p-2 bg-yellow-500 text-white rounded-full sm:hidden">
                <FiEdit size={18} />
              </button>
              <div className="hidden sm:flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                  <FiPlus /> Create Topic
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                  <FiEdit /> Edit Topic
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6 relative">
          {/* Mobile toggle button */}
          {isMobile && (
            <button
              onClick={() => setShowTopicList(!showTopicList)}
              className="fixed left-4 top-1/2 z-30 bg-white shadow-lg rounded-full p-2 border border-gray-200"
            >
              {showTopicList ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
            </button>
          )}

          {/* Topic List Panel */}
          <div
            className={`${isMobile
              ? `fixed inset-y-0 left-0 z-20 bg-white w-64 shadow-xl transform ${showTopicList ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`
              : 'w-full lg:w-1/3'} bg-white rounded-lg shadow-sm`}
          >
            <TopicList
              topics={topics}
              selectedId={selectedTopicId!}
              onSelect={(id) => {
                setSelectedTopicId(id);
                if (isMobile) setShowTopicList(false);
              }}
            />
          </div>

          {/* Overlay for mobile */}
          {isMobile && showTopicList && (
            <div
              className="fixed inset-0 z-10 bg-black bg-opacity-50"
              onClick={() => setShowTopicList(false)}
            />
          )}

          {/* Topic Content Panel */}
          <div className={`${isMobile ? 'w-full' : 'w-full lg:w-2/3'} bg-white rounded-lg shadow-sm`}>
            {selectedTopic ? (
              <TopicDetail topic={selectedTopic} />
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Select a topic to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubjectPage;