import React, {useState} from "react";

const Eatries = () => {
    // Dummy Data
    const [eateries, setEateries] = useState([
        {

          id: 1,
          name: "S Nath Canteen",
          images: [
          ],
          menuImage: "",
          location: "Near Yamuna Canteen",
          contact: "+91 1234567890 ",
          rating: 4.0,
          hours: "8:00 AM - 8:00 PM",
          isOpen: true,
          ratings: [],
          averageRating: 4.5,
        },
        {
          id: 2,
          name: "Dewsis",
          images: [
          ],
          menuImage: "",
          location: "Near MP Hall",
          contact: "+91 1234567890",
          rating: 4.2,
          hours: "9:00 AM - 6:00 PM",
          isOpen: true,
          ratings: [],
          averageRating: 4.5,
        }
      ]);
  return <></>;
};

export default Eatries;
