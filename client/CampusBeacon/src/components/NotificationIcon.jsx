import React, { useState } from "react";
import { Bell } from "lucide-react";
import NotificationPanel from "./NotificationPanel";
import { useNotification } from "../contexts/notificationContext";

const NotificationIcon = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { getNotifications } = useNotification();

  const handleIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !isPanelOpen;
    setIsPanelOpen(newState);
    if (newState) {
      getNotifications();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleIconClick}
        type="button"
        className="p-2 bg-gray-800/50 rounded-full hover:bg-gray-700 transition-colors"
        aria-label="Toggle Notifications"
      >
        <Bell className="w-6 h-6 text-white" />
      </button>
      <NotificationPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  );
};

export default NotificationIcon;
