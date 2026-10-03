const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/coupons', {
      code: 'TEST10',
      discountType: 'percentage',
      discountAmount: 10,
      expiryDate: '2026-12-31'
    });
    console.log(res.data);
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}
test();
