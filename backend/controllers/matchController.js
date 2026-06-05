const Customer = require("../models/Customer");
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.GROQ_API_KEY });

/**
 * Score a potential match for a MALE customer.
 * Rules: female younger, earns less, shorter, compatible on kids views.
 */
const scoreMaleCustomer = (customer, candidate) => {
  let score = 0;
  const reasons = [];

  // Age: candidate should be younger
  if (candidate.age < customer.age) {
    score += 20;
    reasons.push(`Younger by ${customer.age - candidate.age} years`);
  }

  // Income: candidate earns less
  if (candidate.income < customer.income) {
    score += 15;
    reasons.push(`Income compatible (${candidate.income}L vs ${customer.income}L)`);
  }

  // Height: candidate shorter
  if (candidate.height < customer.height) {
    score += 10;
    reasons.push(`Height compatible`);
  }

  // Kids views match
  if (candidate.wantKids === customer.wantKids) {
    score += 20;
    reasons.push(`Same views on children`);
  }

  // Religion match (bonus)
  if (candidate.religion === customer.religion) {
    score += 15;
    reasons.push(`Same religion`);
  }

  // City match (bonus)
  if (candidate.city === customer.city) {
    score += 10;
    reasons.push(`Same city`);
  }

  // Relocation compatibility
  if (customer.openToRelocate === "Yes" || candidate.openToRelocate === "Yes") {
    score += 5;
    reasons.push("Open to relocation");
  }

  // Diet compatibility
  if (candidate.diet === customer.diet) {
    score += 5;
    reasons.push(`Same diet preference`);
  }

  return { score, reasons };
};

/**
 * Score a potential match for a FEMALE customer.
 * Rules: profession, values, relocation preferences, overall compatibility.
 */
const scoreFemaleCustomer = (customer, candidate) => {
  let score = 0;
  const reasons = [];

  // Candidate should be older or same age
  if (candidate.age >= customer.age) {
    score += 15;
    reasons.push(`Age compatible (${candidate.age} years)`);
  }

  // Candidate earns more (common preference)
  if (candidate.income > customer.income) {
    score += 20;
    reasons.push(`Higher income (${candidate.income}L)`);
  }

  // Family values alignment
  if (candidate.familyValues === customer.familyValues) {
    score += 20;
    reasons.push(`Matching family values (${candidate.familyValues})`);
  }

  // Relocation compatibility
  if (candidate.openToRelocate === customer.openToRelocate) {
    score += 15;
    reasons.push(`Both ${candidate.openToRelocate === "Yes" ? "open" : "not open"} to relocation`);
  }

  // Kids views match
  if (candidate.wantKids === customer.wantKids) {
    score += 15;
    reasons.push(`Same views on children`);
  }

  // Religion match
  if (candidate.religion === customer.religion) {
    score += 10;
    reasons.push(`Same religion`);
  }

  // Diet compatibility
  if (candidate.diet === customer.diet) {
    score += 5;
    reasons.push(`Same diet preference`);
  }

  return { score, reasons };
};

// Label score as tier
const getMatchLabel = (score) => {
  if (score >= 70) return "High Potential Match 🌟";
  if (score >= 45) return "Good Match ✅";
  if (score >= 25) return "Possible Match 🔵";
  return "Low Compatibility ⚪";
};

// ─── Controllers ──────────────────────────────────────────────────────────

// @desc  Get ranked matches for a customer
// @route GET /api/matches/:customerId
const getMatches = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // Opposite gender dummy profiles
    const oppositeGender = customer.gender === "Male" ? "Female" : "Male";
    const pool = await Customer.find({ gender: oppositeGender, isDummy: true });

    // Score each candidate
    const scored = pool.map((candidate) => {
      const { score, reasons } =
        customer.gender === "Male"
          ? scoreMaleCustomer(customer, candidate)
          : scoreFemaleCustomer(customer, candidate);

      return {
        candidate: candidate.toObject(),
        score,
        reasons,
        label: getMatchLabel(score),
      };
    });

    // Sort descending by score, return top 20
    scored.sort((a, b) => b.score - a.score);
    res.json(scored.slice(0, 20));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  "Send Match" — mock email/notification
// @route POST /api/matches/:customerId/send
const sendMatch = async (req, res) => {
  try {
    const { matchId } = req.body;
    const customer = await Customer.findById(req.params.customerId);
    const matchProfile = await Customer.findById(matchId);

    if (!customer || !matchProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Simulate sending — in production this would trigger an email service
    res.json({
      success: true,
      message: `Match sent to ${customer.firstName} ${customer.lastName}!`,
      matchSummary: {
        name: `${matchProfile.firstName} ${matchProfile.lastName}`,
        age: matchProfile.age,
        city: matchProfile.city,
        profession: matchProfile.designation,
        income: `${matchProfile.income} LPA`,
        religion: matchProfile.religion,
        wantKids: matchProfile.wantKids,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Generate AI intro email using OpenAI
// @route POST /api/matches/:customerId/ai-intro
const generateAIIntro = async (req, res) => {
  try {
    const { matchId } = req.body;
    const customer = await Customer.findById(req.params.customerId);
    const matchProfile = await Customer.findById(matchId);

    if (!customer || !matchProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const prompt = `
You are a professional Indian matchmaker writing a warm, personalized introduction email.

Person A: ${customer.firstName}, ${customer.age} years old, ${customer.city}, ${customer.designation} at ${customer.currentCompany}, earns ${customer.income} LPA, ${customer.religion}, wants kids: ${customer.wantKids}.

Person B: ${matchProfile.firstName}, ${matchProfile.age} years old, ${matchProfile.city}, ${matchProfile.designation} at ${matchProfile.currentCompany}, earns ${matchProfile.income} LPA, ${matchProfile.religion}, wants kids: ${matchProfile.wantKids}.

Write a short, warm 3-sentence introduction email from the matchmaker introducing Person B to Person A. Keep it personal, culturally appropriate, and highlight 2 compatibility points.
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    const intro = completion.choices[0].message.content;
    res.json({ intro });
  } catch (error) {
    // Fallback if OpenAI key not set
    const customer = await Customer.findById(req.params.customerId);
    const matchProfile = await Customer.findById(req.body.matchId);
    const fallback = `Dear ${customer?.firstName}, we have found a wonderful match for you! ${matchProfile?.firstName} from ${matchProfile?.city} is a ${matchProfile?.designation} who shares similar values and life goals. We believe you two would make a great connection — we look forward to hearing your thoughts!`;
    res.json({ intro: fallback });
  }
};

module.exports = { getMatches, sendMatch, generateAIIntro };