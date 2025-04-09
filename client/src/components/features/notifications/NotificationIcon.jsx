import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { Bell } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getUnreadNotificationCount } from "../../../slices/notificationSlice";
import NotificationPanel from "./NotificationPanel";

// Memoized selector function to prevent unnecessary re-renders
const selectUnreadCount = (state) => state.notifications?.unreadCount ?? 0;

const NotificationIcon = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const dispatch = useDispatch();

  // Use memoized selector to prevent unnecessary re-renders
  const unreadCount = useSelector(selectUnreadCount);

  // Setup polling for unread notifications (if desired)
  useEffect(() => {
    // Initial fetch
    dispatch(getUnreadNotificationCount());

    // Optional: Setup polling interval for real-time updates
    const intervalId = setInterval(() => {
      if (!isOpen) {
        // Only poll when panel is closed to avoid conflicting updates
        dispatch(getUnreadNotificationCount());
      }
    }, 60000); // Poll every minute

    return () => clearInterval(intervalId);
  }, [dispatch, isOpen]);

  // Memoized callbacks to prevent recreating functions on each render
  const togglePanel = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Combine event listeners into a single useEffect
  useEffect(() => {
    if (!isOpen) return; // Skip setup if panel isn't open

    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        closePanel();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closePanel();
      }
    };

    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    // Remove event listeners on cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closePanel]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={togglePanel}
        className="relative p-2 bg-gray-800/60 rounded-full hover:bg-gray-700/80 
                   focus:bg-gray-700/80 transition-colors duration-150 
                   focus:outline-none focus:ring-2 focus:ring-amber-500 
                   focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label={`Notifications ${
          unreadCount > 0 ? `(${unreadCount} unread)` : ""
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />

        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 
                      flex items-center justify-center rounded-full bg-amber-500 
                      text-xs font-bold text-gray-900 pointer-events-none 
                      ring-1 ring-gray-800 text-[10px] sm:text-xs"
            aria-hidden="true"
          >
            {unreadCount > 99 ? "99+" : unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <NotificationPanel ref={panelRef} isOpen={isOpen} onClose={closePanel} />
    </div>
  );
});

NotificationIcon.displayName = "NotificationIcon";

export default NotificationIcon;
