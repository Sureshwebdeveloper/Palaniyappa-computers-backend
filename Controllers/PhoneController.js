import PhoneNumber from "../Models/PhoneNumber.js";

export const addPhoneEntry = async (req, res) => {
  try {
    const newEntry = new PhoneNumber(req.body);
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: "Error saving entry", error });
  }
};

export const getPhoneEntries = async (req, res) => {
  try {
    const entries = await PhoneNumber.find();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching entries", error });
  }
};
