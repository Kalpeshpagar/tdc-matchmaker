const Customer = require("../models/Customer");
const { generateDummyProfiles } = require("../data/dummyProfiles");

// Get all real customers assigned to logged-in matchmaker
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({
      assignedMatchmaker: req.user._id,
      isDummy: false,
    }).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single customer by ID
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate(
      "assignedMatchmaker",
      "name email"
    );
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a note to a customer
const addNote = async (req, res) => {
  try {
    const { text } = req.body;
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    customer.notes.push({ text });
    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update customer status tag
const updateStatus = async (req, res) => {
  try {
    const { statusTag } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { statusTag },
      { new: true }
    );
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Seed dummy profiles into DB
const seedDummyProfiles = async (req, res) => {
  try {
    // Remove old dummy profiles
    await Customer.deleteMany({ isDummy: true });

    const profiles = generateDummyProfiles(100);
    await Customer.insertMany(profiles);

    res.json({ message: `Seeded ${profiles.length} dummy profiles` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  addNote,
  updateStatus,
  seedDummyProfiles,
};