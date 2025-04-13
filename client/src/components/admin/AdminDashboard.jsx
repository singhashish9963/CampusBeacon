// src/components/admin/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../slices/authSlice";
import UserCard from "./UserCard";
import { TailSpin } from "react-loader-spinner";
import { FiSearch, FiUsers, FiUserPlus, FiUserX, FiUserCheck, FiCalendar, FiGrid, FiList } from "react-icons/fi";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    allUsers = [],
    isLoading,
    error,
  } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Filter and sort users
  const filteredUsers = allUsers
    .filter((user) => {
      // Apply search filter
      const matchesSearch =
        !searchTerm ||
        (user.name &&
          user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email &&
          user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.id && user.id.toString().includes(searchTerm));

      // Apply status filter
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "verified" && user.isVerified) ||
        (filterStatus === "unverified" && !user.isVerified);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "alphabetical":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return 0;
      }
    });

  // User stats
  const totalUsers = allUsers.length;
  const verifiedUsers = allUsers.filter((user) => user.isVerified).length;
  const unverifiedUsers = totalUsers - verifiedUsers;
  const recentUsers = allUsers.filter((user) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(user.createdAt) > oneWeekAgo;
  }).length;

  return (
    <div className="p-4 md:p-6 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
          User Management Dashboard
        </h1>
        <p className="text-gray-400">
          Manage and monitor all users in your system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-900 bg-opacity-30 text-blue-400">
              <FiUsers size={24} />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold text-white">{totalUsers}</h3>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-900 bg-opacity-30 text-green-400">
              <FiUserCheck size={24} />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Verified Users</p>
              <h3 className="text-2xl font-bold text-white">{verifiedUsers}</h3>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-900 bg-opacity-30 text-red-400">
              <FiUserX size={24} />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Unverified Users</p>
              <h3 className="text-2xl font-bold text-white">
                {unverifiedUsers}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-amber-900 bg-opacity-30 text-amber-400">
              <FiUserPlus size={24} />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">New This Week</p>
              <h3 className="text-2xl font-bold text-white">{recentUsers}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 mb-6 border border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-grow max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Users</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>

            {/* Sort Options */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Name (A-Z)</option>
            </select>

            {/* View Toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-700">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 flex items-center ${
                  viewMode === "grid"
                    ? "bg-amber-600 text-white"
                    : "bg-gray-900 text-gray-400 hover:text-white"
                }`}
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 flex items-center ${
                  viewMode === "list"
                    ? "bg-amber-600 text-white"
                    : "bg-gray-900 text-gray-400 hover:text-white"
                }`}
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col justify-center items-center h-64 bg-gray-800 bg-opacity-30 rounded-xl border border-gray-700">
          <TailSpin color="#F59E0B" height={60} width={60} />
          <p className="mt-4 text-lg text-gray-400">Loading Users...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          className="bg-red-900 border border-red-700 text-white px-6 py-4 rounded-xl mb-6 flex items-center"
          role="alert"
        >
          <svg
            className="w-6 h-6 text-red-300 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <span className="font-semibold">Error loading users!</span>
            <span className="block sm:inline ml-1">{error}</span>
          </div>
        </div>
      )}

      {/* Results Count */}
      {!isLoading && !error && (
        <div className="mb-4 text-gray-400">
          Showing {filteredUsers.length} of {allUsers.length} users
        </div>
      )}

      {/* User Grid/List */}
      {!isLoading &&
        !error &&
        (viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 bg-gray-800 bg-opacity-30 rounded-xl border border-gray-700">
                <svg
                  className="w-16 h-16 text-gray-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-400 text-xl">No users found</p>
                <p className="text-gray-500 mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-left">
                  <th className="px-4 py-3 rounded-tl-lg">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-700 hover:bg-gray-800"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                            {user.name
                              ? user.name.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                          <div className="ml-3">
                            <p className="text-white">
                              {user.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-400">
                              ID: {user.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{user.email}</td>
                      <td className="px-4 py-3">
                        {user.isVerified ? (
                          <span className="px-2 py-1 bg-green-900 bg-opacity-30 text-green-400 rounded-full text-xs font-medium">
                            Verified
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-900 bg-opacity-30 text-red-400 rounded-full text-xs font-medium">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button className="p-1 rounded-md bg-blue-900 bg-opacity-30 text-blue-400 hover:bg-opacity-50 transition-colors">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          <button className="p-1 rounded-md bg-amber-900 bg-opacity-30 text-amber-400 hover:bg-opacity-50 transition-colors">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                          <button className="p-1 rounded-md bg-red-900 bg-opacity-30 text-red-400 hover:bg-opacity-50 transition-colors">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center">
                      <svg
                        className="w-12 h-12 text-gray-600 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-gray-400 text-xl">No users found</p>
                      <p className="text-gray-500 mt-2">
                        Try adjusting your search or filters
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}

      {/* Pagination - Optional enhancement */}
      {!isLoading && !error && filteredUsers.length > 0 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-1 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 rounded-md bg-amber-600 text-white">
              1
            </button>
            <button className="px-3 py-1 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700">
              2
            </button>
            <button className="px-3 py-1 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700">
              3
            </button>
            <span className="text-gray-500">...</span>
            <button className="px-3 py-1 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700">
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;