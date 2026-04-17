const axios = require("axios");
const db = require("../database");
const { v4: uuidv4 } = require("uuid");

// -------------------- AGE GROUP --------------------
function getAgeGroup(age) {
  if (age <= 12) return "child";
  if (age <= 19) return "teenager";
  if (age <= 59) return "adult";
  return "senior";
}

// -------------------- CREATE PROFILE --------------------
exports.createProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Missing name"
      });
    }

    const cleanName = name.toLowerCase();

    // -------------------- CHECK DUPLICATE --------------------
    const existing = db
      .prepare("SELECT * FROM profiles WHERE name = ?")
      .get(cleanName);

    if (existing) {
      return res.json({
        status: "success",
        message: "Profile already exists",
        data: existing
      });
    }

    // -------------------- FETCH APIs --------------------
    const [genderRes, ageRes, countryRes] = await Promise.all([
      axios.get(`https://api.genderize.io?name=${cleanName}`),
      axios.get(`https://api.agify.io?name=${cleanName}`),
      axios.get(`https://api.nationalize.io?name=${cleanName}`)
    ]);

    const genderData = genderRes.data;
    const ageData = ageRes.data;
    const countryData = countryRes.data;

    // -------------------- VALIDATION --------------------
    if (!genderData.gender || genderData.count === 0) {
      return res.status(502).json({
        status: "error",
        message: "Genderize returned invalid response"
      });
    }

    if (ageData.age === null || ageData.age === undefined) {
      return res.status(502).json({
        status: "error",
        message: "Agify returned invalid response"
      });
    }

    if (!countryData.country || countryData.country.length === 0) {
      return res.status(502).json({
        status: "error",
        message: "Nationalize returned invalid response"
      });
    }

    // -------------------- BEST COUNTRY --------------------
    const bestCountry = countryData.country.reduce((a, b) =>
      a.probability > b.probability ? a : b
    );

    // -------------------- PROFILE OBJECT --------------------
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

    // -------------------- INSERT --------------------
    db.prepare(`
      INSERT INTO profiles (
        id, name, gender, gender_probability, sample_size,
        age, age_group, country_id, country_probability, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(Object.values(profile));

    return res.status(201).json({
      status: "success",
      data: profile
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server error"
    });
  }
};

// -------------------- GET ALL --------------------
exports.getProfiles = (req, res) => {
  const { gender, country_id, age_group } = req.query;

  let query = "SELECT * FROM profiles WHERE 1=1";
  const params = [];

  if (gender) {
    query += " AND LOWER(gender) = ?";
    params.push(gender.toLowerCase());
  }

  if (country_id) {
    query += " AND LOWER(country_id) = ?";
    params.push(country_id.toLowerCase());
  }

  if (age_group) {
    query += " AND LOWER(age_group) = ?";
    params.push(age_group.toLowerCase());
  }

  const rows = db.prepare(query).all(...params);

  return res.json({
    status: "success",
    count: rows.length,
    data: rows
  });
};

// -------------------- GET BY ID --------------------
exports.getProfileById = (req, res) => {
  const { id } = req.params;

  const row = db
    .prepare("SELECT * FROM profiles WHERE id = ?")
    .get(id);

  if (!row) {
    return res.status(404).json({
      status: "error",
      message: "Profile not found"
    });
  }

  return res.json({
    status: "success",
    data: row
  });
};

// -------------------- DELETE --------------------
exports.deleteProfile = (req, res) => {
  const { id } = req.params;

  const result = db
    .prepare("DELETE FROM profiles WHERE id = ?")
    .run(id);

  if (result.changes === 0) {
    return res.status(404).json({
      status: "error",
      message: "Profile not found"
    });
  }

  return res.status(204).send();
};