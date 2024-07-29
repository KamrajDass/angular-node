// Checks for an token in the request headers.

const checkToken = (req, res, next) => {
  const apiKey = req.headers["token"];
  const validApiKey = "ABCD123"; // Replace with your API key

  if (apiKey === validApiKey) {
    next();
  } else {
    res.status(403).json({ message: "Token is inccorect!" });
  }
};

module.exports = checkToken;
