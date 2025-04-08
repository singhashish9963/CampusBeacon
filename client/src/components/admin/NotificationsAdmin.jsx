import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Paperclip } from "lucide-react";

import {
  getNotifications,
  createNotification,
  broadcastNotification,
  deleteNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../slices/notificationSlice";

import { fetchAllUsers } from "../../slices/authSlice";

const LIMIT = 15;

const NotificationsAdmin = () => {
  const dispatch = useDispatch();
  const formRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [isBroadcast, setIsBroadcast] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    type: "general",
    file: null,
    userId: "",
  });

  const {
    notifications = [],
    loading: loadingNotifications,
    error: errorNotifications,
    totalPages = 0,
  } = useSelector((state) => state.notifications) || {};

  const {
    allUsers = [],
    loadingUsers = false,
    usersError = null,
  } = useSelector((state) => state.auth) || {};

  useEffect(() => {
    dispatch(getNotifications({ page: currentPage, limit: LIMIT }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  }, []);

  const handleToggleBroadcast = useCallback(() => {
    setIsBroadcast((prev) => !prev);
    setFormData((prev) => ({ ...prev, userId: "" }));
  }, []);

  const resetForm = () => {
    setFormData({ message: "", type: "general", file: null, userId: "" });
    if (formRef.current) {
      formRef.current.reset();
    }
    setIsBroadcast(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }
    if (!isBroadcast && !formData.userId) {
      toast.error("Please select a target user or enable broadcast.");
      return;
    }

    const payload = new FormData();
    payload.append("message", formData.message);
    payload.append("type", formData.type);
    if (formData.file) {
      payload.append("file", formData.file);
    }

    let actionToDispatch;
    let loadingToastId;

    if (isBroadcast) {
      payload.append("entityType", "broadcast");
      actionToDispatch = broadcastNotification(payload);
      loadingToastId = toast.loading("Broadcasting notification...");
    } else {
      payload.append("userId", formData.userId);
      actionToDispatch = createNotification(payload);
      loadingToastId = toast.loading(
        `Sending notification to user ID ${formData.userId}...`
      );
    }

    try {
      await dispatch(actionToDispatch).unwrap();
      toast.success(
        isBroadcast
          ? "Broadcast sent successfully!"
          : "Notification sent successfully!",
        { id: loadingToastId }
      );
      resetForm();
      if (currentPage !== 1) setCurrentPage(1);
      else if (!isBroadcast)
        dispatch(getNotifications({ page: 1, limit: LIMIT }));
    } catch (err) {
      toast.error(
        `Failed to send notification: ${err?.message || "Unknown error"}`,
        { id: loadingToastId }
      );
    }
  };

  const handleDelete = useCallback(
    async (id) => {
      if (
        window.confirm(`Are you sure you want to delete notification ID ${id}?`)
      ) {
        const loadingToastId = toast.loading("Deleting notification...");
        try {
          await dispatch(deleteNotification(id)).unwrap();
          toast.success("Notification deleted successfully!", {
            id: loadingToastId,
          });
          dispatch(getNotifications({ page: currentPage, limit: LIMIT }));
          if (notifications.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
          }
        } catch (err) {
          toast.error(`Failed to delete: ${err?.message || "Unknown error"}`, {
            id: loadingToastId,
          });
        }
      }
    },
    [dispatch, currentPage, notifications.length]
  );

  const handleMarkAsRead = useCallback(
    async (id) => {
      const loadingToastId = toast.loading("Marking as read...");
      try {
        await dispatch(markNotificationAsRead(id)).unwrap();
        toast.success("Notification marked as read.", { id: loadingToastId });
      } catch (err) {
        toast.error(
          `Failed to mark as read: ${err?.message || "Unknown error"}`,
          { id: loadingToastId }
        );
      }
    },
    [dispatch]
  );

  const handleMarkAllAdminAsRead = useCallback(async () => {
    if (window.confirm("Mark all your listed notifications as read?")) {
      const loadingToastId = toast.loading("Marking all as read...");
      try {
        await dispatch(markAllNotificationsAsRead()).unwrap();
        toast.success("All notifications marked as read.", {
          id: loadingToastId,
        });
      } catch (err) {
        toast.error(`Failed to mark all: ${err?.message || "Unknown error"}`, {
          id: loadingToastId,
        });
      }
    }
  }, [dispatch]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const isSubmitting = useSelector((state) => state.notifications.loading);

  return (
    <div className="p-6 text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-amber-400">
        Manage Notifications
      </h2>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mb-8 p-6 bg-gray-800 rounded-lg border border-gray-700 shadow-md"
      >
        <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
          Create New Notification
        </h3>
        <div className="mb-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isBroadcast}
              onChange={handleToggleBroadcast}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-300">
              Broadcast to ALL users?
            </span>
          </label>
        </div>

        {!isBroadcast && (
          <div className="mb-4">
            <label
              htmlFor="userId"
              className="block text-gray-300 mb-1 text-sm font-medium"
            >
              Target User *
            </label>
            {loadingUsers ? (
              <p className="text-sm text-gray-400">Loading users...</p>
            ) : usersError ? (
              <p className="text-sm text-red-500">
                Error loading users: {usersError}
              </p>
            ) : (
              <select
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                required={!isBroadcast}
                className="w-full p-2.5 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                disabled={isBroadcast}
              >
                <option value="" disabled>
                  -- Select a User --
                </option>
                {allUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email} (ID: {user.id})
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-gray-300 mb-1 text-sm font-medium"
          >
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            className="w-full p-2.5 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
            placeholder="Enter notification message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={3}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="type"
            className="block text-gray-300 mb-1 text-sm font-medium"
          >
            Type
          </label>
          <select
            id="type"
            name="type"
            className="w-full p-2.5 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
            value={formData.type}
            onChange={handleInputChange}
          >
            <option value="general">General</option>
            <option value="system">System</option>
            <option value="alert">Alert</option>
            <option value="update">Update</option>
            <option value="event">Event</option>
          </select>
        </div>
        <div className="mb-6">
          <label
            htmlFor="file"
            className="block text-gray-300 mb-1 text-sm font-medium"
          >
            Attach File (optional)
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </>
          ) : isBroadcast ? (
            "Send Broadcast"
          ) : (
            "Send Notification"
          )}
        </button>
      </form>

      <div className="mt-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h3 className="text-xl font-semibold">
            Existing Notifications (Page {currentPage} of{" "}
            {totalPages > 0 ? totalPages : 1})
          </h3>
          <button
            onClick={handleMarkAllAdminAsRead}
            disabled={loadingNotifications || notifications.length === 0}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm transition-all disabled:opacity-50 whitespace-nowrap"
          >
            Mark My Notifications Read
          </button>
        </div>

        {loadingNotifications && notifications.length === 0 && (
          <div className="text-center py-10">
            <p>Loading notifications...</p>
          </div>
        )}

        {errorNotifications && (
          <div className="text-center py-10 text-red-500">
            <p>Error loading notifications: {errorNotifications}</p>
          </div>
        )}

        {!loadingNotifications &&
          !errorNotifications &&
          notifications.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <p>No notifications found for this page.</p>
            </div>
          )}

        {!errorNotifications && notifications.length > 0 && (
          <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700 shadow-md">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Message
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    User ID
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {notifications.map((notif) => (
                  <tr
                    key={notif.id}
                    className={`${notif.is_read ? "opacity-70" : ""} hover:bg-gray-700/50`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      {!notif.is_read && (
                        <span
                          className="inline-block h-2 w-2 rounded-full bg-amber-500 mr-2"
                          title="Unread"
                        ></span>
                      )}
                      {notif.is_read ? "Read" : "Unread"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-200">
                      {notif.message}
                      {notif.file_url && (
                        <a
                          href={notif.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-400 hover:underline inline-flex items-center text-xs"
                          title="View Attachment"
                        >
                          <Paperclip size={12} className="mr-1" /> View
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                      {notif.userId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                      {notif.type}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                      {new Date(notif.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {!notif.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          disabled={loadingNotifications}
                          title="Mark as Read"
                          className="text-green-400 hover:text-green-300 disabled:opacity-50"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif.id)}
                        disabled={loadingNotifications}
                        title="Delete Notification"
                        className="text-red-400 hover:text-red-300 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center space-x-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || loadingNotifications}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || loadingNotifications}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsAdmin;
