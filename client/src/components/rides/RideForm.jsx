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

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Pickup Location validation
    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = "Pickup location is required";
    }

    // Drop Location validation
    if (!formData.dropLocation.trim()) {
      newErrors.dropLocation = "Drop location is required";
    }

    // Departure Time validation
    if (!formData.departureDateTime) {
      newErrors.departureDateTime = "Departure time is required";
    } else {
      const departureDate = new Date(formData.departureDateTime);
      const now = new Date();
      if (departureDate < now) {
        newErrors.departureDateTime = "Departure time cannot be in the past";
      }
    }

    // Total Seats validation
    if (!formData.totalSeats || formData.totalSeats < 1) {
      newErrors.totalSeats = "Total seats must be at least 1";
    } else if (formData.totalSeats > 8) {
      newErrors.totalSeats = "Maximum 8 seats allowed";
    }

    // Estimated Cost validation
    if (formData.estimatedCost && formData.estimatedCost < 0) {
      newErrors.estimatedCost = "Cost cannot be negative";
    }

    // Phone Number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            className={`w-full bg-gray-800 border ${
              errors.pickupLocation ? "border-red-500" : "border-gray-700"
            } rounded-lg px-4 py-2 text-white`}
            placeholder="Enter pickup location"
          />
          {errors.pickupLocation && (
            <p className="text-red-500 text-sm">{errors.pickupLocation}</p>
          )}
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
            className={`w-full bg-gray-800 border ${
              errors.dropLocation ? "border-red-500" : "border-gray-700"
            } rounded-lg px-4 py-2 text-white`}
            placeholder="Enter drop location"
          />
          {errors.dropLocation && (
            <p className="text-red-500 text-sm">{errors.dropLocation}</p>
          )}
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
            className={`w-full bg-gray-800 border ${
              errors.departureDateTime ? "border-red-500" : "border-gray-700"
            } rounded-lg px-4 py-2 text-white`}
          />
          {errors.departureDateTime && (
            <p className="text-red-500 text-sm">{errors.departureDateTime}</p>
          )}
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
            className={`w-full bg-gray-800 border ${
              errors.totalSeats ? "border-red-500" : "border-gray-700"
            } rounded-lg px-4 py-2 text-white`}
          />
          {errors.totalSeats && (
            <p className="text-red-500 text-sm">{errors.totalSeats}</p>
          )}
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
            min="0"
            className={`w-full bg-gray-800 border ${
              errors.estimatedCost ? "border-red-500" : "border-gray-700"
            } rounded-lg px-4 py-2 text-white`}
            placeholder="Enter estimated cost"
          />
          {errors.estimatedCost && (
            <p className="text-red-500 text-sm">{errors.estimatedCost}</p>
          )}
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
            className={`w-full bg-gray-800 border ${
              errors.phoneNumber ? "border-red-500" : "border-gray-700"
            } rounded-lg px-4 py-2 text-white`}
            placeholder="Enter 10-digit phone number"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
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
