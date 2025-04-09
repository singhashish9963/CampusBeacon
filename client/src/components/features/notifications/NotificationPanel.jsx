import React, { useEffect, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  markAllNotificationsAsRead,
  getNotifications,
} from "../../../slices/notificationSlice";
import NotificationList from "./NotificationList";

// Memoized selector
const selectUnreadAndLoading = (state) => ({
  unreadCount: state.notifications?.unreadCount || 0,
  loading: state.notifications?.loading || false,
});

// Use React.forwardRef and memo for optimization
const NotificationPanel = memo(
  React.forwardRef(({ isOpen, onClose }, ref) => {
    const dispatch = useDispatch();
    const { unreadCount, loading } = useSelector(selectUnreadAndLoading);

    // Fetch notifications when panel opens
    useEffect(() => {
      if (isOpen) {
        dispatch(getNotifications({ page: 1, limit: 20 }));
      }
    }, [isOpen, dispatch]);

    const handleMarkAllAsRead = useCallback(
      (e) => {
        e.stopPropagation();
        if (unreadCount > 0 && !loading) {
          dispatch(markAllNotificationsAsRead());
        }
      },
      [dispatch, unreadCount, loading]
    );

    const handleClosePanel = useCallback(
      (e) => {
        e.stopPropagation();
        onClose();
      },
      [onClose]
    );

    const handlePanelClick = useCallback((e) => {
      e.stopPropagation();
    }, []);

    // Render null if not open for better performance
    if (!isOpen) {
      return null;
    }

    return (
      <div
        ref={ref}
        className="absolute right-0 mt-2 w-[90vw] max-w-md sm:w-96 
                 bg-gradient-to-b from-[#1A1B35] to-[#0B1026] rounded-lg 
                 shadow-2xl border border-amber-500/30 overflow-hidden z-50 
                 flex flex-col"
        style={{ maxHeight: "min(calc(100vh - 6rem), 600px)" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-panel-title"
        onClick={handlePanelClick}
      >
        {/* Panel Header - using sticky positioning for scrolling */}
        <div
          className="flex items-center justify-between p-3 sm:p-4 
                     border-b border-amber-500/30 sticky top-0 
                     bg-gradient-to-b from-[#1A1B35]/95 to-[#0B1026]/95 
                     backdrop-blur-sm z-10 flex-shrink-0"
        >
          <h3
            id="notification-panel-title"
            className="text-base sm:text-lg font-semibold text-transparent 
                     bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600"
          >
            Notifications
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0 || loading}
              className={`text-xs sm:text-sm text-amber-400 hover:text-amber-300 
                      disabled:opacity-50 disabled:cursor-not-allowed 
                      transition-colors duration-150 px-2 py-1 rounded 
                      hover:bg-white/10`}
            >
              Mark all read
            </button>
            <button
              onClick={handleClosePanel}
              className="p-1 text-gray-400 hover:text-white rounded-full 
                      hover:bg-white/10 transition-colors duration-150 
                      focus:outline-none focus:ring-1 focus:ring-white/50"
              aria-label="Close notifications panel"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notification List - flex-1 ensures it takes available height */}
        <div className="flex-1 overflow-hidden">
          <NotificationList />
        </div>
      </div>
    );
  })
);

NotificationPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

NotificationPanel.displayName = "NotificationPanel";

export default NotificationPanel;
