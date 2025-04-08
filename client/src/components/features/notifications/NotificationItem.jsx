import React from "react";
import PropTypes from "prop-types";
// Import an icon for attachments
import { Check, Trash, Clock, Paperclip } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  markNotificationAsRead,
  deleteNotification,
} from "../../../slices/notificationSlice";

const NotificationItem = ({ notification }) => {
  const dispatch = useDispatch();

  const handleMarkAsRead = (e) => {
    e.stopPropagation();
    if (!notification.is_read) {
      dispatch(markNotificationAsRead(notification.id));
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch(deleteNotification(notification.id));
  };

  const formatTime = (dateString) => {
    // ... (keep your existing formatTime function)
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div
      className={`p-4 hover:bg-gray-800/20 transition-colors cursor-pointer ${
        notification.is_read ? "opacity-70" : ""
      }`}
      // Only trigger mark as read on click if it's unread
      onClick={!notification.is_read ? handleMarkAsRead : undefined}
    >
      <div className="flex items-start space-x-3 mb-2">
        {/* Unread Indicator */}
        {!notification.is_read && (
          <div className="mt-1.5 h-2 w-2 rounded-full bg-amber-500 flex-shrink-0"></div>
        )}
        <div className={`flex-1 ${notification.is_read ? "pl-4" : ""}`}>
          {/* Message */}
          <p
            className={`text-sm ${
              notification.is_read ? "text-gray-400" : "text-gray-200"
            }`}
          >
            {notification.message}
          </p>
          {/* Attachment Link - ADDED */}
          {notification.file_url && (
            <a
              href={notification.file_url}
              target="_blank" // Open in new tab
              rel="noopener noreferrer" // Security best practice
              onClick={(e) => e.stopPropagation()} // Prevent parent onClick
              // Optional: Add download attribute to suggest downloading
              // download
              className="mt-2 inline-flex items-center text-xs text-blue-400 hover:text-blue-300 hover:underline"
            >
              <Paperclip className="w-3 h-3 mr-1" />
              View Attachment
            </a>
          )}
        </div>
      </div>
      {/* Footer: Timestamp and Actions */}
      <div className="flex items-center justify-between pl-4 mt-2">
        <div className="flex items-center text-amber-500/70 text-xs">
          <Clock className="w-3 h-3 mr-1" />
          <span>{formatTime(notification.createdAt)}</span>
        </div>
        <div className="flex space-x-2">
          {!notification.is_read && (
            <button
              onClick={handleMarkAsRead}
              className="p-1 rounded-full hover:bg-gray-700/50 transition-colors text-blue-400 hover:text-blue-300"
              title="Mark as read"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-1 rounded-full hover:bg-gray-700/50 transition-colors text-red-400 hover:text-red-300"
            title="Delete notification"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    message: PropTypes.string.isRequired,
    is_read: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
    file_url: PropTypes.string, // Add file_url as an optional string prop
  }).isRequired,
};

export default NotificationItem;
