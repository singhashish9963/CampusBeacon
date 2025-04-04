import React, { useState, useEffect, Fragment } from "react";
import { useDispatch } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import {
  FiX,
  FiLoader,
  FiUploadCloud,
  FiImage,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import {
  createCoordinator,
  updateCoordinator,
} from "../../slices/coordinatorSlice";
import { createFormData } from "../../utils/formDataHelper";
import toast from "react-hot-toast";

const CoordinatorFormModal = ({
  isOpen,
  onClose,
  mode = "create",
  initialData = null,
}) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [contact, setContact] = useState("");
  const [clubId, setClubId] = useState("");
  const [socialLinks, setSocialLinks] = useState([""]);
  const [images, setImages] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [deleteExisting, setDeleteExisting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setDeleteExisting(false);
      if (mode === "edit" && initialData) {
        setName(initialData.name || "");
        setDesignation(initialData.designation || "");
        setContact(initialData.contact || "");
        setClubId(initialData.club_id || "");
        setSocialLinks(
          initialData.social_media_links?.length > 0
            ? [...initialData.social_media_links]
            : [""]
        );
        setExistingImages(initialData.images || []);
        setImages(null);
      } else {
        setName("");
        setDesignation("");
        setContact("");
        setClubId(initialData?.club_id || "");
        setSocialLinks([""]);
        setExistingImages([]);
        setImages(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clubId) {
      setError("Club ID is missing. Cannot save coordinator.");
      return;
    }
    setLoading(true);
    setError(null);

    const finalSocialLinks = socialLinks.filter((link) => link.trim() !== "");
    const coordinatorPayload = {
      name,
      designation,
      contact: contact || null,
      club_id: clubId,
      social_media_links: finalSocialLinks,
      images,
    };

    if (mode === "edit") {
      coordinatorPayload.deleteExistingImages = deleteExisting;
    }

    const formData = createFormData(
      coordinatorPayload,
      ["images"],
      ["social_media_links"]
    );

    try {
      if (mode === "create") {
        await dispatch(createCoordinator(formData)).unwrap();
        toast.success("Coordinator added successfully!");
      } else if (mode === "edit" && initialData) {
        await dispatch(
          updateCoordinator({ id: initialData.id, coordinatorData: formData })
        ).unwrap();
        toast.success("Coordinator updated successfully!");
      }
      onClose();
    } catch (err) {
      console.error("Failed to save coordinator:", err);
      setError(err.message || `Failed to ${mode} coordinator.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition show={isOpen}>
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
        </Transition>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition
              show={isOpen}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all border border-gray-700">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-white flex justify-between items-center"
                >
                  {mode === "create"
                    ? "Add New Coordinator"
                    : "Edit Coordinator"}
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white"
                  >
                    <FiX size={20} />
                  </button>
                </DialogTitle>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="coordName"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="coordName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-50 placeholder-gray-500 px-3 py-2"
                      placeholder="Coordinator's Name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="coordDesignation"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="coordDesignation"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-50 placeholder-gray-500 px-3 py-2"
                      placeholder="e.g., President, Tech Head"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="coordContact"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Contact (Optional)
                    </label>
                    <input
                      type="tel"
                      id="coordContact"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      pattern="[0-9]*"
                      maxLength="15"
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-50 placeholder-gray-500 px-3 py-2"
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Social Media Links
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
                          className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-50 placeholder-gray-500 px-3 py-2 text-sm"
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
                      className="mt-1 text-sm text-cyan-400 hover:text-cyan-300 flex items-center"
                    >
                      <FiPlus className="mr-1" /> Add Link
                    </button>
                  </div>
                  <div>
                    <label
                      htmlFor="coordImages"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Image (Optional)
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
                              alt={`Existing ${idx + 1}`}
                              className="h-10 w-10 object-cover rounded border border-gray-600"
                            />
                          ))}
                        </div>
                        <div className="mt-2 flex items-center">
                          <input
                            id="deleteCoordExistingImages"
                            type="checkbox"
                            checked={deleteExisting}
                            onChange={(e) =>
                              setDeleteExisting(e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-500 bg-gray-600 text-cyan-600 focus:ring-cyan-500"
                          />
                          <label
                            htmlFor="deleteCoordExistingImages"
                            className="ml-2 block text-xs text-gray-400"
                          >
                            Replace existing images with new uploads
                          </label>
                        </div>
                      </div>
                    )}
                    <label
                      htmlFor="coordImages"
                      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                        error ? "border-red-500" : "border-gray-600"
                      } border-dashed rounded-md cursor-pointer hover:border-gray-500 bg-gray-700/50`}
                    >
                      <div className="space-y-1 text-center">
                        <FiUploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                        <div className="flex text-sm text-gray-400">
                          <span className="relative font-medium text-cyan-400 hover:text-cyan-300">
                            Upload files
                            <input
                              id="coordImages"
                              name="images"
                              type="file"
                              className="sr-only"
                              onChange={handleImageChange}
                              multiple
                              accept="image/*"
                            />
                          </span>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                        {images && images.length > 0 && (
                          <p className="text-xs text-green-400 pt-1">
                            {images.length} file(s) selected
                          </p>
                        )}
                      </div>
                    </label>
                  </div>
                  {error && (
                    <p className="text-sm text-red-400 bg-red-900/30 px-3 py-2 rounded border border-red-600">
                      {error}
                    </p>
                  )}
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
                      disabled={loading || !name || !designation || !clubId}
                      className="inline-flex justify-center items-center rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading && (
                        <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      )}
                      {mode === "create" ? "Add Coordinator" : "Save Changes"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CoordinatorFormModal;
