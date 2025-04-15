const jwt = require("jsonwebtoken");
const User = require("../model/User");

const JWT_SECRET = process.env.JWT_SECRET || "mySecretKey";

exports.login = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error("User not found");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid password");

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token, user };
};
