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
import CommunityPage from "./pages/communityPage.jsx";
import { ProfileProvider } from "./contexts/profileContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { LostAndFoundProvider } from "./contexts/lostandfoundContext.jsx";
import BuyAndSellProvider from "./contexts/buyandsellContext.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactsDisplay from "./pages/ContactPage.jsx";
import { ContactContextProvider } from "./contexts/contactContext.jsx";
import { ChatContextProvider } from "./contexts/chatContext.jsx";
function App() {
  return (
    <AuthProvider>
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
                        <Route path="/login" element={<LoginSignup />} />
                        <Route element={<ProtectedRoute />}>
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route
                            path="/marketplace"
                            element={<Marketplace />}
                          />
                          <Route
                            path="/lost-found"
                            element={<LostAndFound />}
                          />
                          <Route path="/about" element={<AboutUs />} />
                          <Route
                            path="/contact"
                            element={<ContactsDisplay />}
                          />
                          <Route path="/SVBH" element={<SVBH />} />
                          <Route path="/DJGH" element={<DJGH />} />
                          <Route
                            path="/Community"
                            element={<CommunityPage />}
                          />
                        </Route>
                        <Route path="*" element={<Navigate to="/" replace />} />
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
    </AuthProvider>
  );
}

export default App;
