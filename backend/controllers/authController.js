const jwt = require("jsonwebtoken");
const Matchmaker = require("../models/Matchmaker");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const matchmaker = await Matchmaker.findOne({ email });
    if (!matchmaker || !(await matchmaker.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: matchmaker._id,
      name: matchmaker.name,
      email: matchmaker.email,
      role: matchmaker.role,
      token: generateToken(matchmaker._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get user profile controller
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { login, getMe };