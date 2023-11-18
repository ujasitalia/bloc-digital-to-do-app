import { stringValidator, categoryValidator } from "../helpers.js";
import ToDo from "../models/ToDo.js";
import mongoose from "mongoose";

export const createTodo = async (userName, text, category) => {
  // validation
  userName = stringValidator(userName, "username");
  text = stringValidator(text, "text");
  category = categoryValidator(category);

  // if the same to-do in db
  if (await ToDo.findOne({ userName, text, category }))
    throw [400, "To-Do already in db"];

  // add to db
  const toDo = new ToDo({ userName, text, category });
  const toDoData = await toDo.save();
  console.log(toDoData);
  return toDoData;
};

export const getToDoById = async function (id) {
  // id validation
  if (!mongoose.Types.ObjectId.isValid(id)) throw `Invalid id: ${id}`;

  // get to-do
  const toDo = await ToDo.findById(id);
  if (!toDo) throw `Could not find to-do with id: ${id}`;
  return toDo;
};

export const deleteToDoById = async function (id) {
  // id validation
  if (!mongoose.Types.ObjectId.isValid(id)) throw `Invalid id: ${id}`;

  //   delete to-do from db
  const result = await ToDo.findByIdAndDelete(id);
  return result;
};

export const editToDoByIdToComplete = async function (id) {
  // id validation
  if (!mongoose.Types.ObjectId.isValid(id)) throw `Invalid id: ${id}`;

  //   edit to-do from db
  const toDo = await getToDoById(id);
  toDo.complete = !toDo.complete;
  toDo.save();
  return toDo;
};

export const getAllToDoByUserName = async function (userName) {
  // get todos from db
  const toDos = await ToDo.find({ userName: userName });
  return toDos.length > 0 ? toDos : [];
};

export const filterToDos = async function (userName, by, value) {
  // get todos from db
  const toDos = await ToDo.find({ userName: userName, [by]: value });
  return toDos.length > 0 ? toDos : [];
};

export const sortToDos = async function (userName, by) {
  // get todos from db
  let toDos;
  if(by === "timeStamp") {
    toDos = await ToDo.find({ userName: userName }).sort({ [by]: -1 });
  }
  else{
    toDos = await ToDo.find({ userName: userName }).sort({ [by]: 1 });
  }
  return toDos.length > 0 ? toDos : [];
};
