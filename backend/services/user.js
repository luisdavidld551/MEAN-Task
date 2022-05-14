import User from "../models/user.js";

const isChanges = async (user, password) => {
  let changes = false;
  const userData = await User.findOne({
    name: user.name,
    password: password,
    phone: user.phone,
    role: user.role,
  });
  return userData ? (changes = true) : changes;
};

const isChangesUser = async (user, description) => {
  let changes = false;
  const userData = await User.findOne({
    name: user.name,
    description: description,
    phone: user.phone,
  });
  return userData ? (changes = true) : changes;
};

export default { isChanges, isChangesUser };
