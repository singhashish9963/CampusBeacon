import React from "react";
import { motion } from "framer-motion";

import { FileText, X } from "lucide-react";

const ResourceModal = React.memo(
    ({
        isOpen,
        onClose,
        onSubmit,
        formData,
        onChange,
        editingResource,
        subjects,
        loading,
    }) => {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-purple-500/50 shadow-xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-gray-800"
                >
                    <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-900 pt-1 pb-3 z-10">
                        <h2 className="text-2xl font-bold text-white">
                            {editingResource ? "Edit Resource" : "Add New Resource"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                            type="button"
                            aria-label="Close modal"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <form onSubmit={onSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label
                                htmlFor="title"
                                className="block mb-1 text-sm font-medium text-gray-300"
                            >
                                Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={onChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors"
                                required
                                placeholder="e.g., Chapter 1 Notes"
                            />
                        </div>
                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="block mb-1 text-sm font-medium text-gray-300"
                            >
                                Description (Optional)
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={onChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors"
                                rows="3"
                                placeholder="Brief details about the resource..."
                            />
                        </div>
                        {/* Type */}
                        <div>
                            <label
                                htmlFor="material_type"
                                className="block mb-1 text-sm font-medium text-gray-300"
                            >
                                Type
                            </label>
                            <select
                                id="material_type"
                                name="material_type"
                                value={formData.material_type}
                                onChange={onChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors appearance-none bg-no-repeat bg-right pr-8"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: "right 0.5rem center",
                                    backgroundSize: "1.5em 1.5em",
                                }}
                                required
                            >
                                <option value="PDF">PDF</option>
                                <option value="Video">Video</option>
                            </select>
                        </div>
                        {/* Subject */}
                        <div>
                            <label
                                htmlFor="subject_id"
                                className="block mb-1 text-sm font-medium text-gray-300"
                            >
                                Subject
                            </label>
                            <select
                                id="subject_id"
                                name="subject_id"
                                value={formData.subject_id}
                                onChange={onChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors appearance-none bg-no-repeat bg-right pr-8"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: "right 0.5rem center",
                                    backgroundSize: "1.5em 1.5em",
                                }}
                                required
                            >
                                <option value="">-- Select Subject --</option>
                                {subjects?.map((subject) => (
                                    <option key={subject.id} value={String(subject.id)}>
                                        {subject.name}
                                    </option>
                                ))}
                                {(!subjects || subjects.length === 0) && (
                                    <option value="" disabled>
                                        No subjects available
                                    </option>
                                )}
                            </select>
                        </div>
                        {/* File Input */}
                        <div>
                            <label
                                htmlFor="file-upload-input"
                                className="block mb-1 text-sm font-medium text-gray-300"
                            >
                                {formData.material_type === "Video" ? "Video File" : "PDF File"}{" "}
                                {editingResource ? "(Optional)" : "(Required)"}
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md bg-gray-800/50 hover:border-purple-500/70 transition-colors">
                                <div className="space-y-1 text-center">
                                    <FileText className="mx-auto h-10 w-10 text-gray-500" />
                                    <div className="flex text-sm text-gray-400 justify-center">
                                        <label
                                            htmlFor="file-upload-input"
                                            className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-purple-500 px-3 py-1 transition-colors"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload-input"
                                                name="file"
                                                type="file"
                                                onChange={onChange}
                                                className="sr-only"
                                                accept={
                                                    formData.material_type === "PDF" ? ".pdf" : "video/*"
                                                }
                                                required={!editingResource}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {formData.material_type === "PDF"
                                            ? "PDF up to 50MB"
                                            : "Video file (MP4, etc.)"}
                                    </p>
                                    {formData.file &&
                                        typeof formData.file === "object" &&
                                        formData.file.name && (
                                            <p
                                                className="text-sm text-green-400 pt-2 font-medium truncate px-2"
                                                title={formData.file.name}
                                            >
                                                Selected: {formData.file.name}
                                            </p>
                                        )}
                                </div>
                            </div>
                            {editingResource && (
                                <p className="text-gray-400 text-xs mt-1">
                                    Leave empty to keep the current file. Uploading replaces it.
                                </p>
                            )}
                        </div>
                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-gray-900 pb-1">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                    loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            >
                                {loading
                                    ? "Saving..."
                                    : editingResource
                                    ? "Update Resource"
                                    : "Add Resource"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        );
    }
);
export default React.memo(ResourceModal);
