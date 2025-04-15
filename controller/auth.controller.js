const authService = require("../services/auth.service");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "mySecretKey";

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { token, user } = await authService.login(username, password);

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: "15m",
  });

  res.json({ message: "Use this token to reset password", resetToken });
};

//Скидання пароля
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};
