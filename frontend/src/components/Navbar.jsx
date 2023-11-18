import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "./UserContext";

function Navbar() {
  const context = useContext(UserContext);
  const email = context.email || null;
  const navigate = useNavigate();

  // to logout: clear the token and redirect to login
  const handleLogout = (e) => {
    localStorage.clear();
    context.setEmail(null);
    navigate("/login");
  };

  return (
    <div className="navbar">
      <Link to="/" className="navlink">
        Home
      </Link>
      {/* if email: display username or else register*/}
      {email ? (
        <p className="navlink-email">{email.split("@")[0]}</p>
      ) : (
        <Link to="/register" className="navlink">
          Register
        </Link>
      )}
      {/* if email: display logout or else login  */}
      {email ? (
        <p className="navlink" onClick={handleLogout}>
          Logout
        </p>
      ) : (
        <Link to="/login" className="navlink">
          Login
        </Link>
      )}
    </div>
  );
}

export default Navbar;
