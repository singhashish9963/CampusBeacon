import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useHostel } from "../../contexts/hostelContext";
import SeeHostel from "./SeeHostel"; // Import the SeeHostel component

const HostelSelector = () => {
  const { hostels, fetchHostels } = useHostel();
  const [selectedHostelId, setSelectedHostelId] = useState("");

  // Fetch hostels when component mounts
  useEffect(() => {
    fetchHostels();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900 py-8">
      <div className="container mx-auto px-4">
        {/* Hostel Selection Dropdown */}
        <div className="mb-6 text-center">
          <label className="text-white text-lg font-semibold mr-4">
            Select Hostel:
          </label>
          <select
            value={selectedHostelId}
            onChange={(e) => setSelectedHostelId(e.target.value)}
            className="p-2 bg-black/30 text-white rounded-lg"
          >
            <option value="">-- Choose a Hostel --</option>
            {hostels.map((hostel) => (
              <option key={hostel.hostel_id} value={hostel.hostel_id}>
                {hostel.hostel_name}
              </option>
            ))}
          </select>
        </div>

        {/* Render the SeeHostel component when a hostel is selected */}
        {selectedHostelId && <SeeHostel hostelId={selectedHostelId} />}
      </div>
    </div>
  );
};

export default HostelSelector;
