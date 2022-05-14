import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
  taskStatus: String,
  userId: { type: mongoose.Schema.ObjectId, ref: "users" },
  registerDate: { type: Date, default: Date.now },
});

const task = mongoose.model("tasks", taskSchema);
export default task;
