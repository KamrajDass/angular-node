// middleware/auth.js
const basicAuth = require("basic-auth");

// const auth = (req, res, next) => {
//   const user = basicAuth(req);

//   const username = "admin";
//   const password = "password";

//   if (user && user.name === username && user.pass === password) {
//     return next();
//   } else {
//     res.set("WWW-Authenticate", 'Basic realm="example"');
//     return res.status(401).send("Authentication required.");
//   }
// };

const auth = (req, res, next) => {
  console.log("authMiddleware");
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.set("WWW-Authenticate", 'Basic realm="example"');
    return res.json({
      status: 401,
      message: "Authentication required.",
    });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );

  const [username, password] = credentials.split(":");

  const validUsername = "admin";
  const validPassword = "password";

  if (username === validUsername && password === validPassword) {
    return next();
  } else if (!username || !password) {
    return res.json({
      status: 401,
      message: "Username or password is missing.",
    });
  } else if (username != validUsername && password != validPassword) {
    return res.json({
      status: 401,
      message: "Username or password is incorrect",
    });
  } else {
    res.set("WWW-Authenticate", 'Basic realm="example"');
    return res.json({
      status: 401,
      message: "Authentication required.",
    });
  }
};

module.exports = auth;
