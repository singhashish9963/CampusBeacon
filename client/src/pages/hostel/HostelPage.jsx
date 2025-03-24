import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getHostelById,
  getMenuByHostel,
  getOfficialsByHostel,
  getComplaintsByHostel,
  getHostelNotifications,
} from "../../slices/hostelSlice";
import MessMenu from "../../components/hostel/MessMenu/MessMenu";
import Notifications from "../../components/hostel/Notifications/Notifications";
import Complaints from "../../components/hostel/Complaints/Complaints";
import Officials from "../../components/hostel/Officials/Officials";

const HostelPage = () => {
  const { hostelId } = useParams();
  const dispatch = useDispatch();
  const { currentHostel, loading } = useSelector((state) => state.hostel);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchHostelData = useCallback(async () => {
    if (!hostelId) return;

    try {
      setError(null);
      await Promise.all([
        dispatch(getHostelById(hostelId)).unwrap(),
        dispatch(getMenuByHostel(hostelId)).unwrap(),
        dispatch(getOfficialsByHostel(hostelId)).unwrap(),
        dispatch(getComplaintsByHostel(hostelId)).unwrap(),
        dispatch(getHostelNotifications(hostelId)).unwrap(),
      ]);
    } catch (error) {
      setError(error.message || "Error fetching hostel data");
      console.error("Error fetching hostel data:", error);
    } finally {
      setIsInitialLoad(false);
    }
  }, [hostelId, dispatch]);

  useEffect(() => {
    if (isInitialLoad) {
      fetchHostelData();
    }
  }, [fetchHostelData, isInitialLoad]);

  if (loading && isInitialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-purple-500/20 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-64 bg-purple-500/20 rounded-xl"
                  ></div>
                ))}
              </div>
              <div className="space-y-8">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-64 bg-purple-500/20 rounded-xl"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 text-white">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            <button
              onClick={() => {
                setIsInitialLoad(true);
                setError(null);
              }}
              className="mt-4 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">
          {currentHostel?.hostel_name}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side: Mess Menu, Notifications & Complaint */}
          <div className="lg:col-span-2 space-y-8">
            <MessMenu hostelId={hostelId} />
            <Notifications hostelId={hostelId} />
            <Complaints hostelId={hostelId} />
          </div>
          {/* Right side: Officials */}
          <div className="space-y-8">
            <Officials hostelId={hostelId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelPage;
