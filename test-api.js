const axios = require("axios");

const BASE_URL = "https://project-production-9ab8.up.railway.app/api/profiles";

async function testAPI() {
  try {
    console.log("🚀 Testing LIVE API...\n");

    const createRes = await axios.post(BASE_URL, {
      name: "ella"
    });
    console.log("CREATE:", createRes.data);

    const id = createRes.data.data.id;

    const allRes = await axios.get(BASE_URL);
    console.log("\nALL:", allRes.data);

    const singleRes = await axios.get(`${BASE_URL}/${id}`);
    console.log("\nSINGLE:", singleRes.data);

    const deleteRes = await axios.delete(`${BASE_URL}/${id}`);
    console.log("\nDELETE:", deleteRes.data);

  catch (err) {
  console.log("🔥 FULL ERROR:", err.response?.data || err.message || err);

  return res.status(500).json({
    status: "error",
    message: err.response?.data?.message || err.message || "Server error"
  });
}