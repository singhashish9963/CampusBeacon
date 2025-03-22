import React, { useState, useEffect } from "react";
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
} from "../slices/contactSlice";
import { clearError } from "../slices/authSlice"; // if needed

const ContactsDisplay = () => {
  const dispatch = useDispatch();

  // Get contacts from Redux state
  const { items, loading, error } = useSelector((state) => state.contacts);
  // Get authentication data from auth slice
  const { roles } = useSelector((state) => state.auth);
  const isAdmin = Array.isArray(roles) && roles.includes("admin");

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  // Local state for filtering and modal/form management
  const [searchTerm, setSearchTerm] = useState("");
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

  const resetForm = () => {
    setFormFields({
      name: "",
      designation: "",
      email: "",
      phone: "",
    });
    setPreviewImage(null);
    setSelectedFile(null);
    setEditingContact(null);
  };

  const handleOpenModal = (contact = null) => {
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
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleFileChange = (file) => {
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formFields.name);
      formDataToSend.append("designation", formFields.designation);
      formDataToSend.append("email", formFields.email);
      formDataToSend.append("phone", formFields.phone);
      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }
      if (editingContact) {
        await dispatch(
          updateContact({ id: editingContact.id, updatedContact: formDataToSend })
        ).unwrap();
      } else {
        await dispatch(createContact(formDataToSend)).unwrap();
      }
      handleCloseModal();
      dispatch(fetchContacts());
    } catch (error) {
      console.error("Error submitting form: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      await dispatch(deleteContact(id));
      dispatch(fetchContacts());
    }
  };

  const filteredContacts = items.filter((contact) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      (contact.name && contact.name.toLowerCase().includes(searchStr)) ||
      (contact.designation && contact.designation.toLowerCase().includes(searchStr)) ||
      (contact.email && contact.email.toLowerCase().includes(searchStr)) ||
      (contact.phone && contact.phone.toString().includes(searchStr))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-violet-800 to-fuchsia-700 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
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
        </div>

        {loading ? (
          <div className="text-center text-slate-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-7 border border-slate-700 hover:border-purple-500 transition-all relative group"
                >
                  {isAdmin && (
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(contact)}
                          className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <img
                      src={contact.image_url || "https://via.placeholder.com/128"}
                      alt={contact.name}
                      className="w-32 h-32 rounded-full object-cover bg-purple-500/20"
                    />
                    <div className="text-center">
                      <h3 className="text-2xl font-semibold">{contact.name}</h3>
                      <p className="text-purple-400 text-l">{contact.designation}</p>
                    </div>
                  </div>
                  <div className="space-y-4 text-slate-300">
                    <div className="flex items-center gap-3">
                      <Phone size={20} className="text-slate-400" />
                      <span className="text-l">{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={20} className="text-slate-400" />
                      <span className="text-l">{contact.email}</span>
                    </div>
                  </div>
                </div>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-slate-800 rounded-xl p-8 w-full max-w-md relative">
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
                      e.target.files && e.target.files.length > 0 && handleFileChange(e.target.files[0])
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
                      onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
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
                      onChange={(e) => setFormFields({ ...formFields, designation: e.target.value })}
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
                      onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
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
                      onChange={(e) => setFormFields({ ...formFields, phone: e.target.value })}
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
                      <motion.img
                        src="https://img.icons8.com/emoji/48/rocket.png"
                        alt="rocket"
                        className="w-6 h-6"
                        initial={{ x: 0 }}
                        animate={{ x: 100 }}
                        transition={{
                          duration: 0.3,
                          ease: "linear",
                          repeat: Infinity,
                          repeatType: "loop",
                        }}
                      />
                      <span className="ml-2">Processing...</span>
                    </div>
                  ) : (
                    <span>{editingContact ? "Update Contact" : "Add Contact"}</span>
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