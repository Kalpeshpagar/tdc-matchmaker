const maleFirstNames = [
  "Arjun","Rohan","Vikram","Aditya","Rahul","Karan","Nikhil","Siddharth",
  "Amit","Ravi","Suresh","Manish","Deepak","Harsh","Varun","Akash",
  "Pranav","Yash","Mohit","Gaurav","Ankit","Sachin","Rajesh","Vivek",
  "Sandeep","Tarun","Dhruv","Naman","Ishan","Kabir"
];

const femaleFirstNames = [
  "Priya","Ananya","Sneha","Pooja","Divya","Kavya","Neha","Shruti",
  "Aishwarya","Riya","Simran","Meera","Tanya","Anjali","Nisha","Swati",
  "Pallavi","Kratika","Sonam","Ridhi","Isha","Diya","Mahi","Komal",
  "Sakshi","Preeti","Aditi","Nidhi","Shipra","Garima"
];

const lastNames = [
  "Sharma","Patel","Verma","Gupta","Singh","Mehta","Joshi","Nair",
  "Iyer","Reddy","Rao","Malhotra","Khanna","Kapoor","Bhat","Pillai",
  "Naik","Shetty","Desai","Shah","Agarwal","Mishra","Tiwari","Saxena",
  "Chauhan","Pandey","Dubey","Tripathi","Srivastava","Kulkarni"
];

const cities = [
  "Mumbai","Delhi","Bangalore","Pune","Hyderabad","Chennai",
  "Kolkata","Ahmedabad","Jaipur","Lucknow","Chandigarh","Surat",
  "Nagpur","Indore","Bhopal","Nashik","Vadodara","Kochi"
];

const religions = ["Hindu","Muslim","Christian","Sikh","Jain","Buddhist"];

const castes = ["Brahmin","Kshatriya","Vaishya","Kayastha","Rajput","Maratha","Patel","Nair","Iyer","Reddy","General"];

const degrees = ["B.Tech","B.E.","MBA","M.Tech","B.Com","B.Sc","BBA","CA","MBBS","B.Arch","LLB","M.Sc"];

const colleges = [
  "IIT Bombay","IIT Delhi","IIT Madras","NIT Trichy","BITS Pilani",
  "Delhi University","Pune University","Mumbai University","VIT Vellore",
  "Manipal University","Symbiosis","Christ University","Amity University",
  "SRM University","Anna University","Jadavpur University"
];

const companies = [
  "TCS","Infosys","Wipro","HCL","Accenture","IBM","Cognizant",
  "Deloitte","KPMG","Goldman Sachs","JP Morgan","HDFC Bank",
  "Reliance Industries","Tata Group","Mahindra","L&T","Byju's",
  "Swiggy","Zomato","Flipkart","Ola","PhonePe","Razorpay","Freshworks"
];

const designations = [
  "Software Engineer","Senior Developer","Product Manager","Data Analyst",
  "Business Analyst","Consultant","Associate","Manager","Team Lead",
  "Financial Analyst","Marketing Executive","HR Manager","Architect"
];

const languages = ["Hindi","English","Marathi","Tamil","Telugu","Kannada","Malayalam","Bengali","Gujarati","Punjabi"];

const wantKidsOptions = ["Yes","No","Maybe"];
const relocateOptions = ["Yes","No","Maybe"];
const petsOptions = ["Yes","No","Maybe"];
const familyValues = ["Traditional","Moderate","Liberal"];
const diets = ["Vegetarian","Non-Vegetarian","Eggetarian","Vegan"];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomDOB = (minAge, maxAge) => {
  const year = new Date().getFullYear() - getRandomInt(minAge, maxAge);
  const month = getRandomInt(0, 11);
  const day = getRandomInt(1, 28);
  return new Date(year, month, day);
};

const randomAge = (dob) => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

// Generate 50 male + 50 female dummy profiles
const generateDummyProfiles = (count = 100) => {
  const profiles = [];
  const half = count / 2;

  // 50 Female dummy profiles
  for (let i = 0; i < half; i++) {
    const dob = randomDOB(22, 32);
    const selectedLangs = [getRandom(languages), getRandom(languages)].filter(
      (v, idx, arr) => arr.indexOf(v) === idx
    );
    profiles.push({
      firstName: getRandom(femaleFirstNames),
      lastName: getRandom(lastNames),
      gender: "Female",
      dateOfBirth: dob,
      age: randomAge(dob),
      country: "India",
      city: getRandom(cities),
      height: getRandomInt(150, 170),
      email: `dummy.female${i + 1}@tdc.com`,
      phone: `9${getRandomInt(100000000, 999999999)}`,
      undergraduateCollege: getRandom(colleges),
      degree: getRandom(degrees),
      income: getRandomInt(3, 15), // in lakhs
      currentCompany: getRandom(companies),
      designation: getRandom(designations),
      profession: getRandom(designations),
      maritalStatus: "Never Married",
      languagesKnown: selectedLangs,
      siblings: getRandomInt(0, 3),
      caste: getRandom(castes),
      religion: getRandom(religions),
      wantKids: getRandom(wantKidsOptions),
      openToRelocate: getRandom(relocateOptions),
      openToPets: getRandom(petsOptions),
      familyValues: getRandom(familyValues),
      diet: getRandom(diets),
      statusTag: "Active",
      isDummy: true,
    });
  }

  // 50 Male dummy profiles
  for (let i = 0; i < half; i++) {
    const dob = randomDOB(24, 35);
    const selectedLangs = [getRandom(languages), getRandom(languages)].filter(
      (v, idx, arr) => arr.indexOf(v) === idx
    );
    profiles.push({
      firstName: getRandom(maleFirstNames),
      lastName: getRandom(lastNames),
      gender: "Male",
      dateOfBirth: dob,
      age: randomAge(dob),
      country: "India",
      city: getRandom(cities),
      height: getRandomInt(165, 185),
      email: `dummy.male${i + 1}@tdc.com`,
      phone: `8${getRandomInt(100000000, 999999999)}`,
      undergraduateCollege: getRandom(colleges),
      degree: getRandom(degrees),
      income: getRandomInt(5, 30), // in lakhs
      currentCompany: getRandom(companies),
      designation: getRandom(designations),
      profession: getRandom(designations),
      maritalStatus: "Never Married",
      languagesKnown: selectedLangs,
      siblings: getRandomInt(0, 3),
      caste: getRandom(castes),
      religion: getRandom(religions),
      wantKids: getRandom(wantKidsOptions),
      openToRelocate: getRandom(relocateOptions),
      openToPets: getRandom(petsOptions),
      familyValues: getRandom(familyValues),
      diet: getRandom(diets),
      statusTag: "Active",
      isDummy: true,
    });
  }

  return profiles;
};

module.exports = { generateDummyProfiles };