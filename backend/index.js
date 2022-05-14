import express from "express";
import cors from "cors";
import db from "./db/db.js";
import dotenv from "dotenv";
import user from "./routes/user.js";
import role from "./routes/role.js";
import task from "./routes/task.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
  res.send("Hello \n Api by @luisdavidld551");
});

app.use("/api/role", role);
app.use("/api/user", user);
app.use("/api/task", task);
app.use("/uploads", express.static("uploads"));

app.listen(process.env.PORT, () =>
  console.log("Backend server running on port: ", process.env.PORT)
);

db.dbConnection();
