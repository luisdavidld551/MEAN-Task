import user from "../models/user.js";

const existingUser = async (req, res, next) => {
  const existingEmail = await user.findOne({ email: req.body.email });
  return existingEmail
    ? res.status(400).send({ message: "The user is already registered" })
    : next();
};

const validData = async (req, res, next) => {
  if(!req.body.email || !req.body.name)
     res.status(400).send({ message: "Incomplete data" });
    next();
};

export default { existingUser, validData };
