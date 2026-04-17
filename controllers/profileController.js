const axios = require("axios");
const db = require("../database");
const { v4: uuidv4 } = require("uuid");

function getAgeGroup(age) {
  if (age <= 12) return "child";
  if (age <= 19) return "teenager";
  if (age <= 59) return "adult";
  return "senior";
}

// CREATE
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
      data: existing
    });
  }

  try {
    const [g, a, c] = await Promise.all([
      axios.get(`https://api.genderize.io?name=${cleanName}`),
      axios.get(`https://api.agify.io?name=${cleanName}`),
      axios.get(`https://api.nationalize.io?name=${cleanName}`)
    ]);

    const country = c.data.country?.[0];

    const profile = {
      id: uuidv4(),
      name: cleanName,
      gender: g.data.gender || "unknown",
      gender_probability: g.data.probability || 0,
      sample_size: g.data.count || 0,
      age: a.data.age || 0,
      age_group: getAgeGroup(a.data.age || 0),
      country_id: country?.country_id || "N/A",
      country_probability: country?.probability || 0,
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

// GET ALL
exports.getProfiles = (req, res) => {
  return res.json({
    status: "success",
    count: db.getAll().length,
    data: db.getAll()
  });
};

// GET BY ID
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

// DELETE
exports.deleteProfile = (req, res) => {
  const { id } = req.params;

  const deleted = db.delete(id);

  if (!deleted) {
    return res.status(404).json({
      status: "error",
      message: "Profile not found"
    });
  }

  return res.json({
    status: "success",
    message: "Profile deleted successfully"
  });
};