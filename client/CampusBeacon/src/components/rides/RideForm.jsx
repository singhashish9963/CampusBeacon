import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";

const RideForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    departureDateTime: "",
    totalSeats: 1,
    estimatedCost: "",
    description: "",
    phoneNumber: "",
    ...initialData,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-gray-200 font-medium">
            Pickup Location
          </label>
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            required
          />
        </div>

        <div className="space-y-3">
          <label className="block text-gray-200 font-medium">
            Drop Location
          </label>
          <input
            type="text"
            name="dropLocation"
            value={formData.dropLocation}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-gray-200 font-medium">
            Departure Time
          </label>
          <input
            type="datetime-local"
            name="departureDateTime"
            value={formData.departureDateTime}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            required
          />
        </div>

        <div className="space-y-3">
          <label className="block text-gray-200 font-medium">Total Seats</label>
          <input
            type="number"
            name="totalSeats"
            value={formData.totalSeats}
            onChange={handleChange}
            min="1"
            max="8"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-gray-200 font-medium">
            Estimated Cost (₹)
          </label>
          <input
            type="number"
            name="estimatedCost"
            value={formData.estimatedCost}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            required
          />
        </div>

        <div className="space-y-3">
          <label className="block text-gray-200 font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-gray-200 font-medium">
          Description (Optional)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-24 resize-none"
          placeholder="Add any additional information about the ride..."
        />
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center"
        >
          <Save className="mr-2" />
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RideForm;
