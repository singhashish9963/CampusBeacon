import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookReader, FaArrowLeft, FaFolderOpen } from "react-icons/fa";
import { MdOutlineBookmarks, MdOutlineSubject } from "react-icons/md";
import {
  ChevronRight,
  Download,
  Search,
  Book,
  FileText,
  Video,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Building,
  BookOpen,
  X, 
  Folder,
  Info,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBranches,
  fetchYears,
  fetchStudyMaterials,
  createStudyMaterial,
  updateStudyMaterial,
  deleteStudyMaterial,
  fetchSubjects,
  createBranch,
  createYear,
  // Import Subject Thunks
  createSubject,
  updateSubject,
  deleteSubject,
} from "../../slices/resourceSlice"; // Verify this path

// --- IMPORT MODAL COMPONENTS ---

import ResourceModal from "../../components/resource/ResourceModal"; 
import BranchModal from "../../components/resource/BranchModal"; 
import YearModal from "../../components/resource/YearModal";
import SubjectModal from "../../components/resource/SubjectModal"; 

// ----------- HELPER COMPONENTS -----------

const EmptyState = ({ message, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <Icon className="w-16 h-16 text-purple-400 mb-4 opacity-50" />
    <p className="text-gray-400 text-lg">{message}</p>
  </div>
);

const getResourceIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "pdf":
      return <Book className="w-6 h-6 text-red-400 flex-shrink-0" />;
    case "video":
      return <Video className="w-6 h-6 text-blue-400 flex-shrink-0" />;
    default:
      return <FileText className="w-6 h-6 text-purple-400 flex-shrink-0" />;
  }
};

// ----------- MAIN PAGE COMPONENT -----------

