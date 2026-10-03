async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Admin', email: 'admin@test.com', password: 'password123' })
    });
    console.log("REGISTER:", await res.json());

    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@test.com', password: 'password123' })
    });
    console.log("LOGIN:", await loginRes.json());
  } catch (err) {
    console.log("ERROR:", err);
  }
}
test();
