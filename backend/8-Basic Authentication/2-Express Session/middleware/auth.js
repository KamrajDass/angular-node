const auth = (req, res, next) => {
  console.log(req.session);

  if (!req.session.user) {
    return respondWithAuthError(res, "You are not authenticated", 403);
  } else {
    if (req.session.user === "authenticated") {
      next();
    } else {
      return respondWithAuthError(res, "You are not authenticated", 403);
    }
  }
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
