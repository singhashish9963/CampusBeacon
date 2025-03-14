import React from "react";
import { Bell } from "lucide-react";
import { useNotification } from "../../contexts/notificationContext";
import NotificationItem from "./NotificationItem";

const NotificationList = () => {
  const { notifications, loading, error } = useNotification();

  // Display error if one exists
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-pulse flex space-x-2">
          <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
          <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
          <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Empty state (when notifications list is empty)
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="bg-gray-800/30 p-4 rounded-full mb-4">
          <Bell className="w-10 h-10 text-amber-500/50" />
        </div>
        <h4 className="text-gray-300 font-medium mb-1">All caught up!</h4>
        <p className="text-gray-500 text-sm max-w-xs">
          You don't have any notifications at the moment. Check back later.
        </p>
      </div>
    );
  }

  // Loaded notifications
  return (
    <div className="max-h-[60vh] overflow-y-auto">
      <div className="py-2 divide-y divide-amber-500/10">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
