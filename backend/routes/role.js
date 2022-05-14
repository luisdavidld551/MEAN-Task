import express from "express";
import role from "../controllers/role.js";
import roleMidd from "../middlewares/role.js";
import validId from "../middlewares/validId.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";

const router = express.Router();

router.post("/register", auth, admin, roleMidd.validData, roleMidd.existingRole, role.registerRole);
router.get("/list/:name?", auth, admin, role.listRole);
router.get("/listStatus/:status", auth, admin, role.listRoleStatus);
router.get("/find/:_id", auth, admin, validId, role.findRoleId);
router.put("/update/", auth, admin, roleMidd.validData, roleMidd.doNotChanges, role.updateRole);
router.put("/delete/", auth, admin, role.deleteRole);

export default router;
