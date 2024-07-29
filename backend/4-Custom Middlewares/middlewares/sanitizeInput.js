// Sanitizes input to prevent injection attacks.
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      req.body[key] = req.body[key].replace(/<[^>]*>/g, ""); // Basic HTML tags stripping
    });
  }
  next();
};

module.exports = sanitizeInput;
