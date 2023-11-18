import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from './components/Home';
import UserContext from "./components/UserContext";
import { useState, useEffect } from "react";
import axios from 'axios';

function App() {
  const [email, setEmail] = useState("");

  // get user data to set context on initial load
  useEffect(() => {
    const getUser = async () => {
      const token = JSON.parse(localStorage.getItem("token_data"))
      const user = await axios.get('http://localhost:5000/user/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setEmail(user.data.email)
    }

    try {
      if(JSON.parse(localStorage.getItem("token_data"))) {
        getUser()
      }      
    } catch (error) {
      console.log(error);
    }
  }, [])

  return (
    <div className="App">
      <UserContext.Provider value={{ email, setEmail }}>
        <Router>
          <Navbar></Navbar>
          <Routes>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/" element={<Home />}></Route>
          </Routes>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
