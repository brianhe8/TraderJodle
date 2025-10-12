import "./Navbar.css";
import TJlogo from "../assets/tjlogo.png";
export default function Navbar() {
  return (
    <nav className="navbar">
      <img className="toplogo" src={TJlogo}></img>
      <p className="title">Trader Jodle!</p>
      <ul className="button-list">
        <li>
          <a href="https://costcodle.com/">costcodle</a>
        </li>
        <li>link2</li>
      </ul>
    </nav>
  );
}
