import cron from "node-cron";
import { Op } from "sequelize";
import User from "../models/user.model.js";
import sequelize from "../db/db.js";


sequelize
    .authenticate()
    .then(() => console.log("Database connected"))
    .catch((err) => console.error("Unable to connect to the database:", err));

const GRACE_PERIOD_MS = 65 * 60 * 1000;

async function scheduleUnverifiedUserCleanup() {
    cron.schedule("*/5 * * * *", async () => {
        try {
            const thresholdTime = new Date(Date.now() - GRACE_PERIOD_MS);

            const result = await User.destroy({
                where: {
                    isVerified: false,
                    createdAt: {
                        [Op.lte]: thresholdTime,
                    },
                },
            });
            if (result > 0) {
                console.log(`Deleted ${result} unverified user(s).`);
            } else {
                console.log("No unverified users eligible for deletion at this time.");
            }
        } catch (error) {
            console.error("Error while cleaning up unverified users:", error);
        }
    });
}

export default scheduleUnverifiedUserCleanup;
