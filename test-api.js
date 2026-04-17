const axios = require("axios");

const BASE_URL = "https://project-production-9ab8.up.railway.app";

async function runTests() {
  try {
    console.log("🚀 Testing API...\n");

    const root = await axios.get(`${BASE_URL}/`);
    console.log("ROOT:", root.data);

    const create = await axios.post(`${BASE_URL}/api/profiles`, {
      name: "ella"
    });

    console.log("CREATE:", create.data);

    const id = create.data.data.id;

    const all = await axios.get(`${BASE_URL}/api/profiles`);
    console.log("ALL:", all.data);

    const single = await axios.get(`${BASE_URL}/api/profiles/${id}`);
    console.log("SINGLE:", single.data);

    await axios.delete(`${BASE_URL}/api/profiles/${id}`);
    console.log("DELETE: success");

  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
  }
}

runTests();