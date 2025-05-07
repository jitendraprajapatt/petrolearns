import React from 'react';

interface Topic {
  id: number;
  title: string;
  published: string;
  fullContent: string;
}

interface TopicDetailProps {
  topic: Topic | undefined;
}

const TopicDetail: React.FC<TopicDetailProps> = ({ topic }) => {
  if (!topic) {
    return (
      <div className="p-6">
        <div className="text-center py-10">
          <p className="text-gray-500">Select a topic to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{topic.title}</h2>
        <p className="text-sm text-gray-500 mt-1">Published: {topic.published}</p>
      </div>
      <div className="prose max-w-none">
        <p className="text-gray-700 whitespace-pre-line">{topic.fullContent}</p>
      </div>
    </div>
  );
};

export default TopicDetail;