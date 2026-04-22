import '../styles/Navbar.css';
import TJlogo from '../assets/tjlogo.png';
import StatsIcon from './StatsIcon';

type NavbarProps = {
  onStatsClick: () => void;
  statsExpanded: boolean;
};

export default function Navbar({ onStatsClick, statsExpanded }: NavbarProps) {
  return (
    <nav className="navbar">
      <img className="toplogo" src={TJlogo} alt="" />
      {/* <div className="navbar-title-group"> */}
        <p className="title">Trader Jodle!</p>
        <button
          type="button"
          className="navbar-stats-btn"
          onClick={onStatsClick}
          aria-expanded={statsExpanded}
          aria-label="Stats"
        >
          <StatsIcon className="navbar-stats-icon" />
        </button>
      {/* </div> */}
    </nav>
  );
}
