import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PopUp from "./PopUp";
import ToDoBox from "./ToDoBox";
import Options from "./Options";

function Home() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // if the user is not logged in, take them to login page
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("token_data"))) {
      navigate("/login", {
        state: { message: "You have to be logged in to view the home page" },
      });
    }
    // else get the todos for the current user
    else {
      fetchTodos();
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

  const fetchTodos = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token_data"));
      await axios
        .get("http://localhost:5000/todo/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // console.log(res.data);
          setTodos(res.data);
        })
        .catch((error) => {
          error.response
            ? setError(error.response.data.error[1])
            : setError(error.message);
        });
    } catch (error) {
      error.response
        ? setError(error.response.data.error[1])
        : setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="error">Loading...</div>; // Render a loading message while fetching todos
  }

  return (
    <div className={"home " + (popupActive ? "dull-background" : "")}>
      {/* error box */}
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      <h4 className="title">Your Tasks</h4>

      {/* sort and filter buttons */}
      <div className="options">
        <Options
          fetchTodos={fetchTodos}
          setError={setError}
          setTodos={setTodos}
        />
      </div>

      {/* display to-dos */}
      <div className="todo-box">
        {todos.map((todo) => {
          return (
            <ToDoBox
              todo={todo}
              setTodos={setTodos}
              todos={todos}
              setError={setError}
            />
          );
        })}
      </div>

      {/* add to-do button */}
      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>

      {/* add to-do */}
      {popupActive ? (
        <PopUp
          setPopupActive={setPopupActive}
          todos={todos}
          setTodos={setTodos}
          setError={setError}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default Home;