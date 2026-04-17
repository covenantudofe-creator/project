const express = require("express");
const router = express.Router();

const controller = require("../controllers/profilesController");

// -------------------- CREATE PROFILE --------------------
router.post("/", controller.createProfile);

// -------------------- GET ALL PROFILES (with filters) --------------------
router.get("/", controller.getProfiles);

// -------------------- GET SINGLE PROFILE --------------------
router.get("/:id", controller.getProfileById);

// -------------------- DELETE PROFILE --------------------
router.delete("/:id", controller.deleteProfile);

module.exports = router;