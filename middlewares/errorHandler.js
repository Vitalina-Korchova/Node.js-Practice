const mongoose = require("mongoose");

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  let statusCode = 500;
  let message = "Internal Server Error";

  //Error validation
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((err) => err.message)
      .join(", ");
  }

  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
