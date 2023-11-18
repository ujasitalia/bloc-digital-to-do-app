import axios from "axios";
import React, { useState, useEffect } from "react";

function Options({ fetchTodos, setError, setTodos }) {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");

  // useEffect for filter and sort
  useEffect(() => {
    if (filter) {
      handleFilter();
    } else if (sort) {
      handleSort();
    }
  }, [filter, sort]);

  const handleFilter = async () => {
    try {
      // data validation: just checking for filter selection
      if (!filter) {
        setError("Error selecting filter");
        return;
      }
      const by = ["complete", "incomplete"].includes(filter)
        ? "complete"
        : "category";
      const value = ["complete", "incomplete"].includes(filter)
        ? filter === "complete"
          ? "true"
          : "false"
        : filter;
      const token = JSON.parse(localStorage.getItem("token_data"));
      await axios
        .get(`http://localhost:5000/todo/filter/${by}/${value}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // console.log(res.data);
          if (res.data.length > 0) {
            setTodos(res.data);
          } else {
            setError("No to-do data found");
            setTodos([]);
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
  const handleSort = async () => {
    try {
      // data validation: just checking for sort option selection
      if (!sort) {
        setError("Error selecting sort field");
        return;
      }
      const by =
        sort === "completion"
          ? "complete"
          : sort === "time"
          ? "timeStamp"
          : sort;
      const token = JSON.parse(localStorage.getItem("token_data"));
      await axios
        .get(`http://localhost:5000/todo/sort/${by}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // console.log(res.data);
          if (res.data.length > 0) {
            setTodos(res.data);
          } else {
            setError("No to-do data found");
            setTodos([]);
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

  const handleClear = () => {
    setFilter("");
    setSort("");
    fetchTodos();
  };

  return (
    <>
      <div>
        <select
          className="category-filter"
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          value={filter}
        >
          <option value="">Filter by category</option>
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
        <select
          className="completion-filter"
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          value={filter}
        >
          <option value="">Filter by completion</option>
          {["complete", "incomplete"].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select
          className="options-sort"
          onChange={(e) => {
            setSort(e.target.value);
          }}
          value={sort}
        >
          <option value="">Sort by</option>
          {["time", "category", "completion"].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <button className="clear-button" onClick={handleClear}>
        Clear options
      </button>
    </>
  );
}

export default Options;
