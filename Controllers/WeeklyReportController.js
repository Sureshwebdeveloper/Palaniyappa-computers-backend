export const getWeeklyReport = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const aadharEntries = await AadharEnrolment.find({ date: { $gte: sevenDaysAgo.toISOString().split("T")[0] } });
    const childEntries = await ChildAadhar.find({ date: { $gte: sevenDaysAgo.toISOString().split("T")[0] } });
    const phoneEntries = await PhoneEnrolment.find({ date: { $gte: sevenDaysAgo.toISOString().split("T")[0] } });

    res.json({ aadharEntries, childEntries, phoneEntries });
  } catch (error) {
    res.status(500).json({ message: "Error fetching weekly report", error });
  }
};
