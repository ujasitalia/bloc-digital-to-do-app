import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserContext from "./UserContext";
import { emailValidator, passwordValidator } from "../helpers";

function Login() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const user = useContext(UserContext);
  const location = useLocation();
  const message = location.state?.message;

  // if the user is already logged in, take them to home page
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("token_data"))) {
      navigate("/");
    }

    if(message){
      setError(message);
    }
  }, []);

  // useEffect to clear the error message
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
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    if (!emailValidator(email)) {
      setError("Invalid email");
      return;
    }
    if (!passwordValidator(password)) {
      setError("Invalid password");
      return;
    }

    // send the data to the server
    try {
      const res = await axios.post("http://localhost:5000/user/login", {
        email,
        password,
      });
      localStorage.setItem("token_data", JSON.stringify(res.data.token));
      user.setEmail(res.data.email);
      navigate("/");
    } catch (error) {
      // console.log(error.response.data.error[1]);
      setError(error.response.data.error[1]);
    }
  };

  return (
    <div>
      <div className="register">
        {error && (
          <div className="error">
            <p className="error-text">{error}</p>
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
          <button className="button" onClick={handleSubmit}>
            Login
          </button>
          <Link to="/register" className="link">
            Don't have an account? Go to Register
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
