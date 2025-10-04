import { useState } from "react";
import "./App.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
export default function Game() {
  const [guesses, setGuesses] = useState([]);
  // pull image from db
  const item = {
    name: "Peach flavored Glaze",
    price: 3.99,
    image:
      "https://www.traderjoes.com/content/dam/trjo/products/m20405/81526.png",
  };
  const answer = item.price;

  // function handleClick() {
  //   setCount((count) => count + 1);
  // }
  return (
    <>
      <header>
        <Navbar />
      </header>
      <div className="middle">
        <h1>ANSWER: {answer}</h1>
        <div className="item-container">
          <div className="image-container">
            <img src={item.image} height="400px" className="item-image" />
          </div>
          <div className="image-name-container">
            <h1>{item.name}</h1>
          </div>
        </div>
        <div className="game-stats">Guess 1/6</div>
        <div className="guesses-container">GUESSES HERE</div>
        {/* Out of the Box stuff */}
        {/* <div className="card">
          <button onClick={handleClick}>count is {count}</button>
        </div> */}
        {/* Out of the Box stuff */}
      </div>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
