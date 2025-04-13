// src/components/admin/UserCard.js
import React, { useState, useMemo } from "react";
import {
  FiUserCheck,
  FiUserX,
  FiEdit,
  FiTrash2,
  FiMail,
  FiCalendar,
  FiStar,
  FiClock,
  FiChevronDown, // Using a specific icon for clarity
  FiUser, // Fallback icon
} from "react-icons/fi";

// Helper function to format dates (memoized for slight performance gain if reused heavily)
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  try {
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return "Invalid Date";
  }
};

const UserCard = React.memo(({ user }) => {
  // Use React.memo to prevent re-renders if the user prop doesn't change
  const [isExpanded, setIsExpanded] = useState(false);

  // Memoize formatted dates to avoid recalculation on every render unless user changes
  const createdAtFormatted = useMemo(
    () => formatDate(user?.createdAt),
    [user?.createdAt]
  );
  const updatedAtFormatted = useMemo(
    () => formatDate(user?.updatedAt),
    [user?.updatedAt]
  );

  if (!user) {
    return null; // Return null if no user data
  }

  // Determine initial for avatar - use username or fallback to 'U'
  const avatarInitial = user.username
    ? user.username.charAt(0).toUpperCase()
    : "U";
  const displayName = user.name || "Anonymous User"; // Prefer username for display

  return (
    <div
      className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700
                 transform transition duration-300 ease-in-out hover:shadow-amber-900/20
                 ${
                   isExpanded
                     ? "scale-[1.02] shadow-xl"
                     : "hover:scale-105 hover:shadow-lg"
                 }`}
    >
      <div className="p-5">
        {/* --- Card Header --- */}
        <div className="flex items-center justify-between mb-4">
          {/* Avatar and Basic Info */}
          <div className="flex items-center min-w-0 mr-2">
            {" "}
            {/* Added min-w-0 here */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-gray-900 font-bold text-xl">
              {avatarInitial}
            </div>
            <div className="ml-3 min-w-0">
              {" "}
              {/* Added min-w-0 here */}
              <h3
                className="font-semibold text-xl text-white truncate"
                title={displayName}
              >
                {displayName}
              </h3>
              {/* Container for email + verification icon */}
              <div className="flex items-center text-sm text-gray-400 min-w-0">
                {" "}
                {/* Added min-w-0 here */}
                {/* Email span - allow shrinking and truncation */}
                <span className="truncate flex-shrink mr-2" title={user.email}>
                  {" "}
                  {/* Added flex-shrink */}
                  {user.email}
                </span>
                {/* Verification Icon */}
                {user.isVerified ? (
                  <span
                    className="flex-shrink-0 flex items-center text-green-400"
                    title="Verified Account"
                  >
                    <FiUserCheck className="mr-1" aria-hidden="true" />
                  </span>
                ) : (
                  <span
                    className="flex-shrink-0 flex items-center text-red-400"
                    title="Account Not Verified"
                  >
                    <FiUserX className="mr-1" aria-hidden="true" />
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 text-gray-400 hover:text-amber-400 transition-colors p-1 rounded-full hover:bg-gray-700"
            aria-label={isExpanded ? "Collapse card" : "Expand card"}
            aria-expanded={isExpanded}
          >
            <FiChevronDown
              className={`w-6 h-6 transform transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* --- Status Badges --- */}
        <div className="flex items-center flex-wrap gap-2 mb-4">
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              user.isVerified
                ? "bg-green-900/50 text-green-300 border border-green-700/50"
                : "bg-red-900/50 text-red-300 border border-red-700/50"
            }`}
          >
            {user.isVerified ? "Verified" : "Unverified"}
          </span>
          {user.roles && user.roles.includes("admin") && (
            <span className="text-xs bg-amber-900/50 text-amber-300 border border-amber-700/50 px-3 py-1 rounded-full font-medium">
              Admin
            </span>
          )}
          {/* Add other role badges if needed */}
        </div>

        {/* --- Expandable Content --- */}
        <div
          // Use specific transitions instead of transition-all
          className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-3 border-t border-gray-700 pt-4 mt-2">
            {/* User ID */}
            <div className="flex items-center text-gray-300">
              <FiUser
                className="text-amber-400 mr-2 flex-shrink-0"
                title="User ID"
                aria-hidden="true"
              />
              <span className="text-amber-400 font-medium mr-2 w-20 flex-shrink-0">
                User ID:
              </span>
              <span className="text-sm font-mono bg-gray-900 px-2 py-0.5 rounded break-all">
                {user.id}
              </span>
            </div>

            {/* Roles with icon */}
            <div className="flex items-start text-gray-300">
              <FiStar
                className="text-amber-400 mr-2 mt-1 flex-shrink-0"
                title="Roles"
                aria-hidden="true"
              />
              <span className="text-amber-400 font-medium mr-2 w-20 flex-shrink-0">
                Roles:
              </span>
              <div className="flex flex-wrap gap-1">
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map(
                    (
                      role // Removed index as key if role names are unique
                    ) => (
                      <span
                        key={role}
                        className="text-xs bg-gray-700 px-2 py-0.5 rounded"
                      >
                        {role}
                      </span>
                    )
                  )
                ) : (
                  <span className="text-xs text-gray-500">No Roles</span>
                )}
              </div>
            </div>

            {/* Dates with icon */}
            <div className="flex items-center text-gray-300">
              <FiCalendar
                className="text-amber-400 mr-2 flex-shrink-0"
                title="Date Created"
                aria-hidden="true"
              />
              <span className="text-amber-400 font-medium mr-2 w-20 flex-shrink-0">
                Created:
              </span>
              <span className="text-sm">{createdAtFormatted}</span>
            </div>

            <div className="flex items-center text-gray-300">
              <FiClock
                className="text-amber-400 mr-2 flex-shrink-0"
                title="Last Updated"
                aria-hidden="true"
              />
              <span className="text-amber-400 font-medium mr-2 w-20 flex-shrink-0">
                Updated:
              </span>
              <span className="text-sm">{updatedAtFormatted}</span>
            </div>

            {/* Add other user details here if needed */}
          </div>

          {/* --- Action Buttons --- */}
          <div className="mt-6 flex space-x-3">
            {/* Add onClick handlers for these actions */}
            <button
              aria-label={`Edit user ${displayName}`}
              className="flex-1 bg-blue-900/50 hover:bg-blue-800/70 border border-blue-700/50 text-blue-300 py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm font-medium"
            >
              <FiEdit className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Edit
            </button>
            <button
              aria-label={`Delete user ${displayName}`}
              className="flex-1 bg-red-900/50 hover:bg-red-800/70 border border-red-700/50 text-red-300 py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm font-medium"
            >
              <FiTrash2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}); // Wrap component export in React.memo

export default UserCard;
