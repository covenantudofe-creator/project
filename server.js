const express = require("express");
const cors = require("cors");
require("./database");

const profilesRoutes = require("./routes/profiles");

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(cors()); // required for grading
app.use(express.json()); // parse JSON body

// -------------------- ROUTES --------------------
app.use("/api/profiles", profilesRoutes);

// -------------------- TEST ROUTE --------------------
app.get("/", (req, res) => {
  res.send("API is running...");
});

// optional test endpoint
app.post("/test", (req, res) => {
  res.json({ ok: true });
});

// -------------------- ERROR HANDLING (OPTIONAL BUT GOOD) --------------------
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found"
  });
});

// -------------------- SERVER START --------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Connected to SQLite database");
});