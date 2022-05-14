import user from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "../lib/jwt.js";
import userService from "../services/user.js";
import taskService from "../services/task.js";
import fs from "fs";

const registerUser = async (req, res) => {
  if (!req.body.password || !req.body.phone)
    return res.status(400).send({ message: "Imcomplete data" });

  let passHash = await bcrypt.hash(req.body.password, 10);

  const schemaUser = new user({
    name: req.body.name,
    email: req.body.email,
    password: passHash,
    phone: req.body.phone,
    role: req.body.role,
    description: "",
    profileImg: "",
    dbStatus: true,
  });
  const userRegister = await schemaUser.save();

  if (!userRegister)
    return res.status(500).send({ message: "Error to register user" });

  const token = await jwt.generateToken(userRegister);
  return !token
    ? res.status(404).send({ message: "Error to register user" })
    : res.status(200).send({ token });
};

const registerAdminUser = async (req, res) => {
  if (!req.body.password || !req.body.role || !req.body.phone)
    return res.status(400).send({ message: "Incomplete data" });

  let passHash = await bcrypt.hash(req.body.password, 10);

  const userRegister = new user({
    name: req.body.name,
    email: req.body.email,
    password: passHash,
    phone: req.body.phone,
    role: req.body.role,
    description: "",
    profileImg: "",
    dbStatus: true,
  });

  const userAdmin = await userRegister.save();
  return !userAdmin
    ? res.status(400).send({ message: "Failed to register user" })
    : res.status(200).send({ userAdmin });
};

const listUsers = async (req, res) => {
  const userList = await user
    .find({
      $and: [
        { name: new RegExp(req.params["name"], "i") },
        { dbStatus: "true" },
      ],
    })
    .populate("role")
    .exec();
  return userList.length === 0
    ? res.status(400).send({ message: "Empty user collection" })
    : res.status(200).send({ userList });
};

const listAllUsers = async (req, res) => {
  const userList = await user
    .find({ name: new RegExp(req.params["name"], "i") })
    .populate("role")
    .exec();
  return userList.length === 0
    ? res.status(404).send({ message: "Empty user collection" })
    : res.status(200).send({ userList });
};

const listUserStatus = async (req, res) => {
  if (!req.params["status"])
    return res.status(400).send({ message: "Imcomplete data" });

  let statusParams = "";

  if (req.params["status"] === "active") {
    statusParams = true;
  } else if (req.params["status"] === "inactive") {
    statusParams = false;
  } else {
    return res.status(400).send({ message: "This status is invalid" });
  }

  const userStatus = await user
    .find({ dbStatus: new RegExp(statusParams) })
    .populate("role")
    .exec();

  return userStatus.length === 0
    ? res.status(404).send({ message: "Empty user collection" })
    : res.status(200).send({ userStatus });
};

const findUserId = async (req, res) => {
  const userById = await user
    .findById({ _id: req.params["_id"] })
    .populate("role")
    .exec();

  return !userById
    ? res.status(404).send({ message: "User does not exist" })
    : res.status(200).send({ userById });
};

const profile = async (req, res) => {
  const userById = await user
    .findById({ _id: req.user._id })
    .populate("role")
    .exec();

  return !userById
    ? res.status(404).send({ message: "User does not exist" })
    : res.status(200).send({ userById });
};

const saveUserImg = async (req, res) => {
  let profileUserImg = await user.findById({ _id: req.user._id });
  let serverImg = "./uploads/";

  if (profileUserImg.profileImg != "") {
    profileUserImg = profileUserImg.profileImg;
    profileUserImg = profileUserImg.split("/")[4];
    serverImg += profileUserImg;
  }

  let imageUrl = await taskService.saveImagen(req);

  const userImg = await user.findByIdAndUpdate(req.user._id, {
    profileImg: imageUrl,
  });

  if (!userImg)
    return res.status(400).send({ message: "Error updating avatar" });

  try {
    if (profileUserImg.imageUrl != "") fs.unlinkSync(serverImg);
    return res.status(200).send({ imageUrl });
  } catch (e) {
    console.log("Image no found in server");
  }
};

const findUserRole = async (req, res) => {
  let userRole = await user
    .findOne({ email: req.params["email"] })
    .populate("roleId")
    .exec();
  if (!userRole) return res.status(400).send({ message: "No search results" });

  userRole = userRole.roleId.name;
  return res.status(200).send({ userRole });
};

