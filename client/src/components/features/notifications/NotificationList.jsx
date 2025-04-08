import React from "react";
import { useSelector } from "react-redux";
import NotificationItem from "./NotificationItem";
import { Loader2, Inbox } from "lucide-react"; // Using Loader2 for a spinning icon

const NotificationList = () => {
  // Select all necessary state fields directly here
  const {
    notifications = [], // Default to empty array
    loading,
    error,
  } = useSelector((state) => state.notifications || {}); // Ensure state.notifications exists

  // Loading State
  if (loading && notifications.length === 0) {
    // Show loader only on initial load
    return (
      <div className="flex justify-center items-center py-16 flex-1">
        <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center flex-1">
        {/* Optional: Add an error icon */}
        <p className="text-red-400 text-sm mb-2">
          Failed to load notifications.
        </p>
        <p className="text-gray-500 text-xs">{error}</p>
        {/* Optional: Add a retry button here that dispatches getNotifications */}
      </div>
    );
  }

  // Empty State (after loading and no errors)
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center flex-1 h-full">
        <div className="bg-gray-800/50 p-3 rounded-full mb-4">
          <Inbox className="w-8 h-8 text-gray-500" />
        </div>
        <h4 className="text-gray-300 font-medium mb-1">All caught up!</h4>
        <p className="text-gray-500 text-sm max-w-xs">
          You have no new notifications right now.
        </p>
      </div>
    );
  }

  // List View
  return (
    // This div handles the scrolling within the panel
    <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-amber-700/30 scrollbar-track-transparent hover:scrollbar-thumb-amber-700/50">
      {/* Optional: Add padding if needed, or handle in NotificationItem */}
      <div className="divide-y divide-amber-500/10">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
        {/* Optional: Add loading indicator for pagination here */}
        {loading && notifications.length > 0 && (
          <div className="flex justify-center items-center py-3">
            <Loader2 className="w-4 h-4 text-amber-500/80 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
