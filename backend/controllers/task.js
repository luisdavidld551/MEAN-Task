import task from "../models/task.js";
import user from "../models/user.js";
import taskService from "../services/task.js";
import fs from "fs";

const registerTask = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send({ message: "Imcomplete data" });

  const schemaTask = new task({
    name: req.body.name,
    description: req.body.description,
    imageUrl: "",
    taskStatus: "to-do",
    userId: req.user._id,
  });

  const result = await schemaTask.save();
  return !result
    ? res.status(400).send({ message: "Error registering task" })
    : res.status(200).send({ result });
};

const saveTaskImg = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send({ message: "Incomplete data" });

  let imageUrl = await taskService.saveImagen(req);

  const schemaTask = new task({
    name: req.body.name,
    description: req.body.description,
    imageUrl: imageUrl,
    taskStatus: "to-do",
    userId: req.user._id,
  });

  const result = await schemaTask.save();
  if (!result)
    return res.status(400).send({ message: "Error registering task" });
  return res.status(200).send({ result });
};

const registerTaskAdmin = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send({ message: "Imcomplete data" });

  let imageUrl = await taskService.saveImagen(req);

  const schemaTask = new task({
    name: req.body.name,
    description: req.body.description,
    imageUrl: imageUrl,
    taskStatus: "to-do",
  });

  const result = await schemaTask.save();
  return !result
    ? res.status(400).send({ message: "Error registering task" })
    : res.status(200).send({ result });
};

const assignTask = async (req, res) => {
  if (!req.body.taskId || !req.body.userId)
    return res.status(400).send({ message: "Imcomplete data" });

  const existingUser = await user.findOne({
    $and: [{ _id: req.body.userId }, { dbStatus: "true" }],
  });
  if (!existingUser) return res.status(400).send({ message: "User no found" });

  const existingTask = await task.findById({ _id: req.body.taskId });
  if (!existingTask) return res.status(400).send({ message: "Task no found" });

  const taskAssing = await task.findByIdAndUpdate(req.body.taskId, {
    userId: req.body.userId,
  });
  return !taskAssing
    ? res.status(400).send({ message: "Task not assigned" })
    : res.status(200).send({ message: "Task assigned" });
};

const listTask = async (req, res) => {
  const taskList = await task
    .find({ name: new RegExp(req.params["name"], "i") })
    .populate("userId")
    .exec();

  return taskList.length === 0
    ? res.status(400).send({ message: "Empty task collection" })
    : res.status(200).send({ taskList });
};

const listTaskIdUser = async (req, res) => {
  const taskIdUserList = await task.find({
    $and: [
      { userId: req.user._id },
      { name: new RegExp(req.params["name"], "i") },
    ],
  });
  return taskIdUserList.length === 0
    ? res.status(400).send({ message: "You have no assigned tasks" })
    : res.status(200).send({ taskIdUserList });
};

const findIdTask = async (req, res) => {
  const findTask = await task
    .findById({ _id: req.params["_id"] });

  return !findTask
    ? res.status(404).send({ message: "Task does not exist" })
    : res.status(200).send({ findTask });
};

const updateTask = async (req, res) => {
  if (!req.body._id || !req.body.taskStatus)
    return res.status(400).send({ message: "Imcomplete data" });

  const taskUpdate = await task.findByIdAndUpdate(req.body._id, {
    taskStatus: req.body.taskStatus,
  });
  return !taskUpdate
    ? res.status(400).send({ message: "Task not found" })
    : res.status(200).send({ message: "Task updated" });
};

const deleteTask = async (req, res) => {
  let taskImg = await task.findById({ _id: req.params["_id"] });
  let serverImg = "./uploads/";

  if (taskImg.imageUrl != "") {
    taskImg = taskImg.imageUrl;
    taskImg = taskImg.split("/")[4];
    serverImg += taskImg;
  }

  const taskDelete = await task.findByIdAndDelete({ _id: req.params["_id"] });
  if (!taskDelete) return res.status(400).send({ message: "Task not found" });

  try {
    if (taskImg.imageUrl != "") fs.unlinkSync(serverImg);
    return res.status(200).send({ message: "Task deleted" });
  } catch (e) {
    console.log("Image no found in server");
  }
};

export default {
  registerTask,
  saveTaskImg,
  registerTaskAdmin,
  assignTask,
  listTask,
  listTaskIdUser,
  findIdTask,
  updateTask,
  deleteTask,
};
