import React, { useEffect, useState } from 'react';
import TopicCard from './TopicCard';
import api from '@/utils/api';
import TopicFilter from '../filter/TopicFilter';

interface Topic {
  _id: string;
  topicId: any;
  subdomain: string;
  subjectName: string;
  domain: string;
  title: string;
  description: string;
  subject: string;
  status: string;
}

const TopicManagement: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    title: '',
    subject: '',
    status: '',
    domain: '',
    subdomain: '',
  });

  useEffect(() => {
    fetchTopics();
  }, [currentPage, filters]);

  const fetchTopics = async () => {
    try {
      const response = await api.get('/get/verify/topics', {
        params: {
          page: currentPage,
          limit: 10,
          ...filters,
        },
      });

      console.log('Fetched topics:', response.data);

      setTopics(response.data.topics || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleOnVerify = async (topic: Topic) => {
    try {
      const res = await api.post('/save/verify/topic', { topic });
      console.log('Topic verified successfully:', res.data.message);
      fetchTopics(); // Refresh the topic list
    } catch (error) {
      console.error('Error verifying topic:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Topic Management Section</h1>

      {/* Filter Component */}
      <TopicFilter
        filters={filters}
        onFilterChange={(updatedFilters) => {
          setFilters(updatedFilters);
          setCurrentPage(1);
        }}
      />

      {/* Topic Cards */}
      {topics.length === 0 ? (
        <p className="text-center text-gray-500">No topics found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <TopicCard
              key={topic._id}
              topicId={topic.topicId}
              contentId={topic.topicId}
              title={topic.title}
              description={topic.description}
              subject={topic.subjectName}
              domain={topic.domain}
              subdomain={topic.subdomain}
              onVerify={() => handleOnVerify(topic)}
              onReport={(remark) =>
                console.log(`Reported with remark: ${remark}`)
              }
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded mr-2"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded ml-2"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TopicManagement;
