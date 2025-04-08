import React, { useState, useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  markAllNotificationsAsRead,
  getNotifications,
  getUnreadNotificationCount, 
} from "../../../slices/notificationSlice"; 
import NotificationList from "./NotificationList"; 

const NotificationIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const dispatch = useDispatch();


  const notificationsState = useSelector((state) => state.notifications);

  const { unreadCount = 0 } = notificationsState || {};

  useEffect(() => {
    dispatch(getUnreadNotificationCount());

  }, [dispatch]); 


  // Close panel on outside click (existing useEffect)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]); // Dependency array is correct

  const togglePanel = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    if (newState) {
      // Fetch notifications list when opening the panel (keep this)
      dispatch(getNotifications({}));
    }
  };

  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    if (unreadCount > 0) {
      dispatch(markAllNotificationsAsRead());
    }
  };

  const handleClosePanel = (e) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        ref={buttonRef}
        onClick={togglePanel}
        className="relative p-2 bg-gray-800/50 rounded-full hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Bell className="w-6 h-6 text-white" />
        {/* Conditional rendering based on unreadCount from state */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-gray-900 pointer-events-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel (no changes needed here) */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-96 bg-gradient-to-b from-[#1A1B35] to-[#0B1026] rounded-lg shadow-2xl border border-amber-500/30 overflow-hidden z-50"
          style={{ maxHeight: "80vh" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="notification-panel-title"
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b border-amber-500/30 sticky top-0 bg-gradient-to-b from-[#1A1B35] to-[#0B1026] z-10">
            <h3
              id="notification-panel-title"
              className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600"
            >
              Notifications
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className={`text-xs text-amber-400 hover:text-amber-300 transition-colors ${
                  unreadCount === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Mark all as read
              </button>
              <button
                onClick={handleClosePanel}
                className="text-gray-400 hover:text-white transition-colors focus:outline-none"
                aria-label="Close notifications panel"
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
