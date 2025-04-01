import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const YearModal = React.memo(
    ({ isOpen, onClose, onSubmit, formData, onChange, branches, loading }) => {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-purple-500/50 shadow-xl"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Create New Year</h2>
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
                        <div>
                            <label
                                htmlFor="year_name"
                                className="block mb-1 text-sm font-medium text-gray-300"
                            >
                                Year Name
                            </label>
                            <input
                                id="year_name"
                                type="text"
                                name="year_name"
                                value={formData.year_name}
                                onChange={onChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors"
                                required
                                placeholder="e.g., First Year, Second Year"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="branch_id_year"
                                className="block mb-1 text-sm font-medium text-gray-300"
                            >
                                Branch
                            </label>
                            <select
                                id="branch_id_year"
                                name="branch_id"
                                value={formData.branch_id}
                                onChange={onChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors appearance-none bg-no-repeat bg-right pr-8"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: "right 0.5rem center",
                                    backgroundSize: "1.5em 1.5em",
                                }}
                                required
                            >
                                <option value="">-- Select Branch --</option>
                                {branches?.map((branch) => (
                                    <option key={branch.branch_id} value={String(branch.branch_id)}>
                                        {branch.branch_name}
                                    </option>
                                ))}
                                {(!branches || branches.length === 0) && (
                                    <option value="" disabled>
                                        No branches available
                                    </option>
                                )}
                            </select>
                        </div>
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
                                className={`px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                    loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            >
                                {loading ? "Creating..." : "Create Year"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        );
    }
);

export default React.memo(YearModal);
