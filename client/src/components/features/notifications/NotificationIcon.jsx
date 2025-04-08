import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getUnreadNotificationCount } from "../../../slices/notificationSlice";
import NotificationPanel from "./NotificationPanel"; // Import the panel component

const NotificationIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const panelRef = useRef(null); // Ref for the panel, passed to NotificationPanel
  const dispatch = useDispatch();

  // Select only the unread count needed for the badge
  const unreadCount = useSelector(
    (state) => state.notifications?.unreadCount ?? 0 // Use nullish coalescing for safety
  );

  // Fetch unread count on mount and when dependencies change (e.g., auth state)
  useEffect(() => {
    dispatch(getUnreadNotificationCount());
  }, [dispatch]);

  // Toggle panel visibility
  const togglePanel = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Close panel function
  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close if click is outside the button AND outside the panel
      if (
        isOpen &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        panelRef.current && // Check if panelRef is assigned and exists
        !panelRef.current.contains(event.target)
      ) {
        closePanel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    // Close on Escape key press
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closePanel();
      }
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closePanel]); // Add closePanel to dependency array

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        ref={buttonRef}
        onClick={togglePanel}
        className="relative p-2 bg-gray-800/60 rounded-full hover:bg-gray-700/80 focus:bg-gray-700/80 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label={`Notifications ${
          unreadCount > 0 ? `(${unreadCount} unread)` : ""
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />{" "}
        {/* Responsive icon size */}
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center rounded-full bg-amber-500 text-[10px] sm:text-xs font-bold text-gray-900 pointer-events-none ring-1 ring-gray-800"
            aria-hidden="true" // Hide from screen readers, covered by aria-label
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Render Notification Panel */}
      {/* Pass the panelRef down so outside click detection works */}
      <NotificationPanel ref={panelRef} isOpen={isOpen} onClose={closePanel} />
    </div>
  );
};

export default NotificationIcon;
