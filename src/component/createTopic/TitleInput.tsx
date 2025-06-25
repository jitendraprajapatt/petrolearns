import React from 'react';

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TitleInput: React.FC<TitleInputProps> = ({ value, onChange }) => (
  <div className="flex flex-col">
    <label htmlFor="title" className="text-sm font-medium text-gray-700 mb-1">
      Topic Title <span className="text-red-500">*</span>
    </label>
    <input
      id="title"
      type="text"
      placeholder="Enter a descriptive title for your topic"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full m-0.5 px-4 py-2 text-base text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
    />
  </div>
);

export default TitleInput;
