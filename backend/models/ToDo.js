import mongoose from "mongoose";

const ToDoSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  complete: {
    type: Boolean,
    default: false,
    required: false,
  },
  timeStamp: {
    type: String,
    default: Date.now(),
  },
});

const ToDo = mongoose.model("ToDo", ToDoSchema);

export default ToDo;
