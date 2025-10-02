import "./Navbar.css";
import TJlogo from "./assets/tjlogo.png";
export default function Navbar() {
  return (
    <nav>
      <img className="toplogo" src={TJlogo}></img>
      Trader Jodle!
      <ul>
        <li>
          <a href="https://costcodle.com/">costcodle</a>
        </li>
        <li>link2</li>
      </ul>
    </nav>
  );
}
