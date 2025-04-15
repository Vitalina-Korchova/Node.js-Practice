const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = 3000;

connectDB();

app.use(morgan("dev"));
app.use(express.json());

app.use("/users", userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
