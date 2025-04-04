// src/App.jsx

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "./slices/authSlice"; // Adjust path if needed

// Layout & Common Components
import NavBar from "./components/common/layout/NavBar";
import Footer from "./components/common/layout/Footer";
import LoadingScreen from "./components/common/loading/LoadingScreen"; // Your loading component
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Route Protection Components
import ProtectedRoute from "./components/features/auth/ProtectedRoute";
import PublicRoute from "./components/features/auth/PublicRoute"; // Optional: See code below

// Page Components
import LoginSignup from "./pages/auth/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/user/ProfilePage";
import Marketplace from "./pages/marketplace/BuyAndSellPage";
import LostAndFound from "./pages/services/LostAndFound";
import HostelPage from "./pages/hostel/HostelPage";
import AboutUs from "./pages/utility/AboutUs";
import ContactsDisplay from "./pages/utility/ContactPage";
import ResetPassword from "./pages/auth/ResetPassword";
import EmailVerification from "./pages/auth/EmailVerification";
import CollegeEateries from "./pages/services/Eateries";
import ResourcesPage from "./pages/utility/ResourceHub";
import PrivacyPolicy from "./pages/utility/PrivacyPolicy";
import TermsOfService from "./pages/utility/TermsOfService";
import NotFound from "./pages/utility/404"; // Your 404 component
import ServerError from "./pages/utility/500";
import Maintenance from "./pages/utility/Maintenance";
import MNNITFactsGenerator from "./pages/utility/FactsGenerator";
import CampusExplorer from "./pages/utility/CampusExplorer";
import MNNITTimeCapsule from "./pages/utility/MNNITTimeCapsule";
import RideShare from "./pages/services/RideShare";
import ChatTestPage from "./pages/chat/ChatTestPage";
import AdminPanel from "./pages/admin/AdminPanel";
import MNNITClubPage from "./pages/clubs/ClubPage";
import EventPage from "./pages/clubs/EventPage";


function App() {
  const dispatch = useDispatch();

  const { loading: authLoading, lastChecked } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    
    if (!lastChecked) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, lastChecked]); 


  if (authLoading && !lastChecked) {
    return <LoadingScreen />; 
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          theme="dark"
          limit={3}
          transition={Slide}
          toastClassName="bg-gray-800 text-white" 
          progressClassName="bg-purple-500" 
        />
        <main className="flex-grow">
          <Routes>
            {/* --- Public Routes --- */}
            {/* Routes accessible whether logged in or not */}
            <Route path="/" element={<HomePage />} />
            <Route path="/policy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/500" element={<ServerError />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/facts" element={<MNNITFactsGenerator />} />
            <Route path="/explore" element={<CampusExplorer />} />
            <Route path="/time" element={<MNNITTimeCapsule />} />
            <Route path="/contact" element={<ContactsDisplay />} />
            <Route path="/reset-password" element={<ResetPassword />} />{" "}
            <Route path="/verify-email" element={<EmailVerification />} />{" "}
            <Route path="/clubs" element={<MNNITClubPage />} />{" "}
            <Route path="/events/:id" element={<EventPage />} />{" "}
            {/* Routes only for non-authenticated users (using PublicRoute) */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginSignup />
                </PublicRoute>
              }
            />
            {/* --- Protected Routes --- */}
            {/* Routes requiring authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/rides" element={<RideShare />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/god/*" element={<AdminPanel />} />{" "}
              {/* Assuming admin needs auth */}
              <Route path="/chat" element={<ChatTestPage />} />
              <Route path="/lost-found" element={<LostAndFound />} />
              <Route path="/resource" element={<ResourcesPage />} />
              <Route path="/hostels/:hostelId" element={<HostelPage />} />
              <Route path="/eatries" element={<CollegeEateries />} />
            </Route>
            {/* --- Fallback Route --- */}
            {/* Catch-all for paths not matched above */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
