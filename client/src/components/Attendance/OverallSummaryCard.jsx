import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { FiPieChart } from "react-icons/fi";
import LoadingSpinner from "../../utils/LoadingSpinner";
import ErrorDisplay from "../../utils/ErrorDisplay";
const PercentageCircleGraph = React.lazy(() => import("../Graphs/PercentageCicleGraph"));

const OverallSummaryCard = ({
    themeStyles,
    errorOverall,
    onRetryOverall,
    loadingOverall,
    overallPercentageData,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`${themeStyles.cardBg} rounded-xl p-5 md:p-6 mb-8 border ${themeStyles.borderColor}`}
        >
            <h2
                className={`text-xl font-semibold mb-4 ${themeStyles.headingColor} flex items-center`}
            >
                <FiPieChart className="mr-2" /> Overall Summary
            </h2>
            {errorOverall && (
                <ErrorDisplay
                    error={errorOverall}
                    onRetry={onRetryOverall}
                    messagePrefix="Overall Stats Error: "
                />
            )}
            {loadingOverall && !overallPercentageData && <LoadingSpinner />}
            {!loadingOverall || overallPercentageData ? (
                overallPercentageData ? (
                    <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
                        <Suspense fallback={<LoadingSpinner />}>
                            <PercentageCircleGraph
                                percentage={overallPercentageData.percentage}
                                size={90}
                                strokeWidth={7}
                                themeStyles={themeStyles}
                            />
                        </Suspense>
                        <div className="text-sm mt-4 sm:mt-0 space-y-1 text-center sm:text-left">
                            <p className="text-gray-300">
                                Across currently enrolled subjects:{" "}
                            </p>
                            <p>
                                <strong className="text-green-400 font-semibold">
                                    {overallPercentageData.presentDays}
                                </strong>{" "}
                                Present
                            </p>
                            <p>
                                <strong className="text-red-400 font-semibold">
                                    {overallPercentageData.absentDays}
                                </strong>{" "}
                                Absent
                            </p>
                            <p>
                                <strong className="text-gray-200 font-semibold">
                                    {overallPercentageData.totalDays}
                                </strong>{" "}
                                Total Marked
                            </p>
                        </div>
                    </div>
                ) : (
                    !errorOverall && (
                        <p className="text-sm text-gray-500 italic text-center py-4">
                            No overall attendance data available yet.
                        </p>
                    )
                )
            ) : null}
        </motion.div>
    );
};

export default OverallSummaryCard;
