async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'wordpressrahila@gmail.com', password: 'password123' })
    });
    console.log("STATUS:", res.status);
    console.log("DATA:", await res.json());
  } catch (err) {
    console.log("ERROR:", err);
  }
}
test();
