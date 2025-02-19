import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { Loader } from "lucide-react";
import { useAttendanceContext } from "../../contexts/attendanceContext";

const AttendanceChart = ({ data, loading }) => {
  const [currentDateTime, setCurrentDateTime] = useState("2025-02-13 14:40:25");
  const [currentUser] = useState("ayush-jadaun");
  const [hoveredData, setHoveredData] = useState(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now.toISOString().replace("T", " ").split(".")[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 p-3 rounded-lg border border-purple-500/30 shadow-lg">
          <p className="text-gray-300 font-semibold mb-1">{label}</p>
          <p className="text-purple-400">
            Attendance: {payload[0].value.toFixed(1)}%
          </p>
          {payload[0].value >= 75 ? (
            <p className="text-green-400 text-xs mt-1">Above target</p>
          ) : (
            <p className="text-red-400 text-xs mt-1">Below target</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate average attendance
  const averageAttendance = data.length
    ? (
        data.reduce((sum, item) => sum + item.attendance, 0) / data.length
      ).toFixed(1)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-gradient-to-br from-purple-900/50 to-fuchsia-900/50 border border-purple-500/30 relative"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold">Attendance Trend</h3>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">
            Average: {averageAttendance}%
          </span>
          {loading && (
            <Loader className="w-4 h-4 text-purple-400 animate-spin" />
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
            <div className="text-center">
              <Loader className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Loading data...</p>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400 text-sm">
              No attendance data available
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              onMouseMove={(e) => {
                if (e.activePayload) {
                  setHoveredData(e.activePayload[0].payload);
                }
              }}
              onMouseLeave={() => setHoveredData(null)}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#444"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#fff"
                tick={{ fill: "#fff" }}
                axisLine={{ stroke: "#666" }}
              />
              <YAxis
                stroke="#fff"
                tick={{ fill: "#fff" }}
                domain={[0, 100]}
                axisLine={{ stroke: "#666" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span className="text-gray-300">{value}</span>
                )}
              />
              <ReferenceLine
                y={75}
                stroke="#22c55e"
                strokeDasharray="3 3"
                label={{
                  value: "Target (75%)",
                  fill: "#22c55e",
                  position: "right",
                }}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                name="Attendance %"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6" }}
                activeDot={{
                  r: 6,
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Time and User Info */}
      <div className="mt-4 pt-4 border-t border-purple-500/20 flex justify-between items-center text-xs text-gray-400">
        <span>Current Time (UTC): {currentDateTime}</span>
        <span>User: {currentUser}</span>
      </div>

      {/* Hover Stats */}
      {hoveredData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-20 right-6 bg-gray-900/95 p-3 rounded-lg border border-purple-500/30"
        >
          <p className="text-gray-300 text-sm">Month: {hoveredData.month}</p>
          <p className="text-purple-400 font-semibold">
            Attendance: {hoveredData.attendance.toFixed(1)}%
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AttendanceChart;
