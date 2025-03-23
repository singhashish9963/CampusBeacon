import React, { useState, useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  markAllNotificationsAsRead,
  getNotifications,
} from "../../../slices/notificationSlice";
import NotificationList from "./NotificationList";

const NotificationIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const dispatch = useDispatch();

  // Get notifications state from Redux
  const { unreadCount } = useSelector((state) => state.notification);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const togglePanel = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    if (newState) {
      // Always fetch notifications when opening the panel
      dispatch(getNotifications({}));
    }
  };

  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    dispatch(markAllNotificationsAsRead());
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        ref={buttonRef}
        onClick={togglePanel}
        className="p-2 bg-gray-800/50 rounded-full hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-gray-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-96 bg-gradient-to-b from-[#1A1B35] to-[#0B1026] rounded-lg shadow-2xl border border-amber-500/30 overflow-hidden z-50"
          style={{ maxHeight: "80vh" }}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b border-amber-500/30">
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
              Notifications
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
              >
                Mark all as read
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors focus:outline-none"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Notification Content */}
          <NotificationList />
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
