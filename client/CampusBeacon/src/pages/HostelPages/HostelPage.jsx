import NotificationsPage from "./NotificationPage";
import MenuPage from "./MenuPage";
import OfficialPage from "./OfficialPage";
import ComplaintPage from "./ComplaintPage";
import React from "react";

const HostelPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <div id="menu-section">
        <MenuPage />
      </div>
      <div id="officials-section">
        <OfficialPage />
      </div>
      <div id="complaints-section">
        <ComplaintPage />
      </div>
      <div id="notifications-section">
        {/* <NotificationsPage /> */}
      </div>
    </div>
  );
};

export default HostelPage;