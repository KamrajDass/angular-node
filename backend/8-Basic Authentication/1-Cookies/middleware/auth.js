const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const userCookie = req.signedCookies.user;

  // Check if user is authenticated via cookie
  if (userCookie === "admin") {
    return next();
  }

  // Check if authorization header is provided
  if (!authHeader) {
    return respondWithAuthError(res, "Please Provide Basic Auth", 401);
  }

  // Decode and parse authorization header
  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");

  if (username === "admin" && password === "password") {
    res.cookie("user", "admin", {
      signed: true,
      maxAge: 1 * 60 * 1000, // 1 minute
    });
    return next();
  }

  return respondWithAuthError(res, "You are not authenticated", 401);
};

// Helper function to respond with authentication error in JSON format
const respondWithAuthError = (res, message, statusCode) => {
  res.status(statusCode).json({
    error: {
      message: message,
      status: statusCode,
    },
  });
};

module.exports = auth;
