'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubjectCard from '@/component/Study/SubjectCard';
import api from '@/utils/api'; // Make sure you have axios instance set up
import { customToast } from '@/utils/toast';

interface Subject {
  _id: string;
  name: string;
  image:string;
  description: string;
  count: number;
}

const StudyPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const subjectsPerPage = 10;

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/study/subjects', {
        params: {
          page: currentPage,
          limit: subjectsPerPage,
          search: searchQuery,
        }
      });

      setSubjects(res.data.subjects);
      setTotalSubjects(res.data.totalSubjects);
    } catch (error: any) {
      customToast(error?.response?.data?.message || 'Failed to fetch subjects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [currentPage, searchQuery]);

  const handleExplore = (id: string, name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-'); // Converts to slug
    const path = `/study/${id}-${slug}`;
    router.push(path);
  };

  const totalPages = Math.ceil(totalSubjects / subjectsPerPage);

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-2 text-black">Study Materials</h1>
      <p className="text-center text-gray-600 mb-8">Explore and start learning</p>

      <div className="max-w-md mx-auto mb-10">
        <input
          type="text"
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset page when filtering
          }}
          className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="w-full h-40 bg-gray-200 animate-pulse rounded-xl" />
            ))
          : subjects.length > 0
          ? subjects.map((subject) => (
              <SubjectCard
                key={subject._id}
                name={subject.name}
                image={subject.image}
                description={subject.description}
                count={subject.count}
                onExplore={() => handleExplore( subject._id , subject.name)}
              />
            ))
          : (
            <p className="text-center text-gray-500 col-span-full">
              No subjects found.
            </p>
          )}
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StudyPage;
