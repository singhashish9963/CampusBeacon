// src/App.jsx

import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "./slices/authSlice";

// Layout & Common Components
import NavBar from "./components/common/layout/NavBar";
import Footer from "./components/common/layout/Footer";
import LoadingScreen from "./components/common/loading/LoadingScreen";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Route Protection Components
import ProtectedRoute from "./components/features/auth/ProtectedRoute";
import PublicRoute from "./components/features/auth/PublicRoute";

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
import NotFound from "./pages/utility/404";
import ServerError from "./pages/utility/500";
import Maintenance from "./pages/utility/Maintenance";
import MNNITFactsGenerator from "./pages/utility/FactsGenerator";
import CampusExplorer from "./pages/utility/CampusExplorer";
import MNNITTimeCapsule from "./pages/utility/MNNITTimeCapsule";
import RideShare from "./pages/services/RideShare";
import ChatTestPage from "./pages/chat/ChatTestPage";
import AdminPanel from "./pages/admin/AdminPanel";
import EventPage from "./pages/clubs/EventPage";
import ClubDetailPage from "./pages/clubs/ClubDetailPage";
import ClubListPage from "./pages/clubs/ClubListPage";
import ScrollToTop from "./components/common/layout/ScrollToTop";
import AttendancePage from "./pages/attendance/AttendancePage";
import EventsPageAll from "./pages/events/EventPage";

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
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const hideFooterRoutes = ["/chat"];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={3000}
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
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/clubs" element={<ClubListPage />} />
          <Route path="/clubs/:clubId" element={<ClubDetailPage />} />
          <Route path="/events/:id" element={<EventPage />} />
          <Route path="/events" element={<EventsPageAll />} />

          {/* --- Public-only route (not for logged-in users) --- */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginSignup />
              </PublicRoute>
            }
          />

          {/* --- Protected Routes --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/rides" element={<RideShare />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/god/*" element={<AdminPanel />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/chat" element={<ChatTestPage />} />
            <Route path="/lost-found" element={<LostAndFound />} />
            <Route path="/resource" element={<ResourcesPage />} />
            <Route path="/hostels/:hostelId" element={<HostelPage />} />
            <Route path="/eatries" element={<CollegeEateries />} />
          </Route>

          {/* --- Catch-All Route --- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default App;
