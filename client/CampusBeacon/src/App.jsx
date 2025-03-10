import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginSignup from "./pages/loginPage.jsx";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/homePage.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProfilePage from "./pages/profilePage.jsx";
import Marketplace from "./pages/buyAndSellPage.jsx";
import LostAndFound from "./pages/lostAndFound.jsx";
import SVBH from "./pages/HostelPages/SVBH.jsx";
import DJGH from "./pages/HostelPages/DJGH.jsx";
import { ProfileProvider } from "./contexts/profileContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { LostAndFoundProvider } from "./contexts/lostandfoundContext.jsx";
import BuyAndSellProvider from "./contexts/buyandsellContext.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactsDisplay from "./pages/ContactPage.jsx";
import { ContactContextProvider } from "./contexts/contactContext.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import EmailVerification from "./pages/EmailVerfication.jsx";
import { ChatbotProvider } from "./contexts/chatBotContext.jsx";
import CollegeEateries from "./pages/eatries.jsx";
import ResourcesPage from "./pages/ResourceHub.jsx";
import AttendanceManager from "./pages/attendancePage.jsx";
import { AttendanceProvider } from "./contexts/attendanceContext.jsx";
import { EateriesProvider } from "./contexts/eateriesContext.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";
import NotFound from "./pages/utilityPages/404.jsx";
import ServerError from "./pages/utilityPages/500.jsx";
import Maintenance from "./pages/utilityPages/Maintenance.jsx";
import MNNITFactsGenerator from "./pages/utilityPages/factsGenerator.jsx";
import CampusExplorer from "./pages/utilityPages/campusExplorer.jsx";
import MNNITTimeCapsule from "./pages/utilityPages/mnnitTimeCapsule.jsx";
import RideShare from "./pages/rideShare.jsx";
import RidesProvider from "./contexts/ridesContext.jsx";
import { HostelProvider } from "./contexts/hostelContext.jsx";
import { MenuProvider } from "./contexts/hostelContext.jsx";
import { OfficialProvider } from "./contexts/hostelContext.jsx";
import { NotificationsProvider } from "./contexts/hostelContext.jsx"; 
import { ComplaintProvider } from "./contexts/hostelContext.jsx";
import AdminHostelPage from "./pages/HostelPages/AdminHostelPage.jsx";

import HostelPage from "./pages/HostelPages/HostelPage.jsx";

import ChatTestPage from "./pages/Chat/ChatTestPage.jsx";


function App() {
  return (
    <AuthProvider>
      <AttendanceProvider>
        <ChatbotProvider>
          <EateriesProvider>
            {/* <ChatContextProvider> */}
              <ContactContextProvider>
                <BuyAndSellProvider>
                  <LostAndFoundProvider>
                    <HostelProvider>
                    <MenuProvider>
                    <OfficialProvider>
                    <NotificationsProvider>
                    <ComplaintProvider>

                    <ProfileProvider>
                      <RidesProvider>
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
                                <Route path="/SVBH" element={<SVBH />} />
                                <Route path="/DJGH" element={<DJGH />} />
                                {/* Protected Routes */}
                                <Route element={<ProtectedRoute />}>
                                  <Route path="/profile" element={<ProfilePage />} />
                                  <Route path="/marketplace" element={<Marketplace />} />
                                  <Route path="/chat" element={<ChatTestPage />} />
                                  <Route path="/lost-found" element={<LostAndFound />} />
                                  <Route path="/resource" element={<ResourcesPage />} />
                                  <Route path="/attendance" element={<AttendanceManager />} />
                                  <Route path="/eatries" element={<CollegeEateries />} />
                                  <Route path="/hostels" element={<AdminHostelPage />} />
                                  <Route path="/hostels/:hostel_id" element={<HostelPage />} />
                                </Route>
                                {/* Redirect unknown paths */}
                                <Route path="*" element={<Navigate to="/" replace />} />
                              </Routes>
                            </main>
                            <Footer />
                          </div>
                        </BrowserRouter>
                      </RidesProvider>
                    </ProfileProvider>
                    </ComplaintProvider>
                    </NotificationsProvider>
                    </OfficialProvider>
                    </MenuProvider>
                    </HostelProvider>
                  </LostAndFoundProvider>
                </BuyAndSellProvider>
              </ContactContextProvider>
            {/* </ChatContextProvider> */}
          </EateriesProvider>
        </ChatbotProvider>
      </AttendanceProvider>
    </AuthProvider>
  );
}

export default App;
