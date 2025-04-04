import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiLoader,
  FiPlus,
  FiAlertTriangle,
  FiInfo,
  FiSearch,
  FiTag,
} from "react-icons/fi";

import { fetchClubs, clearClubError } from "../../slices/clubSlice";

const ClubFormModal = lazy(() =>
  import("../../components/Modals/ClubFormModal")
);

const ClubCard = ({ club, onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    onClick={() => onClick(club.id)}
    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-lg hover:shadow-amber-500/20 hover:border-amber-500/50 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
  >
    <div className="flex items-start justify-between mb-3">
      <h3 className="text-xl font-bold text-amber-400">{club.name}</h3>
      {club.category && (
        <span className="px-2 py-1 text-xs font-medium bg-amber-400/20 text-amber-300 rounded-full flex items-center">
          <FiTag className="mr-1" size={12} />
          {club.category}
        </span>
      )}
    </div>

    <p className="text-gray-300 text-sm flex-grow line-clamp-3 mb-4">
      {club.description || "No description available."}
    </p>

    <div className="mt-auto pt-3 border-t border-gray-700/50 flex justify-between items-center">
      <span className="text-xs text-gray-400">
        {club.memberCount || 0} members
      </span>
      <span className="text-xs font-medium text-amber-400 hover:underline">
        View Details →
      </span>
    </div>
  </motion.div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full min-h-64">
    <div className="relative">
      <FiLoader className="animate-spin text-amber-400 text-4xl" />
      <div className="absolute inset-0 rounded-full animate-ping bg-amber-400/20"></div>
    </div>
  </div>
);

const ClubListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    clubs = [],
    loading: clubsLoading,
    error: clubsError,
  } = useSelector((state) => state.clubs);
  const { roles = [], isAuthenticated } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    ...new Set(clubs.map((club) => club.category).filter(Boolean)),
  ];

  useEffect(() => {
    if (clubs.length === 0 && !clubsLoading) {
      dispatch(fetchClubs());
    }
  }, [dispatch, clubs.length, clubsLoading]);

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      !searchTerm ||
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (club.description &&
        club.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      !selectedCategory || club.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const isAdmin = isAuthenticated && roles.includes("admin");

  const handleClubClick = useCallback(
    (clubId) => {
      navigate(`/clubs/${clubId}`);
    },
    [navigate]
  );

  const openCreateModal = useCallback(() => setIsModalOpen(true), []);
  const closeCreateModal = useCallback(() => {
    setIsModalOpen(false);
    if (clubsError) dispatch(clearClubError());
  }, [dispatch, clubsError]);

  if (clubsLoading && clubs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-center p-4">
        <LoadingSpinner />
        <p className="text-lg text-gray-300 mt-4 animate-pulse">
          Loading Clubs...
        </p>
      </div>
    );
  }

  if (clubsError && !clubsLoading && clubs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-center p-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/60 p-8 rounded-xl shadow-2xl border border-red-700/50 max-w-lg backdrop-blur-sm"
        >
          <FiAlertTriangle className="text-red-400 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-3">
            Failed to Load Clubs
          </h2>
          <p className="text-gray-300 mb-6">{clubsError}</p>
          <button
            onClick={() => {
              dispatch(clearClubError());
              dispatch(fetchClubs());
              toast.success("Retrying...");
            }}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:brightness-110 transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-white px-4 py-8 md:py-12">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 md:mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
            Discover MNNIT Clubs
          </h1>
          <p className="text-blue-400 text-lg max-w-2xl mx-auto">
            Explore the vibrant communities on campus and find your perfect fit
          </p>
        </motion.div>

        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-800/50 text-white border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {isAdmin && (
              <button
                onClick={openCreateModal}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl hover:brightness-110 transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-900 inline-flex items-center whitespace-nowrap"
              >
                <FiPlus className="mr-2" /> Add New Club
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {filteredClubs.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            >
              {filteredClubs.map((club) => (
                <ClubCard key={club.id} club={club} onClick={handleClubClick} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center p-10 bg-gray-800/30 rounded-xl border border-gray-700/50"
            >
              <FiInfo className="text-amber-400 text-5xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">
                {searchTerm || selectedCategory
                  ? "No Matching Clubs Found"
                  : "No Clubs Found"}
              </h2>
              <p className="text-gray-400">
                {searchTerm || selectedCategory
                  ? "Try adjusting your search or filters"
                  : !isAdmin
                  ? "Check back later for new clubs."
                  : "Get started by adding the first club!"}
              </p>
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                  }}
                  className="mt-4 px-4 py-2 text-amber-400 border border-amber-400/30 rounded-lg hover:bg-amber-400/10 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isModalOpen && (
        <Suspense fallback={null}>
          <ClubFormModal
            isOpen={true}
            onClose={closeCreateModal}
            mode="create"
            themeStyles={{}}
          />
        </Suspense>
      )}
    </div>
  );
};

export default ClubListPage;
