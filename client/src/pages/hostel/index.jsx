import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { getAllHostels } from "../../slices/hostelSlice";

const HostelSelectionPage = () => {
  const dispatch = useDispatch();
  const { hostels, loading } = useSelector((state) => state.hostel);

  useEffect(() => {
    dispatch(getAllHostels());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-purple-500/20 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 bg-purple-500/20 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">
          Select Your Hostel
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hostels.map((hostel) => (
            <Link to={`/hostels/${hostel.hostel_id}`} key={hostel.hostel_id}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50 h-full"
              >
                <h2 className="text-2xl font-bold text-white mb-4">
                  {hostel.hostel_name}
                </h2>
                <p className="text-gray-300">
                  Click to view hostel details, mess menu, and more.
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HostelSelectionPage;
