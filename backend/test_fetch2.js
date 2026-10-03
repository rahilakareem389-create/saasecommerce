async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/products');
    console.log("STATUS:", res.status);
    const text = await res.text();
    console.log("DATA LENGTH:", text.length);
    console.log("DATA PREVIEW:", text.substring(0, 100));
  } catch (err) {
    console.log("ERROR:", err);
  }
}
test();
