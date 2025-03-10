import React, { useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { X, Check, Bell, Trash } from "lucide-react";
import { useNotification } from "../contexts/notificationContext";

const NotificationPanel = React.memo(({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationAsRead,
    deleteNotification,
    markAllNotificationsAsRead,
  } = useNotification();

  const panelRef = useRef(null);

  // Position the panel correctly when it opens
  useEffect(() => {
    if (isOpen && panelRef.current) {
      // Get the notification icon position
      const iconElement = document.querySelector(
        'button[aria-label="Notifications"]'
      );

      if (iconElement) {
        const iconRect = iconElement.getBoundingClientRect();
        const panel = panelRef.current;

        // Position the panel below the icon
        panel.style.top = `${iconRect.bottom + 10}px`;
        panel.style.right = `${window.innerWidth - iconRect.right}px`;
      }
    }
  }, [isOpen]);

  // Prevent clicks inside the panel from closing it
  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && panelRef.current.contains(e.target)) {
        e.stopPropagation();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleDelete = useCallback(
    (id, e) => {
      e.stopPropagation();
      console.log(`NotificationPanel: Deleting notification ${id}`);
      deleteNotification(id);
    },
    [deleteNotification]
  );

  const handleMarkAsRead = useCallback(
    (id, e) => {
      e && e.stopPropagation();
      console.log(`NotificationPanel: Marking notification ${id} as read`);
      markNotificationAsRead(id);
    },
    [markNotificationAsRead]
  );

  const handleMarkAllAsRead = useCallback(
    (e) => {
      e.stopPropagation();
      console.log("NotificationPanel: Marking all notifications as read");
      markAllNotificationsAsRead();
    },
    [markAllNotificationsAsRead]
  );

  const getTimeAgo = (timeString) => {
    const now = new Date();
    const time = new Date(timeString);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hr ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} day ago`;
    }
  };

  return (
    <div
      ref={panelRef}
      className="fixed w-80 h-[70vh] max-h-[600px] bg-[#0B1026] border border-amber-500/30 rounded-xl shadow-lg z-50 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-4 border-b border-amber-500/30 bg-gradient-to-r from-[#1A1B35] to-[#0B1026] flex justify-between items-center">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
          Notifications
        </h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close"
          className="text-gray-400 hover:text-amber-400 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto h-[calc(100%-8rem)] scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-[#1A1B35]/30">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bell className="w-12 h-12 text-gray-600 mb-4" />
            <p className="text-gray-400">No notifications yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Stay tuned for updates!
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`bg-gray-800/30 border ${
                  notification.is_read
                    ? "border-gray-700/50"
                    : "border-amber-500/40"
                } rounded-xl p-4 relative overflow-hidden transition-all duration-300`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!notification.is_read) {
                    handleMarkAsRead(notification.id, e);
                  }
                }}
              >
                {!notification.is_read && (
                  <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-amber-500"></div>
                )}
                <p
                  className={`text-sm mb-2 ${
                    notification.is_read ? "text-gray-400" : "text-gray-100"
                  }`}
                >
                  {notification.message}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-amber-500/70">
                    {getTimeAgo(notification.createdAt)}
                  </span>
                  <div className="flex space-x-2">
                    {!notification.is_read && (
                      <button
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      className="text-red-400 hover:text-red-300 transition-colors"
                      onClick={(e) => handleDelete(notification.id, e)}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-amber-500/30 bg-gradient-to-r from-[#1A1B35] to-[#0B1026]">
          <button
            className="w-full py-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 text-amber-400 rounded-lg border border-amber-500/30 transition-colors"
            onClick={handleMarkAllAsRead}
          >
            Mark All as Read
          </button>
        </div>
      )}
    </div>
  );
});

NotificationPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

NotificationPanel.displayName = "NotificationPanel";

export default NotificationPanel;
