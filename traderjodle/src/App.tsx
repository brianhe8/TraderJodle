import { useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
export default function Game() {
  const [count, setCount] = useState(0);
  // pull image from db
  const item = {
    name: "Peach flavored Glaze",
    price: 3.99,
    image:
      "https://www.traderjoes.com/content/dam/trjo/products/m20405/81526.png",
  };
  function handleClick() {
    setCount((count) => count + 1);
  }
  return (
    <>
      <header>
        <Navbar />
      </header>
      <div className="middle">
        <h1>{item.name}</h1>
        <img src={item.image} height="400px" className="item-image" />

        {/* Out of the Box stuff */}
        <div className="card">
          <button onClick={handleClick}>count is {count}</button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        {/* Out of the Box stuff */}
      </div>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
