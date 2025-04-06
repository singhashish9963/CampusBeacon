import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { FiX, FiSave, FiLoader, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  markAttendance,
  updateAttendance,
  clearAttendanceError,
} from "../../slices/attendanceSlice";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "transparent",
    border: "none",
    padding: 0,
    overflow: "visible",
    maxWidth: "90vw",
    width: "500px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 50,
  },
};

Modal.setAppElement("#root");

const AttendanceFormModal = ({
  isOpen,
  onClose,
  mode = "create",
  initialData,
  themeStyles = {},
}) => {
  const dispatch = useDispatch();
  const { loading: attendanceLoading, error: attendanceError } = useSelector(
    (state) => state.attendance
  );
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStatus(mode === "edit" ? initialData.status || "" : "");
      if (attendanceError) {
        dispatch(clearAttendanceError());
      }
    }
  }, [isOpen, mode, initialData, dispatch, attendanceError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!status) {
      toast.error("Please select Present or Absent.");
      return;
    }

    let action;
    let actionPayload;

    if (mode === "create") {
      actionPayload = {
        userId: initialData.userId,
        subjectId: initialData.subjectId,
        date: initialData.date,
        status,
      };
      action = markAttendance(actionPayload);
    } else {
      actionPayload = {
        recordId: initialData.recordId,
        status,
      };
      action = updateAttendance(actionPayload);
    }

    try {
      await dispatch(action).unwrap();
      onClose();
    } catch (err) {
      console.error("Attendance submission failed:", err);
    }
  };

  const handleClose = () => {
    if (attendanceError) {
      dispatch(clearAttendanceError());
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={customStyles}
      contentLabel={
        mode === "create" ? "Mark Attendance Modal" : "Edit Attendance Modal"
      }
      closeTimeoutMS={300}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className={`${
          themeStyles.modalBg || "bg-gray-900"
        } rounded-lg shadow-xl border ${
          themeStyles.borderColor || "border-gray-700"
        } text-white p-6 relative overflow-hidden`}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-amber-400 transition-colors"
          aria-label="Close modal"
        >
          <FiX size={24} />
        </button>
        <h2
          className={`text-2xl font-bold mb-4 ${
            themeStyles.headingColor || "text-amber-400"
          }`}
        >
          {mode === "create" ? "Mark Attendance" : "Edit Attendance"}
        </h2>
        <div className="mb-5 text-gray-300 bg-gray-800/50 p-3 rounded-md border border-gray-700/50">
          <p>
            <strong className="font-medium text-gray-100">Subject:</strong>{" "}
            {initialData?.subjectName || "N/A"}
          </p>
          <p>
            <strong className="font-medium text-gray-100">Date:</strong>{" "}
            {initialData?.date || "N/A"}
          </p>
        </div>
        {attendanceError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md mb-4 text-sm flex items-center"
          >
            <FiAlertCircle className="mr-2 flex-shrink-0" /> {attendanceError}
          </motion.div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="present"
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 flex-1 ${
                  status === "Present"
                    ? "bg-green-800/50 border-green-500 text-white"
                    : `${
                        themeStyles.cardBg || "bg-gray-800/30"
                      } border-gray-700 text-gray-400 hover:border-green-700`
                }`}
              >
                <input
                  type="radio"
                  id="present"
                  name="status"
                  value="Present"
                  checked={status === "Present"}
                  onChange={(e) => setStatus(e.target.value)}
                  className="hidden"
                />
                <span className="ml-2 font-medium">Present</span>
              </label>
              <label
                htmlFor="absent"
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 flex-1 ${
                  status === "Absent"
                    ? "bg-red-800/50 border-red-500 text-white"
                    : `${
                        themeStyles.cardBg || "bg-gray-800/30"
                      } border-gray-700 text-gray-400 hover:border-red-700`
                }`}
              >
                <input
                  type="radio"
                  id="absent"
                  name="status"
                  value="Absent"
                  checked={status === "Absent"}
                  onChange={(e) => setStatus(e.target.value)}
                  className="hidden"
                />
                <span className="ml-2 font-medium">Absent</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={attendanceLoading}
              className={`px-6 py-2 rounded-lg font-semibold shadow-lg text-white flex items-center justify-center transition-all duration-300 ${
                attendanceLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : `bg-gradient-to-r ${
                      themeStyles.buttonGradient ||
                      "from-amber-500 to-orange-600"
                    } hover:brightness-110`
              }`}
            >
              {attendanceLoading ? (
                <>
                  <FiLoader className="animate-spin mr-2" /> Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> Save Attendance
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </Modal>
  );
};

export default AttendanceFormModal;
