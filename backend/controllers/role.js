import Role from "../models/role.js";

const registerRole = async (req, res) => {
  const schemaRole = new Role({
    name: req.body.name,
    description: req.body.description,
    dbStatus: true,
  });

  const role = await schemaRole.save();
  return !role
    ? res.status(500).send({ message: "Error to register role" })
    : res.status(200).send({ role });
};

const listRole = async (req, res) => {
  const roleList = await Role.find({
    $and: [
      {
        name: new RegExp(req.params["name"], "i"),
      },
      { dbStatus: "true" },
    ],
  });
  return roleList.length === 0
    ? res.status(400).send({ message: "Empty role collection" })
    : res.status(200).send({ roleList });
};

const listRoleStatus = async (req, res) => {
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
  const roleList = await Role.find({ dbStatus: new RegExp(statusParams) });
  return roleList.length === 0
    ? res.status(400).send({ message: "Empty role collection" })
    : res.status(200).send({ roleList });
};

const findRoleId = async (req, res) => {
  const role = await Role.findOne({
    $and: [{ _id: req.body._id }, { dbStatus: "true" }],
  });
  return !role
    ? res.status(400).send({ message: "Role does not exist" })
    : res.status(200).send({ role });
};

const updateRole = async (req, res) => {
  const roleEdit = await Role.findOneAndUpdate(
    { $and: [{ _id: req.body._id }, { dbStatus: "true" }] },
    {
      description: req.body.description,
    }
  );

  return !roleEdit
    ? res.status(500).send({ message: "Error updating role" })
    : res.status(200).send({ message: "Role update" });
};

const deleteRole = async (req, res) => {
  if (!req.body._id)
  return res.status(400).send({ message: "Imcomplete data" });
  
  const roleDelete = await Role.findOneAndUpdate(
    { $and: [{ _id: req.body._id }, { dbStatus: "true" }] },
    { dbStatus: false }
  );
  return !roleDelete
    ? res.status(400).send({ message: "Role no found" })
    : res.status(200).send({ message: "Role Deleted" });
};

export default {
  registerRole,
  listRole,
  listRoleStatus,
  findRoleId,
  updateRole,
  deleteRole,
};
