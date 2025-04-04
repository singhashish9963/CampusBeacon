import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import {
  FiX,
  FiLoader,
  FiImage,
  FiVideo,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import { createEvent, updateEvent } from "../../slices/eventSlice";
import { fetchCoordinators } from "../../slices/coordinatorSlice";
import { createFormData } from "../../utils/formDataHelper";
import toast from "react-hot-toast";

const MultiSelectCoordinators = ({
  options = [],
  selectedIds = [],
  onChange,
  loading,
}) => {
  const handleSelect = (id) => {
    const newSelectedIds = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    onChange(newSelectedIds);
  };

  if (loading) {
    return (
      <p className="text-sm text-gray-400 italic">Loading coordinators...</p>
    );
  }
  if (options.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">
        No coordinators available for this club.
      </p>
    );
  }

  return (
    <div className="max-h-40 overflow-y-auto border border-gray-600 rounded-md p-2 bg-gray-700 space-y-1">
      {options.map((coord) => (
        <label
          key={coord.id}
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-600/50 p-1 rounded"
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(coord.id)}
            onChange={() => handleSelect(coord.id)}
            className="h-4 w-4 rounded border-gray-500 bg-gray-600 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm text-gray-200">
            {coord.name} ({coord.designation})
          </span>
        </label>
      ))}
    </div>
  );
};

