const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('http://localhost:5000/api/products/d_0_1');
    console.log("STATUS:", res.status);
    console.log("DATA:", res.data);
  } catch (err) {
    console.log("ERROR STATUS:", err.response?.status);
    console.log("ERROR DATA:", err.response?.data);
  }
}
test();
