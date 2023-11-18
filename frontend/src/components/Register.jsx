import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { emailValidator, passwordValidator } from "../helpers";
import axios from "axios";
import UserContext from "./UserContext";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const user = useContext(UserContext);
  const navigate = useNavigate();

  // if the user is already logged in, take them to home page
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("token_data"))) {
      navigate("/");
    }
  }, []);

  // to clear the error message
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      // when the component unmounts, we need to clear the timer
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate email and password
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (!emailValidator(email)) {
      setError("Invalid email");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!passwordValidator(password) || !passwordValidator(confirmPassword)) {
      setError("Invalid password");
      return;
    }

    // send the data to the server
    try {
      const res = await axios.post("http://localhost:5000/user/register", {
        email,
        password,
      });
      localStorage.setItem("token_data", JSON.stringify(res.data.token));
      // localStorage.setItem("id", JSON.stringify(res.data.id));
      user.setEmail(res.data.email);
      navigate('/')
    } catch (error) {
      setError(error.response.data.error[1]);
    }
  };

  return (
    <div className="register">
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
      <form className="form">
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input"
          required
        />
        <button onClick={handleSubmit} className="button">
          Register
        </button>
        <Link to="/login" className="link">
          Already have an account? Go to Login
        </Link>
      </form>
    </div>
  );
}

export default Register;
