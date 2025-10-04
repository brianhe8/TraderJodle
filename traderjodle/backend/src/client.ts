async function test() {
  const res = await fetch("http://localhost:3000/test");
  const text = await res.text();
  console.log(text); // → "testing here!"
}

test();
