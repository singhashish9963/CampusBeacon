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
import DJGH from "./pages/HostelPages/DJGH.jsx"
import { ProfileProvider } from "./contexts/profileContext.jsx";
import CommunityPage from "./pages/communityPage.jsx";
function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginSignup />} />
                <Route path="/lost-found" element={<LostAndFound />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/SVBH" element={<SVBH />} />
                <Route path="/DJGH" element={<DJGH />} />
                <Route path ="/Community" element={<CommunityPage/>}/>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
