var express = require("express");
var router = express.Router();
var User = require("../models/user");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", async (req, res, next) => {
  try {
    let user = await User.findOne({ username: req.body.username });

    if (user != null) {
      res.status(403).json({
        message: `User ${req.body.username} already exists.`,
      });
    } else {
      const user = new User({
        username: req.body.username,
        password: req.body.password,
      });
      const result = await user.save();
      res.status(200).json({
        data: result,
        message: `Registration Successfully`,
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.post("/login", async (req, res, next) => {
  if (!req.session.user) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        message: "You are not authenticated",
      });
    } else {
      let auth = new Buffer.from(authHeader.split(" ")[1], "base64")
        .toString()
        .split(":");
      let username = auth[0];
      let password = auth[1];
      try {
        let user = await User.findOne({ username: username });
        if (user === null) {
          res.status(403).json({
            message: `Username or password is incorrect`,
          });
        } else if (user.password != password) {
          res.status(403).json({
            message: "Username or password is incorrect",
          });
        } else if (user.username === username && user.password === password) {
          req.session.user = "authenticated";
          res.status(200).json({
            message: "LoggedIn successfully",
          });
        }
      } catch {
        res.status(400).json({ error: err.message });
      }
    }
  } else {
    res.status(200).json({
      message: "You are already LoggedIn",
    });
  }
});
router.get("/logout", (req, res) => {
  console.log("req.session", req.session);
  if (req.session.user) {
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
