var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
const mongoose = require("mongoose");
var session = require("express-session");
const FileStore = require("session-file-store")(session); // Import the file store
var authenticate = require("./authenticate");
const passport = require("passport");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productRouter = require("./routes/productRouter");
let uploadRouter = require("./routes/firebaseUploaderRouter");
const cors = require("cors"); // Add this line
const config = require("./config");
var app = express();
app.use(cors()); // Add this line
// Connect to MongoDB
const url = config.mongoUrl;
mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
// Set up session with FileStore
app.use(
  session({
    name: "session-id",
    secret: "12345-67890-09876-54321", // Replace with a secure  key
    saveUninitialized: false,
    resave: false,
    store: new FileStore({}), // FileStore options can be customized here
    cookie: { secure: false }, // Set `secure: true` in production with HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);

// Use the products router for routes starting with '/products'
app.use("/products", productRouter);
app.use("/upload", uploadRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
