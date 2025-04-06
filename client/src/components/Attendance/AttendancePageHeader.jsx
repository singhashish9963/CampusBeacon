import React from "react";
import { motion } from "framer-motion";
import { FiPlusSquare } from "react-icons/fi";

const AttendancePageHeader = ({
    themeStyles,
    onEnrollMoreClick,
    enrollError,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="py-6 md:py-8 flex flex-wrap justify-between items-center gap-4"
        >
            <div>
                <h1
                    className={`text-3xl md:text-4xl font-bold ${themeStyles.headingColor}`}
                >
                    Attendance Tracker
                </h1>
                <p className="text-gray-400 mt-1">Overview of your attendance stats.</p>
            </div>
            {!enrollError && (
                <button
                    onClick={onEnrollMoreClick}
                    title="Enroll in More Subjects"
                    className={`px-4 py-2 rounded-lg font-medium shadow-lg text-white flex items-center justify-center transition-all duration-300 bg-gradient-to-r ${
                        themeStyles.buttonGradient || "from-amber-500 to-orange-600"
                    } hover:brightness-110`}
                >
                    <FiPlusSquare className="mr-2" /> Enroll More
                </button>
            )}
        </motion.div>
    );
};

export default AttendancePageHeader;
