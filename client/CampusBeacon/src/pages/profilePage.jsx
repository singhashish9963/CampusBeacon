import React from "react";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "Ayush Agarwal",
    email: "john@mnnit.ac.in",
    phone: "+91 888 888 8888",
    branch: "Computer Science",
    year: "3rd Year",
    registrationNumber: "20BCE10001",
    semester: "6th Semester",
  });

  const stats = [
    { label: "Attendance", value: "99%", icon: Calendar },
    { label: "Semester", value: userData.semester, icon: Book },
    { label: "Credits", value: userData.credits, icon: Star },
    { label: "Registration", value: userData.registrationNumber, icon: Hash },
  ];
};

export default ProfilePage;
