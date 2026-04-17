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
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      status: "error",
      message: "Missing name"
    });
  }

  const cleanName = name.toLowerCase();

  db.get(`SELECT * FROM profiles WHERE name = ?`, [cleanName], async (err, existing) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database error"
      });
    }

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

      db.run(
        `INSERT INTO profiles VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          profile.id,
          profile.name,
          profile.gender,
          profile.gender_probability,
          profile.sample_size,
          profile.age,
          profile.age_group,
          profile.country_id,
          profile.country_probability,
          profile.created_at
        ],
        (err) => {
          if (err) {
            return res.status(500).json({
              status: "error",
              message: "Database insert failed"
            });
          }

          return res.status(201).json({
            status: "success",
            data: profile
          });
        }
      );
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Server error"
      });
    }
  });
};

// -------------------- GET ALL --------------------
exports.getProfiles = (req, res) => {
  db.all(`SELECT * FROM profiles`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database error"
      });
    }

    return res.json({
      status: "success",
      count: rows.length,
      data: rows
    });
  });
};

// -------------------- GET BY ID --------------------
exports.getProfileById = (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM profiles WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database error"
      });
    }

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
  });
};

// -------------------- DELETE --------------------
exports.deleteProfile = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Profile ID is required"
    });
  }

  db.run(`DELETE FROM profiles WHERE id = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database error"
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Profile deleted successfully"
    });
  });
};