import express from "express";
import task from "../controllers/task.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import validId from "../middlewares/validId.js";
import formatFile from "../middlewares/formatFile.js";
import multiparty from "connect-multiparty";
const mult = multiparty();
const router = express.Router();

router.post("/register", auth, task.registerTask);
router.post("/saveTaskImg", mult, formatFile, auth, task.saveTaskImg);
router.post("/registerAdmin", mult, formatFile, auth, admin, task.registerTaskAdmin);
router.put("/assign", auth, admin, task.assignTask);
router.get("/list/:name?", auth, admin, task.listTask);
router.get("/findById/:_id", auth, admin, validId, task.findIdTask);
router.get("/listIdUser/:name?", auth, task.listTaskIdUser);
router.put("/update", auth, task.updateTask);
router.delete("/delete/:_id", auth, validId, task.deleteTask);

export default router;
