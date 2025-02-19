import cron from "node-cron";
import { Op } from "sequelize";
import {Notification} from "../models/hostels.model.js"


const deleteOldNotifications = async () => {
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  try {
    const deleted = await Notification.destroy({
      where: {
        createdAt: { [Op.lt]: twoMonthsAgo }, // Deletes notifications older than 2 months
      },
    });

    console.log(`Deleted ${deleted} old notifications`);
  } catch (error) {
    console.error("Error deleting old notifications:", error);
  }
};

cron.schedule("0 0 * * *", deleteOldNotifications);

console.log("Cron job for deleting old notifications is running...");

export default deleteOldNotifications;
