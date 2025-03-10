import React from "react";
import PropTypes from "prop-types";
import { Check, Trash, Clock } from "lucide-react";
import { useNotification } from "../contexts/notificationContext";

const NotificationItem = ({ notification }) => {
  const { markNotificationAsRead, deleteNotification } = useNotification();

  const handleMarkAsRead = (e) => {
    e.stopPropagation();
    markNotificationAsRead(notification.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };

  const formatTime = (dateString) => {
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
      onClick={!notification.is_read ? handleMarkAsRead : undefined}
    >
      {/* Notification Content */}
      <div className="flex items-start space-x-3 mb-2">
        {/* Notification Status Dot */}
        {!notification.is_read && (
          <div className="mt-1.5 h-2 w-2 rounded-full bg-amber-500 flex-shrink-0"></div>
        )}

        {/* Message */}
        <div className={`flex-1 ${notification.is_read ? "pl-4" : ""}`}>
          <p
            className={`text-sm ${
              notification.is_read ? "text-gray-400" : "text-gray-200"
            }`}
          >
            {notification.message}
          </p>
        </div>
      </div>

      {/* Notification Footer */}
      <div className="flex items-center justify-between pl-4 mt-2">
        {/* Time */}
        <div className="flex items-center text-amber-500/70 text-xs">
          <Clock className="w-3 h-3 mr-1" />
          <span>{formatTime(notification.createdAt)}</span>
        </div>

        {/* Actions */}
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
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    message: PropTypes.string.isRequired,
    is_read: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default NotificationItem;
