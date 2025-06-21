import AadharEnrolment from "../Models/AadharEnrolment.js";
import ChildAadhar from "../Models/ChildAadhar.js";
import PhoneEnrolment from "../Models/PhoneNumber.js";
import WeeklyReport from "../Models/WeeklyReportModel.js";

// ✅ Get Today's Report
export const getTodayReport = async (req, res) => {
  try {
    const todayDate = new Date().toLocaleDateString();

    const aadharEntries = await AadharEnrolment.find({ date: todayDate });
    const childEntries = await ChildAadhar.find({ date: todayDate });
    const phoneEntries = await PhoneEnrolment.find({ date: todayDate });

    res.json({ aadharEntries, childEntries, phoneEntries });
  } catch (error) {
    res.status(500).json({ message: "Error fetching today's report", error });
  }
};

// ✅ Move Today’s Data to Weekly at Midnight
export const moveTodayToWeekly = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const entries = await Promise.all([
      AadharEnrolment.find({ date: { $gte: today, $lt: tomorrow } }),
      ChildAadhar.find({ date: { $gte: today, $lt: tomorrow } }),
      PhoneEnrolment.find({ date: { $gte: today, $lt: tomorrow } }),
    ]);

    const allEntries = [...entries[0], ...entries[1], ...entries[2]];

    for (let i = 0; i < allEntries.length; i++) {
      const entry = allEntries[i];
      await WeeklyReport.create({
        entryNo: i + 1,
        date: entry.date,
        count: entry.count,
        price: entry.price,
        subtotal: entry.subtotal,
      });
    }

    await Promise.all([
      AadharEnrolment.deleteMany({ date: { $gte: today, $lt: tomorrow } }),
      ChildAadhar.deleteMany({ date: { $gte: today, $lt: tomorrow } }),
      PhoneEnrolment.deleteMany({ date: { $gte: today, $lt: tomorrow } }),
    ]);

    console.log("✅ Today's data successfully moved to Weekly Report.");
  } catch (error) {
    console.error("❌ Error moving today's report to Weekly:", error);
  }
};

