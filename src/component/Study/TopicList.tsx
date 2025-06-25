import React from 'react';
import { FiClock } from 'react-icons/fi';
import { format } from 'date-fns';

interface Topic {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface TopicListProps {
  topicList: Topic[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const TopicList: React.FC<TopicListProps> = ({ topicList, selectedId, onSelect }) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span>Topics</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {topicList.length}
          </span>
        </h2>
      </div>
      
      <ul className="divide-y divide-gray-200">
        {topicList.length === 0 ? (
          <li className="p-6 text-center">
            <div className="text-gray-500">No topics found</div>
          </li>
        ) : (
          topicList.map((topic) => (
            <li
              key={topic._id}
              onClick={() => onSelect(topic._id)}
              className={`p-4 cursor-pointer transition-all duration-200 ${
                selectedId === topic._id
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">{topic.title}</h3>
                <div className="flex items-center text-xs text-gray-500">
                  <FiClock className="mr-1" size={12} />
                  {format(new Date(topic.createdAt), 'MMM d, yyyy')}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{topic.description}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TopicList;