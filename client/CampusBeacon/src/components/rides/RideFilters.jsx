import React from "react";
import { motion } from "framer-motion";
import { Filter, MapPin } from "lucide-react";

const RideFilters = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="relative">
        <input
          type="text"
          placeholder="Search rides..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-black/40 border border-purple-500/50 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pl-10 w-full md:w-64"
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>

      <select
        value={filters.sortBy}
        onChange={(e) => onFilterChange("sortBy", e.target.value)}
        className="bg-black/40 border border-purple-500/50 rounded-lg px-4 py-2 text-white focus:outline-none"
      >
        <option value="dateAsc">Date: Earliest First</option>
        <option value="dateDesc">Date: Latest First</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="seatsAsc">Available Seats: Low to High</option>
        <option value="seatsDesc">Available Seats: High to Low</option>
      </select>

      <select
        value={filters.status}
        onChange={(e) => onFilterChange("status", e.target.value)}
        className="bg-black/40 border border-purple-500/50 rounded-lg px-4 py-2 text-white focus:outline-none"
      >
        <option value="all">All Rides</option>
        <option value="active">Active Rides</option>
        <option value="completed">Completed Rides</option>
        <option value="myRides">My Rides</option>
        <option value="joined">Rides I've Joined</option>
      </select>
    </div>
  );
};

export default RideFilters;
