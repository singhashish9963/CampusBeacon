import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Bell, Plus, XCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  createNotification,
  deleteNotification,
} from "../../../slices/hostelSlice";

const Notifications = ({ hostelId }) => {
  const { notifications, loading, error } = useSelector(
    (state) => state.hostel
  );
  const { roles } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    message: "",
    type: "info",
  });
  // New state for file attachment
  const [fileAttachment, setFileAttachment] = useState(null);

  const isAdmin = roles.includes("admin");
  const isHostelPresident = roles.includes("hostel_president");

  // Memoize filtered notifications for the current hostel
  const hostelNotifications = useMemo(() => {
    if (!Array.isArray(notifications[hostelId])) return [];
    return notifications[hostelId];
  }, [notifications, hostelId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.message.trim()) {
      setFormError("Message is required");
      return;
    }

    try {
      // Prepare payload. If an attachment exists, include it with key "file".
      const payload = {
        hostel_id: hostelId,
        ...formData,
      };
      if (fileAttachment) {
        payload.file = fileAttachment;
      }
      await dispatch(createNotification(payload)).unwrap();
      setFormData({
        message: "",
        type: "info",
      });
      setFileAttachment(null);
      setIsCreating(false);
    } catch (error) {
      setFormError(error.message || "Error creating notification");
      console.error("Error creating notification:", error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!notificationId) return;
    try {
      await dispatch(deleteNotification({ notificationId })).unwrap();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      message: "",
      type: "info",
    });
    setFileAttachment(null);
    setIsCreating(false);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-purple-500/50"
      >
        <div className="animate-pulse">
          <div className="h-8 bg-purple-500/20 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 md:p-4 rounded-lg border bg-black/30">
                <div className="h-4 bg-purple-500/20 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-purple-500/20 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-red-500/50"
      >
        <p className="text-red-400">Error: {error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-purple-500/50"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
          <Bell className="mr-2 w-5 h-5" /> Notifications
        </h2>
        {(isAdmin || isHostelPresident) && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center justify-center space-x-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Notification</span>
          </button>
        )}
      </div>

      {/* Notification Form */}
      {(isAdmin || isHostelPresident) && isCreating && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 sm:h-32 resize-none text-sm sm:text-base"
              required
            />
            {formError && (
              <p className="mt-1 text-sm text-red-400">{formError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Attachment (Optional)
            </label>
            <input
              type="file"
              onChange={(e) => setFileAttachment(e.target.files[0])}
              className="text-white text-sm w-full"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 text-gray-300 hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {hostelNotifications.map((notif) => (
          <motion.div
            key={notif.notification_id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-3 sm:p-4 rounded-lg border ${
              notif.type === "warning"
                ? "bg-yellow-500/20 border-yellow-500"
                : notif.type === "error"
                ? "bg-red-500/20 border-red-500"
                : "bg-blue-500/20 border-blue-500"
            } flex justify-between items-start gap-2`}
          >
            <div className="flex-1 break-words">
              <p className="text-white text-sm sm:text-base">{notif.message}</p>
              {notif.timestamp && (
                <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">
                  {new Date(notif.timestamp).toLocaleTimeString()}
                </p>
              )}
              {notif.file_url && (
                <a
                  href={notif.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-gray-300 underline mt-1 block"
                >
                  View Attachment
                </a>
              )}
            </div>
            {(isAdmin || isHostelPresident) && (
              <button
                onClick={() => handleDeleteNotification(notif.notification_id)}
                className="text-red-500 hover:text-red-600 flex-shrink-0"
                aria-label="Delete notification"
              >
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </motion.div>
        ))}
        {hostelNotifications.length === 0 && (
          <p className="text-gray-400 text-center text-sm sm:text-base">
            No notifications yet
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Notifications;