const EventFormModal = ({
  isOpen,
  onClose,
  mode = "create",
  initialData = null,
}) => {
  const dispatch = useDispatch();
  const { coordinators: availableCoordinators, loading: coordinatorsLoading } =
    useSelector((state) => state.coordinators);
  const currentClubId =
    mode === "create" ? initialData?.club_id : initialData?.club_id;

  useEffect(() => {
    if (isOpen && currentClubId) {
      dispatch(fetchCoordinators(currentClubId));
    }
  }, [dispatch, isOpen, currentClubId]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [clubId, setClubId] = useState("");
  const [socialLinks, setSocialLinks] = useState([""]);
  const [images, setImages] = useState(null);
  const [videos, setVideos] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [deleteExistingImages, setDeleteExistingImages] = useState(false);
  const [deleteExistingVideos, setDeleteExistingVideos] = useState(false);
  const [selectedCoordinatorIds, setSelectedCoordinatorIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setDeleteExistingImages(false);
      setDeleteExistingVideos(false);
      setSelectedCoordinatorIds([]);

      if (mode === "edit" && initialData) {
        setName(initialData.name || "");
        setDescription(initialData.description || "");
        setLocation(initialData.location || "");
        try {
          setDate(
            initialData.date
              ? new Date(initialData.date).toISOString().split("T")[0]
              : ""
          );
        } catch {
          setDate("");
        }
        setClubId(initialData.club_id || "");
        setSocialLinks(
          initialData.social_media_links?.length > 0
            ? [...initialData.social_media_links]
            : [""]
        );
        setExistingImages(initialData.images || []);
        setExistingVideos(initialData.videos || []);
        if (Array.isArray(initialData.Coordinators)) {
          setSelectedCoordinatorIds(initialData.Coordinators.map((c) => c.id));
        } else {
          setSelectedCoordinatorIds(initialData.coordinator_ids || []);
        }
        setImages(null);
        setVideos(null);
      } else {
        setName("");
        setDescription("");
        setLocation("");
        setDate("");
        setClubId(initialData?.club_id || "");
        setSocialLinks([""]);
        setExistingImages([]);
        setExistingVideos([]);
        setSelectedCoordinatorIds([]);
        setImages(null);
        setVideos(null);
      }
    }
  }, [isOpen, mode, initialData]);

  const handleSocialLinkChange = (index, value) => {
    const newLinks = [...socialLinks];
    newLinks[index] = value;
    setSocialLinks(newLinks);
  };
  const addSocialLinkInput = () => setSocialLinks([...socialLinks, ""]);
  const removeSocialLinkInput = (index) => {
    if (socialLinks.length > 1)
      setSocialLinks(socialLinks.filter((_, i) => i !== index));
    else setSocialLinks([""]);
  };
  const handleImageChange = (e) => {
    if (e.target.files) setImages(e.target.files);
  };
  const handleVideoChange = (e) => {
    if (e.target.files) setVideos(e.target.files);
  };
  const handleCoordinatorSelection = (ids) => setSelectedCoordinatorIds(ids);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clubId) {
      setError("Club ID is missing. Cannot save event.");
      return;
    }
    setLoading(true);
    setError(null);

    const finalSocialLinks = socialLinks.filter((link) => link.trim() !== "");

    const eventPayload = {
      name,
      description,
      location,
      date,
      club_id: clubId,
      social_media_links: finalSocialLinks,
      coordinator_ids: selectedCoordinatorIds,
      images,
      videos,
    };

    if (mode === "edit") {
      eventPayload.deleteExistingImages = deleteExistingImages;
      eventPayload.deleteExistingVideos = deleteExistingVideos;
    }

    const formData = createFormData(
      eventPayload,
      ["images", "videos"],
      ["social_media_links", "coordinator_ids"]
    );

    try {
      if (mode === "create") {
        await dispatch(createEvent(formData)).unwrap();
        toast.success("Event created successfully!");
      } else if (mode === "edit" && initialData) {
        await dispatch(
          updateEvent({ id: initialData.id, eventData: formData })
        ).unwrap();
        toast.success("Event updated successfully!");
      }
      onClose();
    } catch (err) {
      console.error("Failed to save event:", err);
      setError(err.message || `Failed to ${mode} event.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all border border-gray-700">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white flex justify-between items-center"
                >
                  {mode === "create" ? "Create New Event" : "Edit Event"}
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white"
                  >
                    <FiX size={20} />
                  </button>
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="eventName"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Event Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="eventName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 placeholder-gray-500 px-3 py-2"
                      placeholder="e.g., RoboWars 2025"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="eventDescription"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="eventDescription"
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 placeholder-gray-500 px-3 py-2"
                      placeholder="Describe the event..."
                    ></textarea>
                  </div>

                  {/* Location & Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="eventLocation"
                        className="block text-sm font-medium text-gray-300"
                      >
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="eventLocation"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 placeholder-gray-500 px-3 py-2"
                        placeholder="e.g., MP Hall"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="eventDate"
                        className="block text-sm font-medium text-gray-300"
                      >
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="eventDate"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 placeholder-gray-500 px-3 py-2"
                      />
                    </div>
                  </div>

                  {/* Coordinators Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Assign Coordinators (Optional)
                    </label>
                    <MultiSelectCoordinators
                      options={availableCoordinators}
                      selectedIds={selectedCoordinatorIds}
                      onChange={handleCoordinatorSelection}
                      loading={coordinatorsLoading}
                    />
                  </div>

                  {/* Social Media Links (reuse code) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Event Social Media Links
                    </label>
                    {socialLinks.map((link, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <input
                          type="url"
                          value={link}
                          onChange={(e) =>
                            handleSocialLinkChange(index, e.target.value)
                          }
                          className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 placeholder-gray-500 px-3 py-2 text-sm"
                          placeholder="https://..."
                        />
                        <button
                          type="button"
                          onClick={() => removeSocialLinkInput(index)}
                          className="p-1.5 text-red-400 hover:text-red-300 disabled:opacity-50"
                          disabled={socialLinks.length <= 1 && link === ""}
                          aria-label="Remove link"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSocialLinkInput}
                      className="mt-1 text-sm text-purple-400 hover:text-purple-300 flex items-center"
                    >
                      <FiPlus className="mr-1" /> Add Link
                    </button>
                  </div>

                  {/* Image & Video Uploads */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Image Upload */}
                    <div>
                      <label
                        htmlFor="eventImages"
                        className="block text-sm font-medium text-gray-300"
                      >
                        Images
                      </label>
                      {mode === "edit" && existingImages.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-400 mb-1">
                            Current images:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {existingImages.map((imgUrl, idx) => (
                              <img
                                key={idx}
                                src={imgUrl}
                                alt={`Existing Img ${idx + 1}`}
                                className="h-10 w-10 object-cover rounded border border-gray-600"
                              />
                            ))}
                          </div>
                          <div className="mt-2 flex items-center">
                            <input
                              id="deleteEventExistingImages"
                              type="checkbox"
                              checked={deleteExistingImages}
                              onChange={(e) =>
                                setDeleteExistingImages(e.target.checked)
                              }
                              className="h-4 w-4 rounded border-gray-500 bg-gray-600 text-purple-600 focus:ring-purple-500"
                            />
                            <label
                              htmlFor="deleteEventExistingImages"
                              className="ml-2 block text-xs text-gray-400"
                            >
                              Replace existing images
                            </label>
                          </div>
                        </div>
                      )}
                      <label
                        htmlFor="eventImages"
                        className={`mt-1 flex justify-center px-6 py-4 border-2 ${
                          error ? "border-red-500" : "border-gray-600"
                        } border-dashed rounded-md cursor-pointer hover:border-gray-500 bg-gray-700/50`}
                      >
                        <div className="space-y-1 text-center">
                          <FiImage className="mx-auto h-8 w-8 text-gray-400" />
                          <div className="flex text-xs text-gray-400">
                            <span className="relative font-medium text-purple-400 hover:text-purple-300">
                              Upload Images
                              <input
                                id="eventImages"
                                name="images"
                                type="file"
                                className="sr-only"
                                onChange={handleImageChange}
                                multiple
                                accept="image/*"
                              />
                            </span>
                          </div>
                          {images && images.length > 0 && (
                            <p className="text-xs text-green-400 pt-1">
                              {images.length} image(s) selected
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                    {/* Video Upload */}
                    <div>
                      <label
                        htmlFor="eventVideos"
                        className="block text-sm font-medium text-gray-300"
                      >
                        Videos
                      </label>
                      {mode === "edit" && existingVideos.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-400 mb-1">
                            Current videos:
                          </p>
                          <ul className="list-disc list-inside text-xs text-gray-400">
                            {existingVideos.map((vidUrl, idx) => (
                              <li key={idx} className="truncate">
                                {vidUrl.split("/").pop()}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-2 flex items-center">
                            <input
                              id="deleteEventExistingVideos"
                              type="checkbox"
                              checked={deleteExistingVideos}
                              onChange={(e) =>
                                setDeleteExistingVideos(e.target.checked)
                              }
                              className="h-4 w-4 rounded border-gray-500 bg-gray-600 text-purple-600 focus:ring-purple-500"
                            />
                            <label
                              htmlFor="deleteEventExistingVideos"
                              className="ml-2 block text-xs text-gray-400"
                            >
                              Replace existing videos
                            </label>
                          </div>
                        </div>
                      )}
                      <label
                        htmlFor="eventVideos"
                        className={`mt-1 flex justify-center px-6 py-4 border-2 ${
                          error ? "border-red-500" : "border-gray-600"
                        } border-dashed rounded-md cursor-pointer hover:border-gray-500 bg-gray-700/50`}
                      >
                        <div className="space-y-1 text-center">
                          <FiVideo className="mx-auto h-8 w-8 text-gray-400" />
                          <div className="flex text-xs text-gray-400">
                            <span className="relative font-medium text-purple-400 hover:text-purple-300">
                              Upload Videos
                              <input
                                id="eventVideos"
                                name="videos"
                                type="file"
                                className="sr-only"
                                onChange={handleVideoChange}
                                multiple
                                accept="video/*"
                              />
                            </span>
                          </div>
                          {videos && videos.length > 0 && (
                            <p className="text-xs text-green-400 pt-1">
                              {videos.length} video(s) selected
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <p className="text-sm text-red-400 bg-red-900/30 px-3 py-2 rounded border border-red-600">
                      {error}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="inline-flex justify-center rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={
                        loading ||
                        !name ||
                        !description ||
                        !location ||
                        !date ||
                        !clubId
                      }
                      className="inline-flex justify-center items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading && (
                        <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      )}
                      {mode === "create" ? "Create Event" : "Save Changes"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EventFormModal;
