async function test() {
  try {
    // 1. Register admin
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Admin',
        email: 'admin_test3@example.com',
        password: 'password'
      })
    });
    const regData = await regRes.json();
    console.log("Token:", regData.token);

    // 2. Fetch dashboard
    const dashRes = await fetch('http://localhost:5000/api/dashboard', {
      headers: { Authorization: `Bearer ${regData.token}` }
    });
    const dashData = await dashRes.json();
    console.log("Dashboard Status:", dashRes.status);
    if (dashRes.status !== 200) console.log(dashData);
  } catch (e) {
    console.log("Error:", e.message);
  }
}
test();
