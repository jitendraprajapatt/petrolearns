import { useEffect, useState } from "react";
import api from "../../utils/api";
import { customToast } from "../../utils/toast";
import { AxiosError } from "axios";
import { FiCheck, FiX, FiSearch } from "react-icons/fi";

interface User {
  _id: string;
  fullName: string;
  email: string;
  status: "allowed" | "restricted";
  role: "User" | "Admin" | "Volunteer";
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 20;

  type ErrorResponse = {
    message: string;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: usersPerPage,
      };

      if (emailFilter) params.search = emailFilter;
      if (roleFilter !== "All") params.role = roleFilter;

      const res = await api.get("/admin/users", {
        params,
        withCredentials: true,
      });

      setUsers(res.data.users);
      setTotalUsers(res.data.totalUsers);
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const message = error.response?.data?.message || "Failed to load users";
      customToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "allowed" ? "restricted" : "allowed";
      await api.patch(`/admin/users/${id}/status`, { status: newStatus }, {
        withCredentials: true,
      });
      customToast(`User ${newStatus}`, "success");
      fetchUsers();
    } catch (err: any) {
      customToast(err?.response?.data?.message || "Failed to update status", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, emailFilter, roleFilter]);

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Management</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute top-3.5 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email"
            value={emailFilter}
            onChange={(e) => {
              setEmailFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 w-full transition"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
          <option value="Volunteer">Volunteer</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading users...</p>
      ) : (
        <>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50 text-gray-700 text-sm font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {users.length > 0 ? users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-600">{user._id.slice(0, 6)}...</td>
                    <td className="px-4 py-3">{user.fullName}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.role}</td>
                    <td className="px-4 py-3 capitalize">{user.status}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => updateUserStatus(user._id, user.status)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition ${
                          user.status === "allowed"
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {user.status === "allowed" ? (
                          <>
                            <FiX /> Restrict
                          </>
                        ) : (
                          <>
                            <FiCheck /> Allow
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-5 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-sm rounded-md disabled:opacity-50 hover:bg-gray-300"
              >
                Prev
              </button>
              <span className="px-3 py-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-sm rounded-md disabled:opacity-50 hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
