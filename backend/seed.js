const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Matchmaker = require("./models/Matchmaker");
const Customer = require("./models/Customer");
const { generateDummyProfiles } = require("./data/dummyProfiles");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
};

const seed = async () => {
  await connectDB();

  await Matchmaker.deleteMany({});
  await Customer.deleteMany({});
  console.log("Cleared existing data");

  // Create matchmaker account
  const matchmaker = await Matchmaker.create({
    name: "Priya Sharma",
    email: "matchmaker@tdc.com",
    password: "tdc@123",
    role: "matchmaker",
  });
  console.log(`Matchmaker created: ${matchmaker.email} / tdc@123`);

  // Create 5 sample real customers (mix of male and female)
  const sampleCustomers = [
    {
      firstName: "Rahul",
      lastName: "Mehta",
      gender: "Male",
      dateOfBirth: new Date("1995-06-15"),
      age: 29,
      city: "Mumbai",
      country: "India",
      height: 178,
      email: "rahul.mehta@gmail.com",
      phone: "9876543210",
      undergraduateCollege: "IIT Bombay",
      degree: "B.Tech",
      income: 18,
      currentCompany: "Goldman Sachs",
      designation: "Financial Analyst",
      profession: "Finance",
      maritalStatus: "Never Married",
      languagesKnown: ["Hindi", "English", "Marathi"],
      siblings: 1,
      caste: "Brahmin",
      religion: "Hindu",
      wantKids: "Yes",
      openToRelocate: "Maybe",
      openToPets: "Yes",
      familyValues: "Moderate",
      diet: "Vegetarian",
      statusTag: "Active",
      assignedMatchmaker: matchmaker._id,
      isDummy: false,
    },
    {
      firstName: "Ananya",
      lastName: "Iyer",
      gender: "Female",
      dateOfBirth: new Date("1997-03-22"),
      age: 27,
      city: "Bangalore",
      country: "India",
      height: 162,
      email: "ananya.iyer@gmail.com",
      phone: "9812345678",
      undergraduateCollege: "BITS Pilani",
      degree: "B.E.",
      income: 12,
      currentCompany: "Infosys",
      designation: "Software Engineer",
      profession: "Technology",
      maritalStatus: "Never Married",
      languagesKnown: ["Tamil", "English", "Hindi"],
      siblings: 0,
      caste: "Iyer",
      religion: "Hindu",
      wantKids: "Maybe",
      openToRelocate: "Yes",
      openToPets: "No",
      familyValues: "Liberal",
      diet: "Vegetarian",
      statusTag: "New",
      assignedMatchmaker: matchmaker._id,
      isDummy: false,
    },
    {
      firstName: "Arjun",
      lastName: "Singh",
      gender: "Male",
      dateOfBirth: new Date("1993-11-08"),
      age: 31,
      city: "Delhi",
      country: "India",
      height: 182,
      email: "arjun.singh@gmail.com",
      phone: "9988776655",
      undergraduateCollege: "Delhi University",
      degree: "MBA",
      income: 25,
      currentCompany: "Deloitte",
      designation: "Senior Consultant",
      profession: "Consulting",
      maritalStatus: "Never Married",
      languagesKnown: ["Hindi", "English", "Punjabi"],
      siblings: 2,
      caste: "Rajput",
      religion: "Hindu",
      wantKids: "Yes",
      openToRelocate: "No",
      openToPets: "Maybe",
      familyValues: "Traditional",
      diet: "Non-Vegetarian",
      statusTag: "Active",
      assignedMatchmaker: matchmaker._id,
      isDummy: false,
    },
    {
      firstName: "Sneha",
      lastName: "Patel",
      gender: "Female",
      dateOfBirth: new Date("1998-07-30"),
      age: 26,
      city: "Ahmedabad",
      country: "India",
      height: 158,
      email: "sneha.patel@gmail.com",
      phone: "9765432100",
      undergraduateCollege: "Symbiosis",
      degree: "BBA",
      income: 8,
      currentCompany: "Swiggy",
      designation: "Marketing Executive",
      profession: "Marketing",
      maritalStatus: "Never Married",
      languagesKnown: ["Gujarati", "Hindi", "English"],
      siblings: 1,
      caste: "Patel",
      religion: "Hindu",
      wantKids: "Yes",
      openToRelocate: "Yes",
      openToPets: "Yes",
      familyValues: "Moderate",
      diet: "Vegetarian",
      statusTag: "Matched",
      assignedMatchmaker: matchmaker._id,
      isDummy: false,
    },
    {
      firstName: "Karan",
      lastName: "Kapoor",
      gender: "Male",
      dateOfBirth: new Date("1996-01-14"),
      age: 28,
      city: "Pune",
      country: "India",
      height: 175,
      email: "karan.kapoor@gmail.com",
      phone: "9123456789",
      undergraduateCollege: "VIT Vellore",
      degree: "B.Tech",
      income: 14,
      currentCompany: "Wipro",
      designation: "Product Manager",
      profession: "Technology",
      maritalStatus: "Never Married",
      languagesKnown: ["Hindi", "English"],
      siblings: 0,
      caste: "Kayastha",
      religion: "Hindu",
      wantKids: "No",
      openToRelocate: "Yes",
      openToPets: "Yes",
      familyValues: "Liberal",
      diet: "Eggetarian",
      statusTag: "On Hold",
      assignedMatchmaker: matchmaker._id,
      isDummy: false,
    },
  ];

  await Customer.insertMany(sampleCustomers);
  console.log(`Created ${sampleCustomers.length} sample customers`);

  const dummies = generateDummyProfiles(100);
  await Customer.insertMany(dummies);
  console.log(`Seeded ${dummies.length} dummy profiles`);

  mongoose.disconnect();
};

seed().catch(console.error);