// Middleware to log every request URL
const logRequestUrl = (req, res, next) => {
  console.log(`Request URL: ${req.originalUrl}`);
  next(); // Pass control to the next middleware or route handler
};

module.exports = logRequestUrl;
