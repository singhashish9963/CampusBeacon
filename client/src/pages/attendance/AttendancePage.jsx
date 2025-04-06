// src/pages/AttendancePage.jsx
import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { startOfDay } from "date-fns";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiBookOpen } from "react-icons/fi";

// --- Redux Actions ---
import {
  fetchUserEnrollments,
  clearEnrollmentError,
  resetEnrollments,
  unenrollFromSubject,
} from "../../slices/enrollmentSlice"; // Adjust path
import {
  fetchAttendanceRecords,
  fetchAttendancePercentage,
  clearAttendanceError,
  resetAttendance,
  fetchOverallPercentage,
  fetchSubjectWisePercentages,
  clearDetailedAttendance,
} from "../../slices/attendanceSlice"; // Adjust path
import { format,isValid,parseISO } from "date-fns";
// --- Child Components ---
import AttendancePageHeader from "../../components/Attendance/AttendancePageHeader"; // Adjust path
import OverallSummaryCard from "../../components/Attendance/OverallSummaryCard"; // Adjust path
import SubjectBreakdownSection from "../../components/Attendance/SubjectBreakdownSection"; // Adjust path
import DetailedViewControls from "../../components/Attendance/DetailedViewControls"; // Adjust path
import SubjectSummaryCard from "../../components/Attendance/SubjectSummaryCard"; // Adjust path
import DailyRecordsList from "../../components/Attendance/DailyRecordsList"; // Adjust path
import LoadingSpinner from "../../utils/LoadingSpinner"; // Adjust path
import ErrorDisplay from "../../utils/ErrorDisplay"; // Adjust path

// --- Lazy Load Modals ---
const AttendanceFormModal = lazy(
  () => import("../../components/Modals/AttendanceFormModal") // Adjust path
);
const EnrollmentModal = lazy(
  () => import("../../components/Modals/EnrollmentModal") // Adjust path
);

