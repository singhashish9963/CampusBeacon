import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Search,
  Phone,
  Mail,
  Plus,
  Edit2,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../../slices/contactSlice";
import { clearError } from "../../slices/authSlice";

// Custom Debounce Hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
};

// Memoized Contact Card Component
const ContactCard = React.memo(({ contact, isAdmin, onEdit, onDelete }) => (
  <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 sm:p-6 md:p-7 border border-slate-700 hover:border-purple-500 transition-all relative">
    {isAdmin && (
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(contact)}
            className="p-1.5 sm:p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-all"
          >
            <Edit2 size={14} className="sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => onDelete(contact.id)}
            className="p-1.5 sm:p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-all"
          >
            <Trash2 size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    )}
    <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
      <img
        src={contact.image_url || "https://via.placeholder.com/128"}
        alt={contact.name}
        className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover bg-purple-500/20"
        loading="lazy"
      />
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-semibold">{contact.name}</h3>
        <p className="text-purple-400 text-sm sm:text-base">
          {contact.designation}
        </p>
      </div>
    </div>
    <div className="space-y-3 sm:space-y-4 text-slate-300">
      <div className="flex items-center gap-2 sm:gap-3">
        <Phone size={16} className="sm:w-5 sm:h-5 text-slate-400" />
        <span className="text-sm sm:text-base">{contact.phone}</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Mail size={16} className="sm:w-5 sm:h-5 text-slate-400" />
        <span className="text-sm sm:text-base">{contact.email}</span>
      </div>
    </div>
  </div>
));

// Memoized Loading Dots Component
const LoadingDots = React.memo(() => (
  <div className="flex items-center justify-center space-x-1">
    <motion.div
      className="w-2 h-2 bg-purple-400 rounded-full"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
    />
    <motion.div
      className="w-2 h-2 bg-purple-400 rounded-full"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
    />
    <motion.div
      className="w-2 h-2 bg-purple-400 rounded-full"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
    />
  </div>
));

const ContactsDisplay = () => {
  const dispatch = useDispatch();

  // Get contacts from Redux state
  const { items, loading, error } = useSelector((state) => state.contacts);
  // Get authentication data from auth slice
  const { roles } = useSelector((state) => state.auth);
  const isAdmin = useMemo(
    () => Array.isArray(roles) && roles.includes("admin"),
    [roles]
  );

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  // Local state for filtering and modal/form management
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formFields, setFormFields] = useState({
    name: "",
    designation: "",
    email: "",
    phone: "",
  });
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const resetForm = useCallback(() => {
    setFormFields({
      name: "",
      designation: "",
      email: "",
      phone: "",
    });
    setPreviewImage(null);
    setSelectedFile(null);
    setEditingContact(null);
  }, []);

  const handleOpenModal = useCallback(
    (contact = null) => {
      if (contact) {
        setEditingContact(contact);
        setFormFields({
          name: contact.name,
          designation: contact.designation,
          email: contact.email,
          phone: contact.phone,
        });
        setPreviewImage(contact.image_url);
      } else {
        resetForm();
      }
      setShowModal(true);
    },
    [resetForm]
  );

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    resetForm();
  }, [resetForm]);

  const handleFileChange = useCallback((file) => {
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileChange(e.dataTransfer.files[0]);
      }
    },
    [handleFileChange]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      if (!formFields.name || !formFields.email || !formFields.phone) {
        throw new Error("Please fill in all required fields");
      }

      const formDataToSend = new FormData();
      Object.entries(formFields).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      if (editingContact) {
        await dispatch(
          updateContact({
            id: editingContact.id,
            updatedContact: formDataToSend,
          })
        ).unwrap();
      } else {
        await dispatch(createContact(formDataToSend)).unwrap();
      }

      handleCloseModal();
      dispatch(fetchContacts());
    } catch (error) {
      setFormError(
        error.message || "An error occurred while submitting the form"
      );
      console.error("Error submitting form: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = useCallback(
    async (id) => {
      if (window.confirm("Are you sure you want to delete this contact?")) {
        await dispatch(deleteContact(id));
        dispatch(fetchContacts());
      }
    },
    [dispatch]
  );

  const filteredContacts = useMemo(() => {
    if (!debouncedSearchTerm) return items;
    const searchStr = debouncedSearchTerm.toLowerCase();
    return items.filter(
      (contact) =>
        (contact.name && contact.name.toLowerCase().includes(searchStr)) ||
        (contact.designation &&
          contact.designation.toLowerCase().includes(searchStr)) ||
        (contact.email && contact.email.toLowerCase().includes(searchStr)) ||
        (contact.phone && contact.phone.toString().includes(searchStr))
    );
  }, [items, debouncedSearchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-violet-800 to-fuchsia-700 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            MNNIT Contacts Directory
          </h1>
          {isAdmin && (
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg flex items-center gap-2 transition-all"
            >
              <Plus size={20} />
              Add Contact
            </button>
          )}
        </div>

        <div className="mb-8 relative">
          <Search className="absolute left-4 top-3 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 rounded-lg border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
          {searchTerm && !debouncedSearchTerm && (
            <div className="absolute right-4 top-3">
              <LoadingDots />
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingDots />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  isAdmin={isAdmin}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-slate-400">
                No contacts found matching your search.
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div className="bg-slate-800 rounded-xl p-4 sm:p-6 md:p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                {editingContact ? "Edit Contact" : "Add New Contact"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div
                  className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                    dragActive
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-slate-600 hover:border-purple-500"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files &&
                      e.target.files.length > 0 &&
                      handleFileChange(e.target.files[0])
                    }
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center">
                        <ImageIcon size={48} className="text-slate-500" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Upload size={16} />
                      <span>Drop image here or click to upload</span>
                    </div>
                  </label>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formFields.name}
                      onChange={(e) =>
                        setFormFields({ ...formFields, name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-slate-400"
                      placeholder="Enter name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={formFields.designation}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          designation: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-slate-400"
                      placeholder="Enter designation"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formFields.email}
                      onChange={(e) =>
                        setFormFields({ ...formFields, email: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-slate-400"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formFields.phone}
                      onChange={(e) =>
                        setFormFields({ ...formFields, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-slate-400"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    isSubmitting
                      ? "bg-gradient-to-r from-yellow-500 to-red-500 cursor-not-allowed opacity-75"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">Processing</span>
                      <LoadingDots />
                    </div>
                  ) : (
                    <span>
                      {editingContact ? "Update Contact" : "Add Contact"}
                    </span>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactsDisplay;
