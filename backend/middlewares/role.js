import Role from "../models/role.js";

const getRoleUser = async (req, res, next) => {
  const roleId = await Role.findOne({ name: "user" });
  if (!roleId) return res.status(500).send({ message: "No role was assigned" });

  req.body.role = roleId._id;
  next();
};

const existingRole = async (req, res, next) => {
  const roleName = await Role.findOne({ name: req.body.name });
  return roleName
    ? res.status(500).send({ message: "The role is already registered" })
    : next();
};

const doNotChanges = async (req, res, next) => {
  const changes = await Role.findOne({
    name: req.body.name,
    description: req.body.description,
  });
  return changes
    ? res.status(400).send({ message: "No changes were made" })
    : next();
};

const validData = async (req, res, next) => {
  return !req.body.name || !req.body.description
    ? res.status(400).send({ message: "Incomplete data" })
    : next();
};

export default { getRoleUser, existingRole, doNotChanges, validData };
