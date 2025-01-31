import React from "react";

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [listingItem, setListingItem] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    condition: "",
    contactNumber: "",
    image: null,
  });

  const [marketItems, setMarketItems] = useState([
    {
      id: 1,
      name: "Gaming Laptop",
      price: 799.99,
      category: "Electronics",
      description: "High-performance gaming laptop, 16GB RAM, RTX 3060",
      condition: "Like New",
      contactNumber: "555-1234",
      image: "https://placeholder.co/300",
    },
  ]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListingItem((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-purple-900 text-white">
      <div className="container mx-auto p-8"></div>
    </div>
  );
};

export default Marketplace;
