import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useSelector } from "react-redux";

// Admin subpages

const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
      Welcome, God Mode Activated
    </h1>
    <p className="text-lg text-blue-400">
      This is your admin dashboard where you can control every part of the site.
    </p>
  </div>
);

import {
  getNotifications,
  createNotification,
  broadcastNotification,
  deleteNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../slices/notificationSlice";
import { useDispatch } from "react-redux";

const NotificationsAdmin = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector(
    (state) => state.notifications
  );
  const [isBroadcast, setIsBroadcast] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    type: "general",
    file: null,
  });

  useEffect(() => {
    dispatch(getNotifications({}));
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    const payload = new FormData();
    payload.append("message", formData.message);
    payload.append("type", formData.type);
    if (formData.file) {
      payload.append("file", formData.file);
    }

    if (isBroadcast) {
      dispatch(broadcastNotification(payload));
    } else {
      dispatch(createNotification(payload));
    }
    setFormData({ message: "", type: "general", file: null });
  };

  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
  };

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Notifications</h2>
      <div className="mb-4">
        <button
          onClick={() => setIsBroadcast(!isBroadcast)}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white transition-all"
        >
          {isBroadcast
            ? "Switch to Personal Notification"
            : "Switch to Broadcast Notification"}
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <div>Loading notifications...</div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Message</label>
              <textarea
                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-amber-500"
                placeholder="Enter notification message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Type</label>
              <select
                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-amber-500"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="general">General</option>
                <option value="system">System</option>
                <option value="alert">Alert</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">
                File (optional)
              </label>
              <input
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, file: e.target.files[0] })
                }
                className="w-full text-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-md transition-all"
            >
              {isBroadcast
                ? "Send Broadcast Notification"
                : "Create Notification"}
            </button>
          </form>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              Existing Notifications
            </h3>
            {notifications.length === 0 ? (
              <p>No notifications found.</p>
            ) : (
              <ul className="space-y-4">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className="p-4 bg-gray-800 rounded-md border border-gray-700"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="text-white">{notif.message}</p>
                        <p className="text-gray-400 text-sm">
                          Type: {notif.type}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Read: {notif.is_read ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="space-x-2">
                        {!notif.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded-sm text-white text-sm transition-all"
                          >
                            Mark as Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-sm text-white text-sm transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-6">
            <button
              onClick={() => dispatch(markAllNotificationsAsRead())}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white transition-all"
            >
              Mark All as Read
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const HostelAdmin = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-2">Manage Hostels</h2>
    <p className="mb-4">
      Here you can create, update, or remove hostel data and related
      information.
    </p>
  </div>
);

const MenuAdmin = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-2">Update Menus</h2>
    <p className="mb-4">
      Manage hostel menus including creating, editing, or deleting menu items.
    </p>
  </div>
);

const RidesAdmin = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-2">Manage Rides</h2>
    <p className="mb-4">
      Manage ride data (creation, update, deletion, filtering, etc.).
    </p>
  </div>
);

const BuyAndSellAdmin = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-2">Manage Buy &amp; Sell</h2>
    <p className="mb-4">Oversee buy&amp;sell items and related interactions.</p>
  </div>
);

const AdminPanel = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "notifications":
        return <NotificationsAdmin />;
      case "hostels":
        return <HostelAdmin />;
      case "menus":
        return <MenuAdmin />;
      case "rides":
        return <RidesAdmin />;
      case "buysell":
        return <BuyAndSellAdmin />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => setActivePage("dashboard")}
                className={`w-full text-left text-lg transition-colors hover:text-amber-400 ${
                  activePage === "dashboard" ? "text-amber-400" : ""
                }`}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("notifications")}
                className={`w-full text-left text-lg transition-colors hover:text-amber-400 ${
                  activePage === "notifications" ? "text-amber-400" : ""
                }`}
              >
                Notifications
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("hostels")}
                className={`w-full text-left text-lg transition-colors hover:text-amber-400 ${
                  activePage === "hostels" ? "text-amber-400" : ""
                }`}
              >
                Hostels
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("menus")}
                className={`w-full text-left text-lg transition-colors hover:text-amber-400 ${
                  activePage === "menus" ? "text-amber-400" : ""
                }`}
              >
                Menus
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("rides")}
                className={`w-full text-left text-lg transition-colors hover:text-amber-400 ${
                  activePage === "rides" ? "text-amber-400" : ""
                }`}
              >
                Rides
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("buysell")}
                className={`w-full text-left text-lg transition-colors hover:text-amber-400 ${
                  activePage === "buysell" ? "text-amber-400" : ""
                }`}
              >
                Buy &amp; Sell
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">{renderPage()}</main>
    </div>
  );
};

export default AdminPanel;
