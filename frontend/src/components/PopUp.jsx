import React, { useState, useContext } from "react";
import axios from "axios";
import UserContext from "./UserContext";

function PopUp({ setPopupActive, todos, setTodos, setError }) {
  const [newTodo, setNewTodo] = useState("");
  const [newTodoCategory, setNewTodoCategory] = useState("");
  const context = useContext(UserContext);
  const email = context.email || null;

  const addToDo = async () => {
    try {
      // data validation: just checking for filled fields
      if (!newTodo || !newTodoCategory) {
        setError("Please complete all fields");
        return;
      }
      // else create a new to-do
      const token = JSON.parse(localStorage.getItem("token_data"));
      await axios
        .post(
          `http://localhost:5000/todo/new`,
          {
            text: newTodo,
            category: newTodoCategory,
            userName: email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data.toDo);
          if (res.data.toDo) {
            setTodos([...todos, res.data.toDo]);
            setPopupActive(false);
            setNewTodo("");
            setNewTodoCategory("");
          }
        })
        .catch((error) => {
          // console.log(error);
          error.response ? setError(error.response.data.error[1]) : setError(error.message)          
        });
    } catch (error) {
      error.response ? setError(error.response.data.error[1]) : setError(error.message);
    }
  };

  return (
    <div className="popup">
      <div className="closePopup" onClick={() => setPopupActive(false)}>
        x
      </div>
      <div className="content">
        <h3>Add Task</h3>
        <input
          type="text"
          className="add-todo-input"
          onChange={(e) => setNewTodo(e.target.value)}
          value={newTodo}
          required
        />
        <select
          className="add-todo-category"
          onChange={(e) => setNewTodoCategory(e.target.value)}
          value={newTodoCategory}
        >
          <option value="">Select category</option>
          {[
            "work",
            "home",
            "health",
            "finance",
            "shopping",
            "social",
            "education",
            "travel",
          ].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button className="button" onClick={addToDo}>
          Create Task
        </button>
      </div>
    </div>
  );
}

export default PopUp;
