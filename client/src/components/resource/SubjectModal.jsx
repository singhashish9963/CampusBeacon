import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const SubjectModal = React.memo(
    ({
        isOpen,
        onClose,
        onSubmit,
        formData,
        onChange,
        editingSubject,
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
                    className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-cyan-500/50 shadow-xl"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">
                            {editingSubject ? "Edit Subject" : "Create New Subject"}
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
                        {/* Subject Name */}
                        <div>
                            <label
                                htmlFor="subject_name"
                                className="block mb-1 text-sm font-medium text-gray-300"
                            >
                                Subject Name
                            </label>
                            <input
                                id="subject_name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={onChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-colors"
                                required
                                placeholder="e.g., Data Structures"
                            />
                        </div>
                        {/* Subject Code */}
                        <div>
                            <label
                                htmlFor="subject_code"
                                className="block mb-1 text-sm font-medium text-gray-300"
                            >
                                Subject Code
                            </label>
                            <input
                                id="subject_code"
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={onChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-colors"
                                required
                                placeholder="e.g., CS201"
                            />
                        </div>
                        {/* Subject Credit (Optional) */}
                        <div>
                            <label
                                htmlFor="subject_credit"
                                className="block mb-1 text-sm font-medium text-gray-300"
                            >
                                Credits (Optional)
                            </label>
                            <input
                                id="subject_credit"
                                type="number"
                                name="credit"
                                value={formData.credit}
                                onChange={onChange}
                                min="0"
                                step="0.5"
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-colors"
                                placeholder="e.g., 3 or 1.5"
                            />
                        </div>
                        {/* Subject Icon (Optional - maybe use select later) */}
                        <div>
                            <label
                                htmlFor="subject_icon"
                                className="block mb-1 text-sm font-medium text-gray-300"
                            >
                                Icon (Optional Emoji)
                            </label>
                            <input
                                id="subject_icon"
                                type="text"
                                name="icon"
                                value={formData.icon}
                                onChange={onChange}
                                maxLength="2"
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-colors"
                                placeholder="e.g., 📚"
                            />
                        </div>
                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
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
                                className={`px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                    loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            >
                                {loading
                                    ? "Saving..."
                                    : editingSubject
                                    ? "Update Subject"
                                    : "Create Subject"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        );
    }
);

export default React.memo(SubjectModal);
