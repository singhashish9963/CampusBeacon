import React from "react";
import { motion } from "framer-motion";
import { Tilt } from "react-tilt";
import { Award } from "lucide-react";

const AchievementsView = ({ achievements, defaultOptions }) => {
  return (
    <motion.div
      key="achievements"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {achievements.map((achievement) => (
        <Tilt key={achievement.id} options={defaultOptions}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`p-6 rounded-xl border ${
              achievement.unlocked
                ? "border-green-500/30 bg-gradient-to-br from-green-900/50 to-emerald-900/50"
                : "border-gray-500/30 bg-gradient-to-br from-gray-900/50 to-slate-900/50"
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <Award
                className={
                  achievement.unlocked ? "text-green-400" : "text-gray-400"
                }
              />
              <h3 className="text-white font-semibold">{achievement.title}</h3>
            </div>
            <p className="text-gray-400">{achievement.description}</p>
            {achievement.unlocked && (
              <div className="mt-4 text-green-400 text-sm">
                Unlocked on: {new Date("2025-02-13").toLocaleDateString()}
              </div>
            )}
          </motion.div>
        </Tilt>
      ))}

      {/* Achievement Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="col-span-full mt-4"
      >
        <div className="bg-purple-900/30 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">
            Achievement Progress
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex-grow h-2 bg-purple-500/20 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    (achievements.filter((a) => a.unlocked).length /
                      achievements.length) *
                    100
                  }%`,
                }}
                className="h-full bg-purple-500 rounded-full"
              />
            </div>
            <span className="text-purple-400">
              {achievements.filter((a) => a.unlocked).length}/
              {achievements.length}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AchievementsView;
