const Customer = require("../models/Customer");
const { generateDummyProfiles } = require("../data/dummyProfiles");

// @desc  Get all real customers assigned to logged-in matchmaker
// @route GET /api/customers
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

// @desc  Get a single customer by ID
// @route GET /api/customers/:id
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

// @desc  Add a note to a customer
// @route POST /api/customers/:id/notes
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

// @desc  Update customer status tag
// @route PATCH /api/customers/:id/status
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

// @desc  Seed dummy profiles into DB (dev use)
// @route POST /api/customers/seed
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