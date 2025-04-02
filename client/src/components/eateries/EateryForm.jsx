import React, { useState, useEffect } from "react";
import { X, Save, Camera, Loader2 } from "lucide-react";

const formatTimeToHHMM = (timeString) => {
  if (!timeString || typeof timeString !== "string") return "";
  if (/^\d{2}:\d{2}$/.test(timeString)) return timeString;
  const match = timeString.match(/^(\d{2}:\d{2}):\d{2}/);
  return match ? match[1] : "";
};

const EateryForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    location: initialData?.location || "",
    openingTime: formatTimeToHHMM(initialData?.openingTime),
    closingTime: formatTimeToHHMM(initialData?.closingTime),
    phoneNumber: initialData?.phoneNumber || "",
    description: initialData?.description || "",
  });

  const [menuImage, setMenuImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    initialData?.menuImageUrl || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (
      initialData?.menuImageUrl !== previewUrl &&
      !previewUrl?.startsWith("blob:")
    ) {
      setPreviewUrl(initialData?.menuImageUrl || null);
    }
    setFormData((prev) => ({
      ...prev,
      name: initialData?.name ?? prev.name,
      location: initialData?.location ?? prev.location,
      openingTime: formatTimeToHHMM(
        initialData?.openingTime ?? prev.openingTime
      ),
      closingTime: formatTimeToHHMM(
        initialData?.closingTime ?? prev.closingTime
      ),
      phoneNumber: initialData?.phoneNumber ?? prev.phoneNumber,
      description: initialData?.description ?? prev.description,
    }));
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB.");
        return;
      }
      setMenuImage(file);
      const newPreviewUrl = URL.createObjectURL(file);
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(newPreviewUrl);
    } else if (file) {
      alert("Invalid file type. Please select an image (JPG, PNG, WEBP).");
      e.target.value = null;
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setMenuImage(null);
    setPreviewUrl(initialData?.menuImageUrl || null);
    const fileInput = document.getElementById("menuImage");
    if (fileInput) {
      fileInput.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData, menuImage);
    } catch (error) {
      console.error("Error submitting eatery form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70"
          placeholder="e.g., Main Canteen"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Location <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70"
          placeholder="e.g., Near Admin Building"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="openingTime"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Opening Time
          </label>
          <input
            type="time"
            id="openingTime"
            name="openingTime"
            value={formData.openingTime}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="closingTime"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Closing Time
          </label>
          <input
            type="time"
            id="closingTime"
            name="closingTime"
            value={formData.closingTime}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Optional contact number"
          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Optional: Short description about the eatery"
          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Menu Image
        </label>
        <div className="flex items-center space-x-4">
          <label
            className={`relative cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out shadow-sm hover:shadow-md ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="flex items-center text-sm">
              <Camera size={16} className="mr-1.5" />
              {previewUrl ? "Change" : "Choose"} Image
            </span>
            <input
              type="file"
              id="menuImage"
              name="menuImage"
              accept="image/png, image/jpeg, image/webp"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageChange}
              disabled={isSubmitting}
            />
          </label>
          {previewUrl && (
            <div className="relative h-16 w-16 flex-shrink-0">
              <img
                src={previewUrl}
                alt="Menu Preview"
                className="h-full w-full object-cover rounded-md shadow-md border border-gray-600"
              />
              {!isSubmitting && (
                <button
                  type="button"
                  aria-label="Remove image"
                  className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full p-0.5 shadow-md transition"
                  onClick={handleRemoveImage}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Optional. Max 5MB. JPG, PNG, WEBP accepted.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full sm:w-auto flex-1 order-1 sm:order-2 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white py-2.5 px-5 rounded-md transition duration-150 ease-in-out shadow-md hover:shadow-lg text-sm font-medium flex items-center justify-center ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin mr-2" />
          ) : (
            <Save size={18} className="mr-2" />
          )}
          {isSubmitting ? "Saving..." : "Save Eatery"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto flex-1 order-2 sm:order-1 bg-gray-600 hover:bg-gray-500 text-gray-200 py-2.5 px-5 rounded-md transition duration-150 ease-in-out text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EateryForm;
