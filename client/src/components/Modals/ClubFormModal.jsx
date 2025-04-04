// src/components/Modals/ClubFormModal.js
import React, { useState, useEffect, Fragment } from "react";
import { useDispatch } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import {
  FiX,
  FiLoader,
  FiUploadCloud,
  FiTrash2,
  FiPlus,
  FiImage as FiImageIcon,
} from "react-icons/fi";
import { createClub, updateClub } from "../../slices/clubSlice";
import { createFormData } from "../../utils/formDataHelper";
import toast from "react-hot-toast";

const ClubFormModal = ({
  isOpen,
  onClose,
  mode = "create",
  initialData = null,
}) => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [socialLinks, setSocialLinks] = useState([""]);
  const [images, setImages] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [deleteExisting, setDeleteExisting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setLocalError(null);
      setDeleteExisting(false);
      setIsSubmitting(false);
      if (mode === "edit" && initialData) {
        setName(initialData.name || "");
        setDescription(initialData.description || "");
        setSocialLinks(
          initialData.social_media_links?.length > 0
            ? [...initialData.social_media_links, ""]
            : [""]
        );
        setExistingImages(initialData.images || []);
        setImages(null);
        setImagePreviews([]);
      } else {
        setName("");
        setDescription("");
        setSocialLinks([""]);
        setExistingImages([]);
        setImages(null);
        setImagePreviews([]);
      }
    }
  }, [isOpen, mode, initialData]);

  useEffect(() => {
    if (!images) {
      setImagePreviews([]);
      return;
    }
    const objectUrls = Array.from(images).map((file) =>
      URL.createObjectURL(file)
    );
    setImagePreviews(objectUrls);
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const handleSocialLinkChange = (index, value) => {
    const newLinks = [...socialLinks];
    newLinks[index] = value;
    if (index === socialLinks.length - 1 && value.trim() !== "") {
      newLinks.push("");
    }
    setSocialLinks(newLinks);
  };

  const removeSocialLinkInput = (index) => {
    if (socialLinks.length > 1) {
      setSocialLinks(socialLinks.filter((_, i) => i !== index));
    } else {
      setSocialLinks([""]);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImages(e.target.files);
      setLocalError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setLocalError(null);
    const finalSocialLinks = socialLinks.filter(
      (link) => link && link.trim() !== ""
    );
    const clubPayload = {
      name,
      description: description || null,
      social_media_links: finalSocialLinks,
      images,
    };
    if (mode === "edit") {
      clubPayload.deleteExistingImages = deleteExisting;
    }
    const formData = createFormData(
      clubPayload,
      ["images"],
      ["social_media_links"]
    );
    try {
      let actionResult;
      if (mode === "create") {
        actionResult = await dispatch(createClub(formData)).unwrap();
        toast.success(`Club "${actionResult.name}" created!`);
      } else if (mode === "edit" && initialData?.id) {
        actionResult = await dispatch(
          updateClub({ id: initialData.id, clubData: formData })
        ).unwrap();
        toast.success(`Club "${actionResult.name}" updated!`);
      } else {
        throw new Error("Invalid operation mode or missing ID for edit.");
      }
      onClose();
    } catch (err) {
      console.error(`Failed to ${mode} club:`, err);
      const errorMessage =
        err?.message ||
        err?.detail ||
        "Operation failed. Please check your input and try again.";
      setLocalError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose} static>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-2xl transition-all border border-gray-700">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-semibold leading-6 text-white mb-4 flex justify-between items-center"
                >
                  {mode === "create" ? "Add New Club" : "Edit Club"}
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
                    aria-label="Close modal"
                  >
                    <FiX size={20} />
                  </button>
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="clubName"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Club Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="clubName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm px-3 py-2 focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-50 placeholder-gray-500"
                      placeholder="E.g., Computer Club MNNIT"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="clubDescription"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="clubDescription"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="4"
                      className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm px-3 py-2 focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-50 placeholder-gray-500"
                      placeholder="Tell us about the club..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Social Media Links
                    </label>
                    <div className="space-y-2">
                      {socialLinks.map((link, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="url"
                            value={link}
                            onChange={(e) =>
                              handleSocialLinkChange(index, e.target.value)
                            }
                            className="flex-grow rounded-md border-gray-600 bg-gray-700 text-white shadow-sm px-3 py-2 text-sm focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-50 placeholder-gray-500"
                            placeholder="https://example.com"
                          />
                          <button
                            type="button"
                            onClick={() => removeSocialLinkInput(index)}
                            disabled={socialLinks.length === 1}
                            className="p-1.5 text-red-400 hover:text-red-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                            aria-label="Remove link"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Club Images (Optional)
                    </label>
                    {mode === "edit" && existingImages.length > 0 && (
                      <div className="mb-3 p-3 bg-gray-700/50 rounded-md border border-gray-600">
                        <p className="text-xs text-gray-400 mb-2">
                          Current image(s):
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {existingImages.map((imgUrl, idx) => (
                            <img
                              key={idx}
                              src={imgUrl}
                              alt={`Existing ${idx + 1}`}
                              className="h-12 w-12 object-cover rounded border border-gray-500"
                            />
                          ))}
                        </div>
                        <div className="flex items-center">
                          <input
                            id="deleteClubExistingImages"
                            type="checkbox"
                            checked={deleteExisting}
                            onChange={(e) =>
                              setDeleteExisting(e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-500 bg-gray-600 text-cyan-600 focus:ring-cyan-500 focus:ring-offset-gray-800 focus:ring-2"
                          />
                          <label
                            htmlFor="deleteClubExistingImages"
                            className="ml-2 block text-xs text-gray-400"
                          >
                            {images
                              ? "Replace existing images with new uploads"
                              : "Delete existing images (if no new ones are uploaded)"}
                          </label>
                        </div>
                      </div>
                    )}
                    <label
                      htmlFor="clubImages"
                      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                        localError?.includes("image")
                          ? "border-red-500"
                          : "border-gray-600"
                      } border-dashed rounded-md cursor-pointer hover:border-cyan-500 bg-gray-700/30 transition-colors`}
                    >
                      <div className="space-y-1 text-center">
                        <FiUploadCloud className="mx-auto h-10 w-10 text-gray-500" />
                        <div className="flex text-sm text-gray-400">
                          <span className="relative font-medium text-cyan-400 hover:text-cyan-300 cursor-pointer">
                            Upload file(s)
                            <input
                              id="clubImages"
                              name="images"
                              type="file"
                              className="sr-only"
                              onChange={handleImageChange}
                              multiple
                              accept="image/jpeg, image/png, image/gif, image/webp"
                            />
                          </span>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF, WEBP up to 5MB each
                        </p>
                      </div>
                    </label>
                    {imagePreviews.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-400 mb-1">
                          New image(s) preview:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {imagePreviews.map((previewUrl, idx) => (
                            <img
                              key={idx}
                              src={previewUrl}
                              alt={`Preview ${idx + 1}`}
                              className="h-12 w-12 object-cover rounded border border-gray-600"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {localError && (
                    <p className="text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded border border-red-700/50">
                      <strong>Error:</strong> {localError}
                    </p>
                  )}
                  <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors disabled:opacity-60"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !name}
                      className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-700 rounded-md shadow-sm hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting && (
                        <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      )}
                      {isSubmitting
                        ? "Saving..."
                        : mode === "create"
                        ? "Add Club"
                        : "Save Changes"}
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

export default ClubFormModal;
