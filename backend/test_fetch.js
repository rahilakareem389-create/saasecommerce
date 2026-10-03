async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/products/d_0_1');
    console.log("STATUS:", res.status);
    console.log("DATA:", await res.json());
  } catch (err) {
    console.log("ERROR:", err);
  }
}
test();
