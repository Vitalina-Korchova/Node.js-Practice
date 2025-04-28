const userService = require("../services/UserService");
const redisClient = require("../config/redis");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  const userId = req.params.id;

  try {
    // Перевіряємо кеш
    const cachedUser = await redisClient.get(`user:${userId}`);
    if (cachedUser) {
      return res.json(JSON.parse(cachedUser));
    }

    // Якщо в кеші немає — шукаємо в базі
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User was not found" });
    }

    // Зберігаємо в Redis (наприклад на 1 годину — 3600 секунд)
    await redisClient.setEx(`user:${userId}`, 3600, JSON.stringify(user));

    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: "User was not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User was not found" });
    }
    res.json({ message: "User was deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

exports.getFilteredUsers = async (req, res, next) => {
  try {
    const users = await userService.getFilteredUsers(req.query);
    res.json(users);
  } catch (error) {
    next(error);
  }
};
