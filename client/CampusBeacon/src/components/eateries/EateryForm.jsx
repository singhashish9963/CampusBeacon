import React, { useState } from "react";
import { X, Save, Camera } from "lucide-react";

const EateryForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    openingTime: "",
    closingTime: "",
    phoneNumber: "",
    ...initialData,
  });
  const [menuImage, setMenuImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    initialData?.menuImageUrl || null
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMenuImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, menuImage);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label className="block text-gray-200 font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          required
        />
      </div>

      <div className="space-y-3">
        <label className="block text-gray-200 font-medium">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="block text-gray-200 font-medium">
            Opening Time
          </label>
          <input
            type="text"
            name="openingTime"
            value={formData.openingTime}
            placeholder="e.g., 9:00 AM"
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-gray-200 font-medium">
            Closing Time
          </label>
          <input
            type="text"
            name="closingTime"
            value={formData.closingTime}
            placeholder="e.g., 6:00 PM"
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-gray-200 font-medium">Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-gray-200 font-medium">Menu Image</label>
        <div className="flex items-center space-x-4">
          <label className="relative cursor-pointer bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
            <span className="flex items-center">
              <Camera className="mr-2" />
              Choose Image
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          {previewUrl && (
            <div className="relative h-16 w-16">
              <img
                src={previewUrl}
                alt="Menu Preview"
                className="h-full w-full object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                onClick={() => {
                  setMenuImage(null);
                  setPreviewUrl(null);
                }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>
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

export default EateryForm;
