import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import NotificationPanel from "./NotificationPanel";
import { useNotification } from "../contexts/notificationContext";

const NotificationIcon = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [mouseOverIcon, setMouseOverIcon] = useState(false);
  const { getNotifications, unreadCount } = useNotification();
  const iconRef = useRef(null);
  const timeoutRef = useRef(null);

  // Handle showing the panel when hovering over the bell icon
  const handleMouseEnter = () => {
    setMouseOverIcon(true);
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!isPanelOpen) {
      console.log("NotificationIcon: Mouse entered, opening panel");
      setIsPanelOpen(true);
      getNotifications();
    }
  };

  // Handle mouse leaving the bell icon
  const handleMouseLeave = () => {
    setMouseOverIcon(false);
    // Small delay before closing to allow moving to the panel
    timeoutRef.current = setTimeout(() => {
      if (
        !document.querySelector(":hover").closest(".notification-container")
      ) {
        setIsPanelOpen(false);
      }
    }, 300);
  };

  // Handle closing the panel
  const handleClosePanel = () => {
    console.log("NotificationIcon: Close button clicked");
    setIsPanelOpen(false);
  };

  // Event listener for clicks outside to close panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isPanelOpen &&
        !event.target.closest(".notification-container") &&
        !event.target.closest(".notification-icon")
      ) {
        setIsPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPanelOpen]);

  return (
    <div className="relative notification-container">
      <button
        ref={iconRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        type="button"
        className="p-2 bg-gray-800/50 rounded-full hover:bg-gray-700 transition-colors relative notification-icon"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-amber-500"></span>
        )}
      </button>

      {isPanelOpen && (
        <NotificationPanel isOpen={true} onClose={handleClosePanel} />
      )}
    </div>
  );
};

export default NotificationIcon;
