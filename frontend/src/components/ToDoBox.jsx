import React from "react";
import axios from "axios";

function ToDoBox({ todo, setTodos, todos, setError }) {
  const completeToDo = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem("token_data"));
      await axios
        .put(
          `http://localhost:5000/todo/complete/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          // console.log(res.data);
          setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
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
    }
  };

  const deleteTodo = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem("token_data"));
      // console.log(token);
      await axios
        .delete(`http://localhost:5000/todo/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // console.log(res.data);
          if (res.data === `deleted to-do with ${id}`) {
            setTodos(todos.filter((todo) => todo._id !== id));
          }
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
    }
  };
  return (
    <div
      className={"todos " + (todo.complete ? "is-complete" : "")}
      key={todo._id}
      onClick={() => completeToDo(todo._id)}
    >
      <div className="checkbox"></div>
      <div className="text">{todo.text}</div>
      <div className="category">{todo.category}</div>
      <div className="username">{todo.userName.split("@")[0]}</div>
      <div
        className="delete-todo"
        onClick={(e) => {
          e.stopPropagation();
          deleteTodo(todo._id);
        }}
      >
        x
      </div>
    </div>
  );
}

export default ToDoBox;
