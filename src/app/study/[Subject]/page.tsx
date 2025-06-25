'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiPlus, FiEdit, FiChevronLeft, FiChevronRight, FiBookOpen } from 'react-icons/fi';
import TopicList from '@/component/Study/TopicList';
import TopicDetail from '@/component/Study/TopicDetail';
import api from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Topic {
  _id: string;
  title: string;
  description: string;
  contentId: string;
  createdAt: string;
}

const SubjectPage = () => {
  const params = useParams();
  const router = useRouter();
  const { role } = useAuth();

  // Parse subject ID and name from URL
  const slug = params.Subject as string;
  const [id, ...nameParts] = slug.split('-');
  const subjectName = nameParts.join(' ');

  // State management
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [topicList, setTopicList] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTopicList, setShowTopicList] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Check if user is volunteer
  useEffect(() => {
    console.log('Current role:', role); // Debugging
    setIsVolunteer(role === 'Volunteer' || role === 'volunteer');
  }, [role]);

  // Responsive layout handling
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setShowTopicList(true);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch topics for the subject
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await api.get(`/get/topic/lists/${id}`);
        const fetchedTopics = response.data.topicList;
        setTopicList(fetchedTopics);
        if (fetchedTopics.length > 0) {
          setSelectedTopicId(fetchedTopics[0]._id);
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [id]);

  // Filter topics based on search query
  const filteredTopics = topicList.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTopic = topicList.find(t => t._id === selectedTopicId);
  const cId = selectedTopic?.contentId;

  // Navigation handlers
  const handleCreateTopic = () => {
    localStorage.setItem('subjectId', id);
    router.push(`/study/${slug}/create`);
  };

  const handleEditTopic = () => {
    if (selectedTopicId) {
      localStorage.setItem('subjectId', id);
      router.push(`/study/${slug}/${selectedTopicId}/edit`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-56px)]">
        <div className="bg-white shadow-sm p-4">
          <Skeleton height={40} width={200} />
          <Skeleton height={20} width={300} />
        </div>
        <div className="flex flex-1 p-4 gap-4">
          <div className="w-1/3">
            <Skeleton height={50} count={5} />
          </div>
          <div className="flex-1">
            <Skeleton height={400} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 sm:px-6 sticky top-0 z-30 h-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 h-full">
          <div className="flex items-center gap-2 h-full">
            <FiBookOpen className="text-blue-600" size={20} />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 capitalize">
                {subjectName}
              </h1>
              <p className="text-gray-600 text-sm">Explore learning resources</p>
            </div>
          </div>

          {isVolunteer && (
            <div className="flex gap-2 self-end sm:self-auto">
              {/* Mobile buttons */}
              <button 
                onClick={handleCreateTopic} 
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors sm:hidden"
                aria-label="Create topic"
              >
                <FiPlus size={18} />
              </button>
              <button 
                onClick={handleEditTopic} 
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors sm:hidden"
                aria-label="Edit topic"
                disabled={!selectedTopicId}
              >
                <FiEdit size={18} />
              </button>
              
              {/* Desktop buttons */}
              <div className="hidden sm:flex gap-3">
                <button 
                  onClick={handleCreateTopic} 
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiPlus size={18} /> Create Topic
                </button>
                <button 
                  onClick={handleEditTopic} 
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  disabled={!selectedTopicId}
                >
                  <FiEdit size={18} /> Edit Topic
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden relative">
        {/* Mobile toggle button */}
        {isMobile && (
          <button
            onClick={() => setShowTopicList(!showTopicList)}
            className={`fixed z-30 ${showTopicList ? 'left-[19rem]' : 'left-4'} top-1/2 bg-white shadow-md rounded-full p-2 border border-gray-200 hover:bg-gray-100 transition-all duration-300`}
            aria-label={showTopicList ? "Hide topic list" : "Show topic list"}
          >
            {showTopicList ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
          </button>
        )}

        {/* Topic List Sidebar */}
        <div
          className={`${isMobile
              ? `fixed inset-y-0 left-0 z-20 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${showTopicList ? 'translate-x-0' : '-translate-x-full'}`
              : 'w-full lg:w-1/3 xl:w-1/4 min-w-[18rem]'
            } h-[calc(100vh-64px)] flex flex-col border-r border-gray-200`}
        >
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search topics..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <TopicList
              topicList={filteredTopics}
              selectedId={selectedTopicId ?? ''}
              onSelect={(id) => {
                setSelectedTopicId(id);
                if (isMobile) setShowTopicList(false);
              }}
            />
          </div>
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {isMobile && showTopicList && (
          <div
            className="fixed inset-0 z-10 bg-black bg-opacity-50"
            onClick={() => setShowTopicList(false)}
          />
        )}

        {/* Topic Detail Content */}
        <div className={`flex-1 h-[calc(100vh-64px)] overflow-auto bg-white ${isMobile && showTopicList ? 'ml-0' : ''}`}>
          {selectedTopic ? (
            <TopicDetail contentId={cId ?? ''} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <FiBookOpen size={48} className="text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Topic Selected</h3>
              <p className="text-gray-500 max-w-md">
                {filteredTopics.length === 0 
                  ? "No topics available for this subject." 
                  : "Select a topic from the list to view its content."}
              </p>
              {isVolunteer && filteredTopics.length === 0 && (
                <button 
                  onClick={handleCreateTopic}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create First Topic
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SubjectPage;