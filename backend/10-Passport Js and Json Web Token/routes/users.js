var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const passport = require("passport");
var User = require("../models/user");
var authenticate = require("../authenticate");
router.use(bodyParser.json());
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required" });
  }

  User.register(new User({ username }), password, (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    passport.authenticate("local")(req, res, () => {
      var token = authenticate.getToken({ _id: user._id });
      res.status(200).json({
        success: true,
        token: token,
        message: "Registration successful",
      });
    });
  });
});
router.post("/login", async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      // Handle authentication errors
      return res
        .status(500)
        .json({ success: false, status: "Authentication error" });
    }

    if (!user) {
      // Handle incorrect credentials
      return res
        .status(401)
        .json({ success: false, status: "Incorrect username or password" });
    }

    req.logIn(user, (err) => {
      if (err) {
        // Handle login errors
        return res.status(500).json({ success: false, status: "Login error" });
      }

      // Successful login
      var token = authenticate.getToken({ _id: req.user._id });
      res.status(200).json({
        success: true,
        token: token,
        status: "You are successfully logged in",
      });
    });
  })(req, res, next);
});
router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.status(200).json({
      message: "You are Logged out",
    });
  } else {
    res.status(403).json({
      message: "You are already logged out",
    });
  }
});
module.exports = router;
