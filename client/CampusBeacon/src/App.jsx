import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginSignup from "./pages/loginPage.jsx";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/homePage.jsx";
import { AuthProvider } from "./contexts/authContext.jsx";
import ProfilePage from "./pages/profilePage.jsx";
import Marketplace from "./pages/buyAndSellPage.jsx";
import LostAndFound from "./pages/lostAndFound.jsx";
import SVBH from "./pages/HostelPages/SVBH.jsx";
import DJGH from "./pages/HostelPages/DJGH.jsx";
import CommunityPage from "./pages/communityPage.jsx";
import { ProfileProvider } from "./contexts/profileContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { LostAndFoundProvider } from "./contexts/lostandfoundContext.jsx";
import BuyAndSellProvider from "./contexts/buyandsellContext.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactsDisplay from "./pages/ContactPage.jsx";
import { ContactContextProvider } from "./contexts/contactContext.jsx";
import { ChatContextProvider } from "./contexts/chatContext.jsx";
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
function App() {
  return (
    <AuthProvider>
      <AttendanceProvider>
        <RidesProvider>
          <ChatbotProvider>
            <EateriesProvider>
              <ChatContextProvider>
                <ContactContextProvider>
                  <BuyAndSellProvider>
                    <LostAndFoundProvider>
                      <ProfileProvider>
                        <BrowserRouter>
                          <div className="flex flex-col min-h-screen">
                            <NavBar />
                            <main className="flex-grow">
                              <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route
                                  path="/login"
                                  element={<LoginSignup />}
                                />
                                <Route
                                  path="/reset-password"
                                  element={<ResetPassword />}
                                />
                                <Route path="/rides" element={<RideShare />} />
                                <Route
                                  path="/verify-email"
                                  element={<EmailVerification />}
                                />
                                <Route
                                  path="/policy"
                                  element={<PrivacyPolicy />}
                                />
                                <Route path="/about" element={<AboutUs />} />
                                <Route
                                  path="/terms"
                                  element={<TermsOfService />}
                                />
                                <Route path="/404" element={<NotFound />} />
                                <Route path="/500" element={<ServerError />} />
                                <Route
                                  path="/maintenance"
                                  element={<Maintenance />}
                                />
                                <Route
                                  path="/facts"
                                  element={<MNNITFactsGenerator />}
                                />
                                <Route
                                  path="/explore"
                                  element={<CampusExplorer />}
                                />
                                <Route
                                  path="/time"
                                  element={<MNNITTimeCapsule />}
                                />
                                <Route element={<ProtectedRoute />}>
                                  <Route
                                    path="/profile"
                                    element={<ProfilePage />}
                                  />
                                  <Route
                                    path="/marketplace"
                                    element={<Marketplace />}
                                  />
                                  <Route
                                    path="/lost-found"
                                    element={<LostAndFound />}
                                  />
                                  <Route
                                    path="/resource"
                                    element={<ResourcesPage />}
                                  />
                                  <Route
                                    path="/attendance"
                                    element={<AttendanceManager />}
                                  />

                                  <Route
                                    path="/eatries"
                                    element={<CollegeEateries />}
                                  />
                                  <Route path="/SVBH" element={<SVBH />} />
                                  <Route path="/DJGH" element={<DJGH />} />
                                  <Route
                                    path="/community"
                                    element={<CommunityPage />}
                                  />
                                </Route>
                                <Route
                                  path="/contact"
                                  element={<ContactsDisplay />}
                                />
                                <Route
                                  path="*"
                                  element={<Navigate to="/" replace />}
                                />
                              </Routes>
                            </main>
                            <Footer />
                          </div>
                        </BrowserRouter>
                      </ProfileProvider>
                    </LostAndFoundProvider>
                  </BuyAndSellProvider>
                </ContactContextProvider>
              </ChatContextProvider>
            </EateriesProvider>
          </ChatbotProvider>
        </RidesProvider>
      </AttendanceProvider>
    </AuthProvider>
  );
}

export default App;
