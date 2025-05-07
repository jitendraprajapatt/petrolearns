import React from 'react';

interface Topic {
  id: number;
  title: string;
  description: string;
}

interface TopicListProps {
  topics: Topic[];
  selectedId: number;
  onSelect: (id: number) => void;
}

const TopicList: React.FC<TopicListProps> = ({ topics, selectedId, onSelect }) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Topics</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {topics.length === 0 ? (
          <li className="p-4 text-center text-gray-500">No topics available</li>
        ) : (
          topics.map((topic) => (
            <li
              key={topic.id}
              onClick={() => onSelect(topic.id)}
              className={`p-4 cursor-pointer transition-colors ${
                selectedId === topic.id
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <h3 className="font-medium text-gray-900">{topic.title}</h3>
              <p className="text-sm text-gray-500 mt-1 truncate">{topic.description}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TopicList;