import React, { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// Memoize animation variants (remain the same)
const iconAnimation = {
  rest: { rotate: 0 },
  hover: {
    rotate: [0, -10, 10, -10, 0],
    transition: { duration: 0.5, ease: "easeInOut" }, // Added ease
  },
};

const arrowAnimation = {
  rest: { x: 0 },
  hover: { x: 4 }, // Slightly reduced movement
};

const cardAnimation = {
  initial: { opacity: 0, y: 30 }, // Increased initial y offset slightly
  inView: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }, // Added transition details
};

const FeatureCard = React.memo(
  ({
    icon: Icon,
    title,
    description,
    href = "/",
    gradient = "from-pink-500 via-purple-500 to-indigo-500",
  }) => {
    const navigate = useNavigate();

    const handleClick = useCallback(
      (e) => {
        e.preventDefault();
        navigate(href);
      },
      [navigate, href]
    );

    // Memoize gradient styles (remain the same)
    const gradientStyles = useMemo(
      () => ({
        background: `linear-gradient(to right, var(--gradient-from), var(--gradient-via), var(--gradient-to))`,
        "--gradient-from":
          gradient.match(/from-([a-z]+-\d+)/)?.[0] || "transparent", // Extract CSS vars (more robust if using theme)
        "--gradient-via":
          gradient.match(/via-([a-z]+-\d+)/)?.[0] || "transparent", // Or just keep inline style if simpler
        "--gradient-to":
          gradient.match(/to-([a-z]+-\d+)/)?.[0] || "transparent",
      }),
      [gradient]
    );

    // Memoize class strings - NOW WITH RESPONSIVE CLASSES
    const cardClasses = useMemo(
      () => ({
        wrapper: "group relative cursor-pointer overflow-hidden rounded-xl", // Added overflow-hidden and rounding here too
        // --- Responsive Blur/Opacity ---
        gradientBgEffect: `absolute inset-0 rounded-xl bg-gradient-to-r ${gradient} opacity-10 group-hover:opacity-30 blur-md group-hover:blur-lg transition duration-500 ease-out`, // Adjusted effect
        // --- Responsive Padding ---
        container:
          "relative p-4 sm:p-5 bg-gray-900/80 backdrop-blur-md rounded-xl border border-white/10 h-full flex flex-col", // Added h-full and flex
        // --- Responsive Spacing ---
        content:
          "flex flex-col items-center text-center space-y-4 sm:space-y-5 flex-grow", // Added flex-grow
        // --- Responsive Icon Wrapper & Size ---
        iconWrapper: `relative p-3 sm:p-4 rounded-2xl bg-gradient-to-r ${gradient} transform group-hover:scale-105 transition-transform duration-300 ease-out shadow-lg`, // Added shadow, adjusted scale
        icon: "h-10 w-10 sm:h-12 sm:w-12 text-white relative z-10", // Responsive icon size
        // --- Responsive Title Size ---
        title: `text-lg sm:text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradient} transition duration-300 group-hover:brightness-110`, // Adjusted effect
        // --- Responsive Description Size ---
        description:
          "text-sm sm:text-base text-gray-400 font-mono leading-relaxed flex-grow", // Added flex-grow to push learn more down
        // --- Responsive "Learn More" ---
        learnMoreWrapper: "mt-auto pt-4", // Push to bottom
        learnMore:
          "flex items-center justify-center gap-1.5 text-gray-400 group-hover:text-white transition-colors duration-300",
        learnMoreText: "text-xs sm:text-sm font-medium",
        learnMoreIcon: "w-3 h-3 sm:w-4 sm:h-4", // Responsive icon size
        // --- Removed border effect for simplicity, focusing on background ---
        // border: `absolute inset-0 rounded-xl border border-gray-700/50 group-hover:border-transparent opacity-0 group-hover:opacity-20 bg-gradient-to-r ${gradient} transition duration-300`,
      }),
      [gradient]
    );

    return (
      <motion.div
        initial="initial"
        whileInView="inView"
        viewport={{ once: true, amount: 0.2 }} // Trigger slightly earlier
        variants={cardAnimation}
        className={cardClasses.wrapper}
        onClick={handleClick}
        style={{ willChange: "transform, opacity" }} // Optimize animation performance
      >
        {/* Background blur/gradient effect */}
        <div className={cardClasses.gradientBgEffect} />

        {/* Main Content Container */}
        <div className={cardClasses.container}>
          <div className={cardClasses.content}>
            {/* Icon */}
            <motion.div
              initial="rest"
              whileHover="hover"
              variants={iconAnimation}
              className={cardClasses.iconWrapper}
              style={{ willChange: "transform" }}
            >
              <Icon className={cardClasses.icon} />
            </motion.div>

            {/* Title */}
            <h3 className={cardClasses.title}>{title}</h3>

            {/* Description */}
            <p className={cardClasses.description}>{description}</p>
          </div>

          {/* Learn More - Pushed to bottom */}
          <div className={cardClasses.learnMoreWrapper}>
            <motion.div
              initial="rest"
              whileHover="hover"
              variants={arrowAnimation}
              className={cardClasses.learnMore}
              style={{ willChange: "transform" }}
            >
              <span className={cardClasses.learnMoreText}>Learn More</span>
              <ArrowRight className={cardClasses.learnMoreIcon} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  href: PropTypes.string,
  gradient: PropTypes.string,
};

export default FeatureCard;
