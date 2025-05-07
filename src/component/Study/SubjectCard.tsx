// components/SubjectCard.tsx
import React from 'react';

type SubjectCardProps = {
  name: string;
  description: string;
  count: number;
  image: string;
  onExplore: () => void;
};

const SubjectCard: React.FC<SubjectCardProps> = ({
  name,
  image,
  description,
  count,
  onExplore,
}) => {
  const imageUrl = `http://localhost:5000${image}`;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-shadow hover:shadow-lg h-full">
      <div className="relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20"></div>
        <h3 className="absolute bottom-2 left-2 text-white text-xl font-semibold">{name}</h3>
      </div>
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <p className="text-gray-700 text-sm line-clamp-3">{description}</p>
          <p className="text-gray-500 text-xs mt-2">
            {count} {count === 1 ? 'topic' : 'topics'} available
          </p>
        </div>
      </div>
      <div className="px-6 pb-6">
        <button
          onClick={onExplore}
          className="w-full bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600 transition-colors text-sm font-medium"
        >
          Explore
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;