const express = require("express");
const cors = require("cors");

const profileRoutes = require("./routes/profiles");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/profiles", profileRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});