import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginSignup from "./pages/auth/LoginPage";
import NavBar from "./components/common/layout/NavBar";
import Footer from "./components/common/layout/Footer";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/user/ProfilePage";
import Marketplace from "./pages/marketplace/BuyAndSellPage";
import LostAndFound from "./pages/services/LostAndFound";
import HostelPage from "./pages/hostel/HostelPage";
import ProtectedRoute from "./components/features/auth/ProtectedRoute";
import AboutUs from "./pages/utility/AboutUs";
import ContactsDisplay from "./pages/utility/ContactPage";
import ResetPassword from "./pages/auth/ResetPassword";
import EmailVerification from "./pages/auth/EmailVerification";
import CollegeEateries from "./pages/services/Eateries";
import ResourcesPage from "./pages/utility/ResourceHub";
import PrivacyPolicy from "./pages/utility/PrivacyPolicy";
import TermsOfService from "./pages/utility/TermsOfService";
import NotFound from "./pages/utility/404";
import ServerError from "./pages/utility/500";
import Maintenance from "./pages/utility/Maintenance";
import MNNITFactsGenerator from "./pages/utility/FactsGenerator";
import CampusExplorer from "./pages/utility/CampusExplorer";
import MNNITTimeCapsule from "./pages/utility/MNNITTimeCapsule";
import RideShare from "./pages/services/RideShare";

import ChatTestPage from "./pages/chat/ChatTestPage";
import AdminPanel from "./pages/admin/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/policy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/500" element={<ServerError />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/facts" element={<MNNITFactsGenerator />} />
            <Route path="/explore" element={<CampusExplorer />} />
            <Route path="/time" element={<MNNITTimeCapsule />} />
            <Route path="/rides" element={<RideShare />} />
            <Route path="/contact" element={<ContactsDisplay />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/god/*" element={<AdminPanel />} />
              <Route path="/chat" element={<ChatTestPage />} />
              <Route path="/lost-found" element={<LostAndFound />} />
              <Route path="/resource" element={<ResourcesPage />} />
              <Route path="/hostels/:hostelId" element={<HostelPage />} />
              <Route path="/eatries" element={<CollegeEateries />} />
            </Route>
            {/* Redirect unknown paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
