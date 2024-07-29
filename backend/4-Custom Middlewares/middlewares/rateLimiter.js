// Limits the number of requests a user can make in a given period.
const requestCounts = {}; // In a real application, use Redis or a database
const rateLimit = (req, res, next) => {
  const { ip } = req;
  const now = Date.now();
  const limit = 2; // Number of requests
  const windowSize = 1 * 60 * 1000; // 1 minutes

  if (!requestCounts[ip]) {
    requestCounts[ip] = [];
  }

  requestCounts[ip] = requestCounts[ip].filter(
    (timestamp) => now - timestamp < windowSize
  );
  if (requestCounts[ip].length > limit) {
    res.status(429).json({ message: "Too many requests" });
  } else {
    requestCounts[ip].push(now);
    next();
  }
};

module.exports = rateLimit;
