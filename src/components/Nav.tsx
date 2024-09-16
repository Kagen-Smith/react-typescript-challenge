import { NavLink } from 'react-router-dom';

const Nav = () => {
  // TODO: Add necessary code to display the navigation bar and link between the pages
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink className="nav-link" to="/" end>Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/SavedCandidates">Potential Candidates</NavLink>
          </li>
        </ul>
      </div>
  </nav>
);
};

export default Nav;