const updateUser = async (req, res) => {
  if (!req.body.phone || !req.body.role)
    return res.status(400).send({ message: "Imcomplete data" });

  const userEdit = await user.findOne({
    $and: [{ _id: req.body._id }, { dbStatus: "true" }],
  });
  if (!userEdit)
    return res.status(400).send({ message: "User does not exist" });

  let pass = "";

  if (!req.body.password) pass = userEdit.password;
  else pass = await bcrypt.hash(req.body.password, 10);

  let changes = await userService.isChanges(req.body, pass);
  if (changes)
    return res.status(400).send({ message: "You didn't make any changes" });

  const userUpdate = await user.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    password: pass,
    phone: req.body.phone,
    role: req.body.role,
  });

  return !userUpdate
    ? res.status(400).send({ message: "Error updating user " })
    : res.status(200).send({ message: "User update" });
};

const updateProfile = async (req, res) => {
  const userEdit = await user.findById({ _id: req.user._id });
  if (!userEdit)
    return res.status(400).send({ message: "User does not exist" });

  let descip = "";

  if (!req.body.description) descip = userEdit.description;
  else descip = req.body.description;

  let changes = await userService.isChangesUser(req.body, descip);
  if (changes)
    return res.status(400).send({ message: "You didn't make any changes" });

  const userUpdate = await user.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    description: descip,
    phone: req.body.phone,
  });

  return !userUpdate
    ? res.status(400).send({ message: "Error updating user " })
    : res.status(200).send({ message: "User update" });
};

const changePassword = async (req, res) => {
  if (
    !req.body.passwordConfir ||
    !req.body.passwordEdit ||
    !req.body.passwordOld
  )
    return res.status(400).send({ message: "Imcomplete data" });

  const userEdit = await user.findById({ _id: req.user._id });
  if (!userEdit)
    return res.status(400).send({ message: "User does not exist" });

  let passhash = await bcrypt.compare(req.body.passwordOld, userEdit.password);

  if (!passhash)
    return res.status(400).send({ message: "Wrong current password" });

  if (req.body.passwordConfir != req.body.passwordEdit)
    return res.status(400).send({ message: "New passwords don't match" });

  let pass = "";
  pass = await bcrypt.hash(req.body.passwordConfir, 10);

  const userUpdate = await user.findByIdAndUpdate(req.user._id, {
    password: pass,
  });

  return !userUpdate
    ? res.status(400).send({ message: "Error updating password " })
    : res.status(200).send({ message: "Password update" });
};

const deleteUser = async (req, res) => {
  if (!req.body._id)
    return res.status(400).send({ message: "Imcomplete data" });

  const userDelete = await user.findOneAndUpdate(
    { $and: [{ _id: req.body._id }, { dbStatus: "true" }] },
    {
      dbStatus: false,
    }
  );
  return !userDelete
    ? res.status(400).send({ message: "User no found" })
    : res.status(200).send({ message: "User Deleted" });
};

const activateUser = async (req, res) => {
  if (!req.body._id)
    return res.status(400).send({ message: "Imcomplete data" });

  const userActivated = await user.findOneAndUpdate(
    { $and: [{ _id: req.body._id }, { dbStatus: "false" }] },
    {
      dbStatus: true,
    }
  );
  return !userActivated
    ? res.status(400).send({ message: "User no found" })
    : res.status(200).send({ message: "User Activated" });
};

const getUserRole = async (req, res) => {
  let userRole = await user
    .findOne({ email: req.params.email })
    .populate("role")
    .exec();
  if (!userRole) return res.status(400).send({ message: "No search results" });

  userRole = userRole;
  return res.status(200).send({ userRole });
};

const login = async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send({ message: "Imcomplete data" });

  const userLogin = await user.findOne({ email: req.body.email });
  if (!userLogin || !userLogin.dbStatus)
    return res.status(400).send({ message: "Wrong email or password" });

  let passhash = await bcrypt.compare(req.body.password, userLogin.password);

  if (!passhash)
    return res.status(400).send({ message: "Wrong email or password" });

  const token = await jwt.generateToken(userLogin);
  return !token
    ? res.status(400).send({ message: "Login error" })
    : res.status(200).send({ token });
};

export default {
  registerUser,
  registerAdminUser,
  listUsers,
  profile,
  saveUserImg,
  changePassword,
  listAllUsers,
  listUserStatus,
  findUserId,
  findUserRole,
  updateUser,
  updateProfile,
  deleteUser,
  activateUser,
  getUserRole,
  login,
};
