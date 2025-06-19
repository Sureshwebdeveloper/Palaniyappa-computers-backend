import ChildAadhar from "../Models/ChildAadhar.js";

export const addChildEntry = async (req, res) => {
  try {
    const newEntry = new ChildAadhar(req.body);
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: "Error saving entry", error });
  }
};

export const getChildEntries = async (req, res) => {
  try {
    const entries = await ChildAadhar.find();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching entries", error });
  }
};
