import AadharEnrolment from "../Models/AadharEnrolment.js";
import ChildAadhar from "../Models/ChildAadhar.js";
import PhoneNumber from "../Models/PhoneNumber.js";
import { format } from "date-fns";

// For demo, pretend these are gov holidays (yyyy-MM-dd)
const govtHolidays = ["2024-06-19", "2024-06-21"];

export const getSmartWeeklyReport = async (req, res) => {
  try {
    const today = new Date();
    const week = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const iso = format(date, "yyyy-MM-dd");

      const isSaturday = date.getDay() === 6;
      const isGovHoliday = govtHolidays.includes(iso);
      const skip = isGovHoliday;

      // Only show Sat if not skipped
      if (isSaturday && !skip) {
        week.push({ date: iso, formatted: format(date, "EEE, dd MMM yyyy"), isHoliday: true, holidayType: "Office Holiday", entries: null });
      } else if (!isSaturday && !isGovHoliday) {
        const [aadhar, child, phone] = await Promise.all([
          AadharEnrolment.find({ date: { $gte: date, $lt: new Date(date.getTime() + 86400000) } }),
          ChildAadhar.find({ date: { $gte: date, $lt: new Date(date.getTime() + 86400000) } }),
          PhoneNumber.find({ date: { $gte: date, $lt: new Date(date.getTime() + 86400000) } }),
        ]);

        week.push({
          date: iso,
          formatted: format(date, "EEE, dd MMM yyyy"),
          isHoliday: false,
          entries: {
            aadhar,
            child,
            phone,
          },
        });
      } else {
        // Skip gov holiday
        week.push({
          date: iso,
          formatted: format(date, "EEE, dd MMM yyyy"),
          isHoliday: true,
          holidayType: "Government Holiday",
          entries: null,
        });
      }
    }

    const filtered = week.filter((d) => !d.isHoliday || (d.isHoliday && d.holidayType === "Office Holiday"));

    res.status(200).json(filtered.reverse()); // Chronological order
  } catch (error) {
    console.error("Weekly Smart Report Error:", error);
    res.status(500).json({ message: "Error generating weekly report", error });
  }
};
