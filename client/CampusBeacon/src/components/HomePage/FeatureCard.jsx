import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  href = "/",
  gradient = "from-pink-500 via-purple-500 to-indigo-500",
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative cursor-pointer"
      onClick={handleClick}
    >
      <div
        className={`
        absolute -inset-0.5 rounded-xl
        bg-gradient-to-r ${gradient}
        opacity-30 group-hover:opacity-75
        blur group-hover:blur-md
        transition duration-500
      `}
      />

      <div className="relative p-5 bg-gray-900/90 backdrop-blur-md rounded-xl">
        <div className="flex flex-col items-center text-center space-y-6">
          <motion.div
            whileHover={{
              rotate: [0, -10, 10, -10, 0],
              transition: { duration: 0.5 },
            }}
            className={`
              relative p-4 rounded-2xl
              bg-gradient-to-r ${gradient}
              transform group-hover:scale-110
              transition-transform duration-300
              before:absolute before:inset-0
              before:blur-sm before:opacity-50
            `}
          >
            <Icon className="h-12 w-12 text-white relative z-10" />
          </motion.div>

          <h3
            className={`
            text-xl md:text-2xl font-bold
            bg-clip-text text-transparent
            bg-gradient-to-r ${gradient}
            transform group-hover:scale-105
            transition duration-300
          `}
          >
            {title}
          </h3>

          <p className="text-base md:text-lg text-gray-400 font-mono leading-relaxed">
            {description}
          </p>

          <motion.div
            className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors duration-300"
            whileHover={{ x: 5 }}
          >
            <span className="text-sm font-medium">Learn More</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>

        <div
          className={`
          absolute inset-0 rounded-xl
          border border-gray-700/50
          group-hover:border-transparent
          opacity-0 group-hover:opacity-20
          bg-gradient-to-r ${gradient}
          transition duration-300
        `}
        />
      </div>
    </motion.div>
  );
};

FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  href: PropTypes.string,
  gradient: PropTypes.string,
};

export default FeatureCard;
