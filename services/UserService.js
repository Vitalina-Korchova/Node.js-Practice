const User = require("../model/User");

exports.getAllUsers = async () => {
  return await User.find();
};

exports.getUserById = async (id) => {
  return await User.findById(id);
};

exports.createUser = async (userData) => {
  const newUser = new User(userData);
  return await newUser.save();
};

exports.updateUser = async (id, userData) => {
  return await User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true,
  });
};

exports.deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

exports.getFilteredUsers = async (filters) => {
  let query = {};

  if (filters.age) {
    query.age = filters.age;
  }

  if (filters.country) {
    query.country = { $regex: new RegExp(filters.country, "i") };
  }

  return await User.find(query);
};
