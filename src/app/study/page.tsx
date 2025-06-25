'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubjectCard from '@/component/Study/SubjectCard';
import api from '@/utils/api';
import { customToast } from '@/utils/toast';
import TopicFilter from '@/component/filter/TopicFilter';

interface Subject {
  _id: string;
  name: string;
  image: string;
  description: string;
  count: number;
  domain: string;
  subdomain: string;
}

const StudyPage = () => {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [filters, setFilters] = useState({
    title: '',
    subject: '',
    status: '',
    domain: '',
    subdomain: '',
  });

  const subjectsPerPage = 10;

  const fetchSubjects = async () => {
    
    try {
      setLoading(true);
      const res = await api.get('/study/subjects', {
        params: {
          page: currentPage,
          limit: subjectsPerPage,
          ...filters,
        },
      });

      setSubjects(res.data.subjects);
      console.log(subjects)
      setTotalSubjects(res.data.totalSubjects);
    } catch (error: any) {
      customToast(error?.response?.data?.message || 'Failed to fetch subjects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [currentPage, filters]);

  const handleExplore = (id: string, name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    router.push(`/study/${id}-${slug}`);
  };

  const totalPages = Math.ceil(totalSubjects / subjectsPerPage);

  return (
    <div className="min-h-screen bg-white py-10 px-4 relative">
      <h1 className="text-4xl font-bold text-center mb-2 text-black">Study Materials</h1>
      <p className="text-center text-gray-600 mb-8">Explore and start learning</p>

      <div className="max-w-4xl mx-auto mb-10">
        <TopicFilter
          showTitle={false}
          showStatus={false}
          filters={filters}
          onFilterChange={(updatedFilters) => {
            setFilters(updatedFilters);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Subject Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-gray-200 animate-pulse rounded-xl h-72 max-w-xs mx-auto w-full" />
          ))
        ) : subjects.length > 0 ? (
          subjects.map((subject) => (
            <SubjectCard
              key={subject._id}
              name={subject.name}
              image={subject.image}
              description={subject.description}
              count={subject.count}
              domain={subject.domain}
              subdomain={subject.subdomain}
              onExplore={() => handleExplore(subject._id, subject.name)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No subjects found.</p>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Full-page loading overlay (optional) */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-60 z-50 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default StudyPage;
