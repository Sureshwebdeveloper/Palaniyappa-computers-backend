import AadharEnrolment from "../Models/AadharEnrolment.js";
import ChildAadhar from "../Models/ChildAadhar.js";
import PhoneEnrolment from "../Models/PhoneNumber.js";
// import WeeklyReport from "../Models/";

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
    const todayDate = new Date().toLocaleDateString();

    const todayEntries = [
      ...(await AadharEnrolment.find({ date: todayDate })),
      ...(await ChildAadhar.find({ date: todayDate })),
      ...(await PhoneEnrolment.find({ date: todayDate })),
    ];

    todayEntries.forEach(async (entry, index) => {
      await WeeklyReport.create({
        entryNo: index + 1, // Auto-increment count
        date: entry.date,
        count: entry.count,
        price: entry.price,
        subtotal: entry.subtotal,
      });
    });

    // ✅ Delete today’s data after moving to Weekly Report
    await AadharEnrolment.deleteMany({ date: todayDate });
    await ChildAadhar.deleteMany({ date: todayDate });
    await PhoneEnrolment.deleteMany({ date: todayDate });

    console.log("Today's data successfully moved to Weekly Report.");
  } catch (error) {
    console.error("Error moving today's report to Weekly:", error);
  }
};
