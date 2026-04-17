const axios = require("axios");
const db = require("../database");
const { v4: uuidv4 } = require("uuid");

function getAgeGroup(age) {
  if (age <= 12) return "child";
  if (age <= 19) return "teenager";
  if (age <= 59) return "adult";
  return "senior";
}

exports.createProfile = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      status: "error",
      message: "Missing name"
    });
  }

  const cleanName = name.toLowerCase();

  const existing = db.findByName(cleanName);

  if (existing) {
    return res.json({
      status: "success",
      message: "Profile already exists",
      data: existing
    });
  }

  try {
    const [genderRes, ageRes, countryRes] = await Promise.all([
      axios.get(`https://api.genderize.io?name=${cleanName}`),
      axios.get(`https://api.agify.io?name=${cleanName}`),
      axios.get(`https://api.nationalize.io?name=${cleanName}`)
    ]);

    const genderData = genderRes.data;
    const ageData = ageRes.data;
    const countryData = countryRes.data;

    if (!genderData.gender || genderData.count === 0) {
      return res.status(502).json({ status: "error", message: "Invalid gender data" });
    }

    if (ageData.age == null) {
      return res.status(502).json({ status: "error", message: "Invalid age data" });
    }

    if (!countryData.country || !countryData.country.length) {
      return res.status(502).json({ status: "error", message: "Invalid country data" });
    }

    const bestCountry = countryData.country.reduce((a, b) =>
      a.probability > b.probability ? a : b
    );

    const profile = {
      id: uuidv4(),
      name: cleanName,
      gender: genderData.gender,
      gender_probability: genderData.probability,
      sample_size: genderData.count,
      age: ageData.age,
      age_group: getAgeGroup(ageData.age),
      country_id: bestCountry.country_id,
      country_probability: bestCountry.probability,
      created_at: new Date().toISOString()
    };

    db.insert(profile);

    return res.status(201).json({
      status: "success",
      data: profile
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Server error"
    });
  }
};

exports.getProfiles = (req, res) => {
  const data = db.getAll();

  return res.json({
    status: "success",
    count: data.length,
    data
  });
};

exports.getProfileById = (req, res) => {
  const profile = db.findById(req.params.id);

  if (!profile) {
    return res.status(404).json({
      status: "error",
      message: "Profile not found"
    });
  }

  return res.json({
    status: "success",
    data: profile
  });
};

exports.deleteProfile = (req, res) => {
  const ok = db.delete(req.params.id);

  if (!ok) {
    return res.status(404).json({
      status: "error",
      message: "Profile not found"
    });
  }

  return res.status(204).send();
};