import React, { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// Memoize animation variants
const iconAnimation = {
  rest: { rotate: 0 },
  hover: {
    rotate: [0, -10, 10, -10, 0],
    transition: { duration: 0.5 },
  },
};

const arrowAnimation = {
  rest: { x: 0 },
  hover: { x: 5 },
};

const cardAnimation = {
  initial: { opacity: 0, y: 20 },
  inView: { opacity: 1, y: 0 },
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

    // Memoize gradient styles
    const gradientStyles = useMemo(
      () => ({
        background: `linear-gradient(to right, ${gradient
          .split(" ")
          .map((c) => c.replace(/(from-|via-|to-)/, ""))
          .join(", ")})`,
      }),
      [gradient]
    );

    // Memoize class strings
    const cardClasses = useMemo(
      () => ({
        wrapper: "group relative cursor-pointer",
        gradient: `rounded-xl bg-gradient-to-r ${gradient} opacity-30 group-hover:opacity-75 blur group-hover:blur-md transition duration-500`,
        container: "relative p-5 bg-gray-900/90 backdrop-blur-md rounded-xl",
        content: "flex flex-col items-center text-center space-y-6",
        iconWrapper: `relative p-4 rounded-2xl bg-gradient-to-r ${gradient} transform group-hover:scale-110 transition-transform duration-300 before:absolute before:inset-0 before:blur-sm before:opacity-50`,
        icon: "h-12 w-12 text-white relative z-10",
        title: `text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradient} transform group-hover:scale-105 transition duration-300`,
        description:
          "text-base p-4 md:text-lg text-gray-400 font-mono leading-relaxed",
        learnMore:
          "flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors duration-300",
        border: `absolute inset-0 rounded-xl border border-gray-700/50 group-hover:border-transparent opacity-0 group-hover:opacity-20 bg-gradient-to-r ${gradient} transition duration-300`,
      }),
      [gradient]
    );

    return (
      <motion.div
        initial="initial"
        whileInView="inView"
        viewport={{ once: true }}
        variants={cardAnimation}
        className={cardClasses.wrapper}
        onClick={handleClick}
        style={{ willChange: "transform, opacity" }}
      >
        <div className={cardClasses.gradient} style={gradientStyles} />

        <div className={cardClasses.container}>
          <div className={cardClasses.content}>
            <motion.div
              initial="rest"
              whileHover="hover"
              variants={iconAnimation}
              className={cardClasses.iconWrapper}
              style={{ willChange: "transform" }}
            >
              <Icon className={cardClasses.icon} />
            </motion.div>

            <h3 className={cardClasses.title}>{title}</h3>

            <p className={cardClasses.description}>{description}</p>

            <motion.div
              initial="rest"
              whileHover="hover"
              variants={arrowAnimation}
              className={cardClasses.learnMore}
              style={{ willChange: "transform" }}
            >
              <span className="text-sm font-medium">Learn More</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>

          <div className={cardClasses.border} style={gradientStyles} />
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
