const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
       required: true
    },
    lastName: { 
      type: String,
       required: true
     },
    gender: { 
      type: String,
       enum: ["Male", "Female"],
       required: true
     },
    dateOfBirth: { 
      type: Date,
       required: true
     },
    age: { 
      type: Number
     },
    country: { 
      type: String,
       default: "India"
     },
    city: { 
      type: String
     },
    height: { 
      type: Number
     },
    email: { 
      type: String
     },
    phone: { 
      type: String
     },
    undergraduateCollege: { 
      type: String
     },
    degree: { 
      type: String
     },
    income: { 
      type: Number
     },
    currentCompany: { 
      type: String
    },
    designation: { 
      type: String
    },
    profession: { 
      type: String
    },
    maritalStatus: {
      type: String,
      enum: ["Never Married", "Divorced", "Widowed", "Separated"],
      default: "Never Married",
    },
    languagesKnown: [{ 
      type: String
    }],
    siblings: { 
      type: Number,
      default: 0
    },
    caste: { 
      type: String
    },
    religion: { 
      type: String
    },
    wantKids: { 
      type: String, 
      enum: ["Yes", "No", "Maybe"],
      default: "Maybe"
    },
    openToRelocate: { 
      type: String, 
      enum: ["Yes", "No", "Maybe"],
      default: "Maybe"
    },
    openToPets: { 
      type: String, enum: ["Yes", "No", "Maybe"],
      default: "Maybe"
    },
    familyValues: { 
      type: String, 
      enum: ["Traditional", "Moderate", "Liberal"], 
      default: "Moderate"
    },
    diet: { 
      type: String, 
      enum: ["Vegetarian", "Non-Vegetarian", "Eggetarian", "Vegan"],
      default: "Vegetarian"
    },
    profilePhoto: { 
      type: String,
      default: ""
    },
    assignedMatchmaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Matchmaker",
    },
    statusTag: {
      type: String,
      enum: ["New", "Active", "Matched", "On Hold", "Closed"],
      default: "New",
    },
    notes: [
      {
        text: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Is this a dummy profile (for the match pool)?
    isDummy: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-calculate age before save
customerSchema.pre("save", function (next) {
  if (this.dateOfBirth) {
    const today = new Date();
    const birth = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    this.age = age;
  }
  next();
});

module.exports = mongoose.model("Customer", customerSchema);