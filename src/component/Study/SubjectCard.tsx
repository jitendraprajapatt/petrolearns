import React from 'react';

type SubjectCardProps = {
  name: string;
  description: string;
  count: number;
  image: string;
  onExplore: () => void;
  domain: string;
  subdomain: string;
};

const SubjectCard: React.FC<SubjectCardProps> = ({
  name,
  image,
  description,
  count,
  domain,
  subdomain,
  onExplore,
}) => {
   let imageUrl;

if (/^https?:\/\//.test(image)) {
  // If subject.image is a full URL, use it directly
  imageUrl = image;
} else {
  // Otherwise, prepend your base URL
  imageUrl = `${process.env.BASE_IMAGE}${image}`;
}

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col transition hover:shadow-md text-sm max-w-xs mx-auto">
      {/* Slightly increased image height */}
      <div className="relative h-36">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/30" />
        <h3 className="absolute bottom-1 left-2 text-white text-base font-semibold drop-shadow-sm">
          {name}
        </h3>
      </div>

      <div className="p-3 space-y-2 flex flex-col justify-between flex-grow">
        <p className="text-gray-700 line-clamp-2 text-xs">{description}</p>
        <div className="text-xs text-gray-500">
          <p><span className="font-semibold text-gray-600">Domain:</span> {domain}</p>
          <p><span className="font-semibold text-gray-600">Subdomain:</span> {subdomain}</p>
        </div>
        <p className="text-xs text-gray-400">
          {count} {count === 1 ? 'topic' : 'topics'} available
        </p>
      </div>

      <div className="p-3 pt-0">
        <button
          onClick={onExplore}
          className="w-full cursor-pointer bg-sky-600 hover:bg-sky-700 text-white py-1.5 rounded-md text-sm font-medium transition"
        >
          Explore
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;
