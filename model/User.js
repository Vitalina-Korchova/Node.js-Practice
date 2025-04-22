const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "User name is required"],
    minlength: [3, "User name must be at least 3 characters"],
    maxlength: [30, "User name cannot exceed 30 characters"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [5, "User name must be at least 5 characters"],
  },
  role: {
    type: String,
    required: [true, "Role is required"],
    enum: {
      values: ["user", "admin"],
      message: "The role can be admin or user",
    },
    default: "user",
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
    min: [18, "Age must be at least 18"],
  },
  country: {
    type: String,
    required: [true, "Country is required"],
    enum: {
      values: ["Ukraine", "USA", "Spain", "Germany"],
      message: "Country must be one of: Ukraine, USA, Spain, Germany",
    },
  },
});

// хешування паролю перед збереженням
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// метод для перевірки паролю
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
