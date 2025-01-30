import React from "react";

const FeatureCard = ({ icon: Icon, title, descrip }) => {
  return (
    <motion.div
      intial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.25 }}
      className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-pink-500/20 hover:border-pink-200/40 transition-all"
    ></motion.div>
  );
};

export default FeatureCard;
