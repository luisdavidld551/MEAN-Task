import jwt from "jsonwebtoken";
import moment from "moment";

const generateToken = async (user) => {
  let message = false;
  try {
    return jwt.sign(
      {
        _id: user._id,
        name: user.name,
        role: user.role,
        iat: moment().unix(),
      },
      process.env.JWT_SECRET
    );
  } catch (e) {
    return message;
  }
};

export default { generateToken };
