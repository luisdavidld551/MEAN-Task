import express from "express";
import user from "../controllers/user.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import userMidd from "../middlewares/user.js";
import roleMidd from "../middlewares/role.js";
import validId from "../middlewares/validId.js";
import formatFile from "../middlewares/formatFile.js";
import multiparty from "connect-multiparty";
const mult = multiparty();
const router = express.Router();

router.post("/register", userMidd.validData, userMidd.existingUser, roleMidd.getRoleUser, user.registerUser);
router.post("/registerAdminUser", auth, admin, userMidd.existingUser, user.registerAdminUser);
router.post("/login", user.login);
router.get("/list/:name?", auth, admin, user.listUsers);
router.get("/profile", auth, user.profile);
router.put("/profileImg", mult, formatFile, auth, user.saveUserImg);
router.put("/profilePassword", auth, user.changePassword);
router.get("/listAdmin/:name?", auth, admin, user.listAllUsers);
router.get("/listStatus/:status", auth, admin, user.listUserStatus);
router.get("/findId/:_id", auth, admin, validId, user.findUserId);
router.put("/update", auth, admin, userMidd.validData, user.updateUser);
router.put("/updateProfile", auth, userMidd.validData, user.updateProfile);
router.get("/getRole/:email", auth, user.getUserRole);
router.put("/delete", auth, admin, user.deleteUser);
router.put("/activateUser", auth, admin, user.activateUser);

export default router;
