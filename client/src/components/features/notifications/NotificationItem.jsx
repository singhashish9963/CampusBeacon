import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Check, Trash, Clock, Paperclip, AlertCircle } from "lucide-react"; // Added AlertCircle
import { useDispatch } from "react-redux";
import {
  markNotificationAsRead,
  deleteNotification,
} from "../../../slices/notificationSlice";
import { formatDistanceToNowStrict } from "date-fns"; // Using date-fns for robust time formatting

const NotificationItem = React.memo(({ notification }) => {
  const dispatch = useDispatch();

  const handleMarkAsRead = useCallback(
    (e) => {
      e.stopPropagation(); // Prevent parent onClick
      if (!notification.is_read) {
        dispatch(markNotificationAsRead(notification.id));
      }
    },
    [dispatch, notification.id, notification.is_read]
  );

  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation(); // Prevent parent onClick
      dispatch(deleteNotification(notification.id));
    },
    [dispatch, notification.id]
  );

  // Use date-fns for robust relative time formatting
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNowStrict(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Determine background/opacity based on read status
  const itemClasses = `
    p-3 sm:p-4 transition-colors duration-150 relative group
    ${
      notification.is_read
        ? "opacity-75 hover:opacity-100" // Slightly faded when read, fully visible on hover
        : "bg-gradient-to-r from-amber-900/10 via-transparent to-transparent hover:bg-amber-900/20 cursor-pointer" // Subtle gradient/bg when unread
    }
  `;

  // Main item click handler (only marks as read if unread)
  const handleItemClick = useCallback(() => {
    if (!notification.is_read) {
      dispatch(markNotificationAsRead(notification.id));
    }
    // Potentially navigate somewhere based on notification type/content here
    // e.g., if (notification.link) { navigate(notification.link); }
  }, [dispatch, notification.id, notification.is_read]);

  return (
    <div
      className={itemClasses}
      onClick={handleItemClick}
      role="listitem"
      aria-label={`Notification: ${notification.message.substring(0, 50)}...`}
    >
      {/* Unread Indicator Dot */}
      {!notification.is_read && (
        <div
          className="absolute top-3 left-3 h-2 w-2 rounded-full bg-amber-500"
          aria-hidden="true"
        ></div>
      )}

      <div
        className={`flex items-start space-x-3 ${
          !notification.is_read ? "pl-5" : ""
        }`}
      >
        {" "}
        {/* Add padding left if indicator is present */}
        {/* Optional: Icon based on notification type could go here */}
        {/* <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" /> */}
        <div className="flex-1 min-w-0">
          {" "}
          {/* min-w-0 prevents overflow issues */}
          {/* Message */}
          <p
            className={`text-sm break-words ${
              // break-words for long messages without spaces
              notification.is_read
                ? "text-gray-400"
                : "text-gray-200 font-medium"
            }`}
          >
            {notification.message}
          </p>
          {/* Attachment Link */}
          {notification.file_url && (
            <a
              href={notification.file_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} // Prevent parent onClick
              className="mt-1.5 inline-flex items-center text-xs text-blue-400 hover:text-blue-300 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
            >
              <Paperclip className="w-3 h-3 mr-1 flex-shrink-0" />
              View Attachment
            </a>
          )}
          {/* Footer: Timestamp and Actions (Show actions on hover/focus for read items) */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-gray-500 text-xs">
              <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
              <span>{formatTime(notification.createdAt)}</span>
            </div>

            {/* Action Buttons Container */}
            {/* Show permanently for unread, on group-hover/focus-within for read */}
            <div
              className={`flex space-x-1 transition-opacity duration-150 ${
                notification.is_read
                  ? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                  : "opacity-100"
              }`}
            >
              {!notification.is_read && (
                <button
                  onClick={handleMarkAsRead}
                  className="p-1 rounded-full hover:bg-gray-700/50 text-blue-400 hover:text-blue-300 transition-colors"
                  title="Mark as read"
                  aria-label="Mark notification as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleDelete}
                className="p-1 rounded-full hover:bg-gray-700/50 text-red-400 hover:text-red-300 transition-colors"
                title="Delete notification"
                aria-label="Delete notification"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    message: PropTypes.string.isRequired,
    is_read: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired, // Should be ISO string ideally
    file_url: PropTypes.string,
    // Add other potential fields like 'type', 'link', etc.
  }).isRequired,
};

NotificationItem.displayName = "NotificationItem";

export default NotificationItem;
