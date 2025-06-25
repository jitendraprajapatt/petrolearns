import React from 'react';

type SubjectCardProps = {
  subject: {
    _id: string;
    name: string;
    description: string;
    image: string;
    count: number;
    domain: string;
    subdomain: string;
  };
  onDelete: (id: string) => void;
  onExplore?: () => void; // Optional
};

export default function SubjectCard({ subject, onDelete, onExplore }: SubjectCardProps) {
  let imageUrl ;
  if (/^https?:\/\//.test(subject.image)) {
  // If subject.image is a full URL, use it directly
  imageUrl = subject.image;
} else {
  // Otherwise, prepend your base URL
  imageUrl = `${process.env.BASE_IMAGE}${subject.image}`;
}

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden w-full md:w-80 transition-all duration-300 hover:shadow-xl flex flex-col">
      <div className="relative h-48">
        <img
          src={imageUrl}
          alt={subject.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-4 py-2">
          <h3 className="text-white text-lg font-semibold truncate">{subject.name}</h3>
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between flex-grow">
        <div className="mb-3">
          <p className="text-sm text-gray-600 mb-1 line-clamp-2">{subject.description}</p>
          <p className="text-xs text-gray-500"><strong>Domain:</strong> {subject.domain}</p>
          <p className="text-xs text-gray-500 mb-1"><strong>Subdomain:</strong> {subject.subdomain}</p>
          <p className="text-xs text-gray-400">Topics: {subject.count}</p>
        </div>

        <div className="flex justify-between items-center mt-auto">
          <button
            onClick={() => onDelete(subject._id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
          >
            Delete
          </button>

          {/* Optional explore button */}
          {/* 
          {onExplore && (
            <button
              onClick={onExplore}
              className="text-sky-600 hover:text-sky-800 text-sm font-medium"
            >
              Explore
            </button>
          )} 
          */}
        </div>
      </div>
    </div>
  );
}
