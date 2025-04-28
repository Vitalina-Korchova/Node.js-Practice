const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const errorHandler = require("./middlewares/errorHandler");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const requestTimer = require("./middlewares/requestTimer");

const app = express();
const PORT = 3000;

connectDB();

app.use(morgan("dev"));
app.use(express.json());

app.use(errorHandler);

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(requestTimer);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 хвилина
  max: 5,
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

app.use(
  session({
    secret: "keyboard cat", //секретний ключ для підписування ID сесії в cookie
    resave: false, // не зберігати сесію, якщо вона не змінювалася
    saveUninitialized: true, //зберігати нові сесії, навіть якщо нічого не було змінено
  })
);

// роут для логіна через форму
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const { user } = await require("./services/auth.service").login(
      username,
      password
    );
    req.session.user = user;
    res.redirect("/profile");
  } catch (err) {
    res.status(401).send("Login failed: " + err.message);
  }
});

app.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.render("profile", { user: req.session.user });
});

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
