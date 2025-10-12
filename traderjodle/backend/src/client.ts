async function test() {
  const res = await fetch("http://localhost:3000/test");
  const text = await res.text();
  console.log(text); // → "testing here!"
}
async function getData() {
  const response = await fetch("http://localhost:3000/items");
  const data = await response.json();
  let id: number = data[0].id;
  let item_name: string = data[0].item_name;
  let item_price: string = data[0].item_price;
  let item_image: string = data[0].item_image;

  console.log(id);
  console.log(item_name);
  console.log(item_price);
  console.log(item_image);
  return data;
}
test();
getData();
