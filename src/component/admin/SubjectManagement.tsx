import { useEffect, useState } from 'react';
import axios from 'axios';
import SubjectCard from '@/component/admin/SubjectCard';
import CreateSubjectForm from '@/component/admin/SubjectCreate';
import api from '@/utils/api';

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSubjects = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const res = await api.get('/admin/subjects', {
        params: { page, search, limit: 10 },
        withCredentials: true,
      });

      setSubjects(res.data.subjects);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (id: string) => {
    await api.delete(`/subjects/${id}`);
    fetchSubjects(currentPage, searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // reset to first page
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Debounce search input to reduce API calls
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSubjects(currentPage, searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchQuery]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Subject Management</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {showCreateForm ? 'View Subjects' : 'Create Subject'}
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="border p-2 rounded w-full md:w-1/3"
          placeholder="Search by subject name..."
        />
      </div>

      {showCreateForm ? (
        <CreateSubjectForm
          onCreated={() => {
            fetchSubjects(1, '');
            setShowCreateForm(false);
            setSearchQuery('');
            setCurrentPage(1);
          }}
        />
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
            {subjects.length > 0 ? (
              subjects.map((subj: any) => (
                <SubjectCard key={subj._id} subject={subj} onDelete={deleteSubject} />
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">No subjects found.</p>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-6 py-3 border rounded-l-md bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-xl">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-6 py-3 border rounded-r-md bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
