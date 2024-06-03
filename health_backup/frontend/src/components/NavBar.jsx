import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css"; // Ensure this import is here

//this is a toggle between login/logout appearing at the top right of the screen
const NavBar = ({ isLoggedIn, handleLogout, showLoginForm, currentPath }) => {
  const navigate = useNavigate();

  const logout = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <nav className="navBar">
      <Link
        to="/"
        className="navLink"
        style={{
          pointerEvents: currentPath === "/compare" ? "none" : "auto",
          color: currentPath === "/compare" ? "gray" : "inherit",
        }}
      >
        Home
      </Link>

      <div className="navRight">
        {isLoggedIn && (
          <Link to="/update-profile" className="navLink">
            Update Profile
          </Link>
        )}
        {isLoggedIn ? (
          <button onClick={logout} className="toggleButton">
            Log Out
          </button>
        ) : (
          <Link to="/auth" className="navLink" onClick={showLoginForm}>
            <button className="toggleButton">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