const ResourcesPage = () => {
  const dispatch = useDispatch();
  const {
    branches = [],
    years = [],
    studyMaterials = [],
    subjects = [],
    loading,
    error,
  } = useSelector((state) => state.resource);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.roles?.includes("admin");

  // --- State ---
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);

  // Form Data States
  const [resourceFormData, setResourceFormData] = useState({
    title: "",
    description: "",
    material_type: "PDF",
    file: null,
    subject_id: "",
  });
  const [branchFormData, setBranchFormData] = useState({ branch_name: "" });
  const [yearFormData, setYearFormData] = useState({
    year_name: "",
    branch_id: "",
  });
  const [subjectFormData, setSubjectFormData] = useState({
    name: "",
    code: "",
    credit: "",
    icon: "",
  });

  // --- Effects ---
  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchYears());
    dispatch(fetchStudyMaterials());
    dispatch(fetchSubjects());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedBranch) setSelectedYear(null);
    if (!selectedYear) setSelectedSubject(null);
  }, [selectedBranch, selectedYear]);

  // --- Memoized Filters ---
  const filteredYears = useMemo(
    () =>
      selectedBranch
        ? years.filter(
            (y) => Number(y.branch_id) === Number(selectedBranch.branch_id)
          )
        : [],
    [years, selectedBranch]
  );

  const subjectsForCurrentView = useMemo(() => subjects, [subjects]);

  const filteredResourcesList = useMemo(() => {
    if (!selectedBranch || !selectedYear || !selectedSubject) return [];
    const lowerSearch = searchQuery.toLowerCase();
    return studyMaterials.filter(
      (m) =>
        Number(m.branch_id) === Number(selectedBranch.branch_id) &&
        Number(m.year_id) === Number(selectedYear.year_id) &&
        Number(m.subject_id) === Number(selectedSubject.id) &&
        (!lowerSearch ||
          m.title?.toLowerCase().includes(lowerSearch) ||
          m.description?.toLowerCase().includes(lowerSearch))
    );
  }, [
    studyMaterials,
    selectedBranch,
    selectedYear,
    selectedSubject,
    searchQuery,
  ]);

  // --- Modal Handlers (useCallback) ---
  const openResourceModal = useCallback(
    (resource = null) => {
      if (!selectedSubject) {
        alert("Please select a subject first.");
        return;
      }
      setEditingResource(resource ? resource : null);
      setResourceFormData({
        title: resource?.title || "",
        description: resource?.description || "",
        material_type: resource?.material_type || "PDF",
        subject_id: String(resource?.subject_id || selectedSubject.id || ""),
        file: null,
      });
      setShowResourceModal(true);
    },
    [selectedSubject]
  );
  const closeResourceModal = useCallback(() => setShowResourceModal(false), []);

  const openBranchModal = useCallback(() => {
    setBranchFormData({ branch_name: "" });
    setShowBranchModal(true);
  }, []);
  const closeBranchModal = useCallback(() => setShowBranchModal(false), []);

  const openYearModal = useCallback(() => {
    setYearFormData({
      year_name: "",
      branch_id: selectedBranch ? String(selectedBranch.branch_id) : "",
    });
    setShowYearModal(true);
  }, [selectedBranch]);
  const closeYearModal = useCallback(() => setShowYearModal(false), []);

  const openSubjectModal = useCallback((subject = null) => {
    setEditingSubject(subject ? subject : null);
    setSubjectFormData({
      name: subject?.name || "",
      code: subject?.code || "",
      credit: subject?.credit ?? "", // Use ?? to handle null/undefined -> empty string
      icon: subject?.icon || "📚",
    });
    setShowSubjectModal(true);
  }, []);
  const closeSubjectModal = useCallback(() => {
    setShowSubjectModal(false);
    setEditingSubject(null);
    setSubjectFormData({ name: "", code: "", credit: "", icon: "" });
  }, []);

  // --- Form Change Handlers (useCallback) ---
  const handleResourceFormChange = useCallback((e) => {
    const { name, value, files } = e.target;
    if (name === "file")
      setResourceFormData((prev) => ({ ...prev, file: files?.[0] || null }));
    else setResourceFormData((prev) => ({ ...prev, [name]: value }));
  }, []);
  const handleBranchFormChange = useCallback(
    (e) =>
      setBranchFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      })),
    []
  );
  const handleYearFormChange = useCallback(
    (e) =>
      setYearFormData((prev) => ({ ...prev, [e.target.name]: e.target.value })),
    []
  );
  const handleSubjectFormChange = useCallback((e) => {
    const { name, value } = e.target;
    const val = name === "credit" ? (value === "" ? "" : Number(value)) : value;
    setSubjectFormData((prev) => ({ ...prev, [name]: val }));
  }, []);

  // --- Form Submit Handlers (useCallback) ---
  const handleResourceSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (
        !selectedBranch?.branch_id ||
        !selectedYear?.year_id ||
        !resourceFormData.subject_id
      ) {
        alert("Branch, Year, and Subject must be selected/valid.");
        return;
      }
      if (!editingResource && !(resourceFormData.file instanceof File)) {
        alert("File is required for new resources.");
        return;
      }
      const formPayload = new FormData();
      formPayload.append("title", resourceFormData.title);
      formPayload.append("description", resourceFormData.description);
      formPayload.append("material_type", resourceFormData.material_type);
      formPayload.append("subject_id", resourceFormData.subject_id);
      formPayload.append("branch_id", String(selectedBranch.branch_id));
      formPayload.append("year_id", String(selectedYear.year_id));
      if (resourceFormData.file instanceof File)
        formPayload.append("file", resourceFormData.file);
      try {
        if (editingResource)
          await dispatch(
            updateStudyMaterial({
              id: editingResource.material_id,
              formData: formPayload,
            })
          ).unwrap();
        else await dispatch(createStudyMaterial(formPayload)).unwrap();
        closeResourceModal();
        dispatch(fetchStudyMaterials());
      } catch (err) {
        console.error("Failed to save resource:", err);
        alert(
          `Error saving resource: ${err?.message || err || "Unknown error"}`
        );
      }
    },
    [
      dispatch,
      resourceFormData,
      selectedBranch,
      selectedYear,
      editingResource,
      closeResourceModal,
    ]
  );

  const handleBranchSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await dispatch(createBranch(branchFormData)).unwrap();
        closeBranchModal();
        dispatch(fetchBranches());
      } catch (err) {
        console.error("Failed to create branch:", err);
        alert(
          `Error creating branch: ${err?.message || err || "Unknown error"}`
        );
      }
    },
    [dispatch, branchFormData, closeBranchModal]
  );

  const handleYearSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!yearFormData.branch_id) {
        alert("Please select a branch for the year.");
        return;
      }
      try {
        await dispatch(createYear(yearFormData)).unwrap();
        closeYearModal();
        dispatch(fetchYears());
      } catch (err) {
        console.error("Failed to create year:", err);
        alert(`Error creating year: ${err?.message || err || "Unknown error"}`);
      }
    },
    [dispatch, yearFormData, closeYearModal]
  );

  const handleSubjectSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!subjectFormData.name?.trim() || !subjectFormData.code?.trim()) {
        alert("Subject Name and Code are required.");
        return;
      }
      const payload = {
        ...subjectFormData,
        credit: subjectFormData.credit === "" ? null : subjectFormData.credit,
      };
      try {
        if (editingSubject)
          await dispatch(
            updateSubject({ id: editingSubject.id, subjectData: payload })
          ).unwrap();
        else await dispatch(createSubject(payload)).unwrap();
        closeSubjectModal();
        dispatch(fetchSubjects());
      } catch (err) {
        console.error("Failed to save subject:", err);
        alert(
          `Error saving subject: ${err?.message || err || "Unknown error"}`
        );
      }
    },
    [dispatch, subjectFormData, editingSubject, closeSubjectModal]
  );

  // --- Delete Handlers (useCallback) ---
  const handleDeleteResource = useCallback(
    async (id) => {
      if (window.confirm("Delete this resource?")) {
        try {
          await dispatch(deleteStudyMaterial(id)).unwrap();
          dispatch(fetchStudyMaterials());
        } catch (err) {
          console.error("Failed to delete resource:", err);
          alert(
            `Error deleting resource: ${err?.message || err || "Unknown error"}`
          );
        }
      }
    },
    [dispatch]
  );

  const handleDeleteSubject = useCallback(
    async (id) => {
      if (
        window.confirm(
          "Delete this subject? Associated materials might also be deleted."
        )
      ) {
        const hasMaterials = studyMaterials.some(
          (m) => Number(m.subject_id) === Number(id)
        );
        if (
          hasMaterials &&
          !window.confirm(
            "WARNING: Materials exist for this subject. Deleting the subject might delete them. Proceed?"
          )
        )
          return;
        try {
          await dispatch(deleteSubject(id)).unwrap();
          dispatch(fetchSubjects());
          if (selectedSubject?.id === id) setSelectedSubject(null);
        } catch (err) {
          console.error("Failed to delete subject:", err);
          alert(
            `Error deleting subject: ${err?.message || err || "Unknown error"}`
          );
        }
      }
    },
    [dispatch, studyMaterials, selectedSubject]
  );

  // --- Download Handler ---
  const handleDownload = useCallback((url) => {
    if (!url) return;
    const downloadUrl = `${url}?fl_attachment`;
    console.log("Attempting download from:", downloadUrl);
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
  }, []);

  // --- Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 p-4 md:p-8 text-gray-200">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <FaBookReader /> Academic Resources
          </h1>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {!selectedBranch && isAdmin && (
              <button
                onClick={openBranchModal}
                className="w-full md:w-auto flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
                type="button"
              >
                <Plus className="w-4 h-4" />
                <span>Create Branch</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Loading Indicator */}
        {loading && !branches.length && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          </div>
        )}

        {/* Error Message */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/40 border border-red-500/50 text-red-300 p-4 rounded-lg mb-6"
          >
            <p>
              Error loading data:{" "}
              {typeof error === "string"
                ? error
                : "An unexpected error occurred."}
            </p>
          </motion.div>
        )}

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {!selectedBranch ? (
            // --- Branches List ---
            <motion.div
              key="branches-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {branches.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {branches.map((branch) => (
                    <motion.div
                      key={branch.branch_id}
                      whileHover={{
                        scale: 1.03,
                        y: -5,
                        boxShadow: "0 10px 20px rgba(168, 85, 247, 0.2)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/40 hover:border-purple-500/70 cursor-pointer transition-all duration-200 group overflow-hidden"
                      onClick={() => setSelectedBranch(branch)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-800/60 to-blue-800/60 rounded-lg text-purple-200 text-xl font-bold shadow-inner">
                          {branch.branch_name?.slice(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <h2
                        className="text-xl font-semibold text-white truncate"
                        title={branch.branch_name}
                      >
                        {branch.branch_name}
                      </h2>
                      <p className="text-purple-300/80 mt-2 flex items-center text-sm group-hover:text-purple-300 transition-colors">
                        View Years{" "}
                        <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                !loading && (
                  <EmptyState
                    message={
                      isAdmin
                        ? "No branches. Click 'Create Branch'!"
                        : "No branches available."
                    }
                    icon={Building}
                  />
                )
              )}
            </motion.div>
          ) : !selectedYear ? (
            // --- Years List ---
            <motion.div
              key="years-view"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <button
                  onClick={() => setSelectedBranch(null)}
                  className="text-fuchsia-400 hover:text-fuchsia-300 flex items-center transition-colors text-sm font-medium"
                  type="button"
                >
                  <FaArrowLeft className="mr-2 w-4 h-4" /> Back to Branches
                </button>
                {isAdmin && (
                  <button
                    onClick={openYearModal}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
                    type="button"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Year</span>
                  </button>
                )}
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-purple-500/20 pb-3">
                  {selectedBranch.branch_name} - Select Year
                </h2>
                {filteredYears.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredYears.map((year) => (
                      <motion.div
                        key={year.year_id}
                        whileHover={{
                          scale: 1.03,
                          y: -5,
                          boxShadow: "0 10px 20px rgba(168, 85, 247, 0.15)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/40 hover:border-purple-500/70 cursor-pointer transition-all duration-200 group"
                        onClick={() => setSelectedYear(year)}
                      >
                        <MdOutlineBookmarks className="w-8 h-8 mb-4 text-purple-400" />
                        <h2 className="text-xl font-semibold text-white">
                          {year.year_name}
                        </h2>
                        <p className="text-purple-300/80 mt-2 flex items-center text-sm group-hover:text-purple-300 transition-colors">
                          View Subjects{" "}
                          <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  !loading && (
                    <EmptyState
                      message={
                        isAdmin
                          ? "No years. Click 'Add Year'!"
                          : "No years for this branch."
                      }
                      icon={BookOpen}
                    />
                  )
                )}
              </div>
            </motion.div>
          ) : !selectedSubject ? (
            // --- Subjects List ---
            <motion.div
              key="subjects-view"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <button
                  onClick={() => setSelectedYear(null)}
                  className="text-fuchsia-400 hover:text-fuchsia-300 flex items-center transition-colors text-sm font-medium"
                  type="button"
                >
                  <FaArrowLeft className="mr-2 w-4 h-4" /> Back to Years
                </button>
                {isAdmin && (
                  <button
                    onClick={() => openSubjectModal()}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black"
                    type="button"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Subject</span>
                  </button>
                )}
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-purple-500/20 pb-3">
                  {selectedBranch.branch_name} / {selectedYear.year_name} -
                  Select Subject
                </h2>
                {subjectsForCurrentView.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjectsForCurrentView.map((subject) => (
                      <motion.div
                        key={subject.id}
                        whileHover={{
                          scale: 1.03,
                          y: -5,
                          boxShadow: "0 10px 20px rgba(168, 85, 247, 0.15)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="relative bg-black/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/40 hover:border-purple-500/70 transition-all duration-200 group"
                      >
                        {isAdmin && (
                          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openSubjectModal(subject);
                              }}
                              className="p-1.5 bg-gray-700/50 hover:bg-blue-600 rounded-full text-blue-300 hover:text-white transition-colors"
                              aria-label="Edit Subject"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSubject(subject.id);
                              }}
                              className="p-1.5 bg-gray-700/50 hover:bg-red-600 rounded-full text-red-300 hover:text-white transition-colors"
                              aria-label="Delete Subject"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                        <div
                          className="cursor-pointer"
                          onClick={() => setSelectedSubject(subject)}
                        >
                          <span className="text-3xl mb-4 block">
                            {subject.icon || "📚"}
                          </span>
                          <h2
                            className="text-xl font-semibold text-white truncate"
                            title={subject.name}
                          >
                            {subject.name}
                          </h2>
                          <p className="text-gray-400 text-sm mt-1">
                            {subject.code}{" "}
                            {subject.credit
                              ? `(${subject.credit} Credits)`
                              : ""}
                          </p>
                          <p className="text-purple-300/80 mt-3 flex items-center text-sm group-hover:text-purple-300 transition-colors">
                            View Materials{" "}
                            <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  !loading && (
                    <EmptyState
                      message={
                        isAdmin
                          ? "No subjects found. Click 'Add Subject'!"
                          : "No subjects available."
                      }
                      icon={Folder}
                    />
                  )
                )}
              </div>
            </motion.div>
          ) : (
            // --- Resources List (within a Subject) ---
            <motion.div
              key="resources-view"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="text-fuchsia-400 hover:text-fuchsia-300 flex items-center transition-colors text-sm font-medium"
                  type="button"
                >
                  <FaArrowLeft className="mr-2 w-4 h-4" /> Back to Subjects
                </button>
                {isAdmin && (
                  <button
                    onClick={() => openResourceModal()}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
                    type="button"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Resource</span>
                  </button>
                )}
              </div>
              <div className="bg-black/40 backdrop-blur-lg rounded-xl p-4 sm:p-6 border-2 border-purple-500/50">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 border-b border-purple-500/20 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {selectedSubject.name} Materials
                    </h2>
                    <p className="text-gray-400 mt-1 text-sm">
                      {selectedBranch.branch_name} / {selectedYear.year_name}
                      <br />
                      {filteredResourcesList.length} item
                      {filteredResourcesList.length !== 1 ? "s" : ""} found{" "}
                      {searchQuery && `matching "${searchQuery}"`}
                    </p>
                  </div>
                  <div className="relative flex-grow md:flex-grow-0 self-end md:self-center">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search within subject..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full md:w-64 pl-10 pr-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    />
                  </div>
                </div>
                {filteredResourcesList.length > 0 ? (
                  <div className="grid gap-4">
                    {filteredResourcesList.map((resource) => (
                      <motion.div
                        key={resource.material_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-black/30 p-4 rounded-lg border border-purple-500/30 hover:border-purple-500/60 hover:bg-black/50 transition-all duration-200 group"
                      >
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                          <div className="flex items-start space-x-4 flex-1 min-w-0">
                            <div className="pt-1">
                              {getResourceIcon(resource.material_type)}
                            </div>
                            <div className="min-w-0">
                              <h3
                                className="text-lg font-semibold text-white truncate"
                                title={resource.title}
                              >
                                {resource.title}
                              </h3>
                              {resource.description && (
                                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                                  {resource.description}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                                <span className="flex items-center whitespace-nowrap">
                                  <Calendar className="w-3.5 h-3.5 mr-1 opacity-70" />
                                  Added:{" "}
                                  {new Date(
                                    resource.createdAt || resource.created_at
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:items-end space-y-2 w-full sm:w-auto flex-shrink-0 pt-1">
                            <button
                              onClick={() =>
                                handleDownload(resource.material_url)
                              }
                              disabled={!resource.material_url}
                              className={`flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg w-full sm:w-auto ${
                                !resource.material_url
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              type="button"
                            >
                              <Download className="w-4 h-4" />
                              <span>
                                {resource.material_type === "Video"
                                  ? "View"
                                  : "Download"}
                              </span>
                            </button>
                            {isAdmin && (
                              <div className="flex space-x-2 w-full sm:w-auto">
                                <button
                                  onClick={() => openResourceModal(resource)}
                                  className="flex-1 sm:flex-none flex items-center justify-center space-x-1 bg-gray-600 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  type="button"
                                  aria-label="Edit Resource"
                                >
                                  <Edit className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteResource(resource.material_id)
                                  }
                                  className="flex-1 sm:flex-none flex items-center justify-center space-x-1 bg-gray-600 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                                  type="button"
                                  aria-label="Delete Resource"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  !loading && (
                    <EmptyState
                      message={
                        searchQuery
                          ? `No materials matching "${searchQuery}".`
                          : isAdmin
                          ? "No materials. Click 'Add Resource'!"
                          : "No materials for this subject."
                      }
                      icon={FileText}
                    />
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Modals Rendered Conditionally (Imported Components) --- */}
        <ResourceModal
          isOpen={showResourceModal}
          onClose={closeResourceModal}
          onSubmit={handleResourceSubmit}
          formData={resourceFormData}
          onChange={handleResourceFormChange}
          editingResource={editingResource}
          subjects={subjects}
          loading={loading}
        />
        <BranchModal
          isOpen={showBranchModal}
          onClose={closeBranchModal}
          onSubmit={handleBranchSubmit}
          formData={branchFormData}
          onChange={handleBranchFormChange}
          loading={loading}
        />
        <YearModal
          isOpen={showYearModal}
          onClose={closeYearModal}
          onSubmit={handleYearSubmit}
          formData={yearFormData}
          onChange={handleYearFormChange}
          branches={branches}
          loading={loading}
        />
        <SubjectModal
          isOpen={showSubjectModal}
          onClose={closeSubjectModal}
          onSubmit={handleSubjectSubmit}
          formData={subjectFormData}
          onChange={handleSubjectFormChange}
          editingSubject={editingSubject}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ResourcesPage;
