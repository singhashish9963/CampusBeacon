import React from "react";
import { FiCheckCircle, FiXCircle, FiEdit2 } from "react-icons/fi";
import { format, parseISO, isValid } from "date-fns";

const AttendanceRecordItem = ({
    themeStyles,
    record,
    onEditClick,
    isActionDisabled,
}) => {
    const handleEdit = () => {
        onEditClick("edit", record);
    };

    return (
        <div
            key={record.id}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors border ${themeStyles.borderColor} bg-gray-800/20 hover:bg-gray-700/40`}
        >
            <div className="flex items-center">
                {record.status === "Present" ? (
                    <FiCheckCircle className="text-green-500 mr-3 text-xl flex-shrink-0" />
                ) : (
                    <FiXCircle className="text-red-500 mr-3 text-xl flex-shrink-0" />
                )}
                <div>
                    <p
                        className={`text-sm font-semibold ${
                            record.status === "Present" ? "text-green-400" : "text-red-400"
                        }`}
                    >
                        {record.status}
                    </p>
                    {record.markedAt && isValid(parseISO(record.markedAt)) && (
                        <p className="text-xs text-gray-500">
                            Marked at {format(parseISO(record.markedAt), "HH:mm")}
                        </p>
                    )}
                </div>
            </div>
            <button
                onClick={handleEdit}
                className={`p-1.5 rounded-md text-gray-400 hover:text-amber-400 hover:bg-gray-700/60 transition-all ${
                    isActionDisabled ? "cursor-not-allowed opacity-50" : ""
                }`}
                title="Edit Attendance Status"
                disabled={isActionDisabled}
            >
                <FiEdit2 size={16} />
            </button>
        </div>
    );
};

export default AttendanceRecordItem;