// --- Main AttendancePage Component ---
const AttendancePage = () => {
  // Hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State Selection from Redux
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const {
    userEnrollments,
    loading: enrollLoading,
    error: enrollError,
    unenrollLoading,
  } = useSelector((state) => state.enrollment);
  const {
    records,
    percentageData,
    loading: attendLoading, // Loading detailed records or marking/updating
    loadingPercentage,
    error: attendError,
    errorPercentage,
    overallPercentageData,
    subjectPercentageList,
    loadingOverall,
    errorOverall,
    loadingSubjectPercentages,
    errorSubjectPercentages,
  } = useSelector((state) => state.attendance);

  // Local Component State
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [attendanceModalState, setAttendanceModalState] = useState({
    isOpen: false,
    mode: "create",
    data: null,
  });
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [unrollingSubjectId, setUnrollingSubjectId] = useState(null);

  // --- Derived State ---
  const userId = user?.id;
  const selectedSubjectForDetails = userEnrollments.find(
    (s) => s.id === parseInt(selectedSubjectId, 10)
  );
  const isDetailedActionDisabled = attendLoading || attendanceModalState.isOpen; // Combine loading/modal open state

  // Consistent theme styles (can be moved to a context or config if needed)
  const themeStyles = {
    cardBg: "bg-gray-800/40",
    borderColor: "border-gray-700/50",
    headingColor: "text-amber-400",
    buttonGradient: "from-amber-500 to-orange-600",
    modalBg: "bg-gray-900",
    listHoverBg: "hover:bg-gray-700/50",
    tagBg: "bg-amber-500/20",
    tagText: "text-amber-400",
  };

  // --- Data Fetching Effects ---
  useEffect(() => {
    if (isAuthenticated && userId) {
      dispatch(fetchUserEnrollments(userId))
        .unwrap()
        .then((enrollments) => {
          if (enrollments?.length > 0) {
            dispatch(fetchOverallPercentage(userId));
            dispatch(fetchSubjectWisePercentages(userId));
            if (
              selectedSubjectId &&
              !enrollments.some((e) => e.id === parseInt(selectedSubjectId, 10))
            ) {
              setSelectedSubjectId("");
              dispatch(clearDetailedAttendance());
            }
          } else {
            dispatch(resetAttendance());
            setSelectedSubjectId("");
            dispatch(clearDetailedAttendance());
          }
        })
        .catch((err) =>
          console.error("Failed to fetch initial enrollments:", err)
        );
    } else {
      dispatch(resetEnrollments());
      dispatch(resetAttendance());
      setSelectedSubjectId("");
      setSelectedDate(startOfDay(new Date()));
      dispatch(clearDetailedAttendance());
    }
    return () => {
      dispatch(clearEnrollmentError());
      dispatch(clearAttendanceError());
    };
  }, [dispatch, isAuthenticated, userId, selectedSubjectId]);

  useEffect(() => {
    if (userId && selectedSubjectId && selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const filters = {
        userId,
        subjectId: selectedSubjectId,
        date: formattedDate,
      };
      dispatch(fetchAttendanceRecords(filters));
      dispatch(
        fetchAttendancePercentage({ userId, subjectId: selectedSubjectId })
      );
    } else {
      dispatch(clearDetailedAttendance());
    }
  }, [dispatch, userId, selectedSubjectId, selectedDate]);

  // --- Event Handlers (Callbacks for Child Components) ---
  const handleSubjectChangeAndSelect = useCallback(
    (subjectId) => {
      const subjectIdStr = subjectId.toString();
      if (selectedSubjectId !== subjectIdStr) {
        setSelectedSubjectId(subjectIdStr);
        setSelectedDate(startOfDay(new Date()));
        dispatch(clearAttendanceError()); // Clear only detailed errors
      }
    },
    [dispatch, selectedSubjectId]
  );

  const openAttendanceModal = useCallback(
    (mode, record = null, specificDate = null) => {
      const subject = selectedSubjectForDetails;
      if (!subject || !userId) {
        toast.error("Cannot open modal - user or subject missing.");
        return;
      }

      let modalData;
      if (mode === "create") {
        const dateToUse =
          specificDate && isValid(specificDate)
            ? format(startOfDay(specificDate), "yyyy-MM-dd")
            : format(new Date(), "yyyy-MM-dd");
        modalData = {
          userId,
          subjectId: subject.id,
          subjectName: subject.name,
          date: dateToUse,
          status: "",
        };
      } else if (mode === "edit" && record) {
        let recordDateStr = record.date;
        // Attempt formatting robustly
        try {
          if (isValid(parseISO(record.date))) {
            recordDateStr = format(parseISO(record.date), "yyyy-MM-dd");
          } else if (!/^\d{4}-\d{2}-\d{2}$/.test(record.date)) {
            throw new Error("Invalid date format");
          }
          // If already YYYY-MM-DD, use as is
        } catch (error) {
          toast.error("Invalid record date format for editing.");
          console.error("Date parsing error:", error);
          return;
        }
        modalData = {
          userId,
          subjectId: subject.id,
          subjectName: subject.name,
          recordId: record.id,
          date: recordDateStr,
          status: record.status,
        };
      } else {
        toast.error("Invalid modal configuration.");
        return;
      }
      setAttendanceModalState({ isOpen: true, mode, data: modalData });
    },
    [selectedSubjectForDetails, userId]
  );

  const closeAttendanceModal = useCallback(
    () =>
      setAttendanceModalState({ isOpen: false, mode: "create", data: null }),
    []
  );
  const handleOpenEnrollModal = useCallback(
    () => setIsEnrollModalOpen(true),
    []
  );
  const closeEnrollmentModal = useCallback(
    () => setIsEnrollModalOpen(false),
    []
  );

  const handleUnenroll = useCallback(
    async (subjectIdToUnenroll) => {
      if (!userId || !subjectIdToUnenroll || unrollingSubjectId) return;
      const subject = userEnrollments.find((s) => s.id === subjectIdToUnenroll);
      if (
        !subject ||
        !window.confirm(
          `Unenroll from "${subject.name}"? This removes related attendance data.`
        )
      )
        return;

      setUnrollingSubjectId(subjectIdToUnenroll);
      dispatch(clearEnrollmentError());
      try {
        await dispatch(
          unenrollFromSubject({ userId, subjectId: subjectIdToUnenroll })
        ).unwrap();
        // Success toast/refetch handled in thunk/useEffect
      } catch (err) {
        // Error toast handled in thunk
        console.error("Unenrollment failed in component:", err);
      } finally {
        setUnrollingSubjectId(null);
      }
    },
    [dispatch, userId, userEnrollments, unrollingSubjectId]
  );

  // --- Retry Handlers ---
  const handleRetryEnrollments = useCallback(() => {
    if (userId) {
      dispatch(clearEnrollmentError());
      dispatch(fetchUserEnrollments(userId));
    }
  }, [dispatch, userId]);
  const handleRetryOverall = useCallback(() => {
    if (userId) {
      dispatch(clearAttendanceError());
      dispatch(fetchOverallPercentage(userId));
    }
  }, [dispatch, userId]);
  const handleRetrySubjectWise = useCallback(() => {
    if (userId) {
      dispatch(clearAttendanceError());
      dispatch(fetchSubjectWisePercentages(userId));
    }
  }, [dispatch, userId]);
  const handleRetryDetailed = useCallback(() => {
    if (userId && selectedSubjectId && selectedDate) {
      dispatch(clearAttendanceError());
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      dispatch(
        fetchAttendanceRecords({
          userId,
          subjectId: selectedSubjectId,
          date: formattedDate,
        })
      );
      dispatch(
        fetchAttendancePercentage({ userId, subjectId: selectedSubjectId })
      );
    }
  }, [dispatch, userId, selectedSubjectId, selectedDate]);

  // --- Render Logic ---

  if (!isAuthenticated) {
    // Render Login Prompt
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-white p-6">
        <FiAlertTriangle className="text-red-400 text-5xl mx-auto mb-4" />
        <p>
          Please{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-amber-400 underline font-semibold"
          >
            log in
          </button>{" "}
          to view attendance.
        </p>
      </div>
    );
  }

  if (enrollLoading && !userEnrollments.length) {
    // Render Initial Loading State
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-white p-6">
        <LoadingSpinner />
        <p className="text-lg text-gray-300 mt-4">Loading Your Subjects...</p>
      </div>
    );
  }

  if (!enrollLoading && !enrollError && userEnrollments.length === 0) {
    // Render No Enrollments State
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-white flex flex-col items-center justify-center p-6">
        <div className="text-center py-16">
          <h1
            className={`text-3xl md:text-4xl font-bold ${themeStyles.headingColor} mb-6`}
          >
            Attendance Tracker
          </h1>
          <FiBookOpen className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-6">
            You haven't enrolled in any subjects yet.
          </p>
          <button
            onClick={handleOpenEnrollModal}
            /* Use handler */ className={`/* styles */`}
          >
            Enroll Now
          </button>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          {isEnrollModalOpen && (
            <EnrollmentModal
              isOpen={isEnrollModalOpen}
              onClose={closeEnrollmentModal}
              themeStyles={themeStyles}
            />
          )}
        </Suspense>
      </div>
    );
  }

  // --- Main View Render ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-white pb-16 px-4 md:px-8">
      {/* Header */}
      <AttendancePageHeader
        themeStyles={themeStyles}
        onEnrollMoreClick={handleOpenEnrollModal} // Use handler
        enrollError={enrollError}
      />

      {/* Display Enrollment Errors */}
      {enrollError && (
        <ErrorDisplay
          error={enrollError}
          onRetry={handleRetryEnrollments}
          messagePrefix="Error loading subjects: "
        />
      )}

      {/* Overall Statistics */}
      <OverallSummaryCard
        themeStyles={themeStyles}
        errorOverall={errorOverall}
        onRetryOverall={handleRetryOverall}
        loadingOverall={loadingOverall}
        overallPercentageData={overallPercentageData}
      />

      {/* Subject Breakdown */}
      <SubjectBreakdownSection
        themeStyles={themeStyles}
        errorSubjectPercentages={errorSubjectPercentages}
        onRetrySubjectWise={handleRetrySubjectWise}
        loadingSubjectPercentages={loadingSubjectPercentages}
        subjectPercentageList={subjectPercentageList}
        userEnrollments={userEnrollments}
        selectedSubjectId={selectedSubjectId}
        unrollingSubjectId={unrollingSubjectId}
        onSubjectSelect={handleSubjectChangeAndSelect}
        onUnenrollSubject={handleUnenroll}
        unenrollLoading={unenrollLoading}
      />

      {/* --- Detailed View Section (Conditional) --- */}
      <AnimatePresence>
        {selectedSubjectForDetails && (
          <motion.div
            id="attendance-details-section"
            layout
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: "2.5rem" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.4 }}
            className="pt-6 border-t border-gray-700"
          >
            {/* Controls */}
            <DetailedViewControls
              themeStyles={themeStyles}
              selectedSubject={selectedSubjectForDetails}
              selectedDate={selectedDate}
              onDateChange={(date) =>
                setSelectedDate(date ? startOfDay(date) : null)
              }
              onMarkTodayClick={() =>
                openAttendanceModal("create", null, new Date())
              }
              maxDate={startOfDay(new Date())}
              isActionDisabled={isDetailedActionDisabled}
            />

            {/* Grid for Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Subject Summary */}
              <div className="lg:col-span-1">
                <SubjectSummaryCard
                  themeStyles={themeStyles}
                  errorPercentage={errorPercentage}
                  onRetryDetailed={handleRetryDetailed}
                  loadingPercentage={loadingPercentage}
                  percentageData={percentageData}
                />
              </div>

              {/* Right: Daily Records */}
              <div className="lg:col-span-2">
                <DailyRecordsList
                  themeStyles={themeStyles}
                  selectedDate={selectedDate}
                  attendError={attendError}
                  onRetryDetailed={handleRetryDetailed}
                  attendLoading={attendLoading}
                  records={records}
                  onEditRecordClick={openAttendanceModal} // Pass the main modal opener
                  onMarkThisDateClick={openAttendanceModal} // Pass the main modal opener
                  isActionDisabled={isDetailedActionDisabled}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Modals --- */}
      <Suspense
        fallback={
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[100]">
            <LoadingSpinner size="text-3xl" />
          </div>
        }
      >
        {attendanceModalState.isOpen && (
          <AttendanceFormModal
            isOpen={attendanceModalState.isOpen}
            onClose={closeAttendanceModal}
            mode={attendanceModalState.mode}
            initialData={attendanceModalState.data}
            themeStyles={themeStyles}
          />
        )}
        {isEnrollModalOpen && (
          <EnrollmentModal
            isOpen={isEnrollModalOpen}
            onClose={closeEnrollmentModal}
            themeStyles={themeStyles}
          />
        )}
      </Suspense>
    </div>
  );
};

export default AttendancePage;
