const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const matchmakerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true, unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "matchmaker"
    },
  },
  { timestamps: true }
);

// Hash password before saving
matchmakerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


// Compare password method
matchmakerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Matchmaker", matchmakerSchema);